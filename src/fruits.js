import { yearRoll } from "./world.js";

// Canon fruits with the approximate year (before the original present) their canon user ate them.
// Free mode can offer one only before that year; eating it takes the power away from that user in this worldline.
const CANON_FRUITS = [
  // Its true Nika name is not public in the years when this IF can find it.
  { name: "고무고무 열매", type: "초인계", trueType: "동물계 환수종",
    owner: "몽키 D. 루피", eatenBefore: 12, power: "팔을 당기자 고무처럼 길게 늘어났다." },
  { name: "이글이글 열매", type: "자연계", owner: "포트거스 D. 에이스", eatenBefore: 4, power: "손끝에서 불꽃이 피어올랐다." },
  { name: "꽃꽃 열매", type: "초인계", owner: "니코 로빈", eatenBefore: 24, power: "어깨 위로 또 하나의 손이 피어났다." },
  { name: "수술수술 열매", type: "초인계", owner: "트라팔가 로", eatenBefore: 13, power: "손바닥 위로 둥근 막이 펼쳐졌다." },
  { name: "동강동강 열매", type: "초인계", owner: "버기", eatenBefore: 27, power: "손목이 몸에서 떨어져 나갔다가 다시 붙었다." },
  { name: "어둠어둠 열매", type: "자연계", owner: "마셜 D. 티치", eatenBefore: 3, power: "주위의 빛이 손바닥 쪽으로 빨려 들어갔다." },
  { name: "고요고요 열매", type: "초인계", formerOwner: "돈키호테 로시난테", releasedBefore: 13,
    power: "손을 뻗자 주변의 소리가 갑자기 끊겼다." }
];

// Legacy-only pool: keep rule-3 saves reproducible. New rule-4 lives never draw these fictional fruits.
const LEGACY_FRUITS = [
  { name: "조임조임 열매", type: "초인계", power: "손끝에서 매듭이 저절로 조여졌다." },
  { name: "등불등불 열매", type: "초인계", power: "손바닥에서 따뜻한 불빛이 새어 나왔다." },
  { name: "소금소금 열매", type: "초인계", power: "손끝에 닿은 바닷물이 하얀 소금으로 굳었다." },
  { name: "메아리메아리 열매", type: "초인계", power: "한 번 들은 소리를 몸에서 그대로 되울릴 수 있었다." },
  { name: "이끼이끼 열매", type: "초인계", power: "밟은 자리마다 부드러운 이끼가 돋았다." },
  { name: "수달수달 열매", type: "동물계", power: "몸이 수달처럼 날렵하게 바뀌었다. 헤엄만은 여전히 칠 수 없었다." },
  { name: "갈매기갈매기 열매", type: "동물계", power: "팔에 하얀 깃털이 돋더니 바람이 몸을 들어 올렸다." },
  { name: "안개안개 열매", type: "자연계", power: "몸의 끝이 옅은 안개로 풀렸다가 다시 모였다." }
];

// Same seed and age give the same fruit, so the offer shown and the fruit eaten always match.
export function fruitFor(life) {
  const roll = yearRoll(life.seed ^ 0x5f3759df, life.age);
  const beforePresent = life.birth.yearsBeforeCurrent - life.age;
  if (life.creationVersion >= 4) {
    // Approximate eating dates get a two-year buffer so an offer cannot overlap the canon owner.
    const available = CANON_FRUITS.filter((fruit) => fruit.releasedBefore !== undefined
      ? beforePresent < fruit.releasedBefore
      : life.mode === "free" && beforePresent > fruit.eatenBefore + 2);
    const fruit = available[roll % available.length];
    return fruit?.trueType ? { ...fruit, type: fruit.trueType } : fruit || null;
  }
  const canon = life.mode === "free" ? CANON_FRUITS.filter((fruit) => beforePresent > fruit.eatenBefore) : [];
  if (canon.length && roll % 2 === 0) return canon[(roll >>> 1) % canon.length];
  // Logia stays rare.
  const pool = roll % 5 === 0 ? LEGACY_FRUITS : LEGACY_FRUITS.filter((fruit) => fruit.type !== "자연계");
  return pool[(roll >>> 3) % pool.length];
}
