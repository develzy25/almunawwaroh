import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { getDb } from '../db/client';
import { ustadz, ustadzDokumen, ustadzJabatan } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { deleteFromCloudinary, getResourceType } from '../utils/cloudinary';

const ustadzRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

ustadzRouter.use('*', authMiddleware);

// Get list of ustadz (conditionally masking salary)
ustadzRouter.get('/', async (c) => {
  const user = c.get('user');
  const db = getDb(c.env.DB);
  const isSekretariat = user.role === 'sekretariat';

  const result = await db.select().from(ustadz)
    .where(eq(ustadz.yayasanId, user.yayasanId))
    .all();

  // Jika sekretariat, sensor nominal bisyarah
  const formatted = result.map((t) => {
    if (isSekretariat) {
      const { nominalBisyarah, ...rest } = t;
      return rest;
    }
    return t;
  });

  return c.json(formatted);
});

// Get detailed ustadz profile
ustadzRouter.get('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = getDb(c.env.DB);
  const isSekretariat = user.role === 'sekretariat';

  const ustadzData = await db.select().from(ustadz)
    .where(and(eq(ustadz.id, id), eq(ustadz.yayasanId, user.yayasanId)))
    .get();

  if (!ustadzData) {
    return c.json({ error: 'Ustadz tidak ditemukan' }, 404);
  }

  // Ambil dokumen ustadz
  const docs = await db.select().from(ustadzDokumen)
    .where(and(eq(ustadzDokumen.ustadzId, id), eq(ustadzDokumen.yayasanId, user.yayasanId)))
    .all();

  // Ambil jabatan ustadz
  const jabatan = await db.select().from(ustadzJabatan)
    .where(eq(ustadzJabatan.ustadzId, id))
    .all();

  if (isSekretariat) {
    const { nominalBisyarah, ...maskedUstadz } = ustadzData;
    return c.json({
      ...maskedUstadz,
      dokumen: docs,
      jabatan: jabatan
    });
  }

  return c.json({
    ...ustadzData,
    dokumen: docs,
    jabatan: jabatan
  });
});

// Add new ustadz (Sekretariat / Bendahara / Ketua)
ustadzRouter.post('/', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = new Date();

  const finalBisyarah = user.role === 'sekretariat' ? 0 : Number(body.nominalBisyarah || 0);

  await db.insert(ustadz).values({
    id,
    yayasanId: user.yayasanId,
    nomorInduk: body.nomorInduk || null,
    namaLengkap: body.namaLengkap,
    namaPanggilan: body.namaPanggilan || null,
    jenisKelamin: body.jenisKelamin || null,
    tempatLahir: body.tempatLahir || null,
    tanggalLahir: body.tanggalLahir || null,
    noHp: body.noHp || null,
    alamat: body.alamat || null,
    foto: body.foto || null,
    tmtMengajar: body.tmtMengajar || null,
    statusKeaktifan: body.statusKeaktifan || null,
    unitMengajar: body.unitMengajar || null,
    hafalanJuz: body.hafalanJuz ? Number(body.hafalanJuz) : null,
    jenisBisyarah: body.jenisBisyarah || null,
    nominalBisyarah: finalBisyarah,
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true, id });
});

