import fs from "node:fs";
import path from "node:path";

/**
 * The generated PDF's HTML is passed to Puppeteer via `page.setContent()`,
 * which has no navigable origin — a relative or absolute `/branding/...`
 * `<img src>` has nothing to resolve against (and no guaranteed network
 * access in the Vercel serverless environment either). Reading the SVGs
 * from the Next.js `public/` folder at generation time and inlining them
 * as data URIs sidesteps both problems entirely.
 */
function readSvgAsDataUri(filename: string): string {
  const filePath = path.join(process.cwd(), "public", "branding", filename);
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

export const YM_LOGO_WHITE_DATA_URI = readSvgAsDataUri("ym-logo-white.svg");
export const YM_LOGO_BLACK_DATA_URI = readSvgAsDataUri("ym-logo-black.svg");
