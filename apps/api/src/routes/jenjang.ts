import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { getDb } from '../db/client';
import { jenjang } from '../db/schema';
import { eq, and } from 'drizzle-orm';

const jenjangRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

jenjangRouter.use('*', authMiddleware);

// Get all programs / levels
jenjangRouter.get('/', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);
  
  const result = await db.select()
    .from(jenjang)
    .where(eq(jenjang.yayasanId, user.yayasanId))
    .all();

  return c.json(result);
});

// Create new program (Bendahara / Ketua)
jenjangRouter.post('/', requireRole(['ketua', 'bendahara']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { nama, nominalSyahriah } = body;

  if (!nama || nominalSyahriah === undefined) {
    return c.json({ error: 'Nama dan nominal Syahriah wajib diisi' }, 400);
  }

  const db = getDb(c.env.DB);
  const now = new Date();
  const id = crypto.randomUUID();

  await db.insert(jenjang).values({
    id,
    yayasanId: user.yayasanId,
    nama,
    nominalSyahriah: Number(nominalSyahriah),
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id });
});

// Update program (Bendahara / Ketua)
jenjangRouter.put('/:id', requireRole(['ketua', 'bendahara']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id') as string;
  const body = await c.req.json();
  const { nama, nominalSyahriah } = body;

  const db = getDb(c.env.DB);
  const now = new Date();

  // Pastikan program milik yayasan ybs
  const existing = await db.select().from(jenjang)
    .where(and(eq(jenjang.id, id), eq(jenjang.yayasanId, user.yayasanId))).get();
  
  if (!existing) {
    return c.json({ error: 'Program tidak ditemukan' }, 404);
  }

  await db.update(jenjang)
    .set({
      nama: nama || existing.nama,
      nominalSyahriah: nominalSyahriah !== undefined ? Number(nominalSyahriah) : existing.nominalSyahriah,
      updatedAt: now,
    })
    .where(eq(jenjang.id, id));

  return c.json({ success: true });
});

// Delete program (Bendahara / Ketua)
jenjangRouter.delete('/:id', requireRole(['ketua', 'bendahara']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id') as string;

  const db = getDb(c.env.DB);

  // Pastikan program milik yayasan ybs
  const existing = await db.select().from(jenjang)
    .where(and(eq(jenjang.id, id), eq(jenjang.yayasanId, user.yayasanId))).get();
  
  if (!existing) {
    return c.json({ error: 'Program tidak ditemukan' }, 404);
  }

  await db.delete(jenjang).where(eq(jenjang.id, id));

  return c.json({ success: true });
});

export { jenjangRouter };