// Update ustadz info
ustadzRouter.put('/:id', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id') as string;
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const now = new Date();

  const existing = await db.select().from(ustadz)
    .where(and(eq(ustadz.id, id), eq(ustadz.yayasanId, user.yayasanId)))
    .get();

  if (!existing) {
    return c.json({ error: 'Ustadz tidak ditemukan' }, 404);
  }

  const isSekretariat = user.role === 'sekretariat';
  const newBisyarah = isSekretariat ? existing.nominalBisyarah : (body.nominalBisyarah !== undefined ? Number(body.nominalBisyarah) : existing.nominalBisyarah);

  await db.update(ustadz)
    .set({
      nomorInduk: body.nomorInduk !== undefined ? body.nomorInduk : existing.nomorInduk,
      namaLengkap: body.namaLengkap ?? existing.namaLengkap,
      namaPanggilan: body.namaPanggilan !== undefined ? body.namaPanggilan : existing.namaPanggilan,
      jenisKelamin: body.jenisKelamin !== undefined ? body.jenisKelamin : existing.jenisKelamin,
      tempatLahir: body.tempatLahir !== undefined ? body.tempatLahir : existing.tempatLahir,
      tanggalLahir: body.tanggalLahir !== undefined ? body.tanggalLahir : existing.tanggalLahir,
      noHp: body.noHp !== undefined ? body.noHp : existing.noHp,
      alamat: body.alamat !== undefined ? body.alamat : existing.alamat,
      foto: body.foto !== undefined ? body.foto : existing.foto,
      tmtMengajar: body.tmtMengajar !== undefined ? body.tmtMengajar : existing.tmtMengajar,
      statusKeaktifan: body.statusKeaktifan !== undefined ? body.statusKeaktifan : existing.statusKeaktifan,
      unitMengajar: body.unitMengajar !== undefined ? body.unitMengajar : existing.unitMengajar,
      hafalanJuz: body.hafalanJuz !== undefined ? Number(body.hafalanJuz) : existing.hafalanJuz,
      jenisBisyarah: body.jenisBisyarah !== undefined ? body.jenisBisyarah : existing.jenisBisyarah,
      nominalBisyarah: newBisyarah,
      updatedAt: now,
    })
    .where(eq(ustadz.id, id));

  return c.json({ success: true });
});

// Delete ustadz profile
ustadzRouter.delete('/:id', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id') as string;
  const db = getDb(c.env.DB);

  const existing = await db.select().from(ustadz)
    .where(and(eq(ustadz.id, id), eq(ustadz.yayasanId, user.yayasanId)))
    .get();

  if (!existing) {
    return c.json({ error: 'Ustadz tidak ditemukan' }, 404);
  }

  // 1. Hapus foto profil dari Cloudinary jika ada
  if (existing.foto) {
    let publicId = existing.foto;
    // Jika disimpan sebagai URL lengkap, ekstrak public_id-nya
    if (existing.foto.startsWith('http')) {
      const parts = existing.foto.split('/upload/');
      if (parts.length > 1) {
        const pathParts = parts[1].split('/');
        if (pathParts[0].startsWith('v')) {
          pathParts.shift(); // Buang folder versi (v123456)
        }
        const fullPath = pathParts.join('/');
        const lastDot = fullPath.lastIndexOf('.');
        publicId = lastDot !== -1 ? fullPath.substring(0, lastDot) : fullPath;
      }
    }
    await deleteFromCloudinary(c, publicId, 'image');
  }

  // 2. Ambil semua berkas dokumen ustadz ini dan hapus dari Cloudinary
  const docs = await db.select().from(ustadzDokumen)
    .where(and(eq(ustadzDokumen.ustadzId, id), eq(ustadzDokumen.yayasanId, user.yayasanId)))
    .all();

  for (const doc of docs) {
    if (doc.cloudinaryId) {
      const resType = getResourceType(doc.cloudinaryId, doc.secureUrl);
      await deleteFromCloudinary(c, doc.cloudinaryId, resType);
    }
  }

  // 3. Hapus dari database (D1 akan meng-cascade delete ustadzJabatan & ustadzDokumen)
  await db.delete(ustadz).where(eq(ustadz.id, id));
  return c.json({ success: true });
});

// Manage Jabatan
ustadzRouter.post('/:id/jabatan', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const user = c.get('user');
  const ustadzId = c.req.param('id') as string;
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const now = new Date();

  await db.insert(ustadzJabatan).values({
    id: crypto.randomUUID(),
    ustadzId,
    jabatan: body.jabatan,
    tmtJabatan: body.tmtJabatan || null,
    tstJabatan: body.tstJabatan || null,
    status: body.status || 'Aktif',
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ success: true });
});

ustadzRouter.delete('/:id/jabatan/:jabatanId', requireRole(['sekretariat', 'bendahara', 'ketua']), async (c) => {
  const jabatanId = c.req.param('jabatanId') as string;
  const db = getDb(c.env.DB);
  
  await db.delete(ustadzJabatan).where(eq(ustadzJabatan.id, jabatanId));
  return c.json({ success: true });
});

export { ustadzRouter };
