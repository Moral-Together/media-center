import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

const W = 1200;
const H = 630;
const BG = '#020617';

async function loadPng(file) {
  return sharp(path.join(publicDir, file)).ensureAlpha();
}

async function main() {
  const play = await loadPng('logo_play.png');
  const text = await loadPng('logo_text.png');

  const playSize = 280;
  const playBuf = await play
    .resize(playSize, playSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const textWidth = 900;
  const textMeta = await text.metadata();
  const textHeight = Math.round((textWidth * textMeta.height) / textMeta.width);
  const textBuf = await text
    .resize(textWidth, textHeight, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const playMeta = await sharp(playBuf).metadata();
  const textMeta2 = await sharp(textBuf).metadata();

  const gap = 36;
  const stackH = playMeta.height + gap + textMeta2.height;
  const playTop = Math.round((H - stackH) / 2);
  const textTop = playTop + playMeta.height + gap;
  const playLeft = Math.round((W - playMeta.width) / 2);
  const textLeft = Math.round((W - textMeta2.width) / 2);

  const ogPath = path.join(publicDir, 'og-image.png');
  await sharp({
    create: { width: W, height: H, channels: 4, background: BG },
  })
    .composite([
      { input: playBuf, top: playTop, left: playLeft },
      { input: textBuf, top: textTop, left: textLeft },
    ])
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(ogPath);

  const faviconPath = path.join(publicDir, 'favicon.png');
  await play.resize(32, 32, { fit: 'contain', background: { r: 2, g: 6, b: 23, alpha: 1 } }).png().toFile(faviconPath);

  const applePath = path.join(publicDir, 'apple-touch-icon.png');
  await play.resize(180, 180, { fit: 'contain', background: { r: 2, g: 6, b: 23, alpha: 1 } }).png().toFile(applePath);

  const icoPath = path.join(publicDir, 'favicon.ico');
  await sharp(faviconPath).resize(32, 32).toFile(icoPath);

  const ogStat = await sharp(ogPath).metadata();
  console.log(`og-image.png ${ogStat.width}x${ogStat.height}`);
  console.log('favicon.ico, favicon.png, apple-touch-icon.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
