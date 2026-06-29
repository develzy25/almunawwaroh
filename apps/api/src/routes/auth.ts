import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { getDb } from '../db/client';
import { users, sessions, yayasan } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';

const authRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

// Simple salted password hash using native Web Crypto SHA-256
async function hashPassword(password: string): Promise<string> {
  const salt = 'al-munawwaroh-secure-salt-2026';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 1. Bootstrapping / Onboarding Tenant Baru
authRouter.post('/register-yayasan', async (c) => {
  const body = await c.req.json();
  const { namaYayasan, alamatYayasan, namaUser } = body;

  if (!namaYayasan || !alamatYayasan || !namaUser) {
    return c.json({ error: 'Data registrasi tidak lengkap' }, 400);
  }

  const db = getDb(c.env.DB);

  const baseName = namaYayasan.toLowerCase().replace(/[^a-z0-9]/g, '');
  let username = baseName + '.ketua';
  
  // Check if username already registered, append random number if necessary
  let existingUser = await db.select().from(users).where(eq(users.username, username)).get();
  if (existingUser) {
    username = baseName + Math.floor(Math.random() * 1000) + '.ketua';
  }

  const yayasanId = crypto.randomUUID();
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword('123456');
  const now = new Date();

  // Jalankan transaksi pendaftaran tenant baru
  try {
    // 1. Insert Yayasan
    await db.insert(yayasan).values({
      id: yayasanId,
      nama: namaYayasan,
      alamat: alamatYayasan,
      nominalSyahriahDefault: 0,
      createdAt: now,
      updatedAt: now,
    });

    // 2. Insert User (Ketua Yayasan sebagai Admin Pertama)
    await db.insert(users).values({
      id: userId,
      yayasanId,
      username,
      passwordHash,
      nama: namaUser,
      role: 'ketua',
      createdAt: now,
      updatedAt: now,
    });

    return c.json({ success: true, username, message: 'Yayasan dan akun Ketua berhasil didaftarkan' });
  } catch (err: any) {
    return c.json({ error: 'Gagal melakukan pendaftaran: ' + err.message }, 500);
  }
});

// 2. Login User & Setup Session
authRouter.post('/login', async (c) => {
  const body = await c.req.json();
  const { username, password } = body;

  if (!username || !password) {
    return c.json({ error: 'Username dan password wajib diisi' }, 400);
  }

  const db = getDb(c.env.DB);
  const passwordHash = await hashPassword(password);

  const userResult = await db.select({
    user: users,
    yayasan: yayasan,
  })
  .from(users)
  .innerJoin(yayasan, eq(users.yayasanId, yayasan.id))
  .where(and(eq(users.username, username), eq(users.passwordHash, passwordHash)))
  .get();

  if (!userResult) {
    return c.json({ error: 'Username atau password salah' }, 401);
  }

  const { user, yayasan: userYayasan } = userResult;
  const sessionId = crypto.randomUUID();
  const maxAgeDays = 7;
  const expiresAt = Math.floor(Date.now() / 1000) + (maxAgeDays * 24 * 60 * 60);
  const now = new Date();

  // Simpan session token ke D1
  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt: expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  // Pasang HttpOnly cookie
  setCookie(c, 'session_token', sessionId, {
    httpOnly: true,
    secure: true, // Requires HTTPS (localhost is fine in modern dev tools)
    sameSite: 'None',
    path: '/',
    maxAge: maxAgeDays * 24 * 60 * 60,
  });

  return c.json({
    user: {
      id: user.id,
      yayasanId: user.yayasanId,
      nama: user.nama,
      username: user.username,
      role: user.role,
      yayasanNama: userYayasan.nama,
    }
  });
});

// 3. Logout & Hapus Session
authRouter.post('/logout', authMiddleware, async (c) => {
  const sessionId = getCookie(c, 'session_token');
  if (sessionId) {
    const db = getDb(c.env.DB);
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  deleteCookie(c, 'session_token', {
    path: '/',
  });

  return c.json({ success: true, message: 'Berhasil logout' });
});

// 4. Cek Session Me
authRouter.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  return c.json({ user });
});

export { authRouter };
