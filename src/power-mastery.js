// Rule 35: unlocked level and practical proficiency are deliberately separate.
export const HAKI_NAMES = { observation: "견문색", armament: "무장색", conqueror: "패왕색" };
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

export function powerOdds(life, check, kind, hakiKinds = [], synergy = 0) {
  if (life.creationVersion < 35 || kind === "nonuser") return null;
  const progress = life.powerProficiency;
  if (!progress) throw new Error("35번 출생의 능력 숙련도 기록이 없습니다.");
  const levels = kind === "fruit" ? [life.fruitMastery] : hakiKinds.map((key) => life.haki[key]);
  const scores = kind === "fruit" ? [progress.fruit] : hakiKinds.map((key) => progress.haki[key]);
  if (!levels.length || levels.some((n) => n <= 0)) return null;
  const mastery = scores.reduce((sum, n) => sum + n, 0) / scores.length;
  const level = Math.min(...levels);
  const effective = clamp(life[check.stat], 0, 100) * 0.15
    + clamp(mastery + (level >= 2 ? 10 : 0), 0, 100) * 0.85;
  // Bounds preserve a 10% chance of either failure or success.
  const target = clamp(Math.round(40 + check.against - effective - synergy), 11, 91);
  return {
    target, chance: 101 - target, mastery: Math.round(mastery), level,
    bonus: 40 - target + check.against - life[check.stat],
    ability: kind === "fruit" ? "열매" : hakiKinds.map((key) => HAKI_NAMES[key]).join("·")
  };
}

export function gainPowerExperience(life, kind, hakiKinds, tier) {
  if (life.creationVersion < 35) return;
  const points = tier === "great" ? 8 : tier === "good" ? 6 : 3;
  if (kind === "fruit") {
    life.powerProficiency.fruit = clamp(life.powerProficiency.fruit + points, 0, 100);
  } else if (kind === "haki") {
    for (const key of hakiKinds) {
      life.powerProficiency.haki[key] = clamp(life.powerProficiency.haki[key] + points, 0, 100);
    }
  }
}

export function awardPowerAcquisition(before, after, sceneId) {
  if (after.creationVersion < 35) return;
  const progress = after.powerProficiency;
  if (!before.devilFruit && after.devilFruit) progress.fruit = 15;
  for (const key of Object.keys(HAKI_NAMES)) {
    if (!before.haki[key] && after.haki[key]) progress.haki[key] = 15;
  }
  if (sceneId === "life_fruit_practice" && after.fruitMastery > before.fruitMastery) {
    progress.fruit = clamp(progress.fruit + 12, 0, 100);
  }
  if (sceneId === "life_haki_practice") {
    for (const key of ["observation", "armament"]) {
      if (after.haki[key] > before.haki[key]) progress.haki[key] = clamp(progress.haki[key] + 12, 0, 100);
    }
  }
}
