import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { getDb } from '../db/client';
import {
  santri, jenjang, yayasan, syahriahPayment, tabunganSantri,
  pemasukan, pengeluaran, penggajian, ustadz
} from '../db/schema';
import { eq, and, sql, asc, desc } from 'drizzle-orm';

const keuanganRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

// Semua menu keuangan dibatasi hanya untuk Bendahara dan Ketua Yayasan
keuanganRouter.use('*', authMiddleware);
keuanganRouter.use('*', requireRole(['bendahara', 'ketua']));

// ==========================================
// A. SYAHRIAH (SPP Bulanan)
// ==========================================

// Get status pembayaran syahriah seluruh santri untuk bulan & tahun tertentu
keuanganRouter.get('/syahriah/status', async (c) => {
  const user = c.get('user');
  const query = c.req.query();
  const bulan = query.bulan ? Number(query.bulan) : new Date().getMonth() + 1;
  const tahun = query.tahun ? Number(query.tahun) : new Date().getFullYear();

  const db = getDb(c.env.DB);

  // Ambil nominal default yayasan untuk backup
  const yConfig = await db.select().from(yayasan).where(eq(yayasan.id, user.yayasanId)).get();
  const nominalDefaultYayasan = yConfig?.nominalSyahriahDefault || 0;

  const result = await db.select({
    id: santri.id,
    nama: santri.nama,
    statusAktif: santri.statusAktif,
    syahriahStatus: santri.syahriahStatus,
    syahriahNominalKustom: santri.syahriahNominalKustom,
    jenjangNominal: jenjang.nominalSyahriah,
    jenjangNama: jenjang.nama,
    paymentId: syahriahPayment.id,
    tanggalBayar: syahriahPayment.tanggalBayar,
    jumlahBayar: syahriahPayment.jumlahBayar,
    catatan: syahriahPayment.catatan,
  })
  .from(santri)
  .leftJoin(jenjang, eq(santri.jenjangId, jenjang.id))
  .leftJoin(syahriahPayment, and(
    eq(syahriahPayment.santriId, santri.id),
    eq(syahriahPayment.bulan, bulan),
    eq(syahriahPayment.tahun, tahun)
  ))
  .where(and(eq(santri.yayasanId, user.yayasanId), eq(santri.statusAktif, true)))
  .all();

  const formatted = result.map((r) => {
    // Tentukan nominal tagihan SPP
    let nominalTagihan = 0;
    if (r.syahriahStatus === 'WAJIB') {
      if (r.syahriahNominalKustom !== null) {
        nominalTagihan = r.syahriahNominalKustom;
      } else if (r.jenjangNominal !== null) {
        nominalTagihan = r.jenjangNominal;
      } else {
        nominalTagihan = nominalDefaultYayasan;
      }
    }

    const sudahBayar = r.syahriahStatus === 'GRATIS' || r.paymentId !== null;
    let statusPembayaran = 'BELUM_BAYAR';
    if (r.syahriahStatus === 'GRATIS') {
      statusPembayaran = 'GRATIS';
    } else if (r.paymentId !== null) {
      statusPembayaran = 'LUNAS';
    }

    return {
      santriId: r.id,
      nama: r.nama,
      jenjangNama: r.jenjangNama || 'Umum',
      syahriahStatus: r.syahriahStatus,
      nominalTagihan,
      sudahBayar,
      statusPembayaran,
      detailPembayaran: r.paymentId ? {
        id: r.paymentId,
        tanggalBayar: r.tanggalBayar,
        jumlahBayar: r.jumlahBayar,
        catatan: r.catatan
      } : null
    };
  });

  return c.json({
    bulan,
    tahun,
    data: formatted
  });
});

