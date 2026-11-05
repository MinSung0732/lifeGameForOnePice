import { arcScene } from "./canon-arcs.js";
import { EXTRA_BEFORE, takenText } from "./canon-timeline.js";
// Rule 5 follows the published arc order without assigning exact days to the voyage.
const EAST = "https://one-piece.com/story/east_blue/index.html";
const ALABASTA = "https://one-piece.com/story/alabasta/index.html";
const SKY = "https://one-piece.com/story/skypiea/index.html";
const WATER = "https://one-piece.com/story/water_seven/index.html";
const ENIES = "https://one-piece.com/story/enies_lobby/index.html";
const THRILLER = "https://one-piece.com/story/thriller_bark/index.html";
const SABAODY = "https://one-piece.com/story/sabaody/index.html";

const BEATS = [
  { id: "departure", title: "푸샤 마을에서 떠난 배", time: "그해 · 이스트 블루", canon: EAST, places: ["이스트 블루"],
    near: "푸샤 마을에서 밀짚모자를 쓴 루피가 작은 배로 떠났다는 말이 바닷바람을 타고 왔다. 부두의 어른들은 혼자 나간 배의 크기부터 물었다.",
    far: "이스트 블루에서 루피라는 소년이 혼자 바다로 나섰다. 이름 없는 항해 하나가 다른 바다에는 아직 닿지 않았다." },
  { id: "zoro", title: "첫 동료와 해군 기지", time: "출항 뒤 · 셸즈 타운", canon: EAST, places: ["이스트 블루"],
    near: "셸즈 타운의 해군 기지에서 모건의 지배가 끝나고, 검객 조로가 루피의 배에 올랐다는 소식이 돌았다. 지역의 해군도 그 사건을 두고 서로 다른 말을 했다.",
    far: "동쪽 바다의 작은 해군 기지에서 모건이 무너졌다. 루피는 검객 조로를 동료로 얻고 다음 섬으로 향했다." },
  { id: "buggy", title: "오렌지 마을의 소란", time: "얼마 뒤 · 오렌지 마을", canon: EAST, places: ["이스트 블루"],
    near: "오렌지 마을을 휘젓던 버기 해적단이 물러났다. 고양이 도둑이라 불리던 나미가 밀짚모자와 함께 있었다는 이야기는 말하는 사람마다 조금씩 달랐다.",
    far: "오렌지 마을에서 버기와 루피가 맞붙었다. 전투 뒤 사람들은 무너진 집과 돌아온 거리의 소리를 먼저 기억했다." },
  { id: "usopp", title: "시럽 마을에서 받은 배", time: "이어서 · 시럽 마을", canon: EAST, places: ["이스트 블루"],
    near: "시럽 마을에 숨어들었던 해적의 계획이 실패했다. 우솝이 루피 일행에 합류하고, 고잉 메리호라는 새 배가 바다로 나섰다.",
    far: "밀짚모자 일행에 우솝이 들어왔다는 이야기가 배와 함께 퍼졌다. 그들의 배 이름은 고잉 메리호였다." },
  { id: "baratie", title: "바라티에의 식탁과 결투", time: "다음 항해 · 바라티에", canon: EAST, places: ["이스트 블루", "바라티에"],
    near: "해상 레스토랑 바라티에에 굶주린 손님과 무장한 배가 함께 몰려들었다. 크리크가 패한 뒤 요리사 상디가 일행에 합류했고, 조로와 미호크의 결투도 선원들의 화제가 됐다.",
    far: "바라티에에서 크리크가 루피에게 패했다. 요리사 상디가 배에 올랐고, 검객 조로는 미호크와의 결투에서 큰 패배를 겪었다." },
  { id: "arlong", title: "코코야시 마을의 아침", time: "그 뒤 · 아론 파크", canon: EAST, places: ["이스트 블루"],
    near: "코코야시 마을을 오래 짓누르던 아론의 지배가 끝났다. 나미가 루피 일행과 떠나는 날, 주민들은 자유가 하루아침에 생활을 고쳐 주지는 않는다는 것도 알았다.",
    far: "루피가 아론 파크에서 아론을 쓰러뜨렸다. 나미의 고향은 지배에서 벗어났고, 그녀는 동료들과 다시 바다로 향했다." },
  { id: "loguetown", title: "로그 타운의 마지막 길목", time: "얼마 뒤 · 로그 타운", canon: EAST, places: ["로그 타운"],
    near: "로저가 처형됐던 로그 타운에 루피의 배가 들렀다. 버기와 스모커가 그를 붙잡으려 했지만 배는 폭풍 사이로 빠져나갔다. 항구에는 누가 도왔는지 묻는 소리가 남았다.",
    far: "이스트 블루를 떠나기 전 루피는 로그 타운에서 버기와 스모커의 추격을 겪었다. 그 배는 결국 위대한 항로로 향했다." },
  { id: "laboon", title: "쌍둥이 언덕의 약속", time: "위대한 항로 입구 · 쌍둥이 언덕", canon: ALABASTA, places: ["쌍둥이 언덕"],
    near: "리버스 마운틴을 넘은 밀짚모자 배가 고래 라분과 부딪힐 뻔했다. 등대지기 크로커스는 오래 기다린 고래의 사정을 말했고, 루피는 돌아오겠다고 약속했다.",
    far: "위대한 항로의 입구에서 루피는 고래 라분에게 다시 만나겠다고 약속했다. 쌍둥이 언덕의 등대는 다음 배에도 여전히 길을 비췄다." },
  { id: "whiskey", title: "위스키 피크의 환영", time: "기록지침을 따라 · 위스키 피크", canon: ALABASTA, places: ["위스키 피크"],
    near: "위스키 피크의 잔치는 현상금 사냥꾼들의 함정으로 드러났다. 왕녀 비비와 바로크 워크스의 이름이 얽히자 부두의 선원들도 화물 명단을 다시 살폈다.",
    far: "위스키 피크에서 밀짚모자 일행은 바로크 워크스의 함정을 겪었다. 비비의 정체가 드러나면서 목적지는 알라바스타로 바뀌었다." },
  { id: "little_garden", title: "리틀 가든의 두 거인", time: "다음 기항 · 리틀 가든", canon: ALABASTA, places: ["리틀 가든"], art: "giant",
    near: "리틀 가든에서 도리와 브로기의 오랜 결투가 다시 울렸다. 바로크 워크스가 그 승부를 더럽히려 했으나 두 거인은 끝내 자기 길을 지켰다.",
    far: "리틀 가든에서 루피 일행은 도리와 브로기, 그리고 바로크 워크스의 방해를 만났다. 두 거인의 결투는 배가 떠난 뒤에도 이어졌다." },
  { id: "drum", title: "드럼섬의 벚꽃", time: "의사를 찾아 · 드럼섬", canon: ALABASTA, places: ["드럼섬"],
    near: "나미의 병 때문에 드럼섬에 닿은 일행은 의사 쿠레하와 쵸파를 만났다. 와포루가 물러난 뒤 눈 덮인 마을에는 히루루크가 꿈꾸던 벚꽃이 피었다.",
    far: "드럼섬에서 루피는 와포루를 물리치고 의사 쵸파를 동료로 얻었다. 섬의 사람들은 다시 치료받을 곳을 찾기 시작했다." },
  { id: "alabasta_war", title: "알라바스타의 내전", time: "그해 · 알라바스타", canon: ALABASTA, places: ["알라바스타"],
    near: "알라바스타에서는 비가 끊긴 뒤 국왕군과 반란군이 서로를 의심했다. 비비가 전쟁을 막으려 달리는 동안, 나노하나의 항구에서도 물과 피난길을 묻는 사람이 늘었다.",
    far: "알라바스타의 내전 소식이 다른 바다에도 닿았다. 비비가 돌아와 싸움을 멈추려 했고, 크로커다일의 바로크 워크스가 뒤에서 움직이고 있었다.",
    choices: [
      { id: "water", label: "피난민에게 물과 배편을 마련한다", cost: 10, risk: "물자 10 필요 · 지역의 신뢰 +10", personality: { empathy: 6 },
        apply: (life) => { life.supplies -= 10; life.trust += 10; return "물을 실은 작은 배가 싸움에서 먼 항구로 사람들을 옮겼다."; } },
      { id: "route", label: "항구에 남아 안전한 길을 기록한다", risk: "기술 +5", personality: { caution: 5 },
        apply: (life) => { life.skill += 5; return "보이는 길과 소문만 있는 길을 따로 표시했다."; } }
    ] },
  { id: "alabasta_end", title: "비비가 남긴 자리", time: "내전 뒤 · 알라바스타", canon: ALABASTA, places: ["알라바스타"],
    near: "루피가 크로커다일을 쓰러뜨리고 알라바스타의 싸움이 멎었다. 비비는 밀짚모자 일행과 헤어져 나라에 남았다. 항구의 일꾼들은 다시 물길과 창고를 손보기 시작했다.",
    far: "크로커다일의 계획이 무너지고 알라바스타의 내전이 끝났다. 왕녀 비비는 동료들과의 항해 대신 백성 곁에 남았다." },
  { id: "jaya", title: "자야에서 들은 하늘 이야기", time: "이어서 · 자야", canon: SKY, places: ["자야", "모크 타운"],
    near: "모크 타운에서는 하늘섬 이야기를 비웃는 사람과 믿는 사람이 한 술집에 앉았다. 루피는 벨라미와 부딪힌 뒤 몽블랑 크리켓의 도움으로 하늘로 가는 해류를 찾았다.",
    far: "자야에서 루피 일행은 몽블랑 크리켓을 만나 하늘섬으로 오르는 방법을 찾았다. 기록지침의 바늘은 여전히 위를 가리켰다." },
  { id: "skypiea_trial", title: "구름 바다의 재판", time: "하늘로 올라 · 스카이피아", canon: SKY, places: ["스카이피아"], art: "sky",
    near: "스카이피아에 닿은 밀짚모자 일행은 에넬의 신관들에게 쫓겼다. 신의 섬을 둘러싼 오래된 갈등까지 겹치자 구름길의 주민들은 어디로 피해야 할지 묻기 시작했다.",
    far: "밀짚모자 일행은 돌출 해류를 타고 스카이피아에 닿았다. 에넬의 지배와 샨디아의 싸움에 휘말렸다는 소식은 아래 바다에 뒤늦게 전해졌다." },
  { id: "skypiea_bell", title: "황금 종이 울린 뒤", time: "그 뒤 · 스카이피아", canon: SKY, places: ["스카이피아"], art: "sky",
    near: "루피가 에넬을 막자 황금 종이 울렸다. 스카이피아 사람들과 샨디아가 오랜 다툼을 멈추는 사이, 주민들은 무너진 길을 다시 이었다.",
    far: "스카이피아에서 에넬이 패하고 황금 종이 울렸다. 자야의 크리켓에게도 하늘에 황금향이 있었다는 답이 닿았다." },
  { id: "davy", title: "롱 링 롱 랜드의 기묘한 경기", time: "푸른 바다로 돌아와 · 롱 링 롱 랜드", canon: "https://one-piece.com/story/davy_back_fight/index.html", places: ["롱 링 롱 랜드"],
    near: "롱 링 롱 랜드에서는 동료를 걸고 벌이는 데이비 백 파이트가 열렸다. 폭시의 느림보 광선보다 시끄러웠던 것은 응원 소리였다. 뒤이어 해군 대장 아오키지가 나타나 분위기가 얼어붙었다.",
    far: "루피 일행은 폭시 해적단과 동료를 건 경기를 치렀다. 얼마 뒤 아오키지와 마주쳐 압도적인 힘의 차이도 겪었다." },
  { id: "water_seven", title: "워터 세븐의 갈라진 마음", time: "다음 기항 · 워터 세븐", canon: WATER, places: ["워터 세븐"], art: "workbench",
    near: "워터 세븐에서 메리호가 더는 항해하기 어렵다는 판정이 나왔다. 우솝이 일행과 갈라지고 로빈마저 사라진 날, 아쿠아 라구나를 대비하던 조선공들은 도시 전체의 배를 묶어야 했다.",
    far: "워터 세븐에서 메리호의 수명을 두고 일행이 갈라졌다. 로빈의 실종과 CP9의 움직임이 겹치며 도시에는 폭풍까지 다가왔다.",
    choices: [
      { id: "repair", label: "동네 배를 묶고 비바람에 대비한다", cost: 10, risk: "물자 10 필요 · 지역의 신뢰 +10", personality: { loyalty: 5 },
        apply: (life) => { life.supplies -= 10; life.trust += 10; return "도시의 큰 사건은 다른 이들이 맡았다. 가까운 부두의 배 몇 척은 물살을 견뎠다."; } },
      { id: "warn", label: "위험한 물길을 이웃에게 알린다", risk: "기술 +5", personality: { caution: 5 },
        apply: (life) => { life.skill += 5; return "어느 골목이 먼저 잠기는지 적은 종이가 손에서 손으로 건너갔다."; } }
    ] },
  { id: "enies_lobby", title: "에니에스 로비의 깃발", time: "로빈을 찾아 · 에니에스 로비", canon: ENIES, places: ["에니에스 로비"],
    near: "로빈을 데려간 CP9을 쫓아 밀짚모자 일행이 에니에스 로비에 들어왔다. 정부의 깃발이 불타고 버스터 콜이 시작되자 섬 밖의 배들도 퇴로를 찾느라 분주했다.",
    far: "밀짚모자 일행이 로빈을 구하려 에니에스 로비에서 CP9과 싸웠다. 정부의 깃발이 불타고 버스터 콜이 울렸지만 일행은 탈출했다." },
  { id: "merry", title: "메리호와 작별한 항구", time: "탈출 뒤 · 워터 세븐", canon: ENIES, places: ["워터 세븐"], art: "workbench",
    near: "돌아온 일행은 고잉 메리호와 작별했다. 프랑키가 만든 새 배 사우전드 써니호가 물에 뜨자, 조선공들은 떠나는 배보다 남겨진 작업장의 빈자리를 먼저 살폈다.",
    far: "에니에스 로비를 벗어난 일행은 메리호를 떠나보냈다. 워터 세븐에서 프랑키가 동료가 되고 새 배 사우전드 써니호가 출항했다." },
  { id: "thriller_shadows", title: "스릴러 바크의 그림자", time: "안개 속 · 스릴러 바크", canon: THRILLER, places: ["스릴러 바크"],
    near: "안개 속 거대한 배 스릴러 바크에서 그림자를 잃은 사람들이 해가 뜨기 전에 숨을 곳을 찾았다. 루피 일행도 브룩과 함께 모리아의 좀비 군단을 상대했다.",
    far: "루피 일행은 스릴러 바크에서 브룩을 만나고 모리아에게 그림자를 빼앗긴 사람들을 보았다. 해가 뜨기 전까지 되찾아야 하는 싸움이었다." },
  { id: "thriller_aftermath", title: "새벽 뒤에도 남은 일", time: "다음 날 · 스릴러 바크", canon: THRILLER, places: ["스릴러 바크"],
    near: "모리아가 패해 그림자들이 돌아왔다. 그러나 쿠마가 나타나면서 승리의 잔치는 잠시 멈췄다. 배를 떠날 때 브룩은 라분과의 오래된 약속을 다시 품었다.",
    far: "모리아가 쓰러지고 빼앗긴 그림자들이 돌아왔다. 쿠마와의 위험한 대치 뒤 브룩이 일행에 합류해 라분을 다시 만날 길을 택했다." },
  { id: "sabaody_auction", title: "샤본디의 경매장", time: "얼마 뒤 · 샤본디 제도", canon: SABAODY, places: ["샤본디 제도"],
    near: "샤본디에는 억대 현상금의 신인 해적들이 모였다. 인어 케이미가 경매장에 끌려갔고, 하치가 총에 맞자 루피가 천룡인을 때렸다. 거리의 사람들은 곧 해군이 온다는 것을 알았다.",
    far: "샤본디 제도의 인신매매 경매장에서 루피가 천룡인을 때렸다. 해군 대장이 움직인다는 소식에 다른 배들까지 출항을 서둘렀다.",
    choices: [
      { id: "evacuate", label: "사람들을 경매장 밖으로 안내한다", risk: "지역의 신뢰 +10", personality: { empathy: 6 },
        apply: (life) => { life.trust += 10; return "싸움의 중심에는 서지 않았다. 길을 잃은 사람들이 부두까지 나오는 데 손을 보탰다."; } },
      { id: "ship", label: "자기 배와 동료의 퇴로를 확보한다", risk: "기술 +5", personality: { caution: 5, loyalty: 3 },
        apply: (life) => { life.skill += 5; return "바늘이 가리키는 섬보다 지금 빠져나갈 물길을 먼저 확인했다."; } }
    ] },
  { id: "sabaody_scatter", title: "흩어진 밀짚모자 일당", time: "그날 · 샤본디 제도", canon: SABAODY, places: ["샤본디 제도"],
    near: "키자루와 파시피스타가 섬을 뒤흔든 뒤 쿠마가 밀짚모자 일당을 한 사람씩 사라지게 했다. 빈 부두에서 남은 배들은 이 일이 패배인지 구조인지조차 알 수 없었다.",
    far: "샤본디에서 쿠마가 밀짚모자 일당을 서로 다른 곳으로 날려 보냈다. 소문만 들은 사람에게는 일당이 완전히 무너진 것처럼 보였다." },
  { id: "amazon_lily", title: "여인섬으로 날아간 루피", time: "흩어진 뒤 · 아마존 릴리", canon: "https://one-piece.com/story/amazon_lily/index.html", places: ["아마존 릴리"],
    near: "아마존 릴리에 낯선 남자 루피가 나타나 여인섬이 소란스러웠다. 보아 핸콕의 도움으로 그는 붙잡힌 형 에이스를 찾아 다시 길을 떠났다.",
    far: "흩어진 루피는 여인섬 아마존 릴리에서 보아 핸콕을 만났다. 에이스의 처형 소식을 듣고 동료를 찾기 전에 임펠 다운으로 향했다." },
  { id: "impel_down", title: "임펠 다운의 열린 문", time: "에이스를 찾아 · 임펠 다운", canon: "https://one-piece.com/story/impel_down/index.html", places: ["임펠 다운"],
    near: "해저 감옥 임펠 다운의 문이 여러 번 열리고 닫혔다. 루피는 에이스를 만나지 못했지만 탈옥한 이들과 함께 군함을 타고 마린포드로 향했다. 감옥의 소동은 주변 항로에도 경계를 불렀다.",
    far: "루피가 임펠 다운에 들어가 에이스를 구하려 했으나 그는 이미 마린포드로 옮겨진 뒤였다. 탈옥한 동료들과 군함을 탄 루피도 전쟁터로 향했다." }
];

