import { Hono } from 'hono';
import { authMiddleware, AuthenticatedUser } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/cloudinary';

const uploadRouter = new Hono<{ Bindings: { DB: D1Database }; Variables: { user: AuthenticatedUser } }>();

uploadRouter.use('*', authMiddleware);

uploadRouter.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.parseBody();
  
  const file = body.file;
  const targetFolder = (body.folder as string) || 'dokumen'; // Default 'dokumen' if not specified

  if (!file || !(file instanceof File)) {
    return c.json({ error: 'Tidak ada file yang diunggah' }, 400);
  }

  // Sanitize yayasan name for folder path
  const tenantName = user.yayasanNama
    ? user.yayasanNama.toLowerCase().replace(/[^a-z0-9]/g, '-')
    : user.yayasanId;

  // Final folder path structure: al-munawwaroh/<nama-yayasan>/<kategori>
  // e.g. al-munawwaroh/tpq-al-munawwaroh/santri
  const cloudinaryFolderPath = `al-munawwaroh/${tenantName}/${targetFolder}`;

  try {
    const fileBuffer = await file.arrayBuffer();
    
    // Use original file name without extension as prefix
    const dotIndex = file.name.lastIndexOf('.');
    const fileNamePrefix = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;

    const result = await uploadToCloudinary(c, fileBuffer, cloudinaryFolderPath, fileNamePrefix);

    if (!result) {
      return c.json({ error: 'Gagal mengunggah ke Cloudinary. Silakan periksa kredensial server.' }, 500);
    }

    return c.json({
      success: true,
      cloudinaryId: result.public_id,
      secureUrl: result.secure_url,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    return c.json({ error: 'Gagal memproses unggahan file: ' + error.message }, 500);
  }
});

export { uploadRouter };