// Catat Pembayaran Syahriah (Otomatis juga tercatat sebagai pemasukan kas yayasan)
keuanganRouter.post('/syahriah/bayar', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { santriId, bulan, tahun, jumlahBayar, tanggalBayar, catatan } = body;

  if (!santriId || !bulan || !tahun || !jumlahBayar || !tanggalBayar) {
    return c.json({ error: 'Data pembayaran syahriah tidak lengkap' }, 400);
  }

  const db = getDb(c.env.DB);
  const now = new Date();
  const paymentId = crypto.randomUUID();
  const pemasukanId = crypto.randomUUID();

  // Pastikan santri valid & bertipe WAJIB (GRATIS tidak bayar)
  const targetSantri = await db.select().from(santri)
    .where(and(eq(santri.id, santriId), eq(santri.yayasanId, user.yayasanId)))
    .get();

  if (!targetSantri) {
    return c.json({ error: 'Santri tidak ditemukan' }, 404);
  }

  if (targetSantri.syahriahStatus === 'GRATIS') {
    return c.json({ error: 'Santri dengan status GRATIS tidak memerlukan pencatatan syahriah' }, 400);
  }

  // Cek apakah sudah pernah dibayar sebelumnya untuk bulan & tahun ini
  const existing = await db.select().from(syahriahPayment)
    .where(and(
      eq(syahriahPayment.santriId, santriId),
      eq(syahriahPayment.bulan, Number(bulan)),
      eq(syahriahPayment.tahun, Number(tahun)),
      eq(syahriahPayment.yayasanId, user.yayasanId)
    ))
    .get();

  if (existing) {
    return c.json({ error: 'Syahriah santri ini untuk periode bersangkutan sudah lunas' }, 400);
  }

  try {
    // Insert ke pembayaran SPP
    await db.insert(syahriahPayment).values({
      id: paymentId,
      yayasanId: user.yayasanId,
      santriId,
      bulan: Number(bulan),
      tahun: Number(tahun),
      jumlahBayar: Number(jumlahBayar),
      tanggalBayar,
      catatan: catatan || `Syahriah bulan ${bulan}/${tahun}`,
      createdAt: now,
      updatedAt: now,
    });

    // Otomatis masukkan ke kas umum Pemasukan Yayasan
    await db.insert(pemasukan).values({
      id: pemasukanId,
      yayasanId: user.yayasanId,
      tanggal: tanggalBayar,
      jumlah: Number(jumlahBayar),
      sumber: 'SYAHRIAH',
      keterangan: catatan || `SPP Syahriah Santri: ${targetSantri.nama} (Bulan ${bulan}/${tahun})`,
      createdAt: now,
      updatedAt: now,
    });

    return c.json({ success: true, paymentId });
  } catch (err: any) {
    return c.json({ error: 'Gagal mencatat pembayaran: ' + err.message }, 500);
  }
});

// ==========================================
// B. TABUNGAN SANTRI (Koperasi - Terpisah dari Kas)
// ==========================================

// Ambil semua daftar santri beserta total saldo tabungan
keuanganRouter.get('/tabungan', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);

  const summaries = await db.select({
    id: santri.id,
    nama: santri.nama,
    statusAktif: santri.statusAktif,
    totalSetor: sql<number>`sum(case when ${tabunganSantri.jenisTransaksi} = 'SETOR' then ${tabunganSantri.jumlah} else 0 end)`,
    totalTarik: sql<number>`sum(case when ${tabunganSantri.jenisTransaksi} = 'TARIK' then ${tabunganSantri.jumlah} else 0 end)`,
  })
  .from(santri)
  .leftJoin(tabunganSantri, eq(santri.id, tabunganSantri.santriId))
  .where(eq(santri.yayasanId, user.yayasanId))
  .groupBy(santri.id)
  .all();

  const formatted = summaries.map(s => ({
    santriId: s.id,
    nama: s.nama,
    statusAktif: s.statusAktif,
    saldo: (s.totalSetor || 0) - (s.totalTarik || 0)
  }));

  return c.json(formatted);
});

