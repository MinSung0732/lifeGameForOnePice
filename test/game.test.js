import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { ART, PROFILE_OPTIONS, advance, createGame, getContentStats, getScene, replay, saveRecord } from "../src/game.js";
import { createObservation, tickObservation } from "../src/observation.js";
import { scenes } from "../src/story.js";

function play(mode, seed, picks = {}, profile = { species: "인간" }) {
  let life = createGame(mode, seed, profile);
  let steps = 0;
  while (!life.finished) {
    const scene = getScene(life);
    assert.ok(scene, "진행 중인 생애에는 다음 장면이 있어야 한다");
    assert.ok(scene.art?.src && scene.art.alt, `${scene.id}에 그림과 설명이 있어야 한다`);
    assert.ok(scene.body.length <= 300, `${scene.id} 본문이 너무 길다`);
    assert.ok(scene.choices.every((choice) => typeof choice.risk === "string"), `${scene.id} 선택 경고가 화면에 표시되어야 한다`);
    const chosen = picks[scene.id] ?? scene.choices[0]?.id ?? null;
    life = advance(life, chosen);
    steps += 1;
    assert.ok(steps <= scenes.length, "장면 진행이 끝나야 한다");
  }
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
  const birth = createGame("original", 1).birth;
  assert.equal(birth.yearsBeforeCurrent - scenes.find((card) => card.id === "roger_news").age, 24);
  assert.equal(birth.yearsBeforeCurrent - scenes.find((card) => card.id === "marineford_news").age, 2);
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
  const death = play("original", 10, { first_choice: "crew", first_wage: "home", merchant: "refuse", rescue: "sail" });
  const retire = play("original", 11, { first_choice: "repair", join: "cooperative", apprentice_offer: "teach", rescue: "shore", retire_choice: "retire" });
  const present = play("free", 12, { first_choice: "travel", join: "independent", apprentice_offer: "decline", rescue: "shore", retire_choice: "continue", present_choice: "lead" });
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
  const life = createGame("original", 3);
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
    assert.equal(life.supplies, 1);
    assert.equal(getScene(life).age, 0);
    assert.ok(getScene(life).body.includes(home));
    assert.equal(play("original", 11, {}, profile).finished, true);
  }
  const found = new Set();
  for (let seed = 0; seed < 100; seed += 1) {
    const first = createGame("free", seed);
    assert.deepEqual(first.birth, createGame("free", seed).birth);
    assert.ok(PROFILE_OPTIONS.homes[first.birth.species].includes(first.birth.home));
    found.add(first.birth.species);
  }
  assert.deepEqual(found, new Set(PROFILE_OPTIONS.species));
  assert.throws(() => createGame("original", 1, { name: " " }));
  assert.throws(() => createGame("original", 1, { species: "어인", home: "엘바프 북쪽 만" }));
  assert.throws(() => createGame("original", 1, { home: "해무 항구" }));
  assert.throws(() => createGame("original", 1, { species: "알 수 없는 종족" }));
});

test("종족 경로에서 능력치 부족은 실제 실패하고 충분하면 성공한다", () => {
  function reachTest(firstChoice) {
    let life = createGame("original", 7, { species: "어인", means: "넉넉지 않은" });
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
  assert.equal(tickObservation(paused, 7100, 4, true).elapsed, 5000);
  assert.throws(() => tickObservation(paused, 6000, 1, true));
});

test("이전 버전의 인간 출생 저장 기록도 그대로 복원한다", () => {
  const oldRecord = { version: 1, mode: "original", seed: 10, actions: [] };
  const oldLife = replay(oldRecord);
  assert.equal(oldLife.rules, 1);
  assert.equal(oldLife.birth.species, "인간");
  assert.equal(getScene(oldLife).id, "birth");
  assert.deepEqual(replay(saveRecord(oldLife)), oldLife);
});

test("저장 기록은 같은 삶으로 복원되고, 1000개 시드가 막힘 없이 끝난다", () => {
  const completed = new Set();
  for (let seed = 0; seed < 1000; seed += 1) {
    let life = createGame(seed % 2 ? "free" : "original", seed);
    let steps = 0;
    while (!life.finished) {
      const scene = getScene(life);
      const choice = scene.choices.length ? scene.choices[(seed + steps) % scene.choices.length].id : null;
      life = advance(life, choice);
      steps += 1;
      assert.ok(steps <= scenes.length);
    }
    assert.equal(new Set(life.seen).size, life.seen.length);
    assert.ok(life.journal.every((entry, index, entries) => index === 0 || entry.age >= entries[index - 1].age));
    assert.deepEqual(replay(saveRecord(life)), life);
    completed.add(life.ending);
  }
  assert.ok(completed.has("death") && completed.has("retire") && completed.has("present"));
  assert.throws(() => replay({ version: 1, mode: "original", seed: 1, actions: ["not-a-choice"] }));
});
