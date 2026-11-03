/* Run with: node tests/smoke.js */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function makeHarness(saved) {
  const elements = {};
  const listeners = {};
  const data = saved || new Map();
  function element(id) {
    if (!elements[id]) {
      const handlers = {};
      const classes = new Set();
      elements[id] = {
        handlers,
        classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x) },
        addEventListener: (event, cb) => { handlers[event] = cb; },
        innerHTML: "", textContent: "", value: "",
        querySelector: () => ({ value: "이스트 블루" }),
        click: () => {},
      };
    }
    return elements[id];
  }
  const ctx = {
    document: {
      getElementById: element,
      addEventListener: (name, handler) => { listeners[name] = handler; },
    },
    window: { scrollTo: () => {}, confirm: () => false },
    localStorage: {
      getItem: key => data.get(key) || null,
      setItem: (key, value) => data.set(key, value),
      removeItem: key => data.delete(key)
    },
    setTimeout, clearTimeout, Math, JSON, console
  };
  const code = fs.readFileSync("app.js", "utf8");
  vm.runInNewContext(code, ctx, { filename: "app.js", timeout: 2000 });
  listeners.DOMContentLoaded();
  return { element, data, getState: () => JSON.parse(data.get("grand-line-rpg-v1")), act: kind => {
    const button = { getAttribute: name => name === "data-kind" ? kind : "" };
    element("action-list").handlers.click({ target: { closest: () => button } });
  }};
}

const a = makeHarness();
assert.equal(a.element("intro").classList.contains("hidden"), false);
a.element("char-name").value = "모험자";
a.element("char-role").value = "해적";
a.element("char-weapon").value = "나무 검";
a.element("char-look").value = "붉은 스카프";
a.element("create-form").handlers.submit({ preventDefault: () => {}, currentTarget: a.element("create-form") });
assert.equal(a.getState().name, "모험자");
assert.equal(a.getState().turn, 1);
assert.equal(a.getState().stats.strength, 10);
assert.equal(a.getState().scene.actions.length, 4);
assert.equal(a.element("game").classList.contains("hidden"), false);
a.act("rumor");
assert.equal(a.getState().turn, 2);
a.act("hunt");
assert.ok(a.getState().enemy);
for (let i = 0; i < 40 && a.getState().enemy; i++) a.act("flee");
assert.equal(a.getState().enemy, null);
a.element("free-input").value = "잠시 휴식한다";
a.element("free-form").handlers.submit({ preventDefault: () => {} });
assert.ok(a.getState().turn > 3);
assert.ok(a.getState().hp > 0);
const b = makeHarness(a.data);
assert.equal(b.getState().name, "모험자");
assert.equal(b.element("intro").classList.contains("hidden"), true);
console.log("PASS: create character, encounter, combat, free action, save and reload");