// Ambil mutasi detail tabungan santri (Buku Tabungan)
keuanganRouter.get('/tabungan/:santriId', async (c) => {
  const user = c.get('user');
  const santriId = c.req.param('santriId');
  const db = getDb(c.env.DB);

  const targetSantri = await db.select().from(santri)
    .where(and(eq(santri.id, santriId), eq(santri.yayasanId, user.yayasanId)))
    .get();

  if (!targetSantri) {
    return c.json({ error: 'Santri tidak ditemukan' }, 404);
  }

  const txs = await db.select().from(tabunganSantri)
    .where(and(eq(tabunganSantri.santriId, santriId), eq(tabunganSantri.yayasanId, user.yayasanId)))
    .orderBy(asc(tabunganSantri.tanggalTransaksi))
    .all();

  // Hitung running balance dinamis
  let runningBalance = 0;
  const mutasi = txs.map((t) => {
    if (t.jenisTransaksi === 'SETOR') {
      runningBalance += t.jumlah;
    } else {
      runningBalance -= t.jumlah;
    }
    return {
      id: t.id,
      tanggal: t.tanggalTransaksi,
      jenis: t.jenisTransaksi,
      jumlah: t.jumlah,
      keterangan: t.keterangan,
      saldo: runningBalance,
    };
  });

  return c.json({
    santri: {
      id: targetSantri.id,
      nama: targetSantri.nama,
      alamat: targetSantri.alamat,
    },
    totalSaldo: runningBalance,
    mutasi: mutasi.reverse() // Balik agar mutasi terbaru di atas untuk visual
  });
});

// Catat Transaksi Tabungan (Setor / Tarik)
keuanganRouter.post('/tabungan/transaksi', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { santriId, jenisTransaksi, jumlah, tanggalTransaksi, keterangan } = body;

  if (!santriId || !jenisTransaksi || !jumlah || !tanggalTransaksi) {
    return c.json({ error: 'Data transaksi tabungan tidak lengkap' }, 400);
  }

  if (jenisTransaksi !== 'SETOR' && jenisTransaksi !== 'TARIK') {
    return c.json({ error: 'Jenis transaksi harus SETOR atau TARIK' }, 400);
  }

  const db = getDb(c.env.DB);
  const now = new Date();
  const id = crypto.randomUUID();

  // 1. Cek Saldo saat ini jika melakukan TARIK
  if (jenisTransaksi === 'TARIK') {
    const totalSetor = await db.select({ total: sql<number>`sum(jumlah)` })
      .from(tabunganSantri)
      .where(and(eq(tabunganSantri.santriId, santriId), eq(tabunganSantri.jenisTransaksi, 'SETOR')))
      .get();
    const totalTarik = await db.select({ total: sql<number>`sum(jumlah)` })
      .from(tabunganSantri)
      .where(and(eq(tabunganSantri.santriId, santriId), eq(tabunganSantri.jenisTransaksi, 'TARIK')))
      .get();
    
    const saldoSaatIni = (totalSetor?.total || 0) - (totalTarik?.total || 0);
    if (Number(jumlah) > saldoSaatIni) {
      return c.json({ error: `Saldo tabungan tidak mencukupi. Saldo saat ini: Rp${saldoSaatIni.toLocaleString('id-ID')}` }, 400);
    }
  }

  await db.insert(tabunganSantri).values({
    id,
    yayasanId: user.yayasanId,
    santriId,
    jenisTransaksi,
    jumlah: Number(jumlah),
    tanggalTransaksi,
    keterangan: keterangan || `${jenisTransaksi} Tabungan`,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id });
});

// ==========================================
// C. PEMASUKAN & PENGELUARAN (Buku Kas Umum)
// ==========================================

keuanganRouter.get('/pemasukan', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);
  const result = await db.select().from(pemasukan)
    .where(eq(pemasukan.yayasanId, user.yayasanId))
    .orderBy(desc(pemasukan.tanggal))
    .all();
  return c.json(result);
});

keuanganRouter.post('/pemasukan', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { tanggal, jumlah, sumber, keterangan } = body;

  if (!tanggal || !jumlah || !sumber) {
    return c.json({ error: 'Tanggal, jumlah, dan sumber wajib diisi' }, 400);
  }

  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(pemasukan).values({
    id,
    yayasanId: user.yayasanId,
    tanggal,
    jumlah: Number(jumlah),
    sumber,
    keterangan: keterangan || null,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id });
});

keuanganRouter.get('/pengeluaran', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);
  const result = await db.select().from(pengeluaran)
    .where(eq(pengeluaran.yayasanId, user.yayasanId))
    .orderBy(desc(pengeluaran.tanggal))
    .all();
  return c.json(result);
});

keuanganRouter.post('/pengeluaran', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { tanggal, jumlah, kategori, keterangan } = body;

  if (!tanggal || !jumlah || !kategori) {
    return c.json({ error: 'Tanggal, jumlah, dan kategori wajib diisi' }, 400);
  }

  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(pengeluaran).values({
    id,
    yayasanId: user.yayasanId,
    tanggal,
    jumlah: Number(jumlah),
    kategori,
    keterangan: keterangan || null,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id });
});

