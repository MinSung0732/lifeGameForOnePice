function fruitFxKind(fruitText = "") {
  if (fruitText.includes("고무고무")) return "fruit-gomu";
  if (fruitText.includes("이글이글")) return "fruit-mera";
  if (fruitText.includes("꽃꽃")) return "fruit-hana";
  if (fruitText.includes("수술수술")) return "fruit-ope";
  if (fruitText.includes("동강동강")) return "fruit-bara";
  if (fruitText.includes("어둠어둠")) return "fruit-yami";
  if (fruitText.includes("고요고요")) return "fruit-nagi";
  if (fruitText.includes("쿠릉쿠릉")) return "fruit-goro";
  if (fruitText.includes("얼음얼음")) return "fruit-hie";
  if (fruitText.includes("모래모래")) return "fruit-suna";
  if (fruitText.includes("번쩍번쩍")) return "fruit-pika";
  if (fruitText.includes("뭉게뭉게")) return "fruit-moku";
  if (fruitText.includes("눈눈")) return "fruit-yuki";
  if (fruitText.includes("가스가스")) return "fruit-gasu";
  if (fruitText.includes("흔들흔들")) return "fruit-gura";
  if (fruitText.includes("실실")) return "fruit-ito";
  if (fruitText.includes("떡떡")) return "fruit-mochi";
  if (fruitText.includes("도르도르")) return "fruit-doru";
  if (fruitText.includes("불사조")) return "fruit-ori";
  return "fruit";
}

export function powerFxForChoice(state, choiceId, chosenLabel = "", outcome = "", chosenRisk = "") {
  const id = String(choiceId || "").split(":")[0];
  if (id === "power_fruit" || id === "fruit" || chosenLabel.startsWith("[열매]") || chosenLabel.includes("열매의 힘")) {
    if (!state.devilFruit) return null;
    const fruitName = state.devilFruit.replace(/\(.*\)$/, "");
    const synBadge = chosenRisk.includes("상성 유리") ? " · 상성 유리" : chosenRisk.includes("상성 불리") ? " · 상성 불리" : "";
    return { kind: fruitFxKind(fruitName), badge: "능력 발동 · " + fruitName + synBadge };
  }

  // A generic 'observe' action is not necessarily an Observation Haki action.
  const hakiChoice = id === "power_haki" || chosenLabel.startsWith("[패기]") || /^(견문색|무장색|패왕색|패기로)/.test(chosenLabel);
  if (!hakiChoice) return null;

  const haki = state.haki || {};
  if (!haki.observation && !haki.armament && !haki.conqueror) return null;
  const explicit = chosenLabel.replace(/^\[패기\]\s*/, "");
  if (/견문색|기척|속마음/.test(explicit) && !haki.observation) return null;
  if (/무장색|검게 물든|칼날을 맞받/.test(explicit) && !haki.armament) return null;
  if (/패왕색/.test(explicit) && !haki.conqueror) return null;

  const text = chosenLabel + " " + outcome;
  const hasConq = haki.conqueror > 0 && (/패왕색/.test(text) || (!/견문색|무장색|기척|검게 물든/.test(text) && /기세|압도|터뜨려/.test(text)));
  const hasArm = haki.armament > 0 && /무장색|검게 물든|칼날을 맞받/.test(text);
  const hasObs = haki.observation > 0 && /견문색|기척|속마음/.test(text);
  const kind = hasConq ? "haki-conqueror" : hasArm && hasObs ? (haki.armament >= haki.observation ? "haki-armament" : "haki-observation")
    : hasArm ? "haki-armament" : hasObs ? "haki-observation"
      : haki.conqueror ? "haki-conqueror" : haki.armament ? "haki-armament" : "haki-observation";
  const label = { "haki-conqueror": "패왕색 패기", "haki-armament": "무장색 패기", "haki-observation": "견문색 패기" }[kind];
  return { kind, badge: "패기 발동 · " + label };
}
