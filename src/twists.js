// Rule 14: an ordinary choice can still turn out better or worse than planned.
// The stat the choice grows tilts the odds, so a skilled hand gets more windfalls and a weak one more setbacks.
const LINES = {
  skill: {
    up: ["손에 익은 요령 덕에 예상보다 일이 깔끔하게 끝났고, 지켜보던 사람이 비결을 물었다.", "엉뚱한 실수를 바로잡다가 더 나은 방법을 우연히 찾아냈다.",
      "옆에서 지켜보던 노련한 일꾼이 한 가지 요령을 덤으로 알려 주었다.", "같은 일을 두 번 하지 않아도 됐다. 남은 시간에 다른 기술까지 손에 익혔다."],
    down: ["도구가 손에서 미끄러지는 바람에 처음부터 다시 해야 했다.", "자신 있던 순서가 꼬여 버렸다. 배운 것보다 헤맨 시간이 더 길었다.",
      "엉뚱한 사람의 조언을 믿었다가 한참을 돌아갔다.", "서두르다 놓친 매듭 하나 때문에 일이 반만 남았다."]
  },
  health: {
    up: ["몸이 가벼운 날이었다. 땀을 흘린 만큼 밤에 깊이 잤다.", "지나가던 노인이 건넨 약초차가 생각보다 잘 들었다.",
      "고된 하루였지만 오히려 몸에 힘이 붙은 것을 느꼈다.", "끼니를 거르지 않게 챙겨 준 사람 덕에 기운이 넘쳤다."],
    down: ["무리한 탓에 며칠 동안 감기 기운에 시달렸다.", "발을 헛디뎌 삔 발목이 한동안 말썽이었다.",
      "상한 생선을 먹고 밤새 고생했다.", "잠을 설친 날이 이어지며 몸이 무거워졌다."]
  },
  supplies: {
    up: ["값을 깎아 주던 상인이 남은 물건까지 덤으로 얹어 주었다.", "버려진 상자 바닥에서 쓸 만한 물건이 더 나왔다.",
      "운 좋게 시세가 오른 날이라 생각보다 많이 남았다.", "빌려준 돈을 잊고 있던 사람이 이자까지 붙여 갚았다."],
    down: ["주머니에 구멍이 나 있었다. 집에 와서야 알았다.", "갈매기가 짐 하나를 채 가는 바람에 손해를 봤다.",
      "흥정에 진 끝에 값을 너무 많이 치렀다.", "비에 젖은 짐 일부를 버려야 했다."]
  },
  bond: {
    up: ["양육자가 오래 묵혀 둔 옛이야기를 처음으로 들려주었다.", "말없이 차려진 저녁상에서 마음을 읽었다.",
      "함께 웃은 일이 오래 집 안의 화제가 됐다.", "양육자가 아끼던 물건 하나를 건네며 잘했다고 말했다."],
    down: ["사소한 말다툼이 길어져 며칠 동안 집이 조용했다.", "약속한 시간에 늦어 양육자의 걱정을 샀다.",
      "좋은 뜻이었지만 양육자는 다른 방식을 바랐다.", "서로 피곤한 날이라 한마디가 날카롭게 오갔다."]
  },
  friendBond: {
    up: ["친구가 똑같은 생각을 하고 있었다는 걸 알고 한참 웃었다.", "곤란할 때 친구가 먼저 손을 내밀었다. 그날 일은 오래 남았다.",
      "둘만 아는 신호가 하나 더 생겼다.", "친구가 몰래 준비한 작은 선물이 짐 속에서 나왔다."],
    down: ["무심코 한 말에 친구가 서운해했다.", "같은 걸 원하다가 사이가 잠시 어색해졌다.",
      "약속을 깜빡해 친구가 혼자 기다렸다.", "친구의 비밀을 엉뚱한 자리에서 꺼내고 말았다."]
  },
  trust: {
    up: ["소문이 좋게 퍼져 모르는 사람까지 인사를 건넸다.", "도움을 받은 사람이 동네방네 고맙다고 말하고 다녔다.",
      "우연히 그 장면을 본 원로가 이름을 기억해 두었다.", "일을 맡겨 보자는 사람이 하나 둘 늘었다."],
    down: ["좋은 일을 하고도 오해를 사 뒷말이 돌았다.", "누군가 공을 가로채 버려 사람들은 다른 이름을 기억했다.",
      "작은 실수가 부풀려져 한동안 눈총을 받았다.", "잘해 보려던 일이 남의 체면을 건드렸다."]
  }
};

// Returns the extra line for the outcome, or "" when the choice went as planned. `roll` is 1..100.
export function twist(before, after, roll) {
  const gains = Object.keys(LINES).map((key) => [key, after[key] - before[key]]).filter(([, gain]) => gain > 0);
  if (!gains.length) return "";
  const [key, gain] = gains.reduce((best, item) => item[1] > best[1] ? item : best);
  const luck = roll + Math.round((before[key] - 50) / 4);
  const lines = LINES[key];
  if (luck >= 90) {
    after[key] += Math.max(3, Math.round(gain / 2));
    return `뜻밖의 행운: ${lines.up[roll % lines.up.length]}`;
  }
  if (luck <= 10) {
    after[key] -= Math.ceil(gain / 2);
    return `뜻밖의 차질: ${lines.down[roll % lines.down.length]}`;
  }
  return "";
}
