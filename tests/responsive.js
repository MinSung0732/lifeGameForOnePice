/* Mobile UI contract checks — no browser dependencies. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const html = fs.readFileSync("index.template.html", "utf8");
const standalone = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("mobile.css", "utf8");
const app = fs.readFileSync("app.js", "utf8");

function has(pattern, source, reason) {
  assert.match(source, pattern, reason);
}

has(/<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/, html, "mobile viewport meta");
has(/<link rel="stylesheet" href="\.\/mobile\.css">/, html, "responsive styles loaded");
has(/id="mobile-dock"/, html, "mobile navigation");
has(/id="mobile-brief"/, html, "mobile state summary");
for (const id of ["scene-title", "choices-wrap", "profile-card", "journal-card"]) {
  has(new RegExp('id="' + id + '"'), html, "scroll target exists: " + id);
  has(new RegExp('data-jump="' + id + '"'), html, "navigation target exists: " + id);
}
for (const id of ["focus-select", "speed-select", "next-year", "auto-button"]) {
  has(new RegExp('id="' + id + '"'), html, "progress control exists: " + id);
}
has(/@media \(max-width: 720px\)/, css, "mobile breakpoint");
has(/@media \(max-width: 390px\)/, css, "narrow phone breakpoint");
has(/@media \(max-width: 340px\)/, css, "small phone breakpoint");
has(/@media \(max-width: 850px\)/, css, "tablet breakpoint");
has(/grid-template-columns:\s*minmax\(0,\s*1fr\)/, css, "single column story layout");
has(/\.mobile-dock\s*\{[\s\S]*?position:\s*fixed/, css, "quick navigation dock");
has(/safe-area-inset-bottom/, css, "iPhone safe area accommodation");
has(/font-size:\s*16px/, css, "input font size prevents iOS focus zoom");
has(/min-height:\s*44px/, css, "touch-friendly controls");
has(/prefers-reduced-motion/, css, "reduced motion support");
has(/scrollToNewStory\(\)/, app, "scene jump after choice");
has(/\$\("mobile-dock"\)\.addEventListener\("click"/, app, "dock navigation is wired");
for (const id of ["mobile-brief-name", "mobile-brief-health", "mobile-brief-money"]) {
  has(new RegExp('\\$\\("' + id + '"\\)\\.textContent'), app, "compact status updates: " + id);
}
// Verify source stays editable separately from the generated standalone build.
assert.ok(fs.existsSync("scripts/build-standalone.js"));
if (standalone.includes("Standalone build:")) {
  has(/id="one-sea-inline-styles"/, standalone, "all CSS is embedded");
  has(/id="one-sea-scene-catalog"/, standalone, "scene artwork is embedded");
  has(/globalThis\.OneSeaOfflineScenes/, standalone, "embedded scene runtime is present");
  assert.ok(!standalone.includes('<script defer src="./app.js">'));
  assert.ok(!standalone.includes('<link rel="stylesheet" href="./mobile.css">'));
}
console.log("PASS: mobile UI anchors, tap targets, 320px breakpoint, safe areas, touch navigation and standalone support.");
