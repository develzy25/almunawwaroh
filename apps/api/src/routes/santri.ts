import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { getDb } from '../db/client';
import { santri, kartuKeluarga, jenjang, santriDokumen } from '../db/schema';
import { eq, and } from 'drizzle-orm';

const santriRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

santriRouter.use('*', authMiddleware);

// Get list of santri (accessible by all logged in roles)
santriRouter.get('/', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);

  const result = await db.select({
    id: santri.id,
    nama: santri.nama,
    nik: santri.nik,
    jenisKelamin: santri.jenisKelamin,
    statusAktif: santri.statusAktif,
    syahriahStatus: santri.syahriahStatus,
    tanggalMasuk: santri.tanggalMasuk,
    jenjangNama: jenjang.nama,
    kkNomor: kartuKeluarga.nomorKk,
    fotoSecureUrl: santri.fotoSecureUrl,
  })
  .from(santri)
  .leftJoin(jenjang, eq(santri.jenjangId, jenjang.id))
  .leftJoin(kartuKeluarga, eq(santri.kkId, kartuKeluarga.id))
  .where(eq(santri.yayasanId, user.yayasanId))
  .all();

  return c.json(result);
});

// Get detailed santri profile
santriRouter.get('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = getDb(c.env.DB);

  const detail = await db.select({
    santri: santri,
    jenjang: jenjang,
    kartuKeluarga: kartuKeluarga,
  })
  .from(santri)
  .leftJoin(jenjang, eq(santri.jenjangId, jenjang.id))
  .leftJoin(kartuKeluarga, eq(santri.kkId, kartuKeluarga.id))
  .where(and(eq(santri.id, id), eq(santri.yayasanId, user.yayasanId)))
  .get();

  if (!detail) {
    return c.json({ error: 'Santri tidak ditemukan' }, 404);
  }

  // Ambil berkas / dokumen santri
  const docs = await db.select().from(santriDokumen)
    .where(and(eq(santriDokumen.santriId, id), eq(santriDokumen.yayasanId, user.yayasanId)))
    .all();

  return c.json({
    ...detail.santri,
    jenjangNama: detail.jenjang?.nama || null,
    kkDetails: detail.kartuKeluarga || null,
    dokumen: docs
  });
});

// Add new santri (Sekretariat / Bendahara)
santriRouter.post('/', requireRole(['sekretariat', 'bendahara']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const {
    nama, nik, jenisKelamin, tempatLahir, tanggalLahir, alamat,
    sekolah, tanggalMasuk, statusAktif, syahriahStatus, syahriahNominalKustom,
    kkId, jenjangId, fotoCloudinaryId, fotoSecureUrl, fotoWidth, fotoHeight, fotoBytes
  } = body;

  if (!nama || !jenisKelamin || !tempatLahir || !tanggalLahir || !alamat || !sekolah || !tanggalMasuk || !syahriahStatus) {
    return c.json({ error: 'Mohon lengkapi kolom data wajib santri' }, 400);
  }

  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(santri).values({
    id,
    yayasanId: user.yayasanId,
    kkId: kkId || null,
    jenjangId: jenjangId || null,
    nama,
    nik: nik || null,
    jenisKelamin,
    tempatLahir,
    tanggalLahir,
    alamat,
    sekolah,
    tanggalMasuk,
    statusAktif: statusAktif !== undefined ? Boolean(statusAktif) : true,
    syahriahStatus,
    syahriahNominalKustom: syahriahNominalKustom ? Number(syahriahNominalKustom) : null,
    fotoCloudinaryId: fotoCloudinaryId || null,
    fotoSecureUrl: fotoSecureUrl || null,
    fotoWidth: fotoWidth ? Number(fotoWidth) : null,
    fotoHeight: fotoHeight ? Number(fotoHeight) : null,
    fotoBytes: fotoBytes ? Number(fotoBytes) : null,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id });
});

