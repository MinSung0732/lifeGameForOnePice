import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { ART, PERSONALITY, PROFILE_OPTIONS, STATS, advance, createGame, getContentStats, getScene, personalitySummary, replay, saveRecord } from "../src/game.js";
import { createObservation, tickObservation } from "../src/observation.js";
import { scenes } from "../src/story.js";
import { encounterAt, travelScene } from "../src/world.js";
import { fruitFor } from "../src/fruits.js";
import { bountyScene, pursuerFor } from "../src/bounty.js";
import { CANON_BEAT_COUNT, canonScene } from "../src/canon-events.js";
import { PRE_CANON_BEAT_COUNT, preCanonScene } from "../src/canon-before.js";
import { canonGapFor } from "../src/canon-interludes.js";
import { FLEX_IDS, FLEX_IDS_V5, lifeScenes, yearlyScene } from "../src/life-story.js";

function play(mode, seed, picks = {}, profile = { species: "인간" }, rules = 3, version = 3) {
  let life = createGame(mode, seed, profile, rules, version);
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

function reach(seed, target, picks = {}, profile = { species: "인간" }, version = 3) {
  let life = createGame("original", seed, profile, 3, version);
  const matches = (scene) => typeof target === "function" ? target(scene) : scene.id === target;
  while (!life.finished && !matches(getScene(life))) {
    const scene = getScene(life);
    const chosen = scene.choices.find((choice) => choice.id === picks[scene.id] && !choice.disabled)?.id
      ?? scene.choices.find((choice) => !choice.disabled)?.id ?? null;
    life = advance(life, chosen);
  }
  assert.ok(getScene(life) && matches(getScene(life)), `${target} 장면에 도착해야 한다`);
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

test("새 생애는 받침 없는 이름의 조사를 바로잡고 이전 기록의 문장은 유지한다", () => {
  const profile = { name: "라나", species: "하늘섬 사람" };
  assert.match(getScene(createGame("original", 1, profile)).body, /라나가 태어났다/);
  assert.match(getScene(createGame("original", 1, profile, 3, 4)).body, /라나이 태어났다/);
});

test("출생 능력은 종족 기준과 개인차를 합치며 예전 저장 기록은 예전 수치로 복원한다", () => {
  const human = createGame("original", 42, { species: "인간" });
  const giant = createGame("original", 42, { species: "거인족" });
  assert.deepEqual(human.birthStats.individual, giant.birthStats.individual);
  assert.deepEqual(human.birthStats.personality, giant.birthStats.personality);
  assert.equal(human.skill, human.birthStats.species.skill + human.birthStats.individual.skill);
  assert.equal(human.health, human.birthStats.species.health + human.birthStats.individual.health);
  assert.equal(giant.health - human.health, 14);
  assert.ok(human.birth.yearsBeforeCurrent >= 40 && human.birth.yearsBeforeCurrent <= 95, "규칙 7은 한 생애가 원작 현재 안에 끝나도록 태어난다");
  assert.ok(giant.birth.yearsBeforeCurrent >= 130 && giant.birth.yearsBeforeCurrent <= 300);
  const rule6 = createGame("original", 42, { species: "인간" }, 3, 6);
  assert.ok(rule6.birth.yearsBeforeCurrent >= 26 && rule6.birth.yearsBeforeCurrent <= 44, "규칙 6 기록은 로저 처형 20년 전 이내 출생을 유지한다");
  const previous = createGame("original", 42, { species: "인간" }, 3, 2);
  assert.ok(previous.birth.yearsBeforeCurrent >= 35 && previous.birth.yearsBeforeCurrent <= 85, "이전 규칙 기록은 예전 출생 범위를 유지한다");
  assert.notDeepEqual(human.birthStats.individual, createGame("original", 43, { species: "인간" }).birthStats.individual);
  assert.ok(PROFILE_OPTIONS.species.every((species) => {
    const life = createGame("original", 42, { species });
    return [...STATS, ...PERSONALITY].every(({ key }) => {
      const value = life.personality[key] ?? life[key];
      return value >= 0 && value <= 100;
    });
  }));
  assert.deepEqual(replay(saveRecord(human)), human);
  const former = replay({ version: 1, mode: "original", seed: 42, profile: { species: "인간" }, rules: 3, actions: [] });
  assert.equal(former.creationVersion, 1);
  assert.equal(former.skill, 20);
  assert.equal(former.health, 70);
  assert.equal(former.birthStats, null);
  assert.ok(former.birth.yearsBeforeCurrent >= 95 && former.birth.yearsBeforeCurrent <= 120);
  assert.throws(() => replay({ ...saveRecord(human), creationVersion: 9 }));
});

test("새 선택 설명은 조건을 알리되 결과를 미리 단정하지 않는다", () => {
  const child = reach(12, "life_child_crisis", { life_first_skill: "carry" }, { species: "어인" });
  const childChoices = getScene(child).choices;
  assert.match(childChoices.find((choice) => choice.id === "rush").risk, /기술 30/);
  assert.doesNotMatch(childChoices.map((choice) => choice.risk).join(" "), /안전|사망|돌아오지 못/);
  const enemy = reach(0, "life_enemy");
  const fight = getScene(enemy).choices.find((choice) => choice.id === "fight");
  assert.match(fight.risk, /기술 30 · 건강 30 필요/);
  assert.doesNotMatch(fight.risk, /승산|유리|밀리면|충족/);
  const rival = reach(0, "life_rival_return", { life_enemy: "withdraw" }, { species: "인간" }, 2);
  const rivalRisks = getScene(rival).choices.map((choice) => choice.risk).join(" ");
  assert.doesNotMatch(rivalRisks, /승산|유리|적대관계 해소|적대관계 지속/);
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
      const careerChoice = advance(reach(23, "life_career", {}, { species }), career);
      assert.equal(careerChoice.affiliation, affiliation);
      const life = play("original", 23, { life_career: career, life_revolution_choice: "independent", life_change_path: "stay" }, { species });
      assert.equal(life.ending, "death");
      assert.ok(life.seen.length > 50);
    }
  }
  const ordinaryLives = Array.from({ length: 20 }, (_, seed) => play("original", seed, {}, { species: "인간" }));
  assert.ok(ordinaryLives.some((life) => life.age > 84));
  assert.ok(ordinaryLives.some((life) => life.age > life.birth.yearsBeforeCurrent));
  const giantLives = Array.from({ length: 20 }, (_, seed) => play("original", seed, {}, { species: "거인족" }));
  assert.ok(giantLives.some((life) => life.age > 290));

  const crises = Array.from({ length: 60 }, (_, seed) => reach(seed, "life_child_crisis", { life_first_skill: "carry" }, { species: "어인" }));
  const outcomes = crises.map((child) => advance(child, "rush"));
  assert.ok(crises.every((child) => !/사망/.test(getScene(child).choices.find((choice) => choice.id === "rush").risk)));
  const lost = outcomes.find((life) => life.ending === "death");
  const rescued = outcomes.find((life) => !life.ending);
  assert.ok(lost && rescued, "기술이 낮아도 구조 결과가 한쪽으로 고정되지 않아야 한다");
  assert.equal(lost.age, 11);
  assert.equal(getScene(lost), null);
  assert.ok(rescued.health < crises[outcomes.indexOf(rescued)].health);
});

