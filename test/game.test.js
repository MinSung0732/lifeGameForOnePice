import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { ART, PROFILE_OPTIONS, advance, createGame, getContentStats, getScene, personalitySummary, replay, saveRecord } from "../src/game.js";
import { createObservation, tickObservation } from "../src/observation.js";
import { scenes } from "../src/story.js";
import { encounterAt } from "../src/world.js";

function play(mode, seed, picks = {}, profile = { species: "인간" }, rules = 3) {
  let life = createGame(mode, seed, profile, rules);
  let steps = 0;
  while (!life.finished) {
    const scene = getScene(life);
    assert.ok(scene, "진행 중인 생애에는 다음 장면이 있어야 한다");
    assert.ok(scene.art?.src && scene.art.alt, `${scene.id}에 그림과 설명이 있어야 한다`);
    assert.ok(scene.body.length <= 300, `${scene.id} 본문이 너무 길다`);
    assert.ok(scene.choices.every((choice) => typeof choice.risk === "string"), `${scene.id} 선택 경고가 화면에 표시되어야 한다`);
    const chosen = scene.choices.find((choice) => choice.id === picks[scene.id] && !choice.disabled)?.id
      ?? scene.choices.find((choice) => !choice.disabled)?.id ?? null;
    life = advance(life, chosen);
    steps += 1;
    assert.ok(steps <= (rules === 3 ? 400 : scenes.length), "장면 진행이 끝나야 한다");
  }
  return life;
}

function reach(seed, target, picks = {}, profile = { species: "인간" }) {
  let life = createGame("original", seed, profile);
  while (!life.finished && getScene(life).id !== target) {
    const scene = getScene(life);
    const chosen = scene.choices.find((choice) => choice.id === picks[scene.id] && !choice.disabled)?.id
      ?? scene.choices.find((choice) => !choice.disabled)?.id ?? null;
    life = advance(life, chosen);
  }
  assert.equal(getScene(life)?.id, target, `${target} 장면에 도착해야 한다`);
  return life;
}

