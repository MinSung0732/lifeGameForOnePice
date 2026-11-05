import { arcScene } from "./canon-arcs.js";
import { canonRelationshipChanged } from "./canon-relationships.js";
import { EXTRA_AFTER, takenText } from "./canon-timeline.js";
// Rule-4 canon milestones. Relative time labels avoid claiming an unpublished manga calendar.
const BEATS = [
  { id: "war_after", offset: -2, time: "정상전쟁 뒤 · 얼마 지나지 않아", title: "전쟁이 남긴 빈자리",
    canon: "https://one-piece.com/story/marineford/index.html",
    body: (life) => `마린포드발 신문에 에이스와 흰 수염의 죽음이 실렸다. 항구 사람들은 승패보다 부상자 명단을 먼저 읽었다. ${life.birth.name}도 아는 이름을 찾으며 잉크 묻은 종이를 넘겼다.` },
  { id: "training", offset: -1, time: "전쟁 뒤 · 긴 공백", title: "흩어진 이들의 시간", art: "workbench",
    canon: "https://one-piece.com/story/fishman_island/index.html",
    body: "밀짚모자 일당의 이름이 신문에서 뜸해졌다. 그들이 각지에서 힘을 기르는 동안, 다른 배는 찢어진 돛을 고치고 마을은 빈자리를 메웠다. 기다림에도 각자의 일이 있었다." },
  { id: "reunion", offset: 0, time: "약 2년 뒤 · 샤본디", title: "샤본디에서 다시 모이다",
    canon: "https://one-piece.com/story/fishman_island/index.html",
    body: "샤본디에서 밀짚모자 일당이 다시 모였다는 전보가 붙었다. 이름을 사칭하던 무리와 진짜 일당이 한 항구에 있었다는 말에 선원들이 웃음을 터뜨렸다. 웃음이 잦자 모두 다음 항로를 물었다." },
  { id: "fishman", offset: 0, time: "재집결 뒤 · 어인섬", title: "어인섬에 닿은 소식", art: "fishman",
    canon: "https://one-piece.com/story/fishman_island/index.html",
    body: "어인섬에서 온 전보가 항구에 도착했다. 노아가 섬을 덮칠 뻔했지만 위기는 지나갔다. 누군가는 영웅담을 떠들었고, 누군가는 돌아온 사람을 위한 마른 옷부터 찾았다.",
    choices: [
      { id: "aid", label: "도착한 피난민에게 물자를 건넨다", cost: 10, risk: "물자 10 필요 · 지역의 신뢰 +10", personality: { empathy: 6 },
        apply: (life) => { life.supplies -= 10; life.trust += 10; return "누군가의 사연을 듣고 다음 배에 필요한 것을 챙겼다."; } },
      { id: "record", label: "항로와 피난 소식을 기록한다", risk: "기술 +5", personality: { caution: 5 },
        apply: (life) => { life.skill += 5; return "전해 들은 말과 직접 확인한 것을 따로 적었다."; } }
    ] },
  { id: "punk_hazard", offset: 0, time: "신세계로 향한 뒤 · 펑크 하자드", title: "펑크 하자드의 아이들", art: "workbench",
    canon: "https://one-piece.com/story/punk_hazard/index.html",
    body: "불과 눈이 한 섬에 있다는 펑크 하자드에서 아이들이 실험에 이용됐다는 소식이 나왔다. 루피와 로가 손잡았다는 말도 돌았다. 사람들은 기묘한 섬보다 아이들이 무사히 나왔는지 오래 물었다.",
    choices: [
      { id: "shelter", label: "돌아온 아이들을 위한 약을 보낸다", cost: 10, risk: "물자 10 필요 · 지역의 신뢰 +10", personality: { empathy: 7 },
        apply: (life) => { life.supplies -= 10; life.trust += 10; return "약과 담요가 구조선을 통해 건너갔다."; } },
      { id: "listen", label: "확인된 구조 소식만 전한다", risk: "기술 +5", personality: { caution: 5 },
        apply: (life) => { life.skill += 5; return "아이들의 이름을 소문거리로 만들지 않았다."; } }
    ] },
  { id: "dressrosa", offset: 0, time: "그 뒤 · 드레스로자", title: "드레스로자의 새 아침",
    canon: "https://one-piece.com/story/dressrosa/index.html",
    body: (life) => `신문은 도플라밍고의 몰락을 큰 글씨로 알렸다. 장난감으로 잊혔던 이들이 돌아왔다는 대목에서 ${life.birth.name}은 페이지를 다시 읽었다. 루피를 따르겠다는 선단도 생겼지만, 사람들의 일상은 이제 다시 시작이었다.` },
  { id: "zou", offset: 0, time: "항해가 이어질 무렵 · 조", title: "움직이는 조의 비밀", art: "mink",
    canon: "https://one-piece.com/story/zou/index.html",
    body: "조에서 내려온 선원이 밍크족의 상처와 사무라이의 행방을 이야기했다. 누군가 지도를 펴자 그가 고개를 저었다. 그 섬은 서 있는 땅이 아니었다." },
  { id: "whole_cake", offset: 0, time: "항로가 갈린 뒤 · 홀케이크", title: "홀케이크에서 돌아온 배",
    canon: "https://one-piece.com/story/wholecakeisland/index.html",
    body: "홀케이크 아일랜드에서 상디를 데려온 배가 빅 맘의 추격을 벗어났다는 소식이 퍼졌다. 항구의 선원들은 어떻게 달아났는지 따지다가, 살아 돌아왔느냐는 한마디 앞에서 잠잠해졌다." },
  { id: "reverie", offset: 0, time: "같은 시기 · 세계회의", title: "왕들이 모인 날",
    canon: "https://one-piece.com/story/levely/index.html",
    body: "마리조아에 왕들이 모였다는 소식이 왔다. 항구의 상인들은 거창한 연설보다 다음 달의 통행세가 달라질지를 궁금해했다. 회의장 안에서 무슨 말이 오가는지는 아직 알 길이 없었다." },
  { id: "wano", offset: 0, time: "얼마 뒤 · 와노국", title: "와노국 뒤의 새 지형",
    canon: "https://one-piece.com/story/land_of_wano/index.html",
    body: (life) => `카이도와 빅 맘이 와노국에서 패배했다. 새 사황의 이름을 실은 신문이 ${life.location}에도 닿았다. ${life.birth.name}의 곁에서는 새 깃발이 어느 항로를 막을지부터 따졌다.` },
  { id: "egghead", offset: 0, time: "그 뒤 · 에그헤드 방송", title: "전 세계로 울린 방송", art: "workbench",
    canon: "https://one-piece.com/story/egghead/index.html",
    body: "에그헤드에서 시작된 베가펑크의 목소리가 전보벌레를 타고 번졌다. 오래 감춰진 역사와 바다에 관한 말을 듣던 사람들은 서로를 돌아봤다. 같은 방송 앞에서도 다음 행동은 달랐다.",
    choices: [
      { id: "share", label: "방송 내용을 이웃과 함께 확인한다", risk: "지역의 신뢰 +10", personality: { empathy: 5, caution: 4 },
        apply: (life) => { life.trust += 10; return "들은 내용과 모르는 부분을 구분해 함께 적었다."; } },
      { id: "keep", label: "자신의 기록에 남겨 둔다", risk: "기술 +5", personality: { caution: 6 },
        apply: (life) => { life.skill += 5; return "언젠가 다시 읽을 수 있도록 방송 시각과 출처를 적었다."; } }
    ] },
  { id: "elbaf", offset: 0, time: "이어서 · 엘바프 현재", title: "거인의 나라에서", art: "giant",
    canon: "https://one-piece.com/story/elbaph/index.html",
    body: "밀짚모자 일당이 엘바프에 닿았다는 소식이 왔다. 거인의 나라에서 무슨 일이 끝나고 시작될지는 아직 아무도 장담할 수 없다. 신문의 다음 칸은 비어 있었고, 사람들은 자기 배의 일을 계속했다." }
];

