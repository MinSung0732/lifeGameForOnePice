const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const artFiles = fs.readdirSync("assets/scenes").filter(file => file.endsWith(".svg"));
assert.equal(artFiles.length, 75, "25 categories x 3 original scenes are present");
const eventSource = fs.readFileSync("events.js", "utf8");
const gameSource = fs.readFileSync("app.js", "utf8");

function run(savedData) {
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
        textContent:"", innerHTML:"", value:"", src:"", alt:"", style:{}, disabled:false,
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
    // Stable virtual clock and random seed prevent sporadic failures when
    // optional treasure/fruit encounters occur during the same smoke test.
    Date: class extends Date { static now() { return 1793780160000; } },
    Math: Object.assign(Object.create(Math), { random: () => 0.3141592653 }),
    JSON, setTimeout, clearTimeout, setInterval:()=>12345, clearInterval:()=>{},
    console
  };
  vm.createContext(context);
  vm.runInContext(eventSource, context, {filename:"events.js",timeout:2000});
  assert.equal(context.OneSeaLifeEvents.events.length, 121);
  assert.equal(context.OneSeaLifeEvents.events.filter(e => e.requiredFlag).length, 16);
  vm.runInContext(gameSource, context, {filename:"app.js",timeout:3000});
  listeners.get("DOMContentLoaded")();
  return {
    node: makeNode,
    local,
    state: () => JSON.parse(local.get("one-sea-one-life-v2") || "null"),
    past: () => JSON.parse(local.get("one-sea-past-lives-v2") || "[]"),
    submit: () => makeNode("birth-form").handlers.get("submit")({ preventDefault:()=>{} }),
    next: () => makeNode("next-year").handlers.get("click")(),
    choose: id => makeNode("actions").handlers.get("click")({target:{closest:()=>({getAttribute:()=>id})}}),
    free: text => {makeNode("free-action").value=text;makeNode("free-action-form").handlers.get("submit")({preventDefault:()=>{}});},
    step: () => {
      const st = JSON.parse(local.get("one-sea-one-life-v2") || "null");
      if (!st.alive) return;
      const chosen = st.pending ? st.pending.choices[0].id : null;
      if (chosen) makeNode("actions").handlers.get("click")({target:{closest:()=>({getAttribute:()=>chosen})}});
      else makeNode("next-year").handlers.get("click")();
    }
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
assert.equal(game.state().yearBeat, 0);
assert.equal(game.state().name, "테스트모험가");
assert.equal(game.state().journal.length, 1);
assert.equal(game.node("game").classList.contains("hidden"), false);
assert.equal(game.node("scene-image").src, "./assets/scenes/birth-1.svg");

// One choice advances the timeline; the encounter then offers
// contextual responses which resolve WITHOUT advancing an extra year.
game.choose("study");
assert.equal(game.state().age, 1);
assert.equal(game.state().pending.type, "episode");
assert.equal(game.state().pending.choices.length, 3);
const firstImage = game.node("scene-image").src;
assert.ok(/^\.\/assets\/scenes\/[a-z]+-[123]\.svg$/.test(firstImage));
assert.equal(fs.existsSync(firstImage.slice(2)), true);
game.choose(game.state().pending.choices[0].id);
assert.equal(game.state().age, 1);
assert.equal(game.state().pending, null);
assert.ok(game.state().lifeFlags && typeof game.state().lifeFlags === "object");

// Reach age 6 and resolve the first major milestone.
let limit = 0;
while (game.state().age < 6 && game.state().alive && limit++ < 150) game.step();
assert.equal(game.state().age, 6);
assert.equal(game.state().pending.type, "school");
const beforeKnowledge = game.state().stats.knowledge;
game.choose("learn");
assert.equal(game.state().pending, null);
assert.ok(game.state().stats.knowledge > beforeKnowledge);

// Age 6 requires TWO moment advancements, not a single choice.
// The first advancement must NOT automatically age the player.
game.next();
assert.equal(game.state().age, 6);
assert.equal(game.state().yearBeat, 1);
assert.equal(game.state().pending.type, "episode");
game.choose(game.state().pending.choices[1].id);
assert.equal(game.state().age, 6);

// Continue to mentor and career milestones.
limit = 0;
while (game.state().age < 12 && game.state().alive && limit++ < 300) game.step();
assert.equal(game.state().age, 12);
if (game.state().pending?.type === "mentor") game.choose("navigation");
limit = 0;
while (game.state().age < 16 && game.state().alive && limit++ < 300) game.step();
assert.equal(game.state().age, 16);
assert.equal(game.state().pending.type, "career");
game.choose("pirate");
assert.equal(game.state().role, "해적");
assert.equal(game.state().weapon, "검");

const returned = run(game.local);
assert.equal(returned.state().name, "테스트모험가");
assert.equal(returned.state().role, "해적");
assert.equal(returned.node("landing").classList.contains("hidden"), false);
const momentCount = returned.state().totalMoments;
returned.free("검술을 수련한다");
assert.equal(returned.state().age, 16);
assert.equal(returned.state().totalMoments, momentCount + 1);
assert.ok(["episode", "fruit", "storm", "battle"].includes(returned.state().pending?.type),
  "A new moment can be a regular episode or a special encounter");
returned.choose(returned.state().pending.choices[0].id);

// Complete a life, assert records and scene artwork remains valid.
let turns = 0;
while (returned.state().alive && turns++ < 1300) {
  returned.step();
  const scene = returned.node("scene-image").src;
  assert.equal(fs.existsSync(scene.slice(2)), true, "scene image exists: " + scene);
}
assert.ok(turns < 1300, "Life must eventually end.");
assert.equal(returned.state().alive, false);
assert.ok(returned.state().age <= 102);
assert.ok(returned.state().totalMoments > 120 || returned.state().age < 45);
assert.equal(returned.past()[0].name, "테스트모험가");
console.log("PASS: 121 story hooks (16 conditional), 75 original SVG scenes, multi-beat years, milestones, career, custom action, restart, death and archive.");