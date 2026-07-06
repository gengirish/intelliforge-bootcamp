import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "../src/app");
const publicDir = path.join(__dirname, "../public");

/** IntelliForge AI Bootcamp mark — cyan + amber dual accent on dark ink. */
function faviconSvg(size) {
  const r = Math.round(size * 0.18);
  const stroke = Math.max(2, Math.round(size * 0.07));
  const cx = size / 2;
  const cy = size / 2;
  const arcR = size * 0.28;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="amber" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#FBBF24"/>
    </linearGradient>
    <linearGradient id="text" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="50%" stop-color="#A78BFA"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="#0A0F1C"/>
  <rect x="${stroke}" y="${stroke}" width="${size - stroke * 2}" height="${size - stroke * 2}" rx="${r - stroke}" fill="none" stroke="#1E293B" stroke-width="${stroke * 0.5}"/>
  <path d="M ${cx - arcR} ${cy + arcR * 0.15} A ${arcR} ${arcR} 0 1 1 ${cx + arcR} ${cy + arcR * 0.15}"
        fill="none" stroke="url(#cyan)" stroke-width="${stroke}" stroke-linecap="round"/>
  <path d="M ${cx - arcR} ${cy - arcR * 0.15} A ${arcR} ${arcR} 0 1 0 ${cx + arcR} ${cy - arcR * 0.15}"
        fill="none" stroke="url(#amber)" stroke-width="${stroke}" stroke-linecap="round"/>
  <text x="${cx}" y="${cy + size * 0.11}" text-anchor="middle"
        font-family="system-ui, -apple-system, Segoe UI, sans-serif"
        font-size="${Math.round(size * 0.34)}" font-weight="700" fill="url(#text)">IF</text>
</svg>`;
}

async function pngFromSvg(size) {
  return sharp(Buffer.from(faviconSvg(size))).png().toBuffer();
}

/** Minimal ICO writer — single 32×32 PNG embedded in ICO container. */
function toIco(pngBuffer) {
  const pngSize = pngBuffer.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngSize, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuffer]);
}

const sizes = [
  { name: "icon.png", size: 32, dir: appDir },
  { name: "apple-icon.png", size: 180, dir: appDir },
  { name: "icon-192.png", size: 192, dir: publicDir },
  { name: "icon-512.png", size: 512, dir: publicDir },
];

for (const { name, size, dir } of sizes) {
  const out = path.join(dir, name);
  await sharp(Buffer.from(faviconSvg(size))).png().toFile(out);
  console.log(`Wrote ${out} (${size}×${size})`);
}

const ico32 = await pngFromSvg(32);
writeFileSync(path.join(appDir, "favicon.ico"), toIco(ico32));
console.log(`Wrote ${path.join(appDir, "favicon.ico")}`);
console.log("Done.");