test("장면 ID와 그림 키, 원작 사건 근거를 검사한다", () => {
  assert.equal(new Set(scenes.map((card) => card.id)).size, scenes.length);
  for (const card of scenes) {
    const artKey = typeof card.art === "function" ? card.art(createGame("original", 1)) : card.art;
    assert.ok(ART[artKey], `${card.id}의 그림 키가 없음`);
    if (card.canon) assert.match(card.canon, /^https:\/\/one-piece\.com\//);
  }
  for (const [key, art] of Object.entries(ART)) {
    assert.ok(existsSync(new URL(`../${art.src.slice(2)}`, import.meta.url)), `${key} 그림 파일이 없음`);
  }
  assert.equal(getContentStats().cards, scenes.length);
  const birth = createGame("original", 1, {}, 2).birth;
  assert.equal(birth.yearsBeforeCurrent - scenes.find((card) => card.id === "roger_news").age, 24);
  assert.equal(birth.yearsBeforeCurrent - scenes.find((card) => card.id === "marineford_news").age, 2);
  assert.ok(PROFILE_OPTIONS.homes.인간.some((home) => home.includes("웨스트 블루")));
  assert.ok(PROFILE_OPTIONS.homes.인간.some((home) => home.includes("신세계")));
});

test("출생 추첨은 시드와 모드에 재현 가능하고 잘못된 선택은 상태를 바꾸지 않는다", () => {
  const life = createGame("original", 42);
  assert.deepEqual(life.birth, createGame("free", 42).birth);
  assert.notDeepEqual(life.birth, createGame("original", 43).birth);
  assert.throws(() => createGame("unknown", 1));
  assert.throws(() => advance(life, "repair"));
  assert.equal(life.actions.length, 0);
});

test("위험을 무릅쓴 사망, 책임을 넘긴 은퇴, 현재 시점의 세 결말이 도달 가능하다", () => {
  const death = play("original", 10, { first_choice: "crew", first_wage: "home", merchant: "refuse", rescue: "sail" }, { species: "인간" }, 2);
  const retire = play("original", 11, { first_choice: "repair", join: "cooperative", apprentice_offer: "teach", rescue: "shore", retire_choice: "retire" }, { species: "인간" }, 2);
  const present = play("free", 12, { first_choice: "travel", join: "independent", apprentice_offer: "decline", rescue: "shore", retire_choice: "continue", present_choice: "lead" }, { species: "인간" }, 2);
  assert.equal(death.ending, "death");
  assert.equal(retire.ending, "retire");
  assert.equal(present.ending, "present");
  assert.equal(retire.role, "은퇴");
  assert.equal(present.mode, "free");
  assert.ok(death.skill >= 2, "항로 일꾼도 일하며 기술을 쌓아야 한다");
  assert.equal(death.supplies, 0, "구조선에 쓸 물자가 없어 사망한 경로여야 한다");
  assert.ok(death.seen.includes("death_trace"));
  assert.ok(retire.seen.includes("retire_trace"));
  assert.ok(present.seen.includes("present_trace"));
});

test("구조선 선택 전에 현재 준비 상태에 맞는 결과를 알려준다", () => {
  const risk = scenes.find((card) => card.id === "rescue").choices.find((choice) => choice.id === "sail").risk;
  const life = createGame("original", 3, {}, 2);
  assert.match(risk(life), /출항 시 사망/);
  life.skill = 2;
  life.supplies = 1;
  life.health = 2;
  assert.match(risk(life), /구조 가능/);
  life.health = 1;
  assert.match(risk(life), /출항 시 사망/);
});

test("다섯 종족의 고향과 설정을 직접 고르거나 무작위로 재현한다", () => {
  for (const species of PROFILE_OPTIONS.species) {
    const home = PROFILE_OPTIONS.homes[species][0];
    const profile = { name: "  미라 ", gender: "여성", species, home, means: "넉넉지 않은" };
    const life = createGame("original", 11, profile);
    assert.deepEqual([life.birth.name, life.birth.gender, life.birth.species, life.birth.home], ["미라", "여성", species, home]);
    assert.equal(life.supplies, 30);
    assert.equal(getScene(life).age, 0);
    assert.ok(getScene(life).body.includes(home));
    assert.equal(play("original", 11, {}, profile).finished, true);
  }
  const found = new Set();
  for (let seed = 0; seed < 100; seed += 1) {
    const first = createGame("free", seed);
    assert.deepEqual(first.birth, createGame("free", seed).birth);
    assert.ok(PROFILE_OPTIONS.homes[first.birth.species].includes(first.birth.home));
    assert.ok(["남성", "여성"].includes(first.birth.gender));
    found.add(first.birth.species);
  }
  assert.deepEqual(found, new Set(PROFILE_OPTIONS.species));
  assert.throws(() => createGame("original", 1, { name: " " }));
  assert.throws(() => createGame("original", 1, { species: "어인", home: "엘바프 북쪽 만" }));
  assert.throws(() => createGame("original", 1, { home: "해무 항구" }));
  assert.throws(() => createGame("original", 1, { species: "알 수 없는 종족" }));
  assert.throws(() => createGame("original", 1, { gender: "비이분법" }));
  assert.equal(createGame("original", 1, { gender: "비이분법" }, 2).birth.gender, "비이분법");
});

test("종족 경로에서 능력치 부족은 실제 실패하고 충분하면 성공한다", () => {
  function reachTest(firstChoice) {
    let life = createGame("original", 7, { species: "어인", means: "넉넉지 않은" }, 2);
    while (getScene(life).id !== "fishman-test") {
      const scene = getScene(life);
      life = advance(life, scene.id === "fishman-first" ? firstChoice : scene.choices[0]?.id ?? null);
    }
    return life;
  }
  const unready = reachTest("gather");
  assert.match(getScene(unready).choices.find((choice) => choice.id === "attempt").risk, /부족하면 실패/);
  const failed = advance(unready, "attempt");
  assert.equal(failed.health, unready.health - 1);
  assert.equal(failed.trust, unready.trust);
  assert.deepEqual(failed.lastChanges, [{ key: "health", delta: -1 }]);

  const ready = reachTest("learn");
  assert.match(getScene(ready).choices.find((choice) => choice.id === "attempt").risk, /현재 충족/);
  const succeeded = advance(ready, "attempt");
  assert.equal(succeeded.supplies, ready.supplies - 1);
  assert.equal(succeeded.trust, ready.trust + 1);
});

test("관찰 게이지는 속도와 정지 상태를 반영한다", () => {
  const clock = createObservation({ id: "birth", body: "짧은 장면" }, 100);
  assert.equal(clock.duration, 10000);
  const normal = tickObservation(clock, 1100, 1, true);
  assert.equal(normal.elapsed, 1000);
  const paused = tickObservation(normal, 6100, 4, false);
  assert.equal(paused.elapsed, 1000);
  assert.equal(tickObservation(paused, 7100, 4, true).elapsed, 1000);
  const rebased = tickObservation(paused, 7100, 4, false);
  assert.equal(rebased.elapsed, 1000);
  const resumed = tickObservation(rebased, 7200, 4, true);
  assert.equal(resumed.elapsed, 1000);
  assert.equal(tickObservation(resumed, 7300, 4, true).elapsed, 1400);
  assert.equal(tickObservation(clock, 1100, 0.5, true).elapsed, 500);
  assert.equal(tickObservation(clock, 1100, 0.75, true).elapsed, 750);
  assert.throws(() => tickObservation(clock, 1100, 0.25, true));
  assert.throws(() => tickObservation(paused, 6000, 1, true));
});

test("이전 버전의 인간 출생 저장 기록도 그대로 복원한다", () => {
  const oldRecord = { version: 1, mode: "original", seed: 10, actions: [] };
  const oldLife = replay(oldRecord);
  assert.equal(oldLife.rules, 1);
  assert.equal(oldLife.birth.species, "인간");
  assert.equal(getScene(oldLife).id, "birth");
  assert.deepEqual(replay(saveRecord(oldLife)), oldLife);
  const formerHome = createGame("original", 7, { species: "어인", home: "어인섬 조개길" }, 2);
  assert.equal(replay(saveRecord(formerHome)).birth.home, "어인섬 조개길");
});

test("종족과 소속은 독립적이며 새 생애는 이른 죽음부터 긴 수명까지 닫힌다", () => {
  const affiliations = { pirate: "독립 해적단", marine: "해군", liberator: "독립 해방망", civilian: "민간 조합" };
  for (const species of PROFILE_OPTIONS.species) {
    for (const [career, affiliation] of Object.entries(affiliations)) {
      const life = play("original", 23, { life_career: career }, { species });
      assert.equal(life.affiliation, affiliation);
      assert.equal(life.ending, "death");
      assert.ok(life.age <= life.birth.yearsBeforeCurrent);
      assert.ok(life.seen.length > 50);
    }
  }
  const longLife = play("original", 0);
  assert.ok(longLife.age > 84);
  assert.notEqual(longLife.age, 84);
  const giantLife = play("original", 5, {}, { species: "거인족" });
  assert.ok(giantLife.age > 290);

  let child = createGame("original", 12, { species: "어인", name: "미라" });
  while (getScene(child).id !== "life_child_crisis") {
    const scene = getScene(child);
    child = advance(child, scene.id === "life_first_skill" ? "carry" : scene.choices[0]?.id ?? null);
  }
  assert.doesNotMatch(getScene(child).choices.find((choice) => choice.id === "rush").risk, /사망/);
  const lost = advance(child, "rush");
  assert.equal(lost.ending, "death");
  assert.equal(lost.age, 11);
  assert.equal(getScene(lost), null);
});

test("열매의 획득 경위와 수영 제약, 패기와 비능력자 경로가 선택에 반영된다", () => {
  const unknown = reach(0, "life_fruit_find");
  assert.match(getScene(unknown).body, /이름을 찾을 수 없었다/);
  const eater = advance(unknown, "eat");
  assert.equal(eater.devilFruit, "이름 없는 초인계");
  assert.equal(eater.fruitMastery, 1);
  const practice = reach(0, "life_fruit_practice", { life_fruit_find: "eat" });
  assert.equal(advance(practice, "practice").fruitMastery, 2);

  const payment = reach(1, "life_fruit_payment");
  assert.match(getScene(payment).body, /대가/);
  assert.equal(advance(payment, "eat").devilFruit, "이름 없는 초인계");
  assert.equal(advance(payment, "supplies").devilFruit, null);

  const fruitRescue = reach(0, "life_mission", { life_fruit_find: "eat" });
  fruitRescue.skill = 40; fruitRescue.health = 70; fruitRescue.supplies = 20;
  assert.match(getScene(fruitRescue).choices.find((choice) => choice.id === "lead").risk, /물자 40.*물에 빠지면 힘이 빠짐/);
  assert.equal(advance(fruitRescue, "lead").health, 60);
  const ordinaryRescue = reach(2, "life_mission");
  ordinaryRescue.skill = 40; ordinaryRescue.health = 70; ordinaryRescue.supplies = 20;
  assert.equal(advance(ordinaryRescue, "lead").rescued, ordinaryRescue.rescued + 1);

  const training = reach(2, "life_haki_training");
  assert.equal(training.devilFruit, null);
  const learned = advance(training, "observation");
  assert.equal(learned.haki.observation, 1);
  const trial = reach(2, "life_power_trial", { life_haki_training: "observation", life_haki_practice: "armament" });
  assert.equal(trial.devilFruit, null);
  assert.equal(trial.haki.armament, 1);
  assert.deepEqual(getScene(trial).choices.map((choice) => choice.id), ["observe", "armor", "team", "call"]);
  trial.supplies = 10;
  assert.equal(advance(trial, "team").trust, Math.min(100, trial.trust + 10));
});

test("100점 능력과 성격 변화가 종합 성향에 반영되고 조건 부족 선택은 막힌다", () => {
  const early = reach(0, "life_first_skill");
  assert.equal(early.skill, 20);
  assert.equal(early.health, 70);
  assert.equal(personalitySummary(early.personality), "균형을 찾는 사람");
  const helpful = advance(early, "carry");
  assert.equal(helpful.supplies, early.supplies + 10);
  assert.equal(helpful.personality.empathy, 57);
  assert.ok(helpful.lastChanges.some((change) => change.key === "personality.empathy" && change.delta === 7));
  const repeated = advance(reach(0, "life_enemy", { life_first_skill: "carry" }), "withdraw");
  assert.equal(repeated.rival, true);
  assert.ok(repeated.personality.caution > helpful.personality.caution);

  const weak = reach(0, "life_enemy", { life_first_skill: "carry" });
  weak.skill = 20;
  assert.equal(getScene(weak).choices.find((choice) => choice.id === "fight").disabled, true);
  const actionCount = weak.actions.length;
  assert.throws(() => advance(weak, "fight"));
  assert.equal(weak.actions.length, actionCount);
  const strong = { ...weak, skill: 80 };
  assert.equal(getScene(strong).choices.find((choice) => choice.id === "fight").disabled, false);

  const poor = reach(0, "life_training");
  poor.supplies = 0;
  const practice = getScene(poor).choices.find((choice) => choice.id === "practice");
  assert.equal(practice.disabled, true);
  assert.match(practice.risk, /물자 10 필요/);
  assert.throws(() => advance(poor, "practice"));
  assert.equal(poor.supplies, 0);

  const ally = reach(0, "life_alliance_offer");
  assert.equal(advance(ally, "join").alliance, true);
  const betrayed = advance(ally, "betray");
  assert.equal(betrayed.rival, true);
  assert.equal(betrayed.trust, Math.max(0, ally.trust - 20));
  assert.ok(betrayed.personality.loyalty < ally.personality.loyalty);
});

test("실제 섬으로 이동하고 시기와 장소가 맞을 때만 원작 인물을 만난다", () => {
  const profile = { species: "인간", home: "이스트 블루 · 로그 타운" };
  const first = reach(0, "life_voyage_24", {}, profile);
  assert.equal(first.location, "리버스 마운틴");
  assert.equal(getScene(first).choices.find((choice) => choice.id === "near").label, "쌍둥이 언덕으로 간다");
  const whiskey = advance(first, "far");
  assert.equal(whiskey.location, "위스키 피크");
  assert.equal(whiskey.age, 24);
  assert.ok(whiskey.travelHistory.includes("위스키 피크"));

  const littleGarden = reach(0, "life_voyage_27", { life_voyage_24: "far" }, profile);
  const arrived = advance(littleGarden, "near");
  assert.equal(arrived.location, "리틀 가든");
  assert.equal(getScene(arrived).id, "life_meet_dorry_brogy");
  assert.match(getScene(arrived).body, /도리와 브로기/);
  assert.match(getScene(arrived).canon, /^https:\/\/one-piece\.com\//);
  const greeted = advance(arrived, "watch");
  assert.equal(greeted.pendingEncounter, null);
  assert.equal(greeted.journal.at(-1).age, 27);

  const tooEarly = createGame("original", 0, profile);
  tooEarly.location = "샤본디 제도";
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 30;
  assert.equal(encounterAt(tooEarly), null);
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 5;
  assert.equal(encounterAt(tooEarly), "rayleigh");
  tooEarly.location = "워터 세븐";
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 10;
  assert.equal(encounterAt(tooEarly), null, "톰의 사망 이후에는 만날 수 없다");
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 20;
  assert.equal(encounterAt(tooEarly), "tom");
  tooEarly.location = "엘바프";
  tooEarly.age = tooEarly.birth.yearsBeforeCurrent - 50;
  assert.equal(encounterAt(tooEarly), "jarul");
});

test("선택의 여파는 같은 해에 보이고 자유 모드의 상위 직책만 IF로 열린다", () => {
  const picks = { life_career: "pirate", life_revolution_choice: "independent", life_retire_choice: "continue", life_free_rank: "attempt" };
  const free = play("free", 133, picks);
  const original = play("original", 133, picks);
  assert.equal(free.role, "사황");
  assert.equal(free.worldBranch, "emperor");
  assert.notEqual(original.role, "사황");
  assert.ok(!original.seen.includes("life_free_rank"));
  const rank = free.journal.findIndex((entry) => entry.id === "life_free_rank");
  assert.equal(free.birth.yearsBeforeCurrent - free.journal[rank].age, 1);
  assert.equal(free.journal[rank].age, free.journal[rank + 1].age);
  assert.equal(free.journal[rank + 1].id, "life_branch_aftermath");
  const career = free.journal.findIndex((entry) => entry.id === "life_career");
  assert.equal(free.journal[career].age, free.journal[career + 1].age);
  for (const [index, entry] of free.journal.entries()) {
    if (!entry.id.startsWith("life_year_")) continue;
    assert.ok(!free.journal.slice(Math.max(0, index - 10), index).some((previous) => previous.title === entry.title));
  }
});

test("저장 기록은 같은 삶으로 복원되고, 여러 시드가 막힘 없이 끝난다", () => {
  const completed = new Set();
  for (let seed = 0; seed < 120; seed += 1) {
    let life = createGame(seed % 2 ? "free" : "original", seed);
    let steps = 0;
    while (!life.finished) {
      const scene = getScene(life);
      const available = scene.choices.filter((choice) => !choice.disabled);
      const choice = available.length ? available[(seed + steps) % available.length].id : null;
      life = advance(life, choice);
      steps += 1;
      assert.ok(steps <= 400);
    }
    assert.equal(new Set(life.seen).size, life.seen.length);
    assert.ok(life.journal.every((entry, index, entries) => index === 0 || entry.age >= entries[index - 1].age));
    assert.ok(life.journal.every((entry, index, entries) => index === 0 || entry.age - entries[index - 1].age <= 1));
    for (const entry of life.journal) {
      if (entry.id === "life_roger_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 24);
      if (entry.id === "life_revolution_choice") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 22);
      if (entry.id === "life_tiger_liberation_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 15);
      if (entry.id === "life_tom_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 10);
      if (entry.id === "life_marineford_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 2);
    }
    assert.deepEqual(replay(saveRecord(life)), life);
    completed.add(life.ending);
    assert.equal(life.ending, "death");
    assert.ok(life.deathCause);
  }
  assert.deepEqual(completed, new Set(["death"]));
  assert.throws(() => replay({ version: 1, mode: "original", seed: 1, actions: ["not-a-choice"] }));
});