export const CANON_IF_AFTER = BEATS.findIndex((beat) => beat.id === "egghead");

const BEATS_V10 = BEATS.flatMap((beat) => [beat, ...(EXTRA_AFTER[beat.id] || []).map((extra) => ({
  offset: beat.offset, art: beat.art, canon: beat.canon, ...extra }))]);
const beatsFor = (life) => life.creationVersion >= 10 ? BEATS_V10 : BEATS;
export const canonCount = (life) => beatsFor(life).length;
export const canonIfAfter = (life) => beatsFor(life).findIndex((beat) => beat.id === "egghead");

export function canonScene(life) {
  if (life.creationVersion < 4 || !life.seen.includes("life_marineford_news")) return null;
  const beat = beatsFor(life)[life.canonStep];
  if (!beat) return null;
  const arc = arcScene(life, beat, life.birth.yearsBeforeCurrent + beat.offset);
  if (arc) return arc;
  const diverged = life.worldBranch || life.people?.fruitOwner || canonRelationshipChanged(life);
  const body = typeof beat.body === "function" ? beat.body(life) : beat.body;
  const canHelpFishman = life.location.includes("어인섬") || life.location === "샤본디 제도" || life.birth.species === "어인";
  const canHelpPunk = ["펑크 하자드", "드레스로자"].includes(life.location) || ["marine", "liberator"].includes(life.path);
  const choices = (beat.id === "fishman" && !canHelpFishman || beat.id === "punk_hazard" && !canHelpPunk)
    ? undefined : beat.choices;
  return {
    ...beat, id: `canon_${beat.id}`, age: life.birth.yearsBeforeCurrent + beat.offset,
    act: 3, art: beat.art || "deck", yearly: true, urgent: true, canonBeat: true, manual: !choices, choices,
    timeLabel: diverged ? `IF 세계선 · ${beat.time}` : beat.time,
    body: takenText(life, beat.id) || (life.worldBranch && life.canonStep >= 2
      ? `원작 기준으로는 ${body} ${life.birth.name}의 세계는 이미 갈라졌다. 같은 결말이라고 단정할 수 없다.`
      : body)
  };
}

export function canonStatus(life) {
  const beats = beatsFor(life);
  const beat = beats[Math.min(life.canonStep, beats.length - 1)];
  return life.canonStep >= beats.length ? "원작은 엘바프에서 계속된다. 그 이후는 아직 공개되지 않았다."
    : beat ? `같은 시기 원작 · ${beat.title}` : "";
}

export const CANON_BEAT_COUNT = BEATS.length;
