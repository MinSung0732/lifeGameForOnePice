// Rule 18: canon events from the decades before Roger's execution reach the protagonist as news, rumor,
// or, when they stand on the island, as something seen. Every line here must be a manga fact.
import { storyBefore } from "./world.js";

// before: canon years before the original present (the Elbaf arc, about two years after Marineford).
// places: islands where the protagonist sees it first-hand (near text); elsewhere they hear `far`.
// They are news, not decisions, so they carry no choices and read like the other canon news scenes.
// Years follow the Kaienreki calendar with the present at 1524 (God Valley 1486 → 38, Roger's execution 1500 → 24).
const ROGER = "https://one-piece.com/character/Gold_Roger/index.html";
const WANO = "https://one-piece.com/story/land_of_wano/index.html";
export const OLD_ERA = [
  { id: "linlin_elbaf", before: 63, title: "겨울 축제의 소동", places: ["엘바프"], canon: "https://one-piece.com/story/wholecakeisland/index.html",
    near: "겨울 축제를 앞둔 단식 기간에, 섬에 맡겨진 인간 아이 링링이 굶주림을 못 이겨 날뛰었다. 마을이 부서지고 나이 든 거인 전사가 크게 다쳐 끝내 숨졌다. 아이는 마더 카르멜과 함께 엘바프를 떠났다.",
    far: "거인의 나라 엘바프에서 겨울 축제를 앞두고 큰 소동이 있었다는 이야기가 거인족 선원을 통해 들려왔다. 섬에 맡겨진 인간 아이 하나가 마을을 부수고 거인 전사를 쓰러뜨렸다고 했다." },
  { id: "rumbar", before: 52, title: "고래를 남긴 해적단", places: ["쌍둥이 언덕"], canon: "https://one-piece.com/character/Crocus/index.html",
    near: "쌍둥이 언덕의 등대 앞에 어린 고래를 데리고 온 해적단이 있었다. 룸바 해적단은 고래를 남겨 두고 위대한 항로 안쪽으로 나아갔고, 등대지기 크로커스가 그 고래를 돌보게 되었다.",
    far: "음악을 즐기는 룸바 해적단이 리버스 마운틴을 넘어 위대한 항로로 들어갔다는 이야기가 들렸다." },
  { id: "rocks", before: 44, title: "록스 해적단의 시대",
    far: "록스 D. 지벡이 이끄는 록스 해적단의 이름이 신문에 자주 오르내렸다. 그 배에는 흰 수염, 샬롯 링링, 시키처럼 훗날 바다를 흔들 해적들이 함께 타고 있었다." },
  { id: "god_valley", before: 38, title: "지도에서 사라진 섬",
    far: "록스 해적단이 갓 밸리라는 섬에서 무너졌고, 신문은 해군의 몽키 D. 가프를 영웅이라 불렀다. 그 섬은 얼마 뒤 지도에서 사라졌고, 그곳에서 무슨 일이 있었는지는 거의 알려지지 않았다." },
  { id: "donquixote", before: 33, title: "내려온 천룡인 일가",
    far: "천룡인 일가 하나가 마리조아를 떠나 노스 블루에서 평범하게 살겠다며 내려왔다는 소문이 돌았다. 천룡인이 신분을 버렸다는 이야기를 믿지 않는 사람도 많았다." },
  { id: "oden_leaves", before: 30, title: "와노국을 떠난 무사", places: ["와노국 외해"], canon: WANO,
    near: "와노국 해안에 들렀던 흰 수염 해적단의 배가 다시 바다로 나갔다. 떠나는 배의 쇠사슬에 와노국의 무사 코즈키 오뎅이 매달려 함께 나갔다는 이야기가 해안 마을에 돌았다.",
    far: "흰 수염 해적단의 배가 닫힌 나라 와노국에 들렀다가, 그 나라 출신 무사를 태우고 나왔다는 소문이 돌았다." },
  { id: "shiki_marineford", before: 24, title: "마린포드에 쳐들어간 금사자",
    far: "로저가 해군에 자수했다는 소식이 돌던 무렵, 금사자 시키가 함대를 이끌고 마린포드에 쳐들어갔다. 그는 센고쿠와 가프에게 붙잡혀 해저 감옥 임펠 다운에 갇혔다는 이야기가 뒤늦게 퍼졌다." },
  { id: "whitebeard_fishman", before: 24, title: "흰 수염의 깃발", places: ["어인섬"], canon: "https://one-piece.com/story/fishman_island/index.html",
    near: "로저가 처형된 뒤 해적이 몰려들던 어인섬에 흰 수염의 깃발이 걸렸다. 이 섬을 자기 영역으로 삼는다는 말 한마디에, 섬을 노리던 해적들의 발길이 줄었다.",
    far: "흰 수염이 어인섬을 자기 영역으로 삼았다는 소식이 전해졌다. 해적들이 그 섬에서 함부로 굴지 못하게 되었다는 말이 따라왔다." },
  { id: "shiki_escape", before: 22, title: "임펠 다운을 빠져나간 사람",
    far: "금사자 시키가 해저 감옥 임펠 다운을 탈옥했다는 소식이 실렸다. 그 감옥을 빠져나간 사람은 그가 처음이라고 했다." },
  { id: "ace_spade", before: 5, title: "스페이드 해적단",
    far: "이스트 블루에서 출항한 포트거스 D. 에이스의 스페이드 해적단이 빠르게 이름을 떨쳤다. 얼마 뒤 그가 흰 수염 해적단에 들어갔다는 소식이 이어졌다." },
  { id: "edd_war", before: 27, title: "에드 워의 해전", canon: ROGER,
    far: "에드 워 해역에서 금사자 시키의 대함대와 로저 해적단이 맞붙었다. 폭풍이 시키의 함대를 덮쳤고, 로저의 배는 그 바다를 빠져나갔다는 소식이 전해졌다." },
  { id: "roger_whitebeard", before: 26, title: "사흘의 싸움", canon: ROGER,
    far: "로저 해적단과 흰 수염 해적단이 한 섬에서 사흘 동안 맞붙었다는 소문이 돌았다. 어느 쪽이 이겼는지는 말하는 사람마다 달랐다." },
  { id: "pirate_king", before: 25, title: "해적왕이라는 이름", canon: ROGER,
    far: "골 D. 로저가 위대한 항로를 제패했다는 소식이 퍼졌다. 사람들은 그를 해적왕이라 불렀고, 그가 남긴 보물을 원피스라고 했다. 얼마 뒤 로저 해적단이 해산했다는 말도 돌았다." },
  { id: "oden_death", before: 20, title: "닫힌 나라의 처형", places: ["와노국 외해"], canon: WANO, art: "arcWano",
    near: "와노국을 오가는 몇 안 되는 배를 통해, 구리의 다이묘 코즈키 오뎅이 끓는 가마솥에서 처형되고 그의 성이 불탔다는 이야기가 전해졌다. 그 뒤로 나라는 카이도와 쿠로즈미 오로치의 손에 들어갔다.",
    far: "와노국에서 코즈키 오뎅이라는 다이묘가 처형되고 카이도가 그 나라에 자리 잡았다는 소문이 몇몇 선원 사이에서만 오갔다. 쇄국한 나라의 일이라 확인할 길은 없었다." },
  { id: "otohime", before: 17, title: "왕비의 서명", places: ["어인섬"], canon: "https://one-piece.com/story/fishman_island/index.html",
    near: "오토히메 왕비가 거리마다 다니며 지상으로 옮겨 살기 위한 서명을 받았다. 지상의 사람을 미워하는 목소리도 컸지만 왕비는 서명 받기를 멈추지 않았다.",
    far: "어인섬의 오토히메 왕비가 지상으로 옮겨 살자는 서명을 모으기 시작했다는 소식이 전해졌다." },
  { id: "flevance", before: 16, title: "하얀 도시의 끝", canon: "https://one-piece.com/story/dressrosa/index.html",
    far: "노스 블루의 하얀 도시 플레반스가 호박납 병으로 무너졌다. 신문에는 전염병이라는 말이 실렸고, 이웃 나라들이 국경을 막은 가운데 그 나라는 전쟁 끝에 사라졌다." },
  { id: "harald", before: 14, title: "엘바프 왕의 죽음", places: ["엘바프"], canon: "https://one-piece.com/story/elbaph/index.html",
    near: "엘바프의 국왕 하랄드가 숨졌다. 왕자 로키가 아버지를 죽였다는 말이 섬 전체에 퍼졌고, 왕성의 병사들도 여럿 목숨을 잃었다고 했다.",
    far: "거인의 나라 엘바프의 왕 하랄드가 숨졌다는 소식이 전해졌다. 왕자가 아버지를 죽였다는 이야기가 함께 돌았다." },
  { id: "jinbe_warlord", before: 11, title: "어인 칠무해",
    far: "어인 징베가 칠무해에 이름을 올렸다는 소식이 신문에 실렸다. 그와 함께 감옥에 있던 어인 해적 아론이 풀려났다는 말도 돌았다." },
  { id: "enel", before: 8, title: "하늘섬의 새 신", places: ["스카이피아"], canon: "https://one-piece.com/story/skypiea/index.html",
    near: "에넬이라는 자가 신관들을 거느리고 신의 섬을 차지했다. 섬을 다스리던 신 간 폴의 병사들은 붙잡혀 일을 하게 되었고, 사람들은 신의 눈을 피해 말을 줄였다.",
    far: "하늘섬에서 새 신이 섬을 차지했다는 이야기를 하는 선원이 있었지만, 아래 바다에는 하늘섬 자체를 믿지 않는 사람이 많았다." }
];

export function oldEraScene(life, age, base) {
  if (life.creationVersion < 18) return null;
  const before = storyBefore(life, age);
  // An event waits up to three years for a free year, so ones sharing a year with other canon news still arrive.
  const event = OLD_ERA.find((entry) => before <= entry.before && before >= entry.before - 3 && !life.seen.includes(`life_old_${entry.id}`));
  if (!event) return null;
  const near = event.places?.some((place) => life.location.includes(place));
  return { ...base, id: `life_old_${event.id}`, urgent: true, art: event.art || "deck", title: event.title,
    canon: event.canon, body: near && event.near ? event.near : event.far };
}
