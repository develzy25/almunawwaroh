const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const inputLogo = path.join(__dirname, '../public/logo.png');
  
  if (!fs.existsSync(inputLogo)) {
    console.error('logo.png not found at', inputLogo);
    return;
  }

  // Define corner radius (e.g. 25% of image width for squircle-like)
  const meta = await sharp(inputLogo).metadata();
  const size = Math.min(meta.width, meta.height);
  const rx = Math.round(size * 0.22); // 22% radius for premium feel
  
  // Create an SVG mask with rounded corners
  const roundedCorners = Buffer.from(`
    <svg><rect x="0" y="0" width="${size}" height="${size}" rx="${rx}" ry="${rx}"/></svg>
  `);

  console.log('Processing main logo with rounded corners...');
  
  // Create a cropped version of the original with transparent corners
  const processedLogo = await sharp(inputLogo)
    .resize(size, size, { fit: 'cover' })
    .composite([{
      input: roundedCorners,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // 1. Overwrite public/logo.png with the new transparent one
  fs.writeFileSync(inputLogo, processedLogo);
  console.log('Updated public/logo.png');

  // 2. Generate Favicon & App Icons (Next.js app/ directory)
  const appDir = path.join(__dirname, '../src/app');
  
  // favicon.ico is standard, but Next.js supports icon.png
  await sharp(processedLogo)
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, 'icon.png'));
  console.log('Generated src/app/icon.png (32x32)');

  await sharp(processedLogo)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));
  console.log('Generated src/app/apple-icon.png (180x180)');

  // 3. Generate PWA icons in public/
  await sharp(processedLogo)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../public/icon-192x192.png'));
  console.log('Generated public/icon-192x192.png');

  await sharp(processedLogo)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/icon-512x512.png'));
  console.log('Generated public/icon-512x512.png');

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
