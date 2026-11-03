"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const html = fs.readFileSync("index.html","utf8");
const template = fs.readFileSync("index.template.html","utf8");
assert.match(html, /Standal(?:one) build:/);
assert.match(html, /<style id="one-sea-inline-styles">[\s\S]+?<\/style>/);
assert.match(html, /<div id="choose-sea-field" class="field hidden" hidden>/);
assert.ok(!html.includes('<link rel="stylesheet" href="./style.css">'));
assert.ok(!html.includes('<link rel="stylesheet" href="./mobile.css">'));
assert.ok(!html.includes('<script defer src="./app.js"></script>'));
assert.ok(!html.includes('<script defer src="./events.js"></script>'));
assert.ok(template.includes('<script defer src="./app.js"></script>'));
const found = html.match(/<script id="one-sea-scene-catalog" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(found, "offline scene catalog must exist");
const art=JSON.parse(found[1]);
assert.equal(Object.keys(art).length,75,"all illustrations embedded");
for(const [name,svg] of Object.entries(art)){
  assert.match(name,/^[a-z]+-[123]$/);
  assert.match(svg,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
}
const scriptTags = [...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.ok(scriptTags.length >= 4,"catalog, initialization, events, and game");
for (const match of scriptTags.slice(1)){
  new vm.Script(match[1],{filename:"index.html <inline-script>"});
}
assert.match(html,/OneSeaOfflineScenes/);
assert.match(html,/choose-sea-field"\)\.hidden = !choose;/);
assert.match(html,/mobile-dock/);
console.log("PASS: a single offline index.html bundles CSS, JS, all 75 original images and conditional birthplace controls.");