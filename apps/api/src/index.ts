import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRouter } from './routes/auth';
import { dashboardRouter } from './routes/dashboard';
import { jenjangRouter } from './routes/jenjang';
import { kkRouter } from './routes/kk';
import { santriRouter } from './routes/santri';
import { ustadzRouter } from './routes/ustadz';
import { keuanganRouter } from './routes/keuangan';
import { settingsRouter } from './routes/settings';
import { uploadRouter } from './routes/upload';
import { AuthenticatedUser } from './middleware/auth';

type Bindings = {
  DB: D1Database;
};

type Variables = {
  user: AuthenticatedUser;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 1. CORS Configuration supporting session cookies across origins
app.use('*', cors({
  origin: (origin) => {
    // allow all origins in development (or restrict to localhost:3000 / target domains)
    return origin;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Set-Cookie'],
}));

// 2. Health check route
app.get('/health', (c) => c.text('Al-Munawwaroh API is running on Cloudflare Workers!'));

// 3. Mount routes
app.route('/api/auth', authRouter);
app.route('/api/dashboard', dashboardRouter);
app.route('/api/jenjang', jenjangRouter);
app.route('/api/kk', kkRouter);
app.route('/api/santri', santriRouter);
app.route('/api/ustadz', ustadzRouter);
app.route('/api/keuangan', keuanganRouter);
app.route('/api/settings', settingsRouter);
app.route('/api/upload', uploadRouter);

// Global Error Handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error: ' + err.message }, 500);
});

export default app;
