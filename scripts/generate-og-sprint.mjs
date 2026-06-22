import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../public/og-sprint.png");

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A0F1E"/>
      <stop offset="100%" style="stop-color:#111827"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#7C3AED"/>
      <stop offset="50%" style="stop-color:#06B6D4"/>
      <stop offset="100%" style="stop-color:#3B82F6"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="#111827" stroke="#1E3A5F" stroke-width="2"/>
  <text x="100" y="180" fill="#94A3B8" font-family="system-ui,sans-serif" font-size="28">IntelliForge AI</text>
  <text x="100" y="280" fill="url(#accent)" font-family="system-ui,sans-serif" font-size="64" font-weight="bold">2-Week AI Sprint</text>
  <text x="100" y="360" fill="#E2E8F0" font-family="system-ui,sans-serif" font-size="36">Ship your first AI product in 14 days</text>
  <text x="100" y="440" fill="#94A3B8" font-family="system-ui,sans-serif" font-size="28">Claude API + RAG · Deployed to Vercel</text>
  <text x="100" y="520" fill="#22C55E" font-family="system-ui,sans-serif" font-size="48" font-weight="bold">₹4,999</text>
  <text x="280" y="520" fill="#64748B" font-family="system-ui,sans-serif" font-size="32" text-decoration="line-through">₹12,999</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath}`);