test("직업은 사건과 조건으로 일찍 또는 늦게 바꾸고 승급을 거절할 수 있다", () => {
  const young = reach(0, "life_early_departure", {}, { species: "인간" }, 2);
  assert.equal(advance(young, "board").path, "pirate");
  assert.equal(advance(young, "marine").path, "marine");
  assert.equal(advance(young, "liberator").path, "liberator");
  const firstCareer = reach(0, "life_career", {}, { species: "인간" }, 2);
  const captain = advance(firstCareer, "captain");
  assert.equal(captain.role, "선장");
  assert.equal(captain.independent, true);
  const home = play("original", 0, { life_career: "home", life_orders: "obey", life_retire_choice: "continue" }, { species: "인간" }, 3, 2);
  assert.equal(home.homebound, true);
  assert.deepEqual(home.travelHistory, [home.birth.home]);
  assert.equal(home.ending, "death");

  const quietPicks = { life_career: "home", life_orders: "obey", life_revolution_choice: "independent" };
  const marine = reach(0, (scene) => scene.id.startsWith("life_marine_invitation_"), quietPicks, { species: "인간" }, 2);
  assert.ok(getScene(marine).age < 35, "입대 제안은 고정된 중년 나이를 기다리지 않아야 한다");
  const enlisted = advance(marine, "enlist");
  assert.equal(enlisted.path, "marine");
  assert.equal(enlisted.role, "수병");
  assert.equal(enlisted.leftHome, true);
  const pirate = reach(0, (scene) => scene.id.startsWith("life_pirate_invitation_"), quietPicks, { species: "인간" }, 2);
  const recruited = advance(pirate, "join");
  assert.equal(recruited.path, "pirate");
  assert.equal(recruited.role, "견습 선원");
  const otherCrew = reach(0, (scene) => scene.id.startsWith("life_pirate_invitation_"),
    { life_career: "pirate", life_orders: "obey", life_revolution_choice: "independent" });
  assert.equal(otherCrew.path, "pirate");
  const transfer = advance(otherCrew, "join");
  assert.equal(transfer.affiliation, "기항지에서 만난 해적단");
  assert.equal(transfer.role, "견습 선원");
  assert.equal(transfer.skill, otherCrew.skill, "이직 자체가 숙련도를 올리지는 않아야 한다");
  let late = createGame("original", 0, { species: "인간" }, 3, 2);
  while (!late.finished) {
    const scene = getScene(late);
    if (scene.id.startsWith("life_marine_invitation_") && scene.age >= 40) break;
    const choice = scene.id === "life_career" ? "home" : scene.id === "life_orders" ? "obey"
      : scene.id === "life_revolution_choice" ? "independent" : scene.choices.find((item) => !item.disabled)?.id ?? null;
    late = advance(late, choice);
  }
  assert.ok(!late.finished && getScene(late).age >= 40, "중년에 들어도 입대 제안이 다시 열려야 한다");
  assert.equal(advance(late, "enlist").path, "marine");
  const injuryPicks = { life_career: "home", life_orders: "help", life_revolution_choice: "independent" };
  const revolution = reach(0, (scene) => scene.id.startsWith("life_revolution_invitation_"), injuryPicks, { species: "인간" }, 2);
  assert.equal(revolution.injustice, true);
  const joined = advance(revolution, "join");
  assert.equal(joined.affiliation, "혁명군");
  assert.equal(joined.leftHome, true);
  const apprentice = play("original", 0, { life_career: "pirate", life_orders: "obey", life_revolution_choice: "independent", life_retire_choice: "continue" }, { species: "인간" }, 3, 2);
  assert.equal(apprentice.role, "견습 선원");
  assert.ok(apprentice.seen.some((id) => id.startsWith("life_rank_1_")));
});

test("열매의 획득 경위와 수영 제약, 패기와 비능력자 경로가 선택에 반영된다", () => {
  const unknown = reach(0, "life_fruit_find", {}, { species: "인간" }, 2);
  assert.match(getScene(unknown).body, /이름을 찾을 수 없었다/);
  const eater = advance(unknown, "eat");
  assert.equal(eater.devilFruit, "이름 없는 초인계");
  assert.equal(eater.fruitMastery, 1);
  const practice = reach(0, "life_fruit_practice", { life_fruit_find: "eat" }, { species: "인간" }, 2);
  assert.equal(advance(practice, "practice").fruitMastery, 2);

  const payment = reach(1, "life_fruit_payment", {}, { species: "인간" }, 2);
  assert.match(getScene(payment).body, /대가/);
  assert.equal(advance(payment, "eat").devilFruit, "이름 없는 초인계");
  assert.equal(advance(payment, "supplies").devilFruit, null);

  const fruitRescue = reach(0, "life_mission", { life_fruit_find: "eat" }, { species: "인간" }, 2);
  fruitRescue.skill = 40; fruitRescue.health = 70; fruitRescue.supplies = 20;
  assert.match(getScene(fruitRescue).choices.find((choice) => choice.id === "lead").risk, /물자 40.*물에 빠지면 힘이 빠짐/);
  assert.equal(advance(fruitRescue, "lead").health, 60);
  const ordinaryRescue = reach(2, "life_mission", {}, { species: "인간" }, 2);
  ordinaryRescue.skill = 40; ordinaryRescue.health = 70; ordinaryRescue.supplies = 20;
  assert.equal(advance(ordinaryRescue, "lead").rescued, ordinaryRescue.rescued + 1);

  const training = reach(2, "life_haki_training", {}, { species: "인간" }, 2);
  assert.equal(training.devilFruit, null);
  const learned = advance(training, "observation");
  assert.equal(learned.haki.observation, 1);
  const trial = reach(2, "life_power_trial", { life_haki_training: "observation", life_haki_practice: "armament" }, { species: "인간" }, 2);
  assert.equal(trial.devilFruit, null);
  assert.equal(trial.haki.armament, 1);
  assert.deepEqual(getScene(trial).choices.map((choice) => choice.id), ["observe", "armor", "team", "call"]);
  trial.supplies = 10;
  assert.equal(advance(trial, "team").trust, Math.min(100, trial.trust + 10));
});

