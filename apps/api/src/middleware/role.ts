import { Context, Next } from 'hono';
import { AuthenticatedUser } from './auth';

export function requireRole(allowedRoles: ('ketua' | 'sekretariat' | 'bendahara')[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as AuthenticatedUser | undefined;
    if (!user) {
      return c.json({ error: 'Unauthorized: Hubungkan session Anda' }, 401);
    }

    if (user.role !== 'ketua' && !allowedRoles.includes(user.role)) {
      return c.json({ error: 'Forbidden: Hak akses tidak memadai untuk aksi ini' }, 403);
    }

    await next();
  };
}
