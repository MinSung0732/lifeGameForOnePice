const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function run(savedData) {
  const map = new Map();
  const nodes = new Map();
  const listeners = new Map();
  const local = savedData || new Map();
  const makeNode = id => {
    if (!nodes.has(id)) {
      const handlers = new Map();
      const classes = new Set();
      const attrs = {};
      nodes.set(id, {
        id, handlers, classes, attrs,
        textContent:"", innerHTML:"", value:"", style:{}, disabled:false,
        addEventListener: (name, handler) => handlers.set(name, handler),
        classList: {
          add: value => classes.add(value),
          remove: value => classes.delete(value),
          contains: value => classes.has(value),
          toggle: (value, force) => {
            if (force === undefined) force = !classes.has(value);
            if (force) classes.add(value);
            else classes.delete(value);
            return force;
          }
        },
        setAttribute: (k,v) => { attrs[k] = v; },
        getAttribute: k => attrs[k],
        scrollIntoView: () => {},
        click: () => {},
      });
    }
    return nodes.get(id);
  };
  const document = {
    getElementById: makeNode,
    querySelector: query => query === 'input[name="originMode"]:checked' ? { value: "fate" } : null,
    querySelectorAll: () => [],
    addEventListener: (name, handler) => listeners.set(name, handler),
    createElement: () => ({ click:()=>{}, remove:()=>{}, set href(x){}, set download(x){} }),
    body: {appendChild:()=>{}}
  };
  const context = {
    document, localStorage: {getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v),removeItem:k=>local.delete(k)},
    window: {scrollTo:()=>{},confirm:()=>true,alert:()=>{}},
    Date, Math, JSON, setTimeout, clearTimeout, setInterval:()=>12345, clearInterval:()=>{},
    console
  };
  vm.runInNewContext(fs.readFileSync("app.js", "utf8"), context, {filename:"app.js",timeout:2000});
  listeners.get("DOMContentLoaded")();
  return {
    node: makeNode,
    local,
    state: () => JSON.parse(local.get("one-sea-one-life-v2") || "null"),
    past: () => JSON.parse(local.get("one-sea-past-lives-v2") || "[]"),
    submit: () => makeNode("birth-form").handlers.get("submit")({ preventDefault:()=>{} }),
    next: () => makeNode("next-year").handlers.get("click")(),
    choose: id => makeNode("actions").handlers.get("click")({target:{closest:()=>({getAttribute:()=>id})}}),
    free: text => {makeNode("free-action").value=text;makeNode("free-action-form").handlers.get("submit")({preventDefault:()=>{}});}
  };
}

const game = run();
assert.equal(game.node("game").classList.contains("hidden"), true);
assert.equal(game.node("landing").classList.contains("hidden"), false);
game.node("player-name").value = "테스트모험가";
game.node("player-look").value = "붉은 스카프";
game.node("player-weapon").value = "검";
game.submit();
assert.equal(game.state().age, 0);
assert.equal(game.state().name, "테스트모험가");
assert.equal(game.state().journal.length, 1);
assert.equal(game.node("game").classList.contains("hidden"), false);
game.choose("study");
assert.equal(game.state().age, 1);
assert.equal(game.state().pending, null);
for (let i = 0; i < 5; i++) game.next();
assert.equal(game.state().age, 6);
assert.equal(game.state().pending.type, "school");
const beforeKnowledge = game.state().stats.knowledge;
game.choose("learn");
assert.equal(game.state().pending, null);
assert.ok(game.state().stats.knowledge > beforeKnowledge);
while (game.state().age < 12 && game.state().alive) {
  if (game.state().pending) game.choose(game.state().pending.choices[0].id);
  else game.next();
}
assert.equal(game.state().age, 12);
if (game.state().pending?.type === "mentor") game.choose("navigation");
while (game.state().age < 16 && game.state().alive) {
  if (game.state().pending) game.choose(game.state().pending.choices[0].id);
  else game.next();
}
assert.equal(game.state().age, 16);
assert.equal(game.state().pending.type, "career");
game.choose("pirate");
assert.equal(game.state().role, "해적");
assert.equal(game.state().weapon, "검");
const afterCareer = run(game.local);
assert.equal(afterCareer.state().name, "테스트모험가");
assert.equal(afterCareer.state().role, "해적");
assert.equal(afterCareer.node("landing").classList.contains("hidden"), false);
afterCareer.free("검술을 수련한다");
assert.equal(afterCareer.state().age, 17);
let count = 0;
while (afterCareer.state().alive && count++ < 450) {
  const st = afterCareer.state();
  if (st.pending) afterCareer.choose(st.pending.choices[0].id);
  else afterCareer.next();
}
assert.ok(count < 450, "The game must eventually end.");
assert.equal(afterCareer.state().alive, false);
assert.ok(afterCareer.state().age <= 102);
assert.equal(afterCareer.past()[0].name, "테스트모험가");
console.log("PASS: birth, yearly aging, milestones, career, free action, persistence, death and past lives.");