test("100점 능력과 성격 변화가 종합 성향에 반영되고 조건 부족 선택은 막힌다", () => {
  const early = reach(0, "life_first_skill", {}, { species: "인간" }, 2);
  assert.equal(early.skill, early.birthStats.species.skill + early.birthStats.individual.skill);
  assert.equal(early.health, early.birthStats.species.health + early.birthStats.individual.health);
  assert.ok(personalitySummary(early.personality));
  const helpful = advance(early, "carry");
  assert.equal(helpful.supplies, early.supplies + 10);
  assert.equal(helpful.personality.empathy, early.personality.empathy + 7);
  assert.ok(helpful.lastChanges.some((change) => change.key === "personality.empathy" && change.delta === 7));
  const repeated = advance(reach(0, "life_enemy", { life_first_skill: "carry" }, { species: "인간" }, 2), "withdraw");
  assert.equal(repeated.rival, true);
  assert.ok(repeated.personality.caution > helpful.personality.caution);

  const weak = reach(0, "life_enemy", { life_first_skill: "carry" }, { species: "인간" }, 2);
  weak.skill = 20;
  assert.equal(getScene(weak).choices.find((choice) => choice.id === "fight").disabled, true);
  const actionCount = weak.actions.length;
  assert.throws(() => advance(weak, "fight"));
  assert.equal(weak.actions.length, actionCount);
  const strong = { ...weak, skill: 80 };
  assert.equal(getScene(strong).choices.find((choice) => choice.id === "fight").disabled, false);

  const poor = reach(0, "life_training", {}, { species: "인간" }, 2);
  poor.supplies = 0;
  const practice = getScene(poor).choices.find((choice) => choice.id === "practice");
  assert.equal(practice.disabled, true);
  assert.match(practice.risk, /물자 10 필요/);
  assert.throws(() => advance(poor, "practice"));
  assert.equal(poor.supplies, 0);

  const ally = reach(0, "life_alliance_offer", {}, { species: "인간" }, 2);
  assert.equal(advance(ally, "join").alliance, true);
  const betrayed = advance(ally, "betray");
  assert.equal(betrayed.rival, true);
  assert.equal(betrayed.trust, Math.max(0, ally.trust - 20));
  assert.ok(betrayed.personality.loyalty < ally.personality.loyalty);
});

test("실제 섬으로 이동하고 시기와 장소가 맞을 때만 원작 인물을 만난다", () => {
  const profile = { species: "인간", home: "이스트 블루 · 로그 타운" };
  const first = reach(0, "life_voyage_24", {}, profile, 2);
  assert.equal(first.location, "리버스 마운틴");
  assert.equal(getScene(first).choices.find((choice) => choice.id === "near").label, "쌍둥이 언덕으로 간다");
  const whiskey = advance(first, "far");
  assert.equal(whiskey.location, "위스키 피크");
  assert.equal(whiskey.age, 24);
  assert.ok(whiskey.travelHistory.includes("위스키 피크"));

  const littleGarden = reach(0, "life_voyage_27", { life_voyage_24: "far" }, profile, 2);
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
  const latest = createGame("original", 4, { species: "인간" }, 3, 4);
  latest.age = latest.birth.yearsBeforeCurrent - 1;
  latest.location = "엘바프";
  assert.equal(getScene(latest).id, "life_meet_luffy_elbaf");
  const met = advance(latest, "guide");
  assert.equal(met.age, met.birth.yearsBeforeCurrent);
  assert.ok(met.seen.includes("life_meet_luffy_elbaf"));
  assert.equal(encounterAt(met), null);
});

