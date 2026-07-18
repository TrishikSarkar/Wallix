import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'public');

const SOURCE = resolve(ROOT, 'images/wallix_logo.png');
const BASE_SIZE = 1024;
const LOGO_SCALE = 0.75;
const CORNER_RATIO = 0.17; // ~11px on 64px → 0.17

const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-64x64.png', size: 64 },
  { name: 'favicon.ico', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generate() {
  mkdirSync(PUBLIC, { recursive: true });

  const logoSize = Math.round(BASE_SIZE * LOGO_SCALE);

  const logoBuffer = await sharp(SOURCE)
    .resize(logoSize, logoSize, { fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();

  const composite = await sharp({
    create: {
      width: BASE_SIZE,
      height: BASE_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: logoBuffer,
        top: Math.round((BASE_SIZE - logoMeta.height) / 2),
        left: Math.round((BASE_SIZE - logoMeta.width) / 2),
      },
    ])
    .png()
    .toBuffer();

  const cornerRadius = Math.round(BASE_SIZE * CORNER_RATIO);

  const rounded = await sharp(composite)
    .composite([
      {
        input: Buffer.from(
          `<svg><rect x="0" y="0" width="${BASE_SIZE}" height="${BASE_SIZE}" rx="${cornerRadius}" ry="${cornerRadius}"/></svg>`
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  for (const { name, size } of SIZES) {
    const outPath = resolve(PUBLIC, name);
    await sharp(rounded)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✓ ${name} (${size}×${size})`);
  }

  writeFileSync(
    resolve(PUBLIC, 'site.webmanifest'),
    JSON.stringify({
      name: 'Wallix',
      short_name: 'Wallix',
      start_url: '/',
      display: 'standalone',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    })
  );
  console.log('✓ site.webmanifest');
}

generate().catch(console.error);
