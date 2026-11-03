#!/usr/bin/env node
/* Build a truly standalone index.html that works when opened from Android
 * content:// URIs or iOS local Files, with no adjacent assets or internet.
 * Source files remain independently editable in this repository.
 * Usage: node scripts/build-standalone.js [--check]
 */
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const source = read("index.template.html");
const mainCss = read("style.css").replace(/^@import\s+url\([^\n]+\);\s*/, "");
const mobileCss = read("mobile.css");
const eventScript = read("events.js");
const gameScript = read("app.js");
const imageDir = path.join(root, "assets", "scenes");
const imageFiles = fs.readdirSync(imageDir).filter(name => /^[a-z]+-[123]\.svg$/.test(name)).sort();
if (imageFiles.length !== 75) throw new Error("Expected exactly 75 original scene images.");
const imageMap = {};
for (const name of imageFiles) {
  imageMap[name.slice(0, -4)] = fs.readFileSync(path.join(imageDir, name), "utf8");
}
const embedJson = JSON.stringify(imageMap).replace(/</g, "\\u003c");
const inlineScript = src => src.replace(/<\/script/gi, "<\\/script");
const styleLinks = '<link rel="stylesheet" href="./style.css">\n<link rel="stylesheet" href="./mobile.css">';
const scripts = '<script defer src="./events.js"></script>\n<script defer src="./app.js"></script>';
if (!source.includes(styleLinks) || !source.includes(scripts)) {
  throw new Error("The standalone source HTML has changed; update builder placeholders.");
}
let output = source.replace(
  styleLinks,
  '<style id="one-sea-inline-styles">\n' + mainCss + '\n' + mobileCss + '\n</style>'
).replace(scripts, "");
const embedded = [
  '<!-- All 75 images and all game logic are embedded to support content:// files. -->',
  '<script id="one-sea-scene-catalog" type="application/json">' + embedJson + '</script>',
  '<script>globalThis.OneSeaOfflineScenes = JSON.parse(document.getElementById("one-sea-scene-catalog").textContent);</script>',
  '<script>\n' + inlineScript(eventScript) + '\n</script>',
  '<script>\n' + inlineScript(gameScript) + '\n</script>'
].join('\n');
output = output.replace("</body>", embedded + "\n</body>");
output = output.replace("<!doctype html>", "<!doctype html>\n<!-- Standalone build: generated with node scripts/build-standalone.js; edit index.template.html instead. -->");
const dest = path.join(root, "index.html");
if (process.argv.includes("--check")) {
  if (!fs.existsSync(dest) || fs.readFileSync(dest,"utf8") !== output) {
    console.error("Standalone index.html is out of date. Run: node scripts/build-standalone.js");
    process.exit(1);
  }
  console.log("PASS: standalone index.html matches source; " + imageFiles.length + " scenes embedded.");
} else {
  fs.writeFileSync(dest, output, "utf8");
  console.log("Built index.html (" + Buffer.byteLength(output).toLocaleString() +
    " bytes, " + imageFiles.length + " offline scenes, no separate CSS/JS needed).");
}