// ==========================================
// D. PENGGAJIAN (Payroll) & Auto-Expense
// ==========================================

keuanganRouter.get('/penggajian', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);

  const result = await db.select({
    id: penggajian.id,
    bulan: penggajian.bulan,
    tahun: penggajian.tahun,
    gajiPokok: penggajian.gajiPokok,
    tunjangan: penggajian.tunjangan,
    potongan: penggajian.potongan,
    totalDiterima: penggajian.totalDiterima,
    tanggalDibayar: penggajian.tanggalDibayar,
    status: penggajian.status,
    ustadzNama: ustadz.namaLengkap,
  })
  .from(penggajian)
  .innerJoin(ustadz, eq(penggajian.ustadzId, ustadz.id))
  .where(eq(penggajian.yayasanId, user.yayasanId))
  .orderBy(desc(penggajian.tahun), desc(penggajian.bulan))
  .all();

  return c.json(result);
});

// Proses Pembayaran Gaji Pengajar (Otomatis Membuat Transaksi Pengeluaran Kas Umum)
keuanganRouter.post('/penggajian/bayar', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { ustadzId, bulan, tahun, gajiPokok, tunjangan, potongan, tanggalDibayar, keterangan } = body;

  if (!ustadzId || !bulan || !tahun || gajiPokok === undefined || !tanggalDibayar) {
    return c.json({ error: 'Data pembayaran gaji tidak lengkap' }, 400);
  }

  const db = getDb(c.env.DB);
  const now = new Date();
  const payrollId = crypto.randomUUID();
  const pengeluaranId = crypto.randomUUID();

  // 1. Ambil nominal default honor ustadz
  const targetUstadz = await db.select().from(ustadz)
    .where(and(eq(ustadz.id, ustadzId), eq(ustadz.yayasanId, user.yayasanId)))
    .get();

  if (!targetUstadz) {
    return c.json({ error: 'Ustadz tidak ditemukan' }, 404);
  }

  // 2. Cek apakah sudah pernah dibayar gaji bulan ini
  const existing = await db.select().from(penggajian)
    .where(and(
      eq(penggajian.ustadzId, ustadzId),
      eq(penggajian.bulan, Number(bulan)),
      eq(penggajian.tahun, Number(tahun)),
      eq(penggajian.yayasanId, user.yayasanId)
    ))
    .get();

  if (existing) {
    return c.json({ error: 'Gaji ustadz ini sudah dibayarkan untuk bulan berjalan' }, 400);
  }

  const gajiPokokVal = targetUstadz.nominalBisyarah || 0;
  const tunjanganVal = tunjangan ? Number(tunjangan) : 0;
  const potonganVal = potongan ? Number(potongan) : 0;
  const totalDiterima = gajiPokokVal + tunjanganVal - potonganVal;

  try {
    // Aksi atomis dengan D1:
    // 1. Buat Pengeluaran Kas
    await db.insert(pengeluaran).values({
      id: pengeluaranId,
      yayasanId: user.yayasanId,
      tanggal: tanggalDibayar,
      jumlah: totalDiterima,
      kategori: 'GAJI',
      keterangan: keterangan || `Pembayaran Honor Ustadz ${targetUstadz.namaLengkap} - Bulan ${bulan} Tahun ${tahun}`,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Buat Penggajian Payroll
    await db.insert(penggajian).values({
      id: payrollId,
      yayasanId: user.yayasanId,
      ustadzId,
      bulan: Number(bulan),
      tahun: Number(tahun),
      gajiPokok: gajiPokokVal,
      tunjangan: tunjanganVal,
      potongan: potonganVal,
      totalDiterima,
      tanggalDibayar,
      status: 'DIBAYAR',
      pengeluaranId: pengeluaranId,
      createdAt: now,
      updatedAt: now,
    });

    return c.json({ success: true, payrollId });
  } catch (err: any) {
    return c.json({ error: 'Gagal memproses transaksi gaji: ' + err.message }, 500);
  }
});

export { keuanganRouter };
