import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { getDb } from '../db/client';
import { yayasan, users } from '../db/schema';
import { eq, and } from 'drizzle-orm';

const settingsRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

settingsRouter.use('*', authMiddleware);

// Get current yayasan details (Ketua / Bendahara / Sekretariat)
settingsRouter.get('/', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);

  const result = await db.select().from(yayasan)
    .where(eq(yayasan.id, user.yayasanId))
    .get();

  if (!result) {
    return c.json({ error: 'Data yayasan tidak ditemukan' }, 404);
  }

  return c.json(result);
});

// Update yayasan details (Hanya Ketua Yayasan)
settingsRouter.put('/', requireRole(['ketua']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { nama, alamat, nominalSyahriahDefault } = body;

  const db = getDb(c.env.DB);
  const now = new Date();

  await db.update(yayasan)
    .set({
      nama: nama || undefined,
      alamat: alamat || undefined,
      nominalSyahriahDefault: nominalSyahriahDefault !== undefined ? Number(nominalSyahriahDefault) : undefined,
      updatedAt: now,
    })
    .where(eq(yayasan.id, user.yayasanId));

  return c.json({ success: true });
});

export { settingsRouter };

// Simple salted password hash using native Web Crypto SHA-256
async function hashPassword(password: string): Promise<string> {
  const salt = 'al-munawwaroh-secure-salt-2026';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get all users in yayasan
settingsRouter.get('/users', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);
  const result = await db.select({
    id: users.id,
    nama: users.nama,
    username: users.username,
    role: users.role,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.yayasanId, user.yayasanId));
  return c.json(result);
});

// Create new user (Hanya Ketua)
settingsRouter.post('/users', requireRole(['ketua']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { nama, username, password, role } = body;

  if (!nama || !username || !password || !role) {
    return c.json({ error: 'Semua kolom harus diisi' }, 400);
  }

  if (role !== 'bendahara' && role !== 'sekretariat' && role !== 'ketua') {
    return c.json({ error: 'Role tidak valid' }, 400);
  }

  const db = getDb(c.env.DB);
  
  // Check if username already exists
  const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
  if (existingUser) {
    return c.json({ error: 'Username sudah terdaftar' }, 400);
  }

  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const now = new Date();

  await db.insert(users).values({
    id: userId,
    yayasanId: user.yayasanId,
    username,
    passwordHash,
    nama,
    role,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, message: 'Akun berhasil ditambahkan' });
});

// Delete user (Hanya Ketua)
settingsRouter.delete('/users/:id', requireRole(['ketua']), async (c) => {
  const user = c.get('user');
  const targetId = c.req.param('id');
  
  if (targetId === user.id) {
    return c.json({ error: 'Tidak dapat menghapus akun Anda sendiri' }, 400);
  }

  const db = getDb(c.env.DB);
  await db.delete(users).where(and(eq(users.id, targetId as string), eq(users.yayasanId, user.yayasanId)));
  return c.json({ success: true, message: 'Akun berhasil dihapus' });
});
