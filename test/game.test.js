import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { ART, PERSONALITY, PROFILE_OPTIONS, STATS, advance, createGame, getContentStats, getScene, personalitySummary, replay, saveRecord } from "../src/game.js";
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

test("출생 능력은 종족 기준과 개인차를 합치며 예전 저장 기록은 예전 수치로 복원한다", () => {
  const human = createGame("original", 42, { species: "인간" });
  const giant = createGame("original", 42, { species: "거인족" });
  assert.deepEqual(human.birthStats.individual, giant.birthStats.individual);
  assert.deepEqual(human.birthStats.personality, giant.birthStats.personality);
  assert.equal(human.skill, human.birthStats.species.skill + human.birthStats.individual.skill);
  assert.equal(human.health, human.birthStats.species.health + human.birthStats.individual.health);
  assert.equal(giant.health - human.health, 14);
  assert.ok(human.birth.yearsBeforeCurrent >= 35 && human.birth.yearsBeforeCurrent <= 85);
  assert.ok(giant.birth.yearsBeforeCurrent >= 160 && giant.birth.yearsBeforeCurrent <= 260);
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
  assert.throws(() => replay({ ...saveRecord(human), creationVersion: 3 }));
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
  const rival = reach(0, "life_rival_return", { life_enemy: "withdraw" });
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
  const young = reach(0, "life_early_departure");
  assert.equal(advance(young, "board").path, "pirate");
  assert.equal(advance(young, "marine").path, "marine");
  assert.equal(advance(young, "liberator").path, "liberator");
  const firstCareer = reach(0, "life_career");
  const captain = advance(firstCareer, "captain");
  assert.equal(captain.role, "선장");
  assert.equal(captain.independent, true);
  const home = play("original", 0, { life_career: "home", life_orders: "obey", life_retire_choice: "continue" });
  assert.equal(home.homebound, true);
  assert.deepEqual(home.travelHistory, [home.birth.home]);
  assert.equal(home.ending, "death");

  const quietPicks = { life_career: "home", life_orders: "obey", life_revolution_choice: "independent" };
  const marine = reach(0, (scene) => scene.id.startsWith("life_marine_invitation_"), quietPicks);
  assert.ok(getScene(marine).age < 35, "입대 제안은 고정된 중년 나이를 기다리지 않아야 한다");
  const enlisted = advance(marine, "enlist");
  assert.equal(enlisted.path, "marine");
  assert.equal(enlisted.role, "수병");
  assert.equal(enlisted.leftHome, true);
  const pirate = reach(0, (scene) => scene.id.startsWith("life_pirate_invitation_"), quietPicks);
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
  let late = createGame("original", 0, { species: "인간" });
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
  const revolution = reach(0, (scene) => scene.id.startsWith("life_revolution_invitation_"), injuryPicks);
  assert.equal(revolution.injustice, true);
  const joined = advance(revolution, "join");
  assert.equal(joined.affiliation, "혁명군");
  assert.equal(joined.leftHome, true);
  const apprentice = play("original", 0, { life_career: "pirate", life_orders: "obey", life_revolution_choice: "independent", life_retire_choice: "continue" });
  assert.equal(apprentice.role, "견습 선원");
  assert.ok(apprentice.seen.some((id) => id.startsWith("life_rank_1_")));
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
  assert.equal(early.skill, early.birthStats.species.skill + early.birthStats.individual.skill);
  assert.equal(early.health, early.birthStats.species.health + early.birthStats.individual.health);
  assert.ok(personalitySummary(early.personality));
  const helpful = advance(early, "carry");
  assert.equal(helpful.supplies, early.supplies + 10);
  assert.equal(helpful.personality.empathy, early.personality.empathy + 7);
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
  const latest = createGame("original", 4, { species: "인간" });
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
  const free = play("free", 0, picks);
  const original = play("original", 0, picks);
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
    let life = createGame(mode, 3, { species: "인간" });
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
    assert.ok(life.journal.every((entry, index, entries) => index === 0 || entry.age - entries[index - 1].age <= 1));
    assert.ok(life.journal.every((entry, index, entries) => !entries.slice(Math.max(0, index - 10), index)
      .some((previous) => previous.title === entry.title)), "최근 10장면의 제목은 반복되지 않아야 한다");
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
