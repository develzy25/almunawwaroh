import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { getDb } from '../db/client';
import { sql, eq, and, isNull } from 'drizzle-orm';
import { santri, ustadz, kartuKeluarga, pemasukan, pengeluaran } from '../db/schema';
const dashboardRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

dashboardRouter.use('*', authMiddleware);

dashboardRouter.get('/stats', async (c) => {
  const user = c.get('user');
  const yayasanId = user.yayasanId;
  const db = getDb(c.env.DB);

  // 1. Santri Counts
  const totalSantriPromise = db.select({ count: sql<number>`count(*)` })
    .from(santri).where(eq(santri.yayasanId, yayasanId));

  const gratisSantriPromise = db.select({ count: sql<number>`count(*)` })
    .from(santri).where(and(eq(santri.yayasanId, yayasanId), eq(santri.syahriahStatus, 'GRATIS')));

  // 2. Pengajar & KK Counts
  const totalPengajarPromise = db.select({ count: sql<number>`count(*)` })
    .from(ustadz).where(eq(ustadz.yayasanId, yayasanId));

  const totalKKPromise = db.select({ count: sql<number>`count(*)` })
    .from(kartuKeluarga).where(eq(kartuKeluarga.yayasanId, yayasanId));

  // 3. Cashflow Ledgers (Sum Pemasukan & Pengeluaran)
  const totalPemasukanPromise = db.select({ total: sql<number>`coalesce(sum(jumlah), 0)` })
    .from(pemasukan).where(eq(pemasukan.yayasanId, yayasanId));

  const totalPengeluaranPromise = db.select({ total: sql<number>`coalesce(sum(jumlah), 0)` })
    .from(pengeluaran).where(eq(pengeluaran.yayasanId, yayasanId));

  // 4. Missing completeness checks (Audit Log / List data tidak lengkap)
  const santriNoFotoPromise = db.select({ count: sql<number>`count(*)` })
    .from(santri).where(and(eq(santri.yayasanId, yayasanId), isNull(santri.fotoSecureUrl)));

  const santriNoKKPromise = db.select({ count: sql<number>`count(*)` })
    .from(santri).where(and(eq(santri.yayasanId, yayasanId), isNull(santri.kkId)));

  const santriNoNIKPromise = db.select({ count: sql<number>`count(*)` })
    .from(santri).where(and(eq(santri.yayasanId, yayasanId), isNull(santri.nik)));

  const pengajarNoFotoPromise = db.select({ count: sql<number>`count(*)` })
    .from(ustadz).where(and(eq(ustadz.yayasanId, yayasanId), isNull(ustadz.foto)));

  // Eksekusi paralel query menggunakan D1 Database bindings
  const [
    [totalSantri],
    [gratisSantri],
    [totalPengajar],
    [totalKK],
    [totalPemasukan],
    [totalPengeluaran],
    [santriNoFoto],
    [santriNoKK],
    [santriNoNIK],
    [pengajarNoFoto],
  ] = await Promise.all([
    totalSantriPromise,
    gratisSantriPromise,
    totalPengajarPromise,
    totalKKPromise,
    totalPemasukanPromise,
    totalPengeluaranPromise,
    santriNoFotoPromise,
    santriNoKKPromise,
    santriNoNIKPromise,
    pengajarNoFotoPromise,
  ]);

  const pemasukanNum = totalPemasukan.total;
  const pengeluaranNum = totalPengeluaran.total;
  const saldo = pemasukanNum - pengeluaranNum;

  // Penghitungan kelengkapan data (%)
  const totalSantriNum = totalSantri.count;
  const totalPengajarNum = totalPengajar.count;
  const dataLengkapPoints = 
    (totalSantriNum - santriNoFoto.count) +
    (totalSantriNum - santriNoKK.count) +
    (totalSantriNum - santriNoNIK.count) +
    (totalPengajarNum - pengajarNoFoto.count);

  const totalPointsPossibles = (totalSantriNum * 3) + totalPengajarNum;
  const progressKelengkapan = totalPointsPossibles > 0 
    ? Math.round((dataLengkapPoints / totalPointsPossibles) * 100) 
    : 100;

  return c.json({
    stats: {
      totalSantri: totalSantriNum,
      totalUstadz: totalPengajarNum,
      totalKK: totalKK.count,
      totalPemasukan: pemasukanNum,
      totalPengeluaran: pengeluaranNum,
      saldo: saldo,
      gratisSantri: gratisSantri.count,
      progressKelengkapan: progressKelengkapan,
    },
    incompleteData: {
      santriMissingFoto: santriNoFoto.count,
      santriMissingKK: santriNoKK.count,
      santriMissingNIK: santriNoNIK.count,
      ustadzMissingFoto: pengajarNoFoto.count,
    }
  });
});

export { dashboardRouter };
