import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { getDb } from '../db/client';
import { sessions, users, yayasan } from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';

export interface AuthenticatedUser {
  id: string;
  yayasanId: string;
  nama: string;
  role: 'ketua' | 'sekretariat' | 'bendahara';
  yayasanNama: string;
}

export async function authMiddleware(c: Context, next: Next) {
  let sessionId = getCookie(c, 'session_token');
  
  // Fallback untuk perangkat mobile (iOS/Android) yang memblokir third-party cookie
  if (!sessionId) {
    const authHeader = c.req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionId = authHeader.substring(7);
    }
  }

  if (!sessionId) {
    return c.json({ error: 'Unauthorized: Session missing' }, 401);
  }

  const db = getDb(c.env.DB);
  const nowInSeconds = Math.floor(Date.now() / 1000);

  // Ambil data session, user, dan yayasan dari D1
  const result = await db.select({
    session: sessions,
    user: users,
    yayasan: yayasan,
  })
  .from(sessions)
  .innerJoin(users, eq(sessions.userId, users.id))
  .innerJoin(yayasan, eq(users.yayasanId, yayasan.id))
  .where(
    and(
      eq(sessions.id, sessionId),
      gt(sessions.expiresAt, nowInSeconds)
    )
  )
  .get();

  if (!result) {
    return c.json({ error: 'Unauthorized: Invalid or expired session' }, 401);
  }

  // Simpan data user dan yayasan ke context request
  c.set('user', {
    id: result.user.id,
    yayasanId: result.user.yayasanId,
    nama: result.user.nama,
    role: result.user.role as 'ketua' | 'sekretariat' | 'bendahara',
    yayasanNama: result.yayasan.nama,
  } as AuthenticatedUser);

  await next();
}
export type Env = {
  Bindings: {
    DB: D1Database;
  };
  Variables: {
    user: AuthenticatedUser;
  };
};