// Rule 10 inserts the extra beats after the one they follow; they share its places and art unless they name their own.
const BEATS_V10 = BEATS.flatMap((beat) => [beat, ...(EXTRA_BEFORE[beat.id] || []).map((extra) => ({
  places: beat.places, art: beat.art, canon: beat.canon, near: extra.far, ...extra }))]);
const beatsFor = (life) => life.creationVersion >= 10 ? BEATS_V10 : BEATS;
export const preCanonCount = (life) => beatsFor(life).length;

const presentAt = (life) => life.birth.yearsBeforeCurrent - 2;
const nearby = (life, beat) => beat.places.some((place) => life.location.includes(place));

export function preCanonScene(life) {
  if (life.creationVersion < 5 || life.preCanonStep >= beatsFor(life).length || life.age < presentAt(life) - 1
    || life.seen.includes("life_marineford_news")) return null;
  const beat = beatsFor(life)[life.preCanonStep];
  // Rule 8: scenes on the arc's island come first; the milestone itself closes the arc.
  const arc = arcScene(life, beat, presentAt(life));
  if (arc) return arc;
  const fruitTaken = Boolean(life.people?.fruitOwner);
  // Rule 12 keeps nearby choices when only a fruit changed hands; older rules dropped them and still replay that way.
  const diverged = Boolean(life.worldBranch || fruitTaken && life.creationVersion < 12);
  const choices = !diverged && nearby(life, beat) ? beat.choices : undefined;
  // A taken fruit rewrites only the scenes that show its power; the rest of the canon still happens.
  const body = takenText(life, beat.id) || (life.worldBranch
    ? `원작 기준 기록에는 ${beat.far} ${life.birth.name}의 세계도 같은 길을 갔다고 단정할 수 없다.`
    : nearby(life, beat) ? beat.near : beat.far);
  return { id: `canon_before_${beat.id}`, age: presentAt(life), act: 3, species: "all", yearly: true,
    urgent: true, preCanonBeat: true, manual: !choices, art: beat.art || "deck", title: beat.title,
    timeLabel: fruitTaken || life.worldBranch ? `IF 세계선 · ${beat.time}` : beat.time, canon: beat.canon, body, choices };
}

export function preCanonStatus(life) {
  const beat = beatsFor(life)[life.preCanonStep];
  return beat ? `같은 시기 원작 · ${beat.title}` : "루피와 탈옥한 이들이 마린포드로 향한다.";
}

export const PRE_CANON_BEAT_COUNT = BEATS.length;
