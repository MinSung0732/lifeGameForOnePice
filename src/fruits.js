import { storyBefore, yearRoll } from "./world.js";

// Canon fruits with the approximate year (before the original present) their canon user ate them.
// Free mode can offer one only before that year; eating it takes the power away from that user in this worldline.
export const CANON_FRUITS = [
  // Its true Nika name is not public in the years when this IF can find it.
  { name: "고무고무 열매", type: "초인계", trueType: "동물계 환수종",
    owner: "몽키 D. 루피", eatenBefore: 12, power: "팔을 당기자 고무처럼 길게 늘어났다." },
  { name: "이글이글 열매", type: "자연계", owner: "포트거스 D. 에이스", eatenBefore: 4, power: "손끝에서 불꽃이 피어올랐다." },
  { name: "꽃꽃 열매", type: "초인계", owner: "니코 로빈", eatenBefore: 24, power: "어깨 위로 또 하나의 손이 피어났다." },
  { name: "수술수술 열매", type: "초인계", owner: "트라팔가 로", eatenBefore: 13, power: "손바닥 위로 둥근 막이 펼쳐졌다." },
  { name: "동강동강 열매", type: "초인계", owner: "버기", eatenBefore: 27, power: "손목이 몸에서 떨어져 나갔다가 다시 붙었다." },
  { name: "어둠어둠 열매", type: "자연계", owner: "마셜 D. 티치", eatenBefore: 3, power: "주위의 빛이 손바닥 쪽으로 빨려 들어갔다." },
  { name: "고요고요 열매", type: "초인계", formerOwner: "돈키호테 로시난테", releasedBefore: 13,
    power: "손을 뻗자 주변의 소리가 갑자기 끊겼다." },
  { name: "쿠릉쿠릉 열매", type: "자연계", owner: "에넬", eatenBefore: 6, minVersion: 20,
    power: "손끝에서 푸른 전류가 튀며 천둥소리가 울렸다." },
  { name: "얼음얼음 열매", type: "자연계", owner: "쿠잔", eatenBefore: 18, minVersion: 20,
    power: "내쉰 숨결이 하얀 냉기가 되어 손끝의 물기를 얼렸다." },
  { name: "모래모래 열매", type: "자연계", owner: "크로커다일", eatenBefore: 14, minVersion: 20,
    power: "손바닥이 바스락거리는 모래로 풀어졌다가 다시 굳었다." },
  { name: "번쩍번쩍 열매", type: "자연계", owner: "볼사리노", eatenBefore: 20, minVersion: 20,
    power: "몸 끝이 눈부신 황금빛 입자로 번쩍이며 흩어졌다." },
  { name: "뭉게뭉게 열매", type: "자연계", owner: "스모커", eatenBefore: 8, minVersion: 20,
    power: "소매 끝에서 하얀 연기가 피어올라 허공을 감쌌다." },
  { name: "눈눈 열매", type: "자연계", owner: "모네", eatenBefore: 4, minVersion: 20,
    power: "손끝에서 차가운 눈보라가 흩날리며 주위를 하얗게 덮었다." },
  { name: "가스가스 열매", type: "자연계", owner: "시저 크라운", eatenBefore: 6, minVersion: 20,
    power: "몸 둘레에 보랏빛 가스가 아지랑이처럼 피어올랐다." },
  { name: "흔들흔들 열매", type: "초인계", owner: "에드워드 뉴게이트", eatenBefore: 32, minVersion: 20,
    power: "주먹을 쥐자 허공에 금이 가며 묵직한 진동이 퍼졌다." },
  { name: "실실 열매", type: "초인계", owner: "돈키호테 도플라밍고", eatenBefore: 16, minVersion: 20,
    power: "손가락 끝에서 눈에 보이지 않을 만큼 가느다란 실이 뻗어 나갔다." },
  { name: "떡떡 열매", type: "초인계", owner: "샬롯 카타쿠리", eatenBefore: 22, minVersion: 20,
    power: "손끝이 차지고 끈적한 떡처럼 늘어나더니 단단하게 굳었다." },
  { name: "도르도르 열매", type: "초인계", owner: "갤디노", eatenBefore: 5, minVersion: 20,
    power: "손끝에서 흘러나온 하얀 밀랍이 순식간에 강철처럼 굳었다." },
  { name: "새새 열매 모델 불사조", type: "동물계 환수종", owner: "마르코", eatenBefore: 15, minVersion: 20,
    power: "팔 위로 뜨겁지 않은 푸른 불꽃이 일며 상처가 스르르 아물었다." }
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
  const beforePresent = storyBefore(life);
  if (life.creationVersion >= 4) {
    // Approximate eating dates get a two-year buffer so an offer cannot overlap the canon owner.
    const available = CANON_FRUITS.filter((fruit) => (!fruit.minVersion || (life.creationVersion ?? 20) >= fruit.minVersion)
      && (fruit.releasedBefore !== undefined
        ? beforePresent < fruit.releasedBefore
        : life.mode === "free" && beforePresent > fruit.eatenBefore + 2));
    const fruit = available[roll % available.length];
    return fruit?.trueType ? { ...fruit, type: fruit.trueType } : fruit || null;
  }
  const canon = life.mode === "free" ? CANON_FRUITS.filter((fruit) => (!fruit.minVersion || (life.creationVersion ?? 20) >= fruit.minVersion)
    && beforePresent > fruit.eatenBefore) : [];
  if (canon.length && roll % 2 === 0) return canon[(roll >>> 1) % canon.length];
  // Logia stays rare.
  const pool = roll % 5 === 0 ? LEGACY_FRUITS : LEGACY_FRUITS.filter((fruit) => fruit.type !== "자연계");
  return pool[(roll >>> 3) % pool.length];
}
