import test from "node:test";
import assert from "node:assert/strict";
import { createGame } from "../src/game.js";
import { withPower } from "../src/adventures.js";
import { fruitFxKind, powerFxForChoice } from "../src/power-fx.js";

const character = (observation = 0, armament = 0, conqueror = 0) => {
  const life = createGame("free", 42, {}, 3, 20);
  life.haki = { observation, armament, conqueror };
  return life;
};
const hasHakiChoice = (life, event) => withPower(life, event, []).some((choice) => choice.id === "power_haki");

test("ordinary observe actions never trigger Haki effects", () => {
  assert.equal(powerFxForChoice(character(), "observe", "신문을 보관하고 다음 소식을 기다린다"), null);
  assert.equal(powerFxForChoice(character(1), "observe", "예의를 갖추고 섬을 둘러본다"), null);
  assert.equal(powerFxForChoice(character(), "power_haki", "[패기] 기척을 읽는다"), null);
  assert.equal(powerFxForChoice(character(), "observation", "견문색의 기초를 배운다", "수련 실패"), null);
});

test("Haki effects require the named skill even after a failed attempt", () => {
  assert.equal(powerFxForChoice(character(0, 1), "observation", "견문색의 기초를 배운다", "실패"), null);
  assert.equal(powerFxForChoice(character(1), "power_haki", "[패기] 무장색으로 칼날을 막는다"), null);
  assert.equal(powerFxForChoice(character(1), "power_haki", "[패기] 견문색으로 기척을 읽는다")?.kind, "haki-observation");
  assert.equal(powerFxForChoice(character(0, 1), "power_haki", "[패기] 무장색으로 칼날을 막는다")?.kind, "haki-armament");
  assert.equal(powerFxForChoice(character(0, 0, 1), "power_haki", "[패기] 패왕색을 터뜨린다")?.kind, "haki-conqueror");
  assert.notEqual(powerFxForChoice(character(1, 1, 1), "power_haki", "[패기] 패기로 추격대를 압도한다", "무장색과 견문색으로 돌파했다")?.kind, "haki-conqueror");
});

test("fruit animations require an actual devil fruit", () => {
  assert.equal(powerFxForChoice(character(), "fruit", "열매의 힘으로 버틴다"), null);
  const life = character();
  life.devilFruit = "고무고무 열매";
  assert.equal(powerFxForChoice(life, "fruit", "열매의 힘으로 버틴다")?.kind, "fruit-gomu");
});

test("power choices match owned Haki types and two-type moves need both", () => {
  assert.equal(hasHakiChoice(character(), "mishap_feast"), false);
  assert.equal(hasHakiChoice(character(1), "mishap_feast"), true);
  assert.equal(hasHakiChoice(character(0, 1), "mishap_feast"), false);
  assert.equal(hasHakiChoice(character(0, 1), "mishap_giant_fish"), true);
  assert.equal(hasHakiChoice(character(1), "mishap_giant_fish"), false);
  assert.equal(hasHakiChoice(character(1), "mishap_haki_bet"), false);
  assert.equal(hasHakiChoice(character(0, 1), "danger_capture"), false);
  assert.equal(hasHakiChoice(character(1, 1), "mishap_haki_bet"), true);
  assert.equal(hasHakiChoice(character(1, 1), "danger_capture"), true);
});

test("milestone VFX can resolve every learned fruit independently of combat choices", () => {
  assert.equal(fruitFxKind("고무고무 열매"), "fruit-gomu");
  assert.equal(fruitFxKind("이글이글 열매"), "fruit-mera");
  assert.equal(fruitFxKind("정체불명의 열매"), "fruit");
});

test("collectMilestones includes both fruit acquisition and learned Haki", async () => {
  const { collectMilestones } = await import("../src/game.js");
  const before = character();
  const after = structuredClone(before);
  after.devilFruit = "고무고무 열매";
  after.haki.observation = 1;
  const gained = collectMilestones(before, after);
  assert.ok(gained.some((milestone) => milestone.kind === "fruit" && milestone.title === "고무고무 열매"));
  assert.ok(gained.some((milestone) => milestone.kind === "haki-observation"));
});
