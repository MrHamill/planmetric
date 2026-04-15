/**
 * Export carousel HTML slides as numbered PNGs
 *
 * Usage:
 *   node scripts/export-carousel.mjs <html-file> <post-name>
 *
 * Example:
 *   node scripts/export-carousel.mjs social-media/drafts/CITY2SURF/City2Surf*.html "City2Surf"
 *
 * Output:
 *   Saves into the same folder as the HTML file:
 *     1. City2Surf.png
 *     2. City2Surf.png
 *     3. City2Surf.png
 *     ...
 */

import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const htmlArg = process.argv[2];
const postName = process.argv[3] || "slide";

if (!htmlArg) {
  console.error("Usage: node scripts/export-carousel.mjs <html-file> <post-name>");
  console.error('Example: node scripts/export-carousel.mjs "social-media/drafts/CITY2SURF/City2Surf 2026 — Plan Metric 1.html" "City2Surf"');
  process.exit(1);
}

const htmlPath = path.resolve(htmlArg);
const outputDir = path.dirname(htmlPath);

const SLIDE_WIDTH = 1080;
const SLIDE_HEIGHT = 1350;

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Load the HTML file
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  // Wait for fonts to load
  await page.evaluateHandle("document.fonts.ready");

  // Count the slides
  const slideCount = await page.evaluate(() =>
    document.querySelectorAll(".slide").length
  );

  console.log(`Found ${slideCount} slides. Exporting as "${postName}"...`);

  for (let i = 0; i < slideCount; i++) {
    // Navigate to slide
    await page.evaluate((idx) => {
      if (typeof goTo === "function") goTo(idx);
    }, i);

    // Let animations settle
    await new Promise((r) => setTimeout(r, 600));

    // Screenshot just the .stage element at high res
    const stageEl = await page.$(".stage");
    if (!stageEl) {
      console.error("Could not find .stage element");
      break;
    }

    const filename = `${i + 1}. ${postName}.png`;
    const outputPath = path.join(outputDir, filename);

    // Set viewport large enough, then clip to the stage
    await page.setViewport({ width: 1200, height: 1400, deviceScaleFactor: 2.5 });

    // Wait a bit after viewport change
    await new Promise((r) => setTimeout(r, 300));

    // Navigate again to ensure correct render at new viewport
    if (i === 0) {
      await page.evaluate((idx) => {
        if (typeof goTo === "function") goTo(idx);
      }, i);
      await new Promise((r) => setTimeout(r, 400));
    }

    await stageEl.screenshot({
      path: outputPath,
      type: "png",
    });

    console.log(`  ✓ ${filename}`);
  }

  await browser.close();
  console.log(`\nDone! ${slideCount} slides saved to:\n  ${outputDir}`);
}

run().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