// Update santri data (Sekretariat / Bendahara)
santriRouter.put('/:id', requireRole(['sekretariat', 'bendahara']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const now = new Date();

  const existing = await db.select().from(santri)
    .where(and(eq(santri.id, id), eq(santri.yayasanId, user.yayasanId)))
    .get();

  if (!existing) {
    return c.json({ error: 'Santri tidak ditemukan' }, 404);
  }

  await db.update(santri)
    .set({
      kkId: body.kkId !== undefined ? (body.kkId || null) : existing.kkId,
      jenjangId: body.jenjangId !== undefined ? (body.jenjangId || null) : existing.jenjangId,
      nama: body.nama ?? existing.nama,
      nik: body.nik !== undefined ? (body.nik || null) : existing.nik,
      jenisKelamin: body.jenisKelamin ?? existing.jenisKelamin,
      tempatLahir: body.tempatLahir ?? existing.tempatLahir,
      tanggalLahir: body.tanggalLahir ?? existing.tanggalLahir,
      alamat: body.alamat ?? existing.alamat,
      sekolah: body.sekolah ?? existing.sekolah,
      tanggalMasuk: body.tanggalMasuk ?? existing.tanggalMasuk,
      statusAktif: body.statusAktif !== undefined ? Boolean(body.statusAktif) : existing.statusAktif,
      syahriahStatus: body.syahriahStatus ?? existing.syahriahStatus,
      syahriahNominalKustom: body.syahriahNominalKustom !== undefined ? (body.syahriahNominalKustom ? Number(body.syahriahNominalKustom) : null) : existing.syahriahNominalKustom,
      fotoCloudinaryId: body.fotoCloudinaryId !== undefined ? (body.fotoCloudinaryId || null) : existing.fotoCloudinaryId,
      fotoSecureUrl: body.fotoSecureUrl !== undefined ? (body.fotoSecureUrl || null) : existing.fotoSecureUrl,
      fotoWidth: body.fotoWidth !== undefined ? (body.fotoWidth ? Number(body.fotoWidth) : null) : existing.fotoWidth,
      fotoHeight: body.fotoHeight !== undefined ? (body.fotoHeight ? Number(body.fotoHeight) : null) : existing.fotoHeight,
      fotoBytes: body.fotoBytes !== undefined ? (body.fotoBytes ? Number(body.fotoBytes) : null) : existing.fotoBytes,
      updatedAt: now,
    })
    .where(eq(santri.id, id));

  return c.json({ success: true });
});

// Delete santri (Sekretariat / Bendahara)
santriRouter.delete('/:id', requireRole(['sekretariat', 'bendahara']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = getDb(c.env.DB);

  const existing = await db.select().from(santri)
    .where(and(eq(santri.id, id), eq(santri.yayasanId, user.yayasanId)))
    .get();

  if (!existing) {
    return c.json({ error: 'Santri tidak ditemukan' }, 404);
  }

  await db.delete(santri).where(eq(santri.id, id));
  return c.json({ success: true });
});

// Attach document to Santri
santriRouter.post('/:id/documents', requireRole(['sekretariat', 'bendahara']), async (c) => {
  const user = c.get('user');
  const santriId = c.req.param('id');
  const body = await c.req.json();
  const { namaDokumen, cloudinaryId, secureUrl, bytes } = body;

  if (!namaDokumen || !cloudinaryId || !secureUrl || !bytes) {
    return c.json({ error: 'Metadata dokumen tidak lengkap' }, 400);
  }

  const db = getDb(c.env.DB);
  const now = new Date();
  const docId = crypto.randomUUID();

  // Pastikan santri ada
  const existingSantri = await db.select().from(santri)
    .where(and(eq(santri.id, santriId), eq(santri.yayasanId, user.yayasanId)))
    .get();

  if (!existingSantri) {
    return c.json({ error: 'Santri tidak ditemukan' }, 404);
  }

  await db.insert(santriDokumen).values({
    id: docId,
    yayasanId: user.yayasanId,
    santriId,
    namaDokumen,
    cloudinaryId,
    secureUrl,
    bytes: Number(bytes),
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id: docId });
});

// Delete Santri Document
santriRouter.delete('/documents/:docId', requireRole(['sekretariat', 'bendahara']), async (c) => {
  const user = c.get('user');
  const docId = c.req.param('docId');
  const db = getDb(c.env.DB);

  const existing = await db.select().from(santriDokumen)
    .where(and(eq(santriDokumen.id, docId), eq(santriDokumen.yayasanId, user.yayasanId)))
    .get();

  if (!existing) {
    return c.json({ error: 'Dokumen tidak ditemukan' }, 404);
  }

  await db.delete(santriDokumen).where(eq(santriDokumen.id, docId));
  return c.json({ success: true });
});

export { santriRouter };
