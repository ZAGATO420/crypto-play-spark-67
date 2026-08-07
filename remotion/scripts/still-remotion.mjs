import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compId = process.argv[2] ?? "trailer";
const frames = (process.argv[3] ?? "40").split(",").map(Number);
const bundled = await bundle({ entryPoint: path.resolve(__dirname, "../src/index.ts"), webpackOverride: (c) => c });
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: compId, puppeteerInstance: browser });
for (const frame of frames) {
  await renderStill({ composition, serveUrl: bundled, output: `/tmp/qa/${compId}_${frame}.png`, frame, puppeteerInstance: browser, overwrite: true });
  console.log("still", frame);
}
await browser.close({ silent: false });