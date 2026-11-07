// Headless Chrome responsive and interaction check; Node 22 built-ins only.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, writeFile, mkdtemp, mkdir } from "node:fs/promises";
import { spawn, execFileSync } from "node:child_process";
import { join, extname } from "node:path";
import { tmpdir } from "node:os";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const root = process.cwd();
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg" };
const server = createServer(async (req, res) => {
  const path = join(root, (new URL(req.url, "http://localhost").pathname || "/").replace(/^\/+/, "") || "index.html");
  if (!path.startsWith(root + "/")) return res.writeHead(403).end();
  try { res.setHeader("Content-Type", types[extname(path)] || "application/octet-stream"); res.end(await readFile(path)); }
  catch { res.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let exe = process.env.CHROME_BIN;
for (const p of ["google-chrome", "chromium", "chromium-browser"]) {
  if (exe) break;
  try { exe = execFileSync("which", [p], { encoding: "utf8" }).trim(); } catch {}
}
assert.ok(exe, "No installed Chrome or Chromium binary");
const temp = await mkdtemp(join(tmpdir(), "sea-chrome-"));
console.log("BROWSER_BINARY", exe);
const browser = spawn(exe, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-allow-origins=*", "--remote-debugging-port=0", "--user-data-dir=" + temp, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
let stderr = "";
browser.stderr?.on("data", (chunk) => { stderr = (stderr + chunk.toString()).slice(-4000); });
browser.on("exit", (code, signal) => console.log("BROWSER_PROCESS_EXIT", code, signal));
let socket;
try {
  let port = 0;
  for (let i = 0; i < 250 && !port && browser.exitCode === null; i++) {
    try { port = Number((await readFile(join(temp, "DevToolsActivePort"), "utf8")).split("\n")[0]); }
    catch { await sleep(100); }
  }
  if (!port) console.log("BROWSER_STARTUP_DIAGNOSTIC", JSON.stringify({ executable:exe, exitCode:browser.exitCode, stderr }));
  assert.ok(port, "Chrome debugging port unavailable");
  const tabs = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
  const page = tabs.find((entry) => entry.type === "page");
  assert.ok(page, "Chrome page unavailable");
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let count = 0;
  const pending = new Map(), browserErrors = [];
  socket.addEventListener("message", (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === "Runtime.exceptionThrown") browserErrors.push(msg.params.exceptionDetails.text);
    if (!pending.has(msg.id)) return;
    const request = pending.get(msg.id); pending.delete(msg.id);
    msg.error ? request.reject(new Error(msg.error.message)) : request.resolve(msg.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++count; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result?.value;
  };
  const until = async (expression) => {
    for (let i = 0; i < 90; i++) { if (await evaluate(expression)) return; await sleep(100); }
    throw new Error("Browser condition not met: " + expression);
  };
  await send("Page.enable"); await send("Runtime.enable");
  await mkdir(join(root, "test-results"), { recursive: true });
  const url = "http://127.0.0.1:" + server.address().port;
  const result = [];
  for (const [device, width, height] of [["mobile", 390, 844], ["desktop", 1280, 800]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, mobile: device === "mobile", deviceScaleFactor: 1 });
    await send("Page.navigate", { url: url + "/?device=" + device });
    await until('document.readyState === "complete" && !!document.getElementById("dev-patch-select")');
    await evaluate('document.getElementById("start").click()');
    await until('!document.getElementById("birth").hidden');
    await evaluate('document.getElementById("birth-confirm").click()');
    await until('!document.getElementById("game").hidden && document.getElementById("scene-title").textContent.length>0');
    await evaluate('document.getElementById("pause").click()');
    assert.equal(await evaluate('document.getElementById("pause").getAttribute("aria-pressed")'), "true");
    await evaluate('document.getElementById("speed").value="4";document.getElementById("speed").dispatchEvent(new Event("change",{bubbles:true}))');
    await evaluate('document.getElementById("pause").click()');
    assert.equal(await evaluate('document.getElementById("pause").getAttribute("aria-pressed")'), "false");
    await evaluate('document.getElementById("journal-open").click()');
    assert.equal(await evaluate('document.getElementById("journal").open'), true);
    await evaluate('document.getElementById("journal-close").click()');
    await evaluate('document.getElementById("relations-open").click()');
    assert.equal(await evaluate('document.getElementById("relations-dialog").open'), true,
      device + " relationship dialog should open");
    await evaluate('document.getElementById("relations-close").click()');
    assert.equal(await evaluate('document.getElementById("relations-dialog").open'), false,
      device + " relationship dialog should close");
    await evaluate('document.getElementById("dev-patch-select").value="0_1";document.getElementById("dev-patch-select").dispatchEvent(new Event("change",{bubbles:true}))');
    await until('document.querySelectorAll("#choices button.choice").length>0');
    const size = await evaluate('(()=>{document.querySelector(".dev-patch-bar").style.display="none";const b=[...document.querySelectorAll("#choices button.choice")];const d=document.documentElement;return {viewport:d.clientWidth,scrollWidth:d.scrollWidth,bodyFont:parseFloat(getComputedStyle(document.querySelector("#scene-body")).fontSize),buttons:b.length,enabled:b.filter(x=>!x.disabled).length,minButtonHeight:Math.min(...b.map(x=>x.getBoundingClientRect().height))}})()');
    const overflows = await evaluate('(()=>{const max=document.documentElement.clientWidth;return [...document.querySelectorAll("*")].map(el=>({el,r:el.getBoundingClientRect()})).filter(x=>x.r.right>max+2 && x.r.width>0).slice(0,22).map(x=>({tag:x.el.tagName,id:x.el.id,cls:typeof x.el.className==="string"?x.el.className.slice(0,90):"",left:Math.round(x.r.left),right:Math.round(x.r.right),width:Math.round(x.r.width),scrollWidth:x.el.scrollWidth,cssOverflow:getComputedStyle(x.el).overflowX}))})()');
    console.log("BROWSER_GEOMETRY", JSON.stringify({device,...size,overflows}));
    const debugShot = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(root, "test-results", device + "-choices.png"), Buffer.from(debugShot.data, "base64"));
    assert.ok(size.enabled>0, device + " game has no enabled choice");
    assert.ok(size.scrollWidth<=size.viewport+2, device + " horizontal overflow");
    if (device === "mobile") { assert.ok(size.bodyFont>=16, "Mobile body smaller than 16px"); assert.ok(size.minButtonHeight>=44, "Mobile choice target smaller than 44px"); }
    await evaluate('document.querySelector(".dev-patch-bar").style.display="";document.getElementById("dev-patch-select").value="3_0";document.getElementById("dev-patch-select").dispatchEvent(new Event("change",{bubbles:true}))');
    await until('!document.getElementById("ending").hidden');
    const count = await evaluate('document.querySelectorAll("#ending-timeline li").length');
    assert.ok(count>=1 && count<=5, device + " ending not readable");
    const ending = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(root, "test-results", device + "-ending.png"), Buffer.from(ending.data, "base64"));
    result.push({ device, width, height, layout: size, memories: count });
  }
  const original = await evaluate('(()=>{let s=JSON.parse(localStorage.getItem("a-life-at-sea.lives.v1"));s.lives[s.active].actions=["invalid-action","unmodified-original"];localStorage.setItem("a-life-at-sea.lives.v1",JSON.stringify(s));return JSON.stringify(s.lives[s.active].actions)})()');
  await send("Page.navigate", { url: url + "/?corrupt=1" });
  await until('document.readyState === "complete" && !!document.getElementById("dev-patch-select")');
  const restored = await evaluate('(()=>{let s=JSON.parse(localStorage.getItem("a-life-at-sea.lives.v1"));return JSON.stringify(s.lives[s.active].actions)})()');
  assert.equal(restored, original, "Damaged save was silently shortened");
  assert.equal(await evaluate('document.getElementById("storage-message").textContent.includes("보존")'), true);
  assert.deepEqual(browserErrors, [], "Browser script runtime errors");
  console.log("BROWSER_REPORT_START");
  console.log(JSON.stringify({ devices: result, damagedSavePreserved: true }, null, 2));
  console.log("BROWSER_REPORT_END");
} finally {
  if (socket) socket.close();
  browser.kill("SIGTERM");
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