test("선택의 여파는 같은 해에 보이고 자유 모드의 상위 직책만 IF로 열린다", () => {
  const picks = { life_career: "captain", life_revolution_choice: "independent", life_retire_choice: "continue", life_free_rank: "attempt" };
  const free = play("free", 0, picks, undefined, 3, 2);
  const original = play("original", 0, picks, undefined, 3, 2);
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

test("해군 승급은 경력과 신뢰를 쌓은 뒤에만 대장 IF로 이어진다", () => {
  function marineLife(mode) {
    let life = createGame(mode, 3, { species: "인간" }, 3, 2);
    while (!life.finished) {
      const scene = getScene(life);
      const wanted = scene.id === "life_early_departure" || scene.id === "life_career" ? "marine"
        : scene.id === "life_orders" ? "help"
          : scene.id === "life_revolution_choice" ? "independent"
            : scene.id === "life_retire_choice" ? "continue"
              : scene.id === "life_free_rank" ? "attempt"
                : scene.id.startsWith("life_rank_") ? "accept" : null;
      const choice = scene.choices.find((item) => item.id === wanted && !item.disabled)
        ?? scene.choices.find((item) => !item.disabled);
      life = advance(life, choice?.id ?? null);
    }
    return life;
  }
  const free = marineLife("free");
  const original = marineLife("original");
  assert.equal(free.rankTier, 5);
  assert.equal(free.worldBranch, "admiral");
  assert.equal(free.role, "해군 대장");
  assert.equal(original.rankTier, 5);
  assert.equal(original.role, "중장");
  assert.ok(!original.seen.includes("life_free_rank"));
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
    // Folded quiet years jump ahead by the number of years they cover; every other scene moves at most one year.
    assert.ok(life.journal.every((entry, index, entries) => index === 0 || entry.age - entries[index - 1].age
      <= (entry.id.startsWith("life_years_") ? entry.age - Number(entry.id.split("_")[2]) + 1 : 1)));
    assert.ok(life.journal.every((entry, index, entries) => !entries.slice(Math.max(0, index - 10), index)
      .some((previous) => previous.title === entry.title)), "최근 10장면의 제목은 반복되지 않아야 한다");
    for (const entry of life.journal) {
      if (entry.id === "life_roger_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 24);
      if (entry.id === "life_revolution_choice") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 22);
      if (entry.id === "life_tiger_liberation_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 15);
      if (entry.id === "life_tom_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 10);
      if (entry.id === "life_marineford_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 2);
      if (entry.id === "life_timeskip_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 1);
      if (entry.id === "life_new_era_news") assert.equal(life.birth.yearsBeforeCurrent - entry.age, 0);
    }
    assert.deepEqual(replay(saveRecord(life)), life);
    completed.add(life.ending);
    assert.ok(["death", "prison", "missing", "present"].includes(life.ending));
    assert.ok(life.deathCause);
    assert.ok(life.age <= life.birth.yearsBeforeCurrent, "규칙 7의 생애는 원작 현재를 넘기지 않는다");
  }
  assert.ok(completed.has("death") && completed.has("present"), `결말 종류: ${[...completed]}`);
  assert.throws(() => replay({ version: 1, mode: "original", seed: 1, actions: ["not-a-choice"] }));
});

test("거인 전용 선택 사건은 위험 문구대로 수치를 바꾸고 새 규칙의 거인에게만 나온다", async () => {
  const { giantAdultDecisions, giantGrowingDecisions } = await import("../src/giant-years.js");
  const giantTitles = new Set([...giantGrowingDecisions, ...giantAdultDecisions].map((decision) => decision.title));
  const isGiantDecision = (scene) => giantTitles.has(scene.title);
  const life = reach(7, isGiantDecision, {}, { species: "거인족" });
  const choice = getScene(life).choices.find((option) => !option.disabled);
  const next = advance(life, choice.id);
  const shown = Object.fromEntries(choice.risk.split(" · ").map((part) => {
    const [label, delta] = [part.slice(0, part.lastIndexOf(" ")), Number(part.slice(part.lastIndexOf(" ") + 1))];
    return [STATS.find((stat) => stat.label === label).key, delta];
  }));
  for (const stat of STATS) {
    const expected = Math.max(0, Math.min(stat.max, life[stat.key] + (shown[stat.key] || 0)));
    assert.equal(next[stat.key], expected, `${stat.label} 변화가 위험 문구와 같아야 한다`);
  }
  const legacy = play("original", 7, {}, { species: "거인족" }, 3);
  assert.ok(legacy.journal.some((entry) => giantTitles.has(entry.title)), "새 규칙 거인 생애에는 거인 선택 사건이 나와야 한다");
  for (let seed = 0; seed < 10; seed += 1) {
    const former = replay({ ...saveRecord(createGame("original", seed, { species: "거인족" }, 3, 1)), actions: [] });
    let old = former;
    while (!old.finished) { const scene = getScene(old); old = advance(old, scene.choices.find((option) => !option.disabled)?.id ?? null); }
    assert.ok(!old.journal.some((entry) => giantTitles.has(entry.title)), "이전 출생 규칙 기록에는 거인 선택 사건이 섞이지 않아야 한다");
  }
});

test("새 규칙은 주사위 시도, 섬별 신뢰, 다시 오는 인물, 섬 사건, 원작 열매 선점을 다룬다", async () => {
  const { fruitFor } = await import("../src/fruits.js");
  const { moveTo, crewNews } = await import("../src/world.js");
  const weak = reach(0, "life_enemy", { life_first_skill: "carry" });
  weak.skill = 10;
  const fight = getScene(weak).choices.find((choice) => choice.id === "fight");
  assert.equal(fight.disabled, false, "능력이 모자라도 시도할 수 있어야 한다");
  assert.match(fight.risk, /주사위 1~100에서 \d+ 이상이면 성공/);
  assert.equal(fight.dice, Math.min(95, 20 + (30 - 10) * 2 + Math.max(0, 30 - weak.health) * 2));
  const tried = advance(weak, "fight");
  assert.match(tried.lastOutcome, /^주사위 \d+ \(\d+ 이상 성공\) · (성공|실패)\./);
  const poor = reach(0, "life_training");
  poor.supplies = 0;
  assert.equal(getScene(poor).choices.find((choice) => choice.id === "practice").disabled, true, "물자가 없으면 여전히 막혀야 한다");

  const traveler = createGame("original", 5, { species: "인간" });
  const home = traveler.location;
  traveler.trust = 70;
  moveTo(traveler, "워터 세븐");
  assert.ok([15, 30, 45].includes(traveler.trust), "처음 간 섬은 우호·중립·적대 중 하나로 시작한다");
  traveler.trust = 90;
  moveTo(traveler, home);
  assert.equal(traveler.trust, 70);
  moveTo(traveler, "워터 세븐");
  assert.equal(traveler.trust, 90);

  for (let seed = 0; seed < 40; seed += 1) {
    const life = { seed, age: 10, mode: "original", birth: { yearsBeforeCurrent: 60 } };
    assert.equal(fruitFor(life).owner, undefined, "원작 모드에서는 원작 사용자의 열매가 나오지 않는다");
  }
  const early = Array.from({ length: 40 }, (_, seed) => fruitFor({ seed, age: 10, mode: "free", birth: { yearsBeforeCurrent: 60 } }));
  assert.ok(early.some((fruit) => fruit.owner), "자유 모드에서는 원작 사용자보다 먼저 먹을 수 있다");
  assert.ok(Array.from({ length: 40 }, (_, seed) => fruitFor({ seed, age: 58, mode: "free", birth: { yearsBeforeCurrent: 60 } }))
    .every((fruit) => !fruit.owner || fruit.eatenBefore < 2), "원작 사용자가 이미 먹은 열매는 나오지 않는다");
  assert.match(crewNews({ birth: { yearsBeforeCurrent: 60 }, age: 48 }), /밀짚모자/);
  assert.match(crewNews({ birth: { yearsBeforeCurrent: 60 }, age: 70 }), /공개되지 않았다/);

  const { canonCrew } = await import("../src/world.js");
  const named = reach(0, "life_career", {}, { species: "인간" });
  named.skill = 40; named.supplies = 50; named.friendBond = 50;
  assert.equal(getScene(named).choices.find((choice) => choice.id === "captain").naming, true);
  const founded = advance(named, "captain:붉은 파도");
  assert.equal(founded.affiliation, "붉은 파도 해적단");
  assert.equal(replay(saveRecord(founded)).affiliation, "붉은 파도 해적단", "설립 때 지은 이름은 저장 기록으로 복원된다");
  assert.equal(advance(named, "captain").affiliation, `${named.birth.name} 해적단`);
  assert.throws(() => advance(named, `captain:${"가".repeat(13)}`));
  assert.throws(() => advance(named, "marine:이름"), "이름을 받지 않는 선택에는 붙일 수 없다");
  const roger = { seed: 1, birth: { yearsBeforeCurrent: 40, species: "인간" } };
  assert.ok(["로저 해적단", "흰 수염 해적단", "빅 맘 해적단", "백수 해적단"].includes(canonCrew(roger, 14)));
  assert.ok(!["로저 해적단", "흰 수염 해적단"].includes(canonCrew(roger, 39)), "해체·소멸한 해적단에는 들어갈 수 없다");
  assert.notEqual(canonCrew(roger, 26), "태양 해적단", "태양 해적단은 어인만 들어갈 수 있다");
  const deckhand = reach(0, "life_career", {}, { species: "인간" });
  deckhand.skill = 60; deckhand.health = 80;
  const crewChoice = getScene(deckhand).choices.find((choice) => choice.id === "canon_crew");
  if (crewChoice) assert.equal(advance(deckhand, "canon_crew").canonCrew, canonCrew(deckhand));

  let mates = 0; let isles = 0; let folded = 0;
  for (let seed = 0; seed < 40; seed += 1) {
    const life = play(seed % 2 ? "free" : "original", seed);
    if (life.people.mate) mates += 1;
    if (life.seen.some((id) => id.startsWith("life_isle_"))) isles += 1;
    if (life.seen.some((id) => id.startsWith("life_years_"))) folded += 1;
    assert.deepEqual(replay(saveRecord(life)), life);
  }
  assert.ok(mates >= 30, `다시 오는 친구가 대부분의 생애에 있어야 한다 (${mates})`);
  assert.ok(isles >= 10, `섬 사건이 여러 생애에 나와야 한다 (${isles})`);
  assert.ok(folded >= 30, `조용한 해가 묶여야 한다 (${folded})`);
});

test("새 생애에는 원작에 등장한 열매만 나오고 이전 생애는 옛 추첨을 유지한다", () => {
  const canonNames = new Set(["고무고무 열매", "이글이글 열매", "꽃꽃 열매", "수술수술 열매", "동강동강 열매", "어둠어둠 열매", "고요고요 열매"]);
  for (let seed = 0; seed < 50; seed += 1) {
    for (const mode of ["original", "free"]) {
      const life = createGame(mode, seed, { species: "인간" });
      for (const before of [30, 20, 10, 0, -5]) {
        life.age = life.birth.yearsBeforeCurrent - before;
        const fruit = fruitFor(life);
        if (fruit) assert.ok(canonNames.has(fruit.name), `${fruit.name}은 원작 열매여야 한다`);
        if (fruit?.name === "고무고무 열매") assert.equal(fruit.type, "동물계 환수종");
        if (mode === "original" && fruit) assert.equal(fruit.name, "고요고요 열매");
      }
    }
  }
  const old = createGame("original", 0, { species: "인간" }, 3, 3);
  old.age = 27;
  assert.ok(fruitFor(old));
  assert.deepEqual(replay(saveRecord(old)).creationVersion, 3);
  const offer = reach(0, "life_fruit_find", {}, { species: "인간" }, 4);
  assert.match(getScene(offer).body, /고요고요 열매/);
  assert.match(advance(offer, "eat").devilFruit, /고요고요 열매/);
});

test("마린포드 이후 원작의 주요 사건은 짧은 시간 간격으로 수동 진행된다", () => {
  assert.equal(getScene(reach(0, "life_roger_news", {}, { species: "인간" }, 4)).manual, true);
  const distant = createGame("original", 0, { species: "인간" });
  distant.seen.push("life_marineford_news");
  distant.canonStep = 3;
  distant.path = "pirate";
  distant.location = "워터 세븐";
  assert.equal(canonScene(distant).choices, undefined, "멀리 있는 사건은 읽는 장면이어야 한다");
  distant.location = "어인섬";
  assert.equal(canonScene(distant).choices.length, 2, "관여할 수 있는 위치에서는 선택지가 열린다");
  let life = reach(0, "life_marineford_news", {}, { species: "인간" }, 4);
  life = advance(life, null);
  const beats = [];
  let steps = 0;
  while (life.canonStep < CANON_BEAT_COUNT && steps++ < 40) {
    const scene = getScene(life);
    if (scene.id.startsWith("canon_")) {
      beats.push(scene);
      assert.ok(scene.timeLabel);
      assert.equal(scene.manual, scene.choices.length === 0);
    }
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(beats.length, CANON_BEAT_COUNT);
  assert.ok(beats.some((scene) => scene.id === "canon_egghead"));
  assert.ok(beats.some((scene) => scene.id === "canon_elbaf"));
  assert.ok(beats.every((scene, index) => index === 0 || scene.age >= beats[index - 1].age));
  assert.ok(beats.slice(2).every((scene) => scene.age === life.birth.yearsBeforeCurrent));
  assert.deepEqual(replay(saveRecord(life)), life);
});

test("자유 모드의 상위 직책 IF는 와노국 이후 원작 장면 사이에서 열린다", () => {
  let life = createGame("free", 0, { species: "인간" }, 3, 6);
  while (!life.finished && getScene(life).id !== "canon_wano") {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(getScene(life).id, "canon_wano");
  life = advance(life, null);
  life.path = "pirate";
  life.independent = true;
  life.skill = 90;
  life.health = 90;
  life.trust = 90;
  while (getScene(life).id.startsWith("life_canon_daily_")) {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(getScene(life).id, "life_free_rank");
  life = advance(life, "attempt");
  assert.equal(life.role, "사황");
  assert.ok(life.bounty >= 3_000_000_000);
  life = advance(life, null);
  assert.equal(getScene(life).id, "canon_egghead");
  assert.match(getScene(life).body, /원작 기준/);
});

test("현상금은 행동으로 오르고 금액에 따라 추적 주체가 바뀐다", () => {
  const before = reach(0, "life_enemy", {}, { species: "인간" }, 4);
  assert.equal(before.path, "pirate");
  const after = advance(before, "fight");
  assert.equal(after.bounty - before.bounty, 3_000_000);
  assert.equal(pursuerFor(after.bounty).name, "지부 해군");
  assert.equal(pursuerFor(10_000_000).name, "현상금 사냥꾼");
  assert.match(pursuerFor(100_000_000).name, /중장/);
  assert.match(pursuerFor(1_000_000_000).name, /대장급/);
  const hunt = Array.from({ length: 25 }, (_, index) => bountyScene(after, after.age + index + 1,
    { age: after.age + index + 1, yearly: true })).find((card) => card?.id.startsWith("life_bounty_hunt_"));
  assert.ok(hunt);
  assert.ok(hunt.choices.some((choice) => choice.id === "escape"));
  const newLife = createGame("original", 0, { species: "인간" });
  newLife.path = "pirate";
  newLife.leftHome = true;
  newLife.bounty = 100_000_000;
  newLife.lastHuntAge = 1_000;
  const publicAct = Array.from({ length: 50 }, (_, index) => bountyScene(newLife, index + 20,
    { age: index + 20, yearly: true })).find((card) => card?.id.startsWith("life_bounty_act_"));
  assert.equal(publicAct.choices.find((choice) => choice.id === "intervene").bounty, 350_000_000);
  newLife.bounty = 1_000_000_000;
  newLife.lastHuntAge = -100;
  const admiralHunt = Array.from({ length: 50 }, (_, index) => bountyScene(newLife, index + 20,
    { age: index + 20, yearly: true })).find((card) => card?.id.startsWith("life_bounty_hunt_"));
  assert.match(admiralHunt.title, /대장급/);
});

test("기록지침 항로와 영구 지침은 다른 섬으로 이어지고 개인 사건의 등장 연령이 달라진다", () => {
  const life = createGame("original", 0, { species: "인간" });
  life.location = "샤본디 제도";
  life.path = "pirate";
  life.leftHome = true;
  const route = travelScene(life, 30);
  assert.match(route.choices.find((choice) => choice.id === "near").risk, /선박 코팅/);
  const near = structuredClone(life);
  const pose = structuredClone(life);
  route.choices.find((choice) => choice.id === "near").apply(near);
  route.choices.find((choice) => choice.id === "buy_pose").apply(pose);
  assert.notEqual(near.location, pose.location);
  assert.equal(pose.eternalPose, pose.location);
  life.location = "조";
  life.eternalPose = "워터 세븐";
  assert.equal(travelScene(life, 32).choices.find((choice) => choice.id === "pose").when(life), false);
  assert.ok(FLEX_IDS.has("life_first_pay"));
  const ages = new Set();
  for (let seed = 0; seed < 25; seed += 1) {
    for (let age = 20; age <= 30; age += 1) {
      const candidate = createGame("original", seed, { species: "인간" });
      candidate.path = "civilian";
      candidate.age = age - 1;
      if (yearlyScene(candidate).id === "life_first_pay") ages.add(age);
    }
  }
  assert.ok(ages.size > 1, "같은 개인 사건이 다른 나이에 나타나야 한다");
});

test("같은 나이의 재출항은 매번 다른 제목을 쓰고 이전 출생 기록은 기존 제목을 유지한다", () => {
  const life = createGame("original", 12, { species: "인간" });
  life.location = "펑크 하자드";
  const titles = [];
  for (let count = 0; count < 3; count += 1) {
    const title = travelScene(life, 40).title;
    titles.push(title);
    life.journal.push({ title });
  }
  assert.equal(new Set(titles).size, 3);
  assert.match(titles[2], /3번째 출항/);

  const previous = createGame("original", 12, { species: "인간" }, 3, 4);
  previous.location = "펑크 하자드";
  previous.journal.push({ title: travelScene(previous, 40).title });
  assert.match(travelScene(previous, 40).title, /40세의 재출항/);
});

test("새 출생 규칙은 개인 사건의 순서와 마지막 날을 달리하고 이전 기록을 보존한다", () => {
  assert.equal(createGame("original", 0, {}, 3, 5).creationVersion, 5);
  assert.ok(FLEX_IDS_V5.has("life_haki_training"));
  assert.ok(FLEX_IDS_V5.size > FLEX_IDS.size);
  const eventAges = new Set();
  const order = new Set();
  const causes = new Set();
  let seaKingCount = 0;
  for (let seed = 0; seed < 100; seed += 1) {
    const life = play(seed % 2 ? "free" : "original", seed, {}, { species: "인간" }, 3, 5);
    const setback = life.journal.findIndex((entry) => entry.id === "life_setback");
    const mentor = life.journal.findIndex((entry) => entry.id === "life_mentor");
    if (setback >= 0) eventAges.add(life.journal[setback].age);
    if (setback >= 0 && mentor >= 0) order.add(Math.sign(setback - mentor));
    causes.add(life.deathCause);
    seaKingCount += Number(life.seen.includes("life_sea_king"));
  }
  assert.ok(eventAges.size > 3, "개인 사건은 여러 나이에 나와야 한다");
  assert.deepEqual(order, new Set([-1, 1]), "독립 사건의 순서가 회차에 따라 뒤바뀌어야 한다");
  assert.ok(causes.size >= 3, "삶의 상태에 따라 마지막 날이 달라져야 한다");
  assert.ok(seaKingCount > 0, "새 항해 위험 사건이 실제 생애에 나와야 한다");

  const seaKing = lifeScenes.find((card) => card.id === "life_sea_king");
  const stranded = createGame("original", 1, { species: "인간" });
  stranded.health = 10;
  stranded.supplies = 3;
  seaKing.choices.find((choice) => choice.id === "drift").apply(stranded);
  assert.equal(stranded.health, 1);
  assert.equal(stranded.supplies, 0);
  const fallen = createGame("original", 2, { species: "인간" });
  fallen.health = 30;
  seaKing.choices.find((choice) => choice.id === "stand").fail(fallen);
  assert.equal(fallen.ending, "death");
  assert.equal(fallen.deathCause, "해왕류와의 충돌");

  const previous = play("original", 7, {}, { species: "인간" }, 3, 4);
  assert.ok(!previous.seen.some((id) => id.startsWith("canon_before_")));
  assert.deepEqual(replay(saveRecord(previous)), previous);
});

test("새 생애의 유년기 사건과 그림은 회차마다 달라지고 선택의 여파를 이어 간다", () => {
  assert.equal(createGame("original", 0).creationVersion, 8);
  const childhoodIds = new Set(["life_home", "life_friend", "life_first_skill", "life_child_crisis"]);
  const paths = new Set();
  const crises = new Set();
  const arts = new Set();
  for (let seed = 0; seed < 16; seed += 1) {
    let life = createGame("original", seed, { species: "인간" });
    const beats = [];
    while (!life.finished && getScene(life).id !== "life_after_storm") {
      const scene = getScene(life);
      if (childhoodIds.has(scene.id)) beats.push(scene);
      life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id ?? null);
    }
    assert.equal(beats.length, 4);
    assert.ok(beats.every((scene, index) => index === 0 || scene.art.src !== beats[index - 1].art.src),
      "연속된 유년 주요 장면이 같은 그림을 쓰지 않아야 한다");
    const crisis = beats[3];
    const follow = getScene(life);
    assert.equal(follow.title, `${crisis.title} 뒤`);
    assert.ok(life.childhoodMemory?.key);
    assert.equal(life.childhoodMemory.outcome, "safe");
    assert.deepEqual(replay(saveRecord(life)), life);
    paths.add(beats.map((scene) => scene.title).join(" / "));
    crises.add(crisis.title);
    for (const scene of beats) arts.add(scene.art.src);
  }
  assert.ok(paths.size >= 10, "여러 회차의 유년 주요 사건 조합이 달라야 한다");
  assert.ok(crises.size >= 6, "위기 사건이 한 종류에 몰리지 않아야 한다");
  assert.ok(arts.size >= 6, "유년 주요 장면에 여러 그림이 나와야 한다");

  const attempt = reach(0, "life_child_crisis", { life_first_skill: "help" }, { species: "인간" }, 6);
  assert.ok(getScene(attempt).choices.find((choice) => choice.id === "act").dice);
  const failed = advance(attempt, "act");
  assert.equal(failed.childhoodMemory.outcome, "fail");
  assert.ok(failed.health < attempt.health);
  assert.match(getScene(failed).body, /다친 곳이 아물 때까지/);
  assert.deepEqual(replay(saveRecord(failed)), failed);

  const previous = reach(0, "life_child_crisis", {}, { species: "인간" }, 5);
  assert.equal(getScene(previous).title, "범람한 길목");
  assert.equal(getScene(advance(previous, "wait")).title, "그날의 새벽");
  assert.deepEqual(replay(saveRecord(previous)), previous);
});

test("유년 후반의 배움과 수련도 출항 전에 등장하고 회차마다 달라진다", () => {
  const schoolTitles = new Set();
  const trainingTitles = new Set();
  for (let seed = 0; seed < 12; seed += 1) {
    const training = reach(seed, "life_training", {}, { species: "인간" }, 6);
    const school = training.journal.find((entry) => entry.id === "life_school");
    assert.ok(school, "배움 장면은 수련보다 먼저 나와야 한다");
    assert.ok(training.seen.includes("life_early_departure"), "이른 출항 선택을 건너뛰면 안 된다");
    assert.ok(!training.seen.includes("life_career"), "첫 소속 선택보다 먼저 나와야 한다");
    schoolTitles.add(school.title);
    trainingTitles.add(getScene(training).title);
  }
  assert.ok(schoolTitles.size >= 5);
  assert.equal(trainingTitles.size, 4);

  const ready = reach(0, "life_training", {}, { species: "인간" }, 6);
  const poor = { ...ready, supplies: 0 };
  assert.equal(getScene(poor).choices.find((choice) => choice.id === "practice").disabled, true);
  assert.throws(() => advance(poor, "practice"));
  const practiced = advance(ready, "practice");
  assert.equal(practiced.skill, ready.skill + 10);
  assert.equal(practiced.supplies, ready.supplies - 10);
  assert.deepEqual(replay(saveRecord(practiced)), practiced);
});

test("출항부터 정상전쟁까지 원작 사건과 일상을 가변 간격으로 함께 보여 준다", () => {
  let life = createGame("original", 0, { species: "인간" }, 3, 6);
  let steps = 0;
  while (!life.finished && !life.seen.includes("life_marineford_news") && steps++ < 250) {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.ok(life.seen.includes("life_marineford_news"));
  const before = life.journal.filter((entry) => entry.id.startsWith("canon_before_"));
  assert.equal(before.length, PRE_CANON_BEAT_COUNT);
  assert.deepEqual(before.slice(0, 3).map((entry) => entry.id),
    ["canon_before_departure", "canon_before_zoro", "canon_before_buggy"]);
  assert.ok(before.some((entry) => entry.id === "canon_before_arlong"));
  assert.ok(before.some((entry) => entry.id === "canon_before_skypiea_bell"));
  assert.ok(before.some((entry) => entry.id === "canon_before_thriller_shadows"));
  assert.ok(before.every((entry) => entry.age === life.birth.yearsBeforeCurrent - 2));
  assert.ok(life.journal.findIndex((entry) => entry.id === "life_marineford_news")
    > life.journal.findIndex((entry) => entry.id === "canon_before_impel_down"));
  const daily = life.journal.filter((entry) => entry.id.startsWith("life_canon_daily_"));
  assert.ok(daily.length > 15, "원작 장면 사이에 일상 장면이 들어가야 한다");
  assert.ok(daily.every((entry) => /뒤/.test(entry.timeLabel)), "일상 사이에 상대적인 날짜 간격을 보여야 한다");
  assert.ok(daily.some((entry) => entry.choice?.includes("기록지침")), "원작 사건 사이에도 다른 섬으로 갈 수 있어야 한다");
  assert.ok(new Set(Array.from({ length: PRE_CANON_BEAT_COUNT }, (_, step) => canonGapFor(life, "before", step))).size >= 3,
    "원작 장면과 일상 장면이 고정 패턴으로 반복되면 안 된다");
  assert.deepEqual(replay(saveRecord(life)), life);

  const local = createGame("original", 1, { species: "인간" });
  local.age = local.birth.yearsBeforeCurrent - 3;
  local.preCanonStep = 11;
  local.location = "위대한 항로 · 알라바스타 나노하나";
  assert.equal(preCanonScene(local).choices.length, 2);
  local.location = "워터 세븐";
  assert.equal(preCanonScene(local).choices, undefined);
  local.people.fruitOwner = { owner: "루피", fruit: "고무고무 열매" };
  assert.match(preCanonScene(local).body, /원작 기준/);
  assert.equal(preCanonScene(local).choices, undefined);
});

test("정상전쟁 뒤 원작 소식 사이에는 날짜 간격을 둔 일상이 끼고 연속 소식이 길게 쌓이지 않는다", () => {
  let life = reach(0, "life_marineford_news", {}, { species: "인간" }, 5);
  life = advance(life, null);
  assert.match(getScene(life).id, /^life_canon_daily_/);
  const gaps = Array.from({ length: CANON_BEAT_COUNT + 1 }, (_, step) => canonGapFor(life, "after", step));
  assert.ok(new Set(gaps).size >= 3);
  assert.ok(gaps.every((gap, index) => gap > 0 || gaps[index - 1] > 0));

  let steps = 0;
  while (life.canonStep < CANON_BEAT_COUNT && steps++ < 100) {
    const scene = getScene(life);
    life = advance(life, scene.choices.find((choice) => !choice.disabled)?.id || null);
  }
  assert.equal(life.canonStep, CANON_BEAT_COUNT);
  const afterWar = life.journal.slice(life.journal.findIndex((entry) => entry.id === "life_marineford_news") + 1);
  const sequence = afterWar.filter((entry) => entry.id.startsWith("canon_") || entry.id.startsWith("life_canon_daily_"));
  assert.ok(sequence.filter((entry) => entry.id.startsWith("life_canon_daily_")).length >= 10);
  assert.ok(sequence.filter((entry) => entry.id.startsWith("life_canon_daily_"))
    .every((entry) => /뒤/.test(entry.timeLabel)));
  assert.ok(sequence.every((entry, index) => index < 2 || !entry.id.startsWith("canon_")
    || !sequence.slice(Math.max(0, index - 2), index).every((previous) => previous.id.startsWith("canon_"))));
});

test("규칙 7은 소동·위험 사건을 섞고 모든 생애를 원작 현재 안에서 닫는다", async () => {
  const { adventureCounts } = await import("../src/adventures.js");
  assert.ok(adventureCounts.mishaps >= 15 && adventureCounts.dangers >= 8);
  const endings = new Set();
  let mishaps = 0; let dangers = 0;
  for (let seed = 0; seed < 60; seed += 1) {
    const life = play(seed % 2 ? "free" : "original", seed * 31 + 7, {}, { species: ["인간", "어인", "거인족"][seed % 3] }, 3, 7);
    mishaps += life.seen.filter((id) => id.startsWith("life_mishap_")).length;
    dangers += life.seen.filter((id) => id.startsWith("life_danger_")).length;
    endings.add(life.ending);
    assert.ok(life.age <= life.birth.yearsBeforeCurrent, "원작 현재 이후의 해가 없어야 한다");
    if (life.ending === "present") assert.equal(life.journal.at(-1).id, "life_present_end");
  }
  assert.ok(mishaps >= 120 && dangers >= 60, `소동 ${mishaps}, 위험 ${dangers}`);
  assert.ok(endings.has("present") && endings.has("death"));
  const old = createGame("original", 3, { species: "인간" }, 3, 6);
  assert.ok(!play("original", 3, {}, { species: "인간" }, 3, 6).seen.some((id) => id.startsWith("life_mishap_")), "규칙 6 기록에는 새 사건이 섞이지 않는다");
  assert.equal(old.creationVersion, 6);
});

test("규칙 8은 원작 편의 섬에 있으면 날짜별 장면에 휘말리고, 곁의 사람을 보여 준다", async () => {
  const { ARC_ART, ARC_COUNT, ARC_SCENE_COUNT } = await import("../src/canon-arcs.js");
  assert.ok(ARC_ART.every((key) => ART[key]), `없는 그림 키: ${ARC_ART.filter((key) => !ART[key])}`);
  const { crewFor } = await import("../src/crew.js");
  assert.ok(ARC_COUNT >= 17 && ARC_SCENE_COUNT >= 29);
  let involved = 0; let lured = 0;
  for (let seed = 0; seed < 80 && involved < 3; seed += 1) {
    let life = createGame("free", seed * 7919 + 13, { species: "인간" });
    let steps = 0;
    while (!life.finished && steps++ < 700) {
      const scene = getScene(life);
      const usable = scene.choices.filter((choice) => !choice.disabled);
      const safe = usable.filter((choice) => !choice.dice && !/목숨/.test(choice.risk));
      let pick = (safe.length ? safe : usable)[0]?.id ?? null;
      if (scene.id.endsWith("_lure")) { lured += 1; if (usable.some((choice) => choice.id === "go")) pick = "go"; }
      const before = { pre: life.preCanonStep, post: life.canonStep };
      life = advance(life, pick);
      if (/^canon_arc_.*_\d+$/.test(scene.id)) {
        assert.ok(scene.timeLabel, "원작 편 장면에는 상대적인 날짜가 붙는다");
        assert.deepEqual({ pre: life.preCanonStep, post: life.canonStep }, before, "편 안의 장면은 원작 순서를 건너뛰지 않는다");
      }
    }
    if (life.seen.some((id) => /^canon_arc_.*_\d+$/.test(id))) { involved += 1; assert.deepEqual(replay(saveRecord(life)), life); }
  }
  assert.ok(lured > 0 && involved >= 3, `소문 ${lured}, 휘말린 생애 ${involved}`);
  assert.ok(!play("free", 13, {}, { species: "인간" }, 3, 7).seen.some((id) => id.startsWith("canon_arc_")), "규칙 7 기록에는 편 장면이 섞이지 않는다");

  const captain = createGame("free", 5, { species: "인간" });
  Object.assign(captain, { path: "pirate", independent: true, careerStartAge: 20, bounty: 150_000_000 });
  const roster = crewFor(captain);
  assert.ok(roster.length >= 5 && roster.some((member) => member.role === "산하 선단"), "이름난 선장에게는 산하 선단이 붙는다");
  const marine = Object.assign(createGame("free", 5, { species: "인간" }), { path: "marine", careerStartAge: 20, rankTier: 2 });
  assert.ok(crewFor(marine).some((member) => member.role === "부관"));
  assert.equal(new Set(roster.map((member) => member.name)).size, roster.length, "곁의 사람 이름이 겹치지 않는다");
});
