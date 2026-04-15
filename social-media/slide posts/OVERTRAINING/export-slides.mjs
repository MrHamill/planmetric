import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Find the HTML file dynamically (handles FIXED suffix or name variations)
const htmlFile = fs.readdirSync(__dirname).find(f => f.endsWith('.html') && f.includes('Overtraining'));
if (!htmlFile) { console.error('HTML file not found'); process.exit(1); }
const htmlPath = path.join(__dirname, htmlFile);
console.log('Source:', htmlFile);
const outDir = __dirname;
const html = fs.readFileSync(htmlPath, 'utf-8');

const TOTAL_SLIDES = 7;
const SCALE = 2; // 864x1080 final output

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: SCALE });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for Google Fonts to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    await page.evaluate((idx) => goTo(idx), i);
    await new Promise(r => setTimeout(r, 700));

    const stage = await page.$('.stage');
    const outPath = path.join(outDir, `slide_${i + 1}.png`);
    await stage.screenshot({ path: outPath, type: 'png' });
    console.log(`Saved: slide_${i + 1}.png`);
  }

  await browser.close();
  console.log(`\nDone — ${TOTAL_SLIDES} slides exported at 864x1080px`);
}

run().catch(err => { console.error(err); process.exit(1); });
