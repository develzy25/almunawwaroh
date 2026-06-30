import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { getDb } from '../db/client';
import { kartuKeluarga, santri } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

const kkRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

kkRouter.use('*', authMiddleware);

// Get list of KK with member count
kkRouter.get('/', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);

  // Ambil KK beserta hitungan jumlah anggota santri
  const result = await db.select({
    id: kartuKeluarga.id,
    nomorKk: kartuKeluarga.nomorKk,
    alamat: kartuKeluarga.alamat,
    rt: kartuKeluarga.rt,
    rw: kartuKeluarga.rw,
    desa: kartuKeluarga.desa,
    kecamatan: kartuKeluarga.kecamatan,
    kabupaten: kartuKeluarga.kabupaten,
    provinsi: kartuKeluarga.provinsi,
    namaAyah: kartuKeluarga.namaAyah,
    namaIbu: kartuKeluarga.namaIbu,
    namaWali: kartuKeluarga.namaWali,
    createdAt: kartuKeluarga.createdAt,
    memberCount: sql<number>`(SELECT count(*) FROM ${santri} WHERE ${santri.kkId} = ${kartuKeluarga.id})`
  })
  .from(kartuKeluarga)
  .where(eq(kartuKeluarga.yayasanId, user.yayasanId))
  .all();

  return c.json(result);
});

// Get single KK detail with list of matching santri members
kkRouter.get('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = getDb(c.env.DB);

  const kkDetail = await db.select().from(kartuKeluarga)
    .where(and(eq(kartuKeluarga.id, id), eq(kartuKeluarga.yayasanId, user.yayasanId)))
    .get();

  if (!kkDetail) {
    return c.json({ error: 'Kartu Keluarga tidak ditemukan' }, 404);
  }

  // Get associated santri
  const members = await db.select().from(santri)
    .where(and(eq(santri.kkId, id), eq(santri.yayasanId, user.yayasanId)))
    .all();

  return c.json({
    ...kkDetail,
    members
  });
});

// Create KK (Sekretariat / Bendahara)
kkRouter.post('/', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { nomorKk, alamat, rt, rw, desa, kecamatan, kabupaten, provinsi, namaAyah, namaIbu, namaWali } = body;

  if (!nomorKk || !alamat || !rt || !rw || !desa || !kecamatan || !kabupaten || !provinsi || !namaAyah || !namaIbu) {
    return c.json({ error: 'Mohon isi data wajib KK dengan lengkap' }, 400);
  }

  const db = getDb(c.env.DB);

  // Cek keunikan nomor KK di yayasan yang sama
  const existing = await db.select().from(kartuKeluarga)
    .where(and(eq(kartuKeluarga.nomorKk, nomorKk), eq(kartuKeluarga.yayasanId, user.yayasanId)))
    .get();
  
  if (existing) {
    return c.json({ error: 'Nomor KK sudah terdaftar di yayasan ini' }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date();

  await db.insert(kartuKeluarga).values({
    id,
    yayasanId: user.yayasanId,
    nomorKk,
    alamat,
    rt,
    rw,
    desa,
    kecamatan,
    kabupaten,
    provinsi,
    namaAyah,
    namaIbu,
    namaWali,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id });
});

// Update KK (Sekretariat / Bendahara)
kkRouter.put('/:id', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const body = await c.req.json();

  const db = getDb(c.env.DB);
  const now = new Date();

  const existing = await db.select().from(kartuKeluarga)
    .where(and(eq(kartuKeluarga.id, id), eq(kartuKeluarga.yayasanId, user.yayasanId)))
    .get();

  if (!existing) {
    return c.json({ error: 'Kartu Keluarga tidak ditemukan' }, 404);
  }

  // Jika update nomor KK, pastikan tetap unik
  if (body.nomorKk && body.nomorKk !== existing.nomorKk) {
    const duplicate = await db.select().from(kartuKeluarga)
      .where(and(eq(kartuKeluarga.nomorKk, body.nomorKk), eq(kartuKeluarga.yayasanId, user.yayasanId)))
      .get();
    if (duplicate) {
      return c.json({ error: 'Nomor KK baru sudah digunakan oleh keluarga lain' }, 400);
    }
  }

  await db.update(kartuKeluarga)
    .set({
      nomorKk: body.nomorKk ?? existing.nomorKk,
      alamat: body.alamat ?? existing.alamat,
      rt: body.rt ?? existing.rt,
      rw: body.rw ?? existing.rw,
      desa: body.desa ?? existing.desa,
      kecamatan: body.kecamatan ?? existing.kecamatan,
      kabupaten: body.kabupaten ?? existing.kabupaten,
      provinsi: body.provinsi ?? existing.provinsi,
      namaAyah: body.namaAyah ?? existing.namaAyah,
      namaIbu: body.namaIbu ?? existing.namaIbu,
      namaWali: body.namaWali !== undefined ? body.namaWali : existing.namaWali,
      updatedAt: now,
    })
    .where(eq(kartuKeluarga.id, id));

  return c.json({ success: true });
});

// Delete KK (Sekretariat / Bendahara)
kkRouter.delete('/:id', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = getDb(c.env.DB);

  const existing = await db.select().from(kartuKeluarga)
    .where(and(eq(kartuKeluarga.id, id), eq(kartuKeluarga.yayasanId, user.yayasanId)))
    .get();

  if (!existing) {
    return c.json({ error: 'Kartu Keluarga tidak ditemukan' }, 404);
  }

  // Hapus KK
  await db.delete(kartuKeluarga).where(eq(kartuKeluarga.id, id));

  return c.json({ success: true });
});

export { kkRouter };
