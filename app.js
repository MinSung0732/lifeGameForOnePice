/* ONE SEA, ONE LIFE — original fan-made life simulation rules.
   Original fictional probabilities; not affiliated with 1in8b.life or ONE PIECE rights holders. */
(() => {
  "use strict";

  const STORE = "one-sea-one-life-v2";
  const PAST = "one-sea-past-lives-v2";
  const ROLE_NAMES = ["해적", "해군", "혁명군", "현상금 사냥꾼", "상인", "모험가"];
  const SEAS = [
    { name: "이스트 블루", weight: 34, towns: ["여명항", "바람 언덕 마을", "흰갈매기 부두", "코코넛 해변"], mood: "온화한 바람과 잔잔한 파도" },
    { name: "웨스트 블루", weight: 24, towns: ["검은 종탑 항구", "갈대빛 마을", "자줏빛 섬", "안개 시장"], mood: "길고 깊은 해무" },
    { name: "사우스 블루", weight: 24, towns: ["산호항", "초록 나침반 섬", "태양의 해변", "남풍의 마을"], mood: "뜨거운 태양과 짙은 바다 냄새" },
    { name: "노스 블루", weight: 18, towns: ["서릿빛 항구", "은빛 등대", "차가운 바람 마을", "흰 눈의 부두"], mood: "차가운 바람과 은색 파도" }
  ];
  const FAMILIES = [
    { title: "작은 어촌의 어부 집안", weight: 28, class: "소박한", money: 600, knowledge: 3, bonds: 9, story: "가족은 아침마다 그물을 꿰매며 다음 조업을 준비한다." },
    { title: "평범한 항구 노동자 집안", weight: 24, class: "서민", money: 850, knowledge: 4, bonds: 6, story: "창고와 부두를 오가는 사람들의 땀으로 하루가 이어진다." },
    { title: "작은 상점을 꾸리는 집안", weight: 18, class: "여유로운", money: 1800, knowledge: 10, bonds: 5, story: "장부와 선물 상자, 수많은 여행자의 이야기가 집에 가득하다." },
    { title: "한때 항해하던 선원 집안", weight: 12, class: "불안정한", money: 900, knowledge: 7, bonds: 2, story: "벽에 걸린 낡은 항해도에는 먼 바다의 이야기가 남아 있다." },
    { title: "해군과 연이 있는 집안", weight: 10, class: "안정적인", money: 1350, knowledge: 8, bonds: 5, story: "식탁에서는 늘 정의와 질서에 관한 말이 오간다." },
    { title: "떠돌이 행상 집안", weight: 8, class: "고단한", money: 350, knowledge: 5, bonds: 4, story: "집이라 부를 곳은 자주 바뀌지만 새로운 풍경만큼은 익숙하다." }
  ];
  const NAMES = ["아론", "루카", "미오", "레오", "세나", "유나", "에이든", "카인", "로아", "노아", "리아", "시온", "케이", "란", "엘리"];
  const POWER = ["잉크잉크 열매", "모래시계시계 열매", "거울거울 열매"];
  const ACTIONS = {
    little: [
      ["bond","가족의 품에서 지내기","인연과 행복에 집중"],
      ["study","주변 세상을 배우기","지식과 호기심"],
      ["rest","건강하게 자라기","건강과 안정"],
      ["explore","작은 모험을 꿈꾸기","약간의 위험과 발견"]
    ],
    youth: [
      ["study","책과 지도를 익힌다","지식 중심 성장"],
      ["training","몸을 단련한다","힘과 민첩 성장"],
      ["bond","친구들과 시간을 보낸다","인연과 행복"],
      ["explore","마을 밖을 탐험한다","발견과 위험"]
    ],
    grown: [
      ["training","강해지기 위해 수련","힘·민첩과 패기"],
      ["work","돈과 기반을 마련","베리와 안정"],
      ["bond","소중한 인연을 만나다","관계와 행복"],
      ["explore","새로운 섬과 사건을 좇다","명성과 위험"]
    ]
  };
  const DECISIONS = {
    school: [
      ["learn","학업을 이어간다","지식과 미래의 기회"],
      ["craft","집안의 일을 돕는다","경제와 생존력"],
      ["wander","마을을 돌아다닌다","민첩과 경험"]
    ],
    mentor: [
      ["martial","검술 선생에게 배운다","힘과 민첩"],
      ["navigation","항해사에게 배운다","지식과 항해"],
      ["friendship","친구와 약속을 지킨다","관계와 행복"]
    ],
    career: [
      ["pirate","해적의 깃발을 선택","자유 · 위험 · 보물"],
      ["marine","해군에 입대한다","정의 · 계급 · 안정"],
      ["revolution","혁명군과 뜻을 함께한다","변혁 · 신념 · 잠행"],
      ["hunter","현상금 사냥꾼이 된다","실력 · 현상금 · 생존"]
    ],
    voyage: [
      ["grand","위대한 항로에 도전","큰 위험과 큰 가능성"],
      ["crew","믿을 동료를 모은다","관계와 항해 능력"],
      ["settle","고향에 남아 기반을 닦는다","안정과 재산"],
      ["trade","상인들과 먼 항로를 돈다","베리와 항해 경험"]
    ],
    purpose: [
      ["treasure","전설의 보물을 좇는다","명성 · 위험"],
      ["justice","힘없는 사람들을 돕는다","관계 · 명예"],
      ["family","가족과 친구를 지킨다","행복 · 관계"],
      ["power","누구보다 강해진다","능력치 · 패기"]
    ],
    legacy: [
      ["lead","누군가의 스승이 된다","관계와 유산"],
      ["sail","마지막까지 바다에 남는다","항해와 위험"],
      ["home","돌아갈 집을 만든다","안정과 회복"]
    ],
    retirement: [
      ["retire","조용한 삶으로 물러난다","건강 · 행복"],
      ["command","후배들을 이끈다","명성 · 관계"],
      ["lastsea","끝까지 항해한다","영광 · 위험"]
    ],
    battle: [
      ["strike","정면으로 맞선다","힘 판정 · 강한 보상"],
      ["dodge","회피 후 빈틈을 노린다","민첩 판정 · 피해 감소"],
      ["talk","대화와 협상을 시도한다","지식 판정 · 평화적 해결"],
      ["escape","위험에서 물러난다","민첩 판정 · 생존 우선"]
    ],
    storm: [
      ["brave","폭풍을 가르며 나아간다","민첩 판정 · 큰 위험"],
      ["harbor","가까운 항구로 피항한다","안정 · 작은 손실"],
      ["crewhelp","동료들과 힘을 합친다","인연 판정 · 적은 위험"]
    ],
    fruit: [
      ["eat","악마의 열매를 먹는다","특별한 능력 · 수영 불가"],
      ["sell","수집가에게 판매한다","큰돈 · 능력 포기"],
      ["keep","나중을 위해 보관한다","선택 유예"],
      ["leave","그대로 두고 떠난다","위험 회피"]
    ]
  };
  const ROLE_INFO = {
    "해적": { icon: "☠", pay: 600, risk: .011, desc: "바다의 자유를 택한 항해자" },
    "해군": { icon: "⚖", pay: 1150, risk: .006, desc: "정의의 깃발 아래 선 군인" },
    "혁명군": { icon: "✦", pay: 700, risk: .008, desc: "세상을 바꾸려는 비밀의 투사" },
    "현상금 사냥꾼": { icon: "⚔", pay: 950, risk: .009, desc: "자신의 실력으로 살아남는 추적자" },
    "상인": { icon: "◈", pay: 1450, risk: .003, desc: "거래와 신뢰로 항로를 잇는 사람" },
    "모험가": { icon: "⚓", pay: 560, risk: .007, desc: "미지의 섬을 찾아 떠도는 사람" },
    "평범한 아이": { icon: "✧", pay: 0, risk: 0, desc: "아직 이름 붙지 않은 운명" }
  };

  let s = null;
  let interval = null;
  const $ = id => document.getElementById(id);
  const clamp = (n, low = 0, high = 100) => Math.min(high, Math.max(low, Math.round(n)));
  const fmt = n => Math.round(n).toLocaleString("ko-KR");
  const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const choice = (id, title, help) => ({ id, title, help });
  const options = type => DECISIONS[type].map(x => choice(x[0], x[1], x[2]));
  const float = () => {
    let x = s.seed | 0;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    s.seed = x | 0;
    return (x >>> 0) / 4294967296;
  };
  const rand = (min, max) => min + Math.floor(float() * (max - min + 1));
  const prob = p => float() < p;
  const pick = a => a[Math.floor(float() * a.length)];
  const weighted = arr => {
    const total = arr.reduce((n, item) => n + item.weight, 0);
    let n = float() * total;
    for (const item of arr) { n -= item.weight; if (n < 0) return item; }
    return arr[arr.length - 1];
  };
  function toast(msg) {
    $("toast").textContent = msg;
    $("toast").classList.add("visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => $("toast").classList.remove("visible"), 2600);
  }
  function store() {
    try { if (s) localStorage.setItem(STORE, JSON.stringify(s)); } catch (_) { toast("저장 공간을 사용할 수 없습니다."); }
  }
  function pastLives() {
    try {
      const d = JSON.parse(localStorage.getItem(PAST) || "[]");
      return Array.isArray(d) ? d : [];
    } catch (_) { return []; }
  }
  function record(title, body, tag = "일상") {
    s.journal.unshift({ age: s.age, title, body, tag, beat: s.yearBeat || 0 });
    if (s.journal.length > 550) s.journal.pop();
  }
  function inferArt(tag, title) {
    if (/탄생/.test(tag)) return "birth";
    if (/죽음|마지막|끝/.test(tag + title)) return "farewell";
    if (/열매|능력/.test(tag + title)) return "fruit";
    if (/폭풍|난파/.test(tag + title)) return "storm";
    if (/전투|격돌|싸움/.test(tag + title)) return "battle";
    if (/해군/.test(title)) return "marine";
    if (/해적|깃발/.test(title)) return "pirate";
    if (/혁명군/.test(title)) return "revolution";
    if (/위대한 항로|리버스|항해|수평선/.test(title)) return "grandline";
    if (/학교|배움|글/.test(title)) return "school";
    if (/스승|도장|검술/.test(title)) return "dojo";
    if (/동료|친구|인연/.test(title)) return "friends";
    if (/늙|노년|유산|반세기|서른 살/.test(title)) return "legacy";
    if (/갈림길|지도|결정/.test(tag + title)) return "map";
    if (/유년|가족/.test(tag)) return "home";
    if (/경제|시장/.test(tag + title)) return "market";
    if (/건강/.test(tag)) return "clinic";
    return "island";
  }
  function announce(title, body, note = "", tone = "", tag = "일상", art = null) {
    s.visualUse = s.visualUse || {};
    const category = art || inferArt(tag, title);
    const variant = ((s.visualUse[category] || 0) % 3) + 1;
    s.visualUse[category] = (s.visualUse[category] || 0) + 1;
    s.scene = { title, body, note, tone, art: category, variant, tag };
    record(title, body.slice(0, 180), tag);
  }
  function statsNote(changes) {
    return changes.filter(Boolean).join(" · ");
  }
  function getStage() {
    if (s.age < 6) return "PROLOGUE — CHILDHOOD";
    if (s.age < 16) return "CHAPTER I — THE FIRST HORIZON";
    if (s.age < 30) return "CHAPTER II — FIND YOUR FLAG";
    if (s.age < 50) return "CHAPTER III — THE WIDE SEA";
    if (s.age < 70) return "CHAPTER IV — LEGACY";
    return "EPILOGUE — THE LAST TIDE";
  }
  function stageName() {
    if (s.age < 6) return "유년기";
    if (s.age < 16) return "성장기";
    if (s.age < 30) return "청년기";
    if (s.age < 50) return "장년기";
    if (s.age < 70) return "중년 이후";
    return "노년기";
  }
  function statDelta(key, amount) { s.stats[key] = clamp(s.stats[key] + amount); }
  function changeMoney(amount) { s.money = Math.max(0, Math.round(s.money + amount)); }
  function birth(ev) {
    if (ev) ev.preventDefault();
    stopAuto();
    const mode = document.querySelector('input[name="originMode"]:checked')?.value || "fate";
    const sea = mode === "choose" ? $("selected-sea").value : null;
    const seed = ((Date.now() & 0xffffffff) ^ Math.floor(Math.random() * 0xffffffff)) | 0;
    s = { version: 2, seed: seed || 123456789, createdAt: new Date().toISOString(),
      name: $("player-name").value.trim().slice(0, 22), look: $("player-look").value.trim().slice(0, 100),
      dreamWeapon: $("player-weapon").value.trim().slice(0, 60) || "맨주먹", mode,
      age: 0, sea: "", birthSea: "", hometown: "", family: "",
      familyClass: "", familyStory: "", role: "평범한 아이", rank: "-", weapon: "아직 없음",
      ability: "비능력자", heldFruit: null, haki: "미각성", hakiExp: 0, crew: 0, voyages: 0, wins: 0, grandLine: false,
      stats: { health: 0, happy: 0, knowledge: 0, bonds: 0, strength: 6, agility: 6, toughness: 6 },
      money: 0, bounty: 0, reputation: 0, focus: "study", decisions: [], journal: [], scene: null,
      pending: null, alive: true, deathCause: "", autoChoices: 0, relationName: "", retirement: false,
      kindMode: false, yearBeat: 0, totalMoments: 0, visualUse: {}, recentEvents: [], experience: {}, lifeFlags: {} };
    const origin = sea ? SEAS.find(x => x.name === sea) || SEAS[0] : weighted(SEAS);
    const family = weighted(FAMILIES);
    s.name = s.name || pick(NAMES);
    s.look = s.look || pick(["눈매가 또렷한 아이", "햇빛에 그을린 얼굴", "바람에 헝클어진 머리", "활달한 미소를 가진 아이"]);
    s.sea = origin.name;
    s.birthSea = origin.name;
    s.hometown = pick(origin.towns);
    s.family = family.title;
    s.familyClass = family.class;
    s.familyStory = family.story;
    s.stats = { health: rand(72, 94), happy: rand(57, 82), knowledge: rand(10, 24) + family.knowledge,
      bonds: rand(48, 72) + family.bonds, strength: rand(4, 7), agility: rand(4, 7), toughness: rand(5, 8) };
    s.money = family.money;
    announce("파도 소리와 함께 찾아온 탄생",
      origin.name + "의 " + s.hometown + ". " + origin.mood + "이(가) 창문을 스치던 날, 한 아이가 세상에 태어났다.\n\n" +
      "그 아이의 이름은 " + s.name + ". " + family.title + "에서 자라게 되었고, " + family.story + "\n\n" +
      "아직 그 누구도 이 아이가 누구의 깃발을 들고 어떤 바다에 도달할지 알지 못한다. 이제 그 한 사람의 삶이 시작된다.",
      "⚄ 출신 바다와 가정은 허구의 가중 추첨으로 결정됩니다. | " + s.birthSea + " · " + s.family, "good", "탄생");
    store(); showGame(); toast(s.name + "의 새로운 인생이 시작되었습니다.");
  }
  function revive() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE));
      if (saved && saved.version === 2 && saved.stats && saved.scene && Array.isArray(saved.journal)
          && typeof saved.age === "number" && typeof saved.seed === "number") {
        s = saved;
        s.yearBeat = Number.isInteger(s.yearBeat) && s.yearBeat >= 0 ? s.yearBeat : 0;
        s.totalMoments = Number.isInteger(s.totalMoments) ? s.totalMoments : 0;
        s.visualUse = s.visualUse && typeof s.visualUse === "object" ? s.visualUse : {};
        s.recentEvents = Array.isArray(s.recentEvents) ? s.recentEvents : [];
        s.experience = s.experience && typeof s.experience === "object" ? s.experience : {};
        s.lifeFlags = s.lifeFlags && typeof s.lifeFlags === "object" ? s.lifeFlags : {};
        if (!s.scene.art) {
          s.scene.art = inferArt(s.scene.tag || "일상", s.scene.title);
          s.scene.variant = 1;
        }
        return true;
      }
    } catch (_) {}
    return false;
  }
  function baseActions() {
    let arr = s.age < 6 ? ACTIONS.little : s.age < 16 ? ACTIONS.youth : ACTIONS.grown;
    if (s.retirement && s.age >= 60) {
      arr = [["rest", "여유를 즐기며 쉰다", "건강과 행복"],["bond","사람들을 찾아간다","인연"],["study","삶의 이야기를 기록한다","지식"],["explore","바닷가를 산책한다","작은 모험"]];
    }
    return arr.map(a => choice(...a));
  }
  function createDecision(type, title, body) {
    s.pending = { type, choices: options(type) };
    const art = ({
      school:"school", mentor:"dojo", career:"harbor", voyage:"grandline",
      purpose:"map", legacy:"legacy", retirement:"legacy",
      battle:"battle", storm:"storm", fruit:"fruit"
    })[type] || "map";
    announce(title, body, "결정을 기다리고 있습니다. 이번 갈림길은 직접 선택해야 합니다.", "", "갈림길", art);
    stopAuto();
  }
  function seasonChange(action) {
    const st = s.stats;
    if (action === "study") { statDelta("knowledge", rand(3, 7)); statDelta("happy", -rand(0, 2)); }
    if (action === "training") { statDelta("strength", s.age < 16 ? 1 : rand(1, 2)); statDelta("agility", rand(1, 2)); statDelta("toughness", 1); statDelta("health", -rand(0, 2)); }
    if (action === "bond") { statDelta("bonds", rand(3, 7)); statDelta("happy", rand(2, 5)); }
    if (action === "work") { if (s.age < 12) statDelta("knowledge", 1); else { changeMoney(rand(450, 1500)); statDelta("happy", -rand(0, 3)); } }
    if (action === "explore") { statDelta("agility", rand(1, 2)); statDelta("happy", rand(1, 4)); statDelta("health", -rand(0, 3)); }
    if (action === "rest") { statDelta("health", rand(2, 6)); statDelta("happy", rand(1, 3)); }
    if (s.age < 16) {
      statDelta("knowledge", rand(0, 2));
      if (s.age % 3 === 0) { statDelta("strength", 1); statDelta("agility", 1); statDelta("toughness", 1); }
    } else {
      const role = ROLE_INFO[s.role] || ROLE_INFO["모험가"];
      const wage = rand(Math.round(role.pay * .7), Math.round(role.pay * 1.5));
      changeMoney(wage + Math.round((st.knowledge - 40) * 8));
      if (s.role === "해군" && s.wins >= 3 && s.rank === "해군 이등병") s.rank = "해군 일등병";
      if (s.role === "해군" && s.wins >= 8) s.rank = "해군 하사";
      if (s.age >= 56) statDelta("health", -rand(0, 2));
      if (s.age >= 75) statDelta("health", -rand(1, 3));
      if (s.age > 35 && prob(.25)) statDelta("bonds", -1);
      if (s.age > 20 && action === "training" && s.haki === "미각성" && s.hakiExp < 8) s.hakiExp++;
      if (s.hakiExp >= 5 && s.haki === "미각성" && prob(.13)) { s.haki = "견문색 패기"; record("패기 각성", "오랜 훈련 끝에 견문색 패기를 깨달았다.", "능력"); }
      if (s.haki === "견문색 패기" && s.hakiExp >= 8 && prob(.08)) { s.haki = "견문색 · 무장색 패기"; record("무장색 패기", "무장색 패기까지 익혔다.", "능력"); }
    }
    if (st.health <= 0) return;
    if (s.age > 15 && s.money > 0 && prob(.17)) changeMoney(-rand(100, 600));
  }
  function deathChance(action) {
    let p;
    if (s.age < 1) p = .002;
    else if (s.age < 5) p = .0014;
    else if (s.age < 16) p = .0008;
    else if (s.age < 40) p = .0013;
    else if (s.age < 60) p = .003 + (s.age - 40) * .0003;
    else if (s.age < 75) p = .01 + (s.age - 60) * .002;
    else p = .05 + Math.pow((s.age - 75) / 28, 2) * .36;
    p += Math.max(0, (40 - s.stats.health)) * .0009;
    if (s.age >= 16) p += (ROLE_INFO[s.role] || ROLE_INFO["모험가"]).risk;
    if (action === "explore") p *= 1.5;
    if (action === "rest") p *= .75;
    if (s.retirement) p *= .75;
    return Math.min(.96, p);
  }
  function eventForYear(action, custom) {
    const age = s.age;
    const loc = s.hometown;
    if (age < 6) {
      const events = [
        ["항구의 평범한 오후", "창 너머로 선원들의 웃음소리가 들린다. 아직 세상은 집 앞 골목과 따뜻한 식탁만큼 작다.", "건강"],
        ["낯선 손님이 들려준 이야기", "먼 항해를 마친 방문객이 어른들과 이야기한다. 수평선 너머에는 어마어마한 바다와 기묘한 섬들이 있다고 한다.", "호기심"],
        ["가족의 겨울", "올해는 물고기가 잘 잡히지 않았다. 가족은 서로를 다독이며 궂은 날씨를 버텨낸다.", "가족"],
        ["작은 축제", "마을 광장에서 노래가 들리고, 어린아이들이 종이로 만든 배를 띄운다. 오랫동안 기억할 장면이 된다.", "인연"]
      ];
      const event = pick(events);
      if (event[2] === "건강") statDelta("health", 2);
      if (event[2] === "호기심") statDelta("knowledge", 2);
      if (event[2] === "인연") statDelta("happy", 3);
      announce(event[0], age + "세의 " + s.name + "에게 " + loc + "은(는) 아직 세계의 전부다.\n\n" + event[1], custom ? "직접 선택: " + custom : "한 해가 흘렀습니다.", "good", "유년");
      return;
    }
    if (age < 16) {
      const events = [
        ["지도 가장자리의 낙서", "낡은 지도 한쪽에 존재하지 않는 섬이 그려져 있다. 그것을 그린 항해사는 지금 어디에 있을까?", "knowledge"],
        ["마을 친구와의 약속", "바다가 보이는 둔덕에서 친구와 언젠가 큰 배를 타겠다는 약속을 나눴다.", "bonds"],
        ["소년의 첫 시련", "동네에서 나보다 큰 아이에게 괴롭힘을 당할 뻔했지만 용기 내어 맞섰다.", "strength"],
        ["여름의 큰 파도", "해안에서 급한 물살에 휩쓸릴 뻔했다. 바다 앞에서는 누구나 조심해야 한다는 것을 배웠다.", "health"],
        ["새로 온 선생", "멀리서 온 학자가 도서관에 머문다. 세상의 역사와 네 바다에 관해 들을 수 있었다.", "knowledge"]
      ];
      const event = pick(events);
      statDelta(event[2], event[2] === "health" ? -2 : rand(1, 4));
      announce(event[0], s.name + "은(는) " + age + "세가 되었다.\n\n" + event[1] + "\n\n조금씩 바라보는 세계가 넓어지고 있다.",
        custom ? "직접 행동: " + custom : "올해의 초점: " + focusLabel(action), event[2] === "health" ? "bad" : "good", "성장");
      return;
    }
    if (s.ability === "비능력자" && !s.heldFruit && prob(.018 + (action === "explore" ? .016 : 0))) {
      createDecision("fruit", "소용돌이 문양의 과일", "폐허가 된 선창 바닥 아래에서 소용돌이 무늬가 새겨진 기묘한 과일을 발견했다.\n\n비밀리에 거래되는 악마의 열매일 가능성이 높다. 한입 먹으면 특별한 힘을 얻지만 더 이상 바다에서 헤엄칠 수 없다. 아직 그것이 어떤 능력인지조차 알 수 없다.\n\n당신은 어떻게 하겠는가?");
      return;
    }
    if (!s.retirement && prob((s.role === "해적" || s.role === "현상금 사냥꾼" || s.role === "해군" ? .18 : .10) + (action === "explore" ? .14 : 0))) {
      createDecision("battle", "거센 파도만큼 날카로운 대치", "부두 너머에서 무장한 " + pick(["해적단 잔당", "현상범", "불법 무역상", "검은 코트의 용병"]) + "이(가) 사람들을 위협하고 있다.\n\n당신을 알아본 상대가 다가와 무기를 뽑는다.\n“네가 내 길을 막을 생각인가?”\n\n이 싸움은 승리할 수도, 크게 다칠 수도, 목숨을 잃을 수도 있다.");
      return;
    }
    if (!s.retirement && prob((action === "explore" ? .13 : .04) + (s.grandLine ? .05 : 0))) {
      createDecision("storm", "지평선을 삼킨 검은 폭풍", "갑자기 하늘이 검게 변하고 산처럼 큰 파도가 갑판을 덮친다. 조타수가 소리친다.\n“이대로면 배가 뒤집힙니다!”\n\n앞에는 위험한 해류가 있고, 뒤쪽에는 좁은 피항로가 보인다. 누구에게 조타를 맡길 것인가?");
      return;
    }
    const events = [
      ["바닷바람을 실은 편지", "오래전 알던 이에게서 편지가 도착했다. 단순한 안부만으로도 마음이 한결 따뜻해졌다.", "bonds", 3, "인연"],
      ["짙은 안개 속의 거래", "멀리서 온 상인과 짐을 나누어 운송했다. 좋은 평판 덕분에 적지 않은 보상을 얻었다.", "money", rand(500, 2400), "경제"],
      ["별이 가득한 밤", "갑판 위에 누워 밤하늘을 바라본다. 지금의 삶이 언제까지나 같은 모습은 아닐 것이다.", "happy", 3, "일상"],
      ["선술집의 낯선 이야기", "어느 노인이 위대한 항로에서 살아 돌아온 사람들의 이야기를 들려주었다. 한 줄의 항해도를 머릿속에 새긴다.", "knowledge", 3, "모험"],
      ["뜻밖의 작은 상처", "예상 못 한 사고로 잠시 일을 쉬어야 했다. 몸이 평소만큼 말을 듣지 않는다.", "health", -rand(2, 6), "건강"],
      ["스쳐 간 동료", "새로운 친구 한 명이 당신의 여행에 합류했다. 함께하는 사람은 생각보다 큰 힘이 된다.", "crew", 1, "인연"],
      ["오랜 노력의 결실", "작은 성공이 쌓여 당신의 이름을 아는 사람이 늘어났다. 언젠가 누군가 이 이야기를 전할지 모른다.", "reputation", rand(2, 7), "성취"],
      ["수평선 너머의 섬", "한동안 보지 못했던 색의 해안선이 눈앞에 나타난다. 새로운 항구는 낯설면서도 반갑다.", "voyages", 1, "항해"]
    ];
    const event = pick(events);
    if (event[2] === "money") changeMoney(event[3]);
    else if (event[2] === "crew") s.crew += event[3];
    else if (event[2] === "reputation") s.reputation += event[3];
    else if (event[2] === "voyages") { s.voyages++; if (s.grandLine) s.sea = "위대한 항로"; }
    else statDelta(event[2], event[3]);
    const context = s.role === "해군" ? "해군의 임무를 마친 날" : s.role === "해적" ? "배가 잠시 항구에 머문 날" : "평범한 일상과 여행이 교차하던 날";
    announce(event[0], s.age + "세, " + context + ".\n\n" + event[1] + "\n\n이렇게 한 해가 지나고 또 다음 해가 찾아온다.",
      (custom ? "직접 행동: " + custom + " · " : "") + "올해의 초점: " + focusLabel(action),
      event[3] < 0 ? "bad" : "good", event[4]);
  }
  function focusLabel(id) {
    return ({ study:"배움",training:"수련",bond:"인연",work:"일과 재산",explore:"모험",rest:"휴식" })[id] || "일상";
  }
  // 1 episode/year in early childhood or late old age;
  // up to 3 distinct incidents/year for working-age characters.
  // A complete life usually presents 150-220 multi-step incidents.
  function beatsForAge(age) {
    if (age < 6) return 1;
    if (age < 16) return 2;
    if (age < 50) return 3;
    if (age < 80) return 2;
    return 1;
  }
  function memoryFlavor() {
    const echoes = [
      "잠시 스쳐 간 바람에서 고향 " + s.hometown + "의 냄새가 난다.",
      "어릴 적 들었던 항해 이야기가 문득 떠오른다.",
      "한때는 별일 아니었던 선택들이 지금의 당신을 여기까지 데려왔다.",
      "해 질 무렵, 바다가 또 다른 가능성을 속삭이는 듯하다."
    ];
    if ((s.lifeFlags.family || 0) >= 3) echoes.push("가족에게 들었던 오래된 충고가 아직 마음 한편에 남아 있다.");
    if ((s.lifeFlags.friendship || 0) >= 3) echoes.push("오랜 친구의 얼굴이 떠오른다. 누군가는 당신을 기다리고 있다.");
    if ((s.lifeFlags.navigation || 0) >= 4 && s.age >= 16) echoes.push("누적된 항해 경험 덕분에 파도와 바람의 작은 변화까지 눈에 들어온다.");
    if (s.role === "해군") echoes.push("정의라는 말의 무게는 임무를 거듭할수록 달라지는 것 같다.");
    if (s.role === "해적") echoes.push("당신의 깃발 아래 모인 이들은 당신의 다음 결정을 기다리고 있다.");
    if (s.grandLine) echoes.push("로그 포스의 바늘이 다음 섬의 자기장을 향해 조금씩 움직인다.");
    return pick(echoes);
  }
  function eventForMoment(action, custom = "") {
    const deck = globalThis.OneSeaLifeEvents;
    if (!deck || !deck.events || !deck.select) {
      eventForYear(action, custom);
      return;
    }
    // Dangerous encounters keep the original GM's special choice logic.
    if (s.age >= 16 && s.ability === "비능력자" && !s.heldFruit && prob(action === "explore" ? .026 : .006)) {
      createDecision("fruit", "금지된 소용돌이 문양", "오래된 상자 속에 이상한 과일이 놓여 있다. 악마의 열매일지도 모른다.\n\n능력과 수영할 수 없는 몸 사이에서 당신은 무엇을 선택할 것인가?");
      return;
    }
    if (s.age >= 16 && !s.retirement && prob(action === "explore" ? .063 : .027)) {
      createDecision("battle", "항구 뒤편의 불길한 검 그림자", "무장한 " + pick(["무법자", "현상범", "수상한 경비병", "해적단 잔당"]) + "이(가) 사람들의 길을 막아섰다.\n\n지금 여기서 싸울 것인가, 말로 해결할 것인가, 뒤로 물러설 것인가?");
      return;
    }
    if (s.age >= 16 && !s.retirement && prob(action === "explore" ? .052 : .018)) {
      createDecision("storm", "순식간에 돌변한 바다", "하늘이 어두워지더니 수평선에서 검은 벽처럼 파도가 솟는다. 선체가 크게 흔들리고 모두가 당신을 바라본다.\n\n배를 전진시킬 것인가, 피항할 것인가, 동료와 힘을 합칠 것인가?");
      return;
    }
    const event = deck.select(s, action, float);
    if (!event) { eventForYear(action, custom); return; }
    s.recentEvents.push(event.id);
    if (s.recentEvents.length > 80) s.recentEvents.shift();
    s.experience[event.category] = (s.experience[event.category] || 0) + 1;
    s.pending = { type: "episode", eventId: event.id, choices: event.choices.map(opt => choice(opt.id, opt.title, opt.help)) };
    const prefix = s.age + "세 · " + (s.grandLine ? "위대한 항로" : s.birthSea) + " · " + s.role;
    announce(event.title,
      prefix + "\n\n" + event.story + "\n\n" + (s.totalMoments % 3 === 0 ? memoryFlavor() + "\n\n" : "") +
      "이 순간의 선택은 이후의 삶에도 흔적을 남길 수 있다.",
      (custom ? "직접 행동: " + custom + " · " : "") + "올해의 장면 " + (s.yearBeat || beatsForAge(s.age)) +
      "/" + beatsForAge(s.age) + " · " + focusLabel(action), "", "사건", event.art);
  }
  function applyEpisodeEffects(effects) {
    const changed = [];
    for (const [key, amount] of Object.entries(effects || {})) {
      if (Object.prototype.hasOwnProperty.call(s.stats, key)) statDelta(key, amount);
      else if (key === "money") changeMoney(amount);
      else if (["crew","voyages","wins","reputation","bounty","hakiExp"].includes(key)) {
        s[key] = Math.max(0, (s[key] || 0) + amount);
      }
      changed.push((key === "money" ? "베리" : ({
        bonds:"관계",happy:"행복",knowledge:"지식",health:"건강",strength:"힘",agility:"민첩",toughness:"맷집",
        crew:"동료",voyages:"항해",reputation:"명성",bounty:"현상금",hakiExp:"패기 경험"
      })[key] || key) + " " + (amount > 0 ? "+" : "") + amount);
    }
    return changed;
  }
  function resolveEpisode(id, custom = "") {
    const deck = globalThis.OneSeaLifeEvents;
    const pending = s.pending;
    const event = deck && deck.events.find(e => e.id === pending.eventId);
    if (!event) { s.pending = null; announce("지나온 장면", "이 사건을 계속할 수 없어 다음 이야기로 넘어갔다."); store(); render(); return; }
    const selected = event.choices.find(o => o.id === id) || event.choices[0];
    const stored = (s.lifeFlags[selected.flag] || 0);
    const r = roll(selected.stat, selected.dc, Math.min(3, Math.floor(stored / 3)));
    const changes = applyEpisodeEffects(r.success ? selected.success : selected.failure);
    if (r.success) s.lifeFlags[selected.flag] = stored + 1;
    s.pending = null;
    announce(event.title + (r.success ? " — 작은 결실" : " — 남겨진 흔적"),
      event.story + "\n\n" + "당신은 “" + selected.title + "”을(를) 선택했다. " +
      (r.success ? selected.successText : selected.failureText) + "\n\n" +
      ((s.lifeFlags[selected.flag] || 0) >= 3 ? "비슷한 순간에 쌓아 온 경험이 이번 선택의 밑바탕이 되었다." : "이 사건 또한 당신이 걸어온 길의 일부가 되었다."),
      rollText(r) + " · " + changes.join(" / "), r.success ? "good" : "bad", "선택", event.art);
    if (s.stats.health <= 0) { die("사건 중 입은 치명상"); return; }
    store(); render();
  }
  function advanceYear(action = null, custom = "") {
    if (!s || !s.alive) return;
    if (s.pending) { toast("먼저 인생의 갈림길에서 결정해야 합니다."); stopAuto(); return; }
    action = action || s.focus;
    if (!["study","training","bond","work","explore","rest"].includes(action)) action = "study";
    s.focus = action;
    s.totalMoments = (s.totalMoments || 0) + 1;
    s.yearBeat = (s.yearBeat || 0) + 1;
    // Each action advances a scene, not automatically a year.
    const birthday = s.yearBeat >= beatsForAge(s.age);
    if (birthday) {
      s.age += 1;
      s.yearBeat = 0;
      seasonChange(action);
      if (s.stats.health <= 0) { die("건강 악화"); return; }
      if (s.age >= 102 || prob(deathChance(action))) {
        die(s.age >= 85 ? "평온한 노년의 끝" : s.stats.health < 28 ? "오랜 건강 악화" : "예기치 못한 생의 끝");
        return;
      }
    }
    const milestone = {
      6: ["school", "첫 배움을 선택하는 날", "여섯 살. " + s.hometown + "의 길가에 서 있는 당신에게 세 갈래 길이 보인다.\n\n마을 학교에서 글과 지도를 배울 수도, 가족의 일을 도울 수도, 궁금한 세상을 직접 탐험할 수도 있다."],
      12: ["mentor", "어린 시절의 스승", "열두 살이 되었다. 마을에 머무는 세 명의 어른이 저마다 자신의 이야기를 들려준다.\n\n이 시기에 어떤 일을 배우는지가 먼 훗날의 재능을 결정할지도 모른다."],
      16: ["career", "당신의 깃발은 무엇인가", "열여섯 살. 이제는 자신의 이름을 걸고 세상에 나갈 때다.\n\n해적이 되어 자유를 좇을 것인가, 해군이 되어 정의를 따를 것인가, 혁명군과 세상을 바꿀 것인가, 현상금 사냥꾼으로 실력을 증명할 것인가.\n\n상인이나 모험가의 길도 직접 입력으로 선택할 수 있다."],
      22: ["voyage", "스물둘, 수평선 너머", "몇 해 동안 모은 경험과 인연이 당신을 이곳으로 이끌었다. 위대한 항로에 도전한다는 소문이 항구에 돌고 있다.\n\n바다로 나갈 수도, 동료를 모을 수도, 고향에서 다른 삶을 택할 수도 있다."],
      30: ["purpose", "서른 살, 무엇을 남길 것인가", "서른 번째 생일. 당신은 자신이 지금까지 선택한 길을 돌아본다.\n\n앞으로의 수십 년을 무엇에 바칠 것인가. 자유, 정의, 가족, 강함 중에서 어떤 것을 가장 소중히 여길까?"],
      50: ["legacy", "반세기 동안 이어진 파도", "쉰 살. 젊은 시절의 친구 중 누군가는 떠났고, 누군가는 여전히 함께한다.\n\n이제 자신의 이야기를 다른 사람에게 전할지, 끝까지 바다를 달릴지, 조용한 곳에서 삶을 이어갈지 결정할 때다."],
      65: ["retirement", "오래된 항해도를 접으며", "예순다섯 살. 낡은 항해도를 펼치면 지나온 섬들의 이름이 눈에 들어온다.\n\n이제는 세상을 직접 바꿀 수도, 다음 세대에 자리를 내어줄 수도 있다."]
    };
    if (birthday && milestone[s.age]) {
      const m = milestone[s.age];
      createDecision(m[0], m[1], m[2]); store(); render(); return;
    }
    eventForMoment(action, custom);
    store(); render();
  }
  function roll(stat, difficulty, extra = 0) {
    const dice = rand(1, 20);
    const value = stat === "knowledge" || stat === "bonds" ? Math.floor((s.stats[stat] - 35) / 12)
      : Math.floor((s.stats[stat] - 10) / 2);
    const bonus = value + extra + (s.haki === "미각성" ? 0 : 2);
    const score = dice + bonus;
    return { dice, score, difficulty, success: dice === 20 || (dice !== 1 && score >= difficulty), bonus };
  }
  function rollText(r) {
    return "⚄ D20 " + r.dice + (r.bonus >= 0 ? " + " : " − ") + Math.abs(r.bonus) + " = " + r.score
      + " / 목표 " + r.difficulty + (r.success ? " · 성공" : " · 실패");
  }
  function complete(title, body, note = "", tone = "good", category = "선택") {
    s.pending = null;
    announce(title, body, note, tone, category);
    store(); render();
  }
  function chooseDecision(id, custom = "") {
    if (!s || !s.alive || !s.pending) return;
    const type = s.pending.type;
    if (type === "episode") { resolveEpisode(id, custom); return; }
    let r;
    if (type === "career") {
      const roles = { pirate:"해적", marine:"해군", revolution:"혁명군", hunter:"현상금 사냥꾼",
        merchant:"상인", wanderer:"모험가" };
      const role = roles[id] || "모험가";
      s.role = role;
      s.weapon = s.dreamWeapon;
      s.rank = role === "해군" ? "해군 이등병" : "-";
      s.reputation += 2;
      complete("처음으로 세운 자신의 깃발",
        "당신은 " + role + "의 삶을 선택했다. " + ROLE_INFO[role].desc + ".\n\n" +
        "어린 날 꿈꾸던 " + s.weapon + "을(를) 손에 쥐고 " + s.hometown + "의 부두를 바라본다.\n\n" +
        "이제부터 중요한 것은 어디서 태어났느냐만이 아니다. 어떻게 살아가느냐가 당신의 이름을 만들어 줄 것이다.",
        "새로운 신분: " + role + " · 무기: " + s.weapon, "good", "진로");
      return;
    }
    if (type === "school") {
      if (id === "learn") statDelta("knowledge", 11);
      if (id === "craft") { changeMoney(1400); statDelta("toughness", 2); }
      if (id === "wander") { statDelta("agility", 3); statDelta("happy", 4); }
      complete("처음 고른 작은 길", "마을에서 당신의 첫 번째 중요한 선택이 이루어졌다.\n\n" +
        (id === "learn" ? "글을 익히며 세상을 배웠다." : id === "craft" ? "가족의 일을 도우며 땀의 무게를 알았다." : "호기심을 따라 바람 부는 언덕을 달렸다.") +
        "\n\n선택은 작은 씨앗처럼 앞으로의 인생에 남는다.", "6세의 선택이 능력치에 반영되었습니다."); return;
    }
    if (type === "mentor") {
      if (id === "martial") { statDelta("strength", 4); statDelta("agility", 3); }
      if (id === "navigation") { statDelta("knowledge", 9); s.voyages += 1; }
      if (id === "friendship") { statDelta("bonds", 10); statDelta("happy", 5); }
      complete("잊지 못할 스승과의 만남", "당신은 " +
        (id === "martial" ? "수련장에서 나무 검을 휘두르며 자신을 단련했다." : id === "navigation" ? "밤마다 별과 해류를 읽으며 항해술을 배웠다." : "친구와 함께했던 시간을 무엇보다 소중하게 여겼다.") +
        "\n\n훗날 이 순간이 떠오르는 날이 있을 것이다.", "12세의 선택이 삶에 영향을 주었습니다."); return;
    }
    if (type === "voyage") {
      if (id === "grand") {
        r = roll("agility", 17, Math.min(3, s.crew));
        if (r.success) {
          s.grandLine = true; s.sea = "위대한 항로"; s.voyages += 3; s.reputation += 12;
          complete("리버스 마운틴을 넘다!", "거대한 산을 거슬러 오르는 해류에 배를 맡겼다. 절벽이 코앞까지 다가왔지만 끝내 폭풍 같은 물길을 통과했다.\n\n쌍둥이 곶에 닿은 순간, 새로운 바다가 당신의 인생을 받아들인다.", rollText(r) + " · 위대한 항로 진입!", "good", "항해");
        } else {
          statDelta("health", -rand(12, 22)); changeMoney(-rand(200, 1500));
          complete("리버스 마운틴의 거친 물살", "산을 거슬러 오르는 급류 앞에서 배가 크게 흔들렸다. 간신히 해변으로 돌아왔지만 몸과 배가 상했다.\n\n위대한 항로는 언제든 다시 도전할 수 있는 바다다.", rollText(r) + " · 큰 부상과 수리비", "bad", "항해");
        }
      } else if (id === "crew") {
        s.crew += rand(1, 3); statDelta("bonds", 8);
        complete("같은 배를 타게 된 사람들", "서로 다른 꿈을 꾸는 사람들이 하나의 배 위에서 만났다.\n\n" + s.crew + "명의 동료가 당신을 신뢰하며 다음 여정을 기다리고 있다.", "동료 모집 성공", "good", "인연");
      } else if (id === "trade") {
        changeMoney(rand(3000, 7600)); s.voyages += 2;
        complete("거래의 항로", "무역상들과 함께 작은 항구를 몇 곳이나 돌았다. 거친 바다에서도 협상과 신뢰가 얼마나 중요한지 깨달았다.", "베리 획득 · 항해 경험 +2", "good", "경제");
      } else {
        changeMoney(rand(1000, 3000)); statDelta("health", 5); statDelta("bonds", 4);
        complete("고향에 뿌리 내리는 선택", "고향의 바람은 언제나 낯익다. 수평선 너머의 전설보다 바로 곁의 사람들을 지키며 살아가기로 했다.", "건강과 인연, 안정적인 경제 기반", "good", "일상");
      }
      if (s.stats.health <= 0) die("항해 중 치명상");
      return;
    }
    if (type === "purpose") {
      const effects = {
        treasure: () => { s.reputation += 12; s.voyages += 2; statDelta("health", -6); },
        justice: () => { s.reputation += 7; statDelta("bonds", 12); },
        family: () => { statDelta("happy", 12); statDelta("bonds", 10); },
        power: () => { statDelta("strength", 6); statDelta("agility", 5); s.hakiExp += 3; }
      };
      (effects[id] || effects.family)();
      complete("내 인생의 나침반", "서른 살이 된 당신은 스스로 무엇을 소중히 여기는지 정했다.\n\n" +
        ({treasure:"보물을 찾아 바다 끝까지 나아갈 것이다.",justice:"힘없는 이들을 지키며 살아갈 것이다.",family:"곁에 있는 사람들을 지킬 것이다.",power:"어떤 적 앞에서도 흔들리지 않도록 강해질 것이다."}[id] || "소중한 사람을 지킬 것이다.") +
        "\n\n이 결심은 앞으로의 길 위에 남는다.", "삶의 가치관이 능력치와 명성에 반영되었습니다.", "good", "목표"); return;
    }
    if (type === "legacy") {
      if (id === "lead") { s.crew += 2; statDelta("bonds", 10); s.reputation += 8; }
      if (id === "sail") { s.voyages += 3; s.reputation += 6; statDelta("health", -4); }
      if (id === "home") { statDelta("health", 7); statDelta("happy", 8); s.retirement = true; }
      complete("지나온 시간을 나눌 때", "인생의 절반을 넘어서자 당신의 말을 들으려는 사람들이 생겼다.\n\n누군가는 칼을 물려받고, 누군가는 당신이 들려준 바다 이야기를 기억할 것이다.", "50세의 선택이 앞으로의 인생을 바꿉니다.", "good", "유산"); return;
    }
    if (type === "retirement") {
      if (id === "retire") { s.retirement = true; statDelta("health", 10); statDelta("happy", 10); }
      if (id === "command") { s.reputation += 10; statDelta("bonds", 9); }
      if (id === "lastsea") { s.voyages += 3; s.reputation += 7; statDelta("health", -6); }
      complete("어떤 노년을 선택할 것인가", "바다는 오늘도 그 자리에 있다. 다만 파도를 바라보는 당신의 마음이 조금 달라졌을 뿐이다.\n\n수십 년 동안 쌓인 기억이 미래의 누군가에게 전해질지도 모른다.", "인생의 후반부가 시작되었습니다.", "good", "노년"); return;
    }
    if (type === "fruit") {
      if (id === "eat") {
        const power = s.heldFruit || pick(POWER);
        s.ability = power + " (악마의 열매)";
        s.heldFruit = null; statDelta("strength", 7); statDelta("agility", 5); s.reputation += 10;
        complete("새로운 힘과 바다의 저주", "과일을 한입 베어 문 순간 기이한 맛과 함께 온몸이 뒤틀렸다. 손끝에서 전에는 없던 능력이 흘러나온다.\n\n" + power + "의 힘을 얻었다. 하지만 이제 바다에서 헤엄칠 수 없다.", "악마의 열매 능력 획득 · 힘 +7 · 민첩 +5 · 수영 불가", "good", "능력"); return;
      }
      if (id === "sell") {
        changeMoney(35000); s.heldFruit = null;
        complete("금화가 담긴 무거운 자루", "힘 대신 새로운 기회를 택했다. 수집가는 열매를 받고 커다란 돈주머니를 내려놓았다.\n\n앞으로의 삶은 당신에게 달려 있다.", "35,000 베리 획득", "good", "경제"); return;
      }
      if (id === "keep") {
        s.heldFruit = pick(POWER);
        complete("아직 열지 않은 가능성", "열매를 조심히 천으로 감쌌다. 언젠가 다시 결정을 내려야 할 때가 올 것이다.\n\n자유 행동에 '보관한 열매를 먹는다' 또는 '열매를 판다'라고 입력하면 사용할 수 있다.", "가방에 악마의 열매 보관", "good", "능력"); return;
      }
      complete("바다에 남겨 둔 비밀", "당신은 낯선 힘을 쫓는 대신 지금 가진 것들을 믿기로 했다. 과일은 다시 바닷바람 속에 남았다.", "열매를 포기했습니다.", "", "능력"); return;
    }
    if (type === "battle") {
      if (id === "escape") {
        r = roll("agility", 12, Math.min(2, s.crew));
        if (r.success) { complete("살아남은 사람의 선택", "때로는 이기는 것보다 살아남는 일이 중요하다. 빠르게 몸을 숨겨 피 한 방울 흘리지 않고 현장을 벗어났다.", rollText(r) + " · 무사히 퇴각", "good", "전투"); return; }
      } else if (id === "talk") {
        r = roll("knowledge", 14);
        if (r.success) { statDelta("bonds", 4); s.reputation += 3; complete("칼을 뽑지 않은 승리", "상대의 사정을 듣고 서로 양보할 길을 찾았다. 사람들은 아무도 다치지 않은 것을 보고 안도했다.", rollText(r) + " · 협상 성공", "good", "전투"); return; }
      } else {
        r = roll(id === "dodge" ? "agility" : "strength", id === "dodge" ? 12 : 14, Math.min(3, s.crew) + (s.ability !== "비능력자" ? 2 : 0));
        if (r.success) {
          const reward = rand(1300, 6000) + (id === "strike" ? 1200 : 0);
          s.wins++; s.reputation += 7; changeMoney(reward);
          if (s.role === "해적" || s.role === "혁명군") s.bounty += rand(10, 40) * 1000;
          if (s.role === "해군" && s.wins >= 5) s.rank = "해군 하사";
          complete("항구에 퍼지는 승전 소식", "당신의 판단이 정확했다. 적은 물러났고 사람들은 어깨에 힘이 들어간 당신을 바라본다.\n\n누군가 조용히 당신의 이름을 기억한다. 바다는 이 작은 승리마저 오래 전할 것이다.", rollText(r) + " · " + fmt(reward) + " 베리 획득" + (s.bounty ? " · 현상금 " + fmt(s.bounty) : ""), "good", "전투"); return;
        }
      }
      const loss = rand(8, id === "dodge" ? 17 : 26);
      statDelta("health", -loss); changeMoney(-rand(0, 1100));
      complete("남겨진 상처", "상대가 생각보다 강했다. 잠시 균형을 잃은 사이 날카로운 공격을 받아 몸이 크게 상했다.\n\n당신은 간신히 몸을 추슬러 현장을 빠져나왔다.", rollText(r) + " · 건강 -" + loss, "bad", "전투");
      if (s.stats.health <= 0) die("전투에서 입은 치명상");
      return;
    }
    if (type === "storm") {
      if (id === "harbor") {
        changeMoney(-rand(300, 1800)); statDelta("health", 1);
        complete("피항한 저녁", "무리하게 맞서기보다 가까운 항구로 방향을 돌렸다. 며칠의 지체와 수리비가 들었지만 아무도 크게 다치지 않았다.", "항해 연기 · 수리비 지출", "good", "항해"); return;
      }
      const stat = id === "crewhelp" ? "bonds" : "agility";
      r = roll(stat, id === "crewhelp" ? 13 : 16, Math.min(4, s.crew));
      if (r.success) {
        s.voyages += 2; s.reputation += 5;
        complete("폭풍을 뚫고 나온 깃발", "거친 파도에 돛이 찢어졌지만 끝내 새벽의 빛이 드러났다. 갑판 위 사람들의 환호가 폭풍의 마지막 소리를 삼켰다.", rollText(r) + " · 항해 경험 +2 · 명성 상승", "good", "항해");
      } else {
        const damage = rand(7, 20);
        statDelta("health", -damage); changeMoney(-rand(300, 2300));
        complete("부서진 돛과 아침의 바다", "작은 판단 실수로 파도가 배를 휩쓸었다. 당신은 간신히 떠 있는 목재를 붙잡고 가까운 섬까지 떠밀려 왔다.", rollText(r) + " · 건강 -" + damage + " · 재산 손실", "bad", "항해");
        if (s.stats.health <= 0) die("폭풍 속 난파");
      }
      return;
    }
  }
  function die(cause) {
    if (!s || !s.alive) return;
    stopAuto();
    s.alive = false; s.pending = null; s.deathCause = cause;
    const achievement = s.grandLine ? "위대한 항로에 자신의 발자국을 남겼다."
      : s.role === "해군" ? "자신이 믿는 정의의 길을 걸었다."
      : s.wins > 4 ? "많은 싸움 속에서도 뜻을 굽히지 않았다."
      : s.stats.bonds >= 70 ? "사랑하는 사람들의 기억 속에 남았다."
      : "어떤 유명한 항구에도 쓰이지 않은 소중한 인생을 살았다.";
    s.epitaph = achievement;
    announce("하나의 인생, 마지막 파도",
      s.name + "의 " + s.age + "년이 지나갔다.\n\n" +
      cause + "으로 그 여정은 마침내 끝을 맺었다.\n\n" + achievement +
      "\n\n위대한 항로의 역사에 이름이 남지 않아도, 이 삶은 그 자체로 단 한 번뿐이었다.",
      "인생 종료 · " + s.age + "세 · " + cause, "", "끝");
    const history = pastLives();
    if (!history.some(x => x.id === s.createdAt)) {
      history.unshift({ id:s.createdAt, name:s.name, age:s.age, role:s.role, sea:s.birthSea,
        cause, money:s.money, bounty:s.bounty, reputation:s.reputation, wins:s.wins,
        voyages:s.voyages, crew:s.crew, grandLine:s.grandLine, epilogue:s.epitaph, journal:s.journal.slice().reverse() });
      try { localStorage.setItem(PAST, JSON.stringify(history.slice(0, 12))); } catch (_) {}
    }
    store(); render(); toast(s.name + "의 생애가 기록되었습니다.");
  }
  function handleChoice(id) {
    if (!s || !s.alive) return;
    if (s.pending) chooseDecision(id);
    else advanceYear(id);
  }
  function customAction(text) {
    if (!s || !s.alive) return;
    const t = text.trim();
    if (!t) return;
    if (/^[1-4]$/.test(t)) {
      const list = s.pending ? s.pending.choices : baseActions();
      if (list[Number(t)-1]) { handleChoice(list[Number(t)-1].id); return; }
    }
    if (s.pending) {
      const p = s.pending.type;
      if (p === "episode") {
        const all = s.pending.choices;
        const best = all.find(c => t.includes(c.title)) ||
          (/함께|돕|나누|듣|이야기/.test(t) ? all[1] : /직접|달리|올라|쫓|싸우|조타/.test(t) ? all[2] : all[0]);
        chooseDecision(best.id, t);
        return;
      }
      if (p === "career") {
        if (/상인|무역|장사/.test(t)) { chooseDecision("merchant", t); return; }
        if (/모험가|탐험가|여행/.test(t)) { chooseDecision("wanderer", t); return; }
        if (/해군/.test(t)) { chooseDecision("marine", t); return; }
        if (/혁명군/.test(t)) { chooseDecision("revolution", t); return; }
        if (/현상금/.test(t)) { chooseDecision("hunter", t); return; }
        if (/해적/.test(t)) { chooseDecision("pirate", t); return; }
      }
      if (p === "battle") {
        chooseDecision(/도망|후퇴|피하|도주/.test(t) ? "escape" : /협상|설득|대화/.test(t) ? "talk" : /회피|재빠르|기습/.test(t) ? "dodge" : "strike", t); return;
      }
      if (p === "fruit") {
        chooseDecision(/먹/.test(t) ? "eat" : /팔|판매/.test(t) ? "sell" : /보관|간직/.test(t) ? "keep" : "leave", t); return;
      }
      if (p === "storm") { chooseDecision(/피항|항구|돌아/.test(t) ? "harbor" : /동료|함께/.test(t) ? "crewhelp" : "brave", t); return; }
      toast("지금은 선택지 중 하나를 골라야 합니다. 숫자 1~4로도 선택할 수 있어요."); return;
    }
    if (s.age >= 16 && /리버스|위대한 항로|그랜드 라인/.test(t)) {
      s.pending = { type:"voyage", choices: options("voyage") };
      chooseDecision("grand", t);
      return;
    }
    if (s.age >= 16 && /해군.*입대|해군이 되|해군으로 전향|해적.*되|해적단.*결성|혁명군.*가입|혁명군이 되|현상금 사냥꾼.*되|상인.*되|모험가.*되/.test(t)) {
      const role = /해군/.test(t) ? "해군" : /해적/.test(t) ? "해적" : /혁명군/.test(t) ? "혁명군"
        : /현상금/.test(t) ? "현상금 사냥꾼" : /상인/.test(t) ? "상인" : "모험가";
      s.role = role;
      s.rank = role === "해군" ? "해군 이등병" : "-";
      s.reputation += 1;
      announce("새로운 깃발을 택하다", "이전까지 걸어온 길을 뒤로하고 " + role + "의 신분으로 새로운 장을 연다.\n\n이 선택이 쉬웠던 것은 아니다. 하지만 바다는 오늘도 당신에게 새로운 가능성을 보여 준다.", "신분 변경: " + role, "good", "진로");
      store(); render(); return;
    }
    if (s.age >= 16 && /동료.*모집|선원.*구|동료.*찾|선원.*모집/.test(t)) {
      const r = roll("bonds", 12, Math.min(3, s.reputation / 20 | 0));
      if (r.success) { s.crew++; statDelta("bonds", 3); announce("새로운 동료와의 약속", "당신의 이야기를 들은 항해자가 두 눈을 빛낸다.\n\n“좋아, 네 배에 나도 타겠어!”\n\n함께할 사람이 한 명 늘었다.", rollText(r) + " · 동료 +1", "good", "인연"); }
      else { changeMoney(-300); announce("쉽지 않은 동료 모집", "모집을 위해 사람들을 만났지만 아직 마음이 맞는 이가 없었다. 당신은 다음 기회를 기다리기로 했다.", rollText(r) + " · 모집 실패", "bad", "인연"); }
      store(); render(); return;
    }
    if (s.age >= 16 && /수배범.*추적|현상범.*추적|적.*공격|전투.*시작|해적.*습격/.test(t)) {
      createDecision("battle", "위험한 인물과 마주하다", "당신은 직접 위험을 찾아 나섰다. 창고 뒤편에서 무장한 무법자가 길을 막아섰다.\n\n“넌 누구지? 내 앞을 막겠다는 거냐?”");
      store(); render(); return;
    }
    if (s.heldFruit && /열매.*먹|먹.*열매/.test(t)) {
      s.pending = { type:"fruit", choices: options("fruit") }; chooseDecision("eat", t); return;
    }
    if (s.heldFruit && /열매.*팔|팔.*열매/.test(t)) {
      s.pending = { type:"fruit", choices: options("fruit") }; chooseDecision("sell", t); return;
    }
    const action = /쉬|휴식|치료|잠/.test(t) ? "rest"
      : /검술|수련|훈련|패기|운동|싸움/.test(t) ? "training"
      : /공부|지식|책|읽|지도|학업|배우/.test(t) ? "study"
      : /친구|가족|연애|사랑|동료|인연/.test(t) ? "bond"
      : /일|돈|거래|팔|장사|상업|벌/.test(t) ? "work"
      : "explore";
    advanceYear(action, t);
  }
  function render() {
    const active = !!s;
    $("landing").classList.toggle("hidden", active);
    $("game").classList.toggle("hidden", !active);
    $("new-life-link").classList.toggle("hidden", !active);
    $("resume-life").classList.toggle("hidden", !(s && s.alive));
    $("birth-form").setAttribute("data-saved", s && s.alive ? "yes" : "no");
    renderHistory();
    if (!active) return;
    $("scene-chapter").textContent = getStage() + " · EPISODE " + String((s.totalMoments || 0)+1).padStart(3,"0");
    $("age-pill").textContent = s.age + "세 · " + stageName() + " · " +
      Math.max(1, s.yearBeat || 1) + "/" + beatsForAge(s.age);
    $("place-tag").textContent = (s.grandLine ? "GRAND LINE" : s.sea.toUpperCase()) + " · " + s.hometown;
    $("scene-title").textContent = s.scene.title;
    $("scene-story").textContent = s.scene.body;
    $("mobile-brief-name").textContent = s.name + " · " + s.age + "세";
    $("mobile-brief-health").textContent = "♥ " + s.stats.health + "/100";
    $("mobile-brief-money").textContent = fmt(s.money) + " 베리";
    const kind = /^[a-z]+$/.test(s.scene.art || "") ? s.scene.art : "island";
    const variant = [1,2,3].includes(Number(s.scene.variant)) ? Number(s.scene.variant) : 1;
    // Prefer embedded art in the standalone Android/iOS file build.
    // Without this fallback, content:// documents cannot load adjacent SVG files.
    const embedded = globalThis.OneSeaOfflineScenes?.[kind + "-" + variant];
    $("scene-image").src = embedded
      ? "data:image/svg+xml;charset=utf-8," + encodeURIComponent(embedded)
      : "./assets/scenes/" + kind + "-" + variant + ".svg";
    $("scene-image").alt = "사건 장면: " + s.scene.title + " (" + kind + " 삽화 " + variant + ")";
    const note = $("scene-outcome");
    note.className = "outcome" + (s.scene.tone ? " " + s.scene.tone : "") + (!s.scene.note ? " hidden" : "");
    note.textContent = s.scene.note;
    $("life-stage-text").textContent = s.age + "세 · " + stageName() + " · 올해 " + (s.yearBeat || 0) +
      "/" + beatsForAge(s.age) + " 장면 진행";
    $("life-progress").style.width = Math.min(100, s.age + (s.yearBeat || 0) / beatsForAge(s.age)) + "%";
    $("focus-select").value = s.focus;
    $("next-year").disabled = !s.alive || !!s.pending;
    $("auto-button").disabled = !s.alive || !!(s.pending && s.pending.type !== "episode");
    $("next-year").textContent = s.pending ? "먼저 사건을 선택하세요" : "⏭ 다음 사건 만나기";
    $("choices-wrap").classList.toggle("hidden", !s.alive);
    $("ending-panel").classList.toggle("hidden", s.alive);
    $("birth-record").classList.toggle("hidden", s.alive);
    $("choices-label").textContent = s.pending
      ? s.pending.type === "episode" ? "이 사건에서 당신은 어떻게 행동할까요?" : "운명의 갈림길 — 당신의 결정은?"
      : "다음 장면에 어떤 시간을 쓸까요?";
    const arr = s.pending ? s.pending.choices : baseActions();
    $("actions").innerHTML = arr.slice(0, 4).map((a, i) =>
      '<button class="action" type="button" data-id="' + esc(a.id) + '"><span class="action-num">' + (i+1) +
      '</span><span><strong>' + esc(a.title) + '</strong><small>' + esc(a.help) + '</small></span></button>').join("");
    if (!s.alive) {
      $("ending-panel").innerHTML =
        '<div class="eyebrow">THE LAST PAGE</div><div class="end-age">' + s.age + ' YEARS</div>' +
        '<h3>' + esc(s.name) + '의 마지막 항해</h3><p>삶의 끝: ' + esc(s.deathCause) +
        '<br>마지막 신분: ' + esc(s.role) + '<br>' + esc(s.epitaph || "") + '</p>' +
        '<div class="buttons"><button type="button" class="gold-btn" data-new-life="yes">↻ 다시 태어나기</button>' +
        '<button type="button" class="outline-btn" data-history="yes">지난 인생 보기</button></div>';
      $("birth-record").innerHTML =
        '<h3>◈ 생애 결산</h3><p>출신: <strong>' + esc(s.birthSea) + '</strong> · 가족: <strong>' + esc(s.family) +
        '</strong><br>최종 신분: <strong>' + esc(s.role) + '</strong> · 패기: ' + esc(s.haki) +
        '<br>능력: ' + esc(s.ability) + '<br>명성: ' + s.reputation + ' · 현상금: ' + fmt(s.bounty) +
        ' 베리<br>재산: ' + fmt(s.money) + ' 베리 · 동료 ' + s.crew +
        '명 · 항해 ' + s.voyages + '회 · 전투 승리 ' + s.wins + '회</p>';
    }
    renderProfile();
    renderJournal();
  }
  function meter(label, value, className) {
    return '<div class="stat-row"><div class="stat-top"><span>' + label + '</span><strong>' + value +
      '/100</strong></div><div class="meter ' + className + '"><span style="width:' + clamp(value) + '%"></span></div></div>';
  }
  function renderProfile() {
    const v = s.stats;
    $("profile").innerHTML =
      '<div class="char-name">' + esc(s.name) + '</div><div class="char-role">' +
      esc(s.role) + ' · ' + esc(s.sea) + ' · ' + s.age + '세</div>' +
      meter("♥ 건강", v.health, "heart") + meter("✦ 행복", v.happy, "") +
      meter("▤ 지식", v.knowledge, "mind") + meter("◈ 관계", v.bonds, "bond") +
      '<div class="numbers"><div class="number"><small>소지금</small><strong>' + fmt(s.money) + ' B</strong></div>' +
      '<div class="number"><small>명성</small><strong>' + fmt(s.reputation) + '</strong></div>' +
      '<div class="number"><small>힘 / 민첩</small><strong>' + v.strength + ' / ' + v.agility + '</strong></div>' +
      '<div class="number"><small>맷집 / 동료</small><strong>' + v.toughness + ' / ' + s.crew + '</strong></div></div>' +
      '<dl class="details">' +
      '<div><dt>출신 바다</dt><dd>' + esc(s.birthSea) + '</dd></div>' +
      '<div><dt>가정</dt><dd>' + esc(s.family) + '</dd></div>' +
      '<div><dt>현재 신분</dt><dd>' + esc(s.role) + (s.role === "해군" ? " · " + esc(s.rank) : "") + '</dd></div>' +
      '<div><dt>현상금</dt><dd>' + fmt(s.bounty) + ' 베리</dd></div>' +
      '<div><dt>악마의 열매</dt><dd>' + esc(s.ability) + (s.heldFruit ? " · 보관 1개" : "") + '</dd></div>' +
      '<div><dt>패기</dt><dd>' + esc(s.haki) + '</dd></div>' +
      '<div><dt>무기</dt><dd>' + esc(s.weapon) + '</dd></div>' +
      '<div><dt>특징</dt><dd>' + esc(s.look) + '</dd></div>' +
      '<div><dt>위대한 항로</dt><dd>' + (s.grandLine ? "진입 성공" : "미진입") + '</dd></div>' +
      '</dl>';
  }
  function renderJournal() {
    $("journal").innerHTML = s.journal.slice(0, 12).map(x =>
      '<div class="entry"><small>' + x.age + '세 · ' + esc(x.tag) + '</small><strong>' + esc(x.title) +
      '</strong>' + esc(x.body).slice(0, 90) + (x.body.length > 90 ? "…" : "") + '</div>').join("");
  }
  function renderHistory() {
    const entries = pastLives();
    $("history-list").innerHTML = entries.length ? entries.slice(0, 9).map(x =>
      '<button class="history-card" type="button" data-past="' + esc(x.id) + '">' +
      '<span class="small">' + esc(x.sea) + ' · ' + esc(x.role) + '</span><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:7px">' +
      '<strong>' + esc(x.name) + '</strong><span class="age">' + x.age + '세</span></div>' +
      '<span class="small">' + esc(x.cause) + ' · ' + fmt(x.money) + ' 베리</span></button>').join("")
      : '<p class="empty">아직 완주한 인생이 없습니다. 첫 삶을 시작해 보세요.</p>';
  }
  function scrollToNewStory() {
    // On narrow screens the player is typically scrolled down to the choice buttons.
    // Bring the next scene into view, without moving the desktop page unnecessarily.
    if (window.matchMedia && window.matchMedia("(max-width: 720px)").matches) {
      $("scene-title").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  function showGame() {
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function showLanding() {
    stopAuto();
    $("landing").classList.remove("hidden");
    $("game").classList.add("hidden");
    renderHistory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function stopAuto() {
    if (interval != null) clearInterval(interval);
    interval = null;
    const btn = $("auto-button");
    if (btn) { btn.textContent = "▷ 자동 진행"; btn.classList.remove("active"); btn.setAttribute("aria-pressed", "false"); }
  }
  function toggleAuto() {
    if (interval != null) { stopAuto(); return; }
    if (!s || !s.alive || (s.pending && s.pending.type !== "episode")) {
      toast("중요한 갈림길은 직접 결정해야 합니다."); return;
    }
    const ms = Number($("speed-select").value) || 9000;
    $("auto-button").textContent = "❚❚ 일시정지";
    $("auto-button").classList.add("active");
    $("auto-button").setAttribute("aria-pressed", "true");
    interval = setInterval(() => {
      if (!s || !s.alive || $("game").classList.contains("hidden")) { stopAuto(); return; }
      if (s.pending) {
        if (s.pending.type !== "episode") { stopAuto(); return; }
        const list = s.pending.choices;
        const index = s.focus === "bond" ? 1 : s.focus === "training" || s.focus === "explore" ? 2 : 0;
        chooseDecision((list[index] || list[0]).id);
      } else {
        advanceYear(s.focus);
      }
      if (!s.alive || (s.pending && s.pending.type !== "episode")) stopAuto();
    }, ms);
  }
  function newLife() {
    if (!s || !s.alive || window.confirm("현재 진행 중인 인생을 끝내고 새로 태어나시겠습니까? 진행 중인 인생은 자동 기록에 남지 않습니다.")) {
      stopAuto();
      s = null;
      try { localStorage.removeItem(STORE); } catch (_) {}
      render(); showLanding();
    }
  }
  function viewHistory(id) {
    const h = pastLives().find(x => x.id === id);
    if (!h) return;
    const details = [h.name + " · " + h.age + "세", h.sea + " 출생 / " + h.role,
      "삶의 끝: " + h.cause, "명성 " + h.reputation + " · 현상금 " + fmt(h.bounty) + " 베리",
      h.epilogue, "", "주요 생애 기록"];
    for (const item of (h.journal || []).filter(x => x.tag !== "일상").slice(-14)) details.push(item.age + "세: " + item.title);
    window.alert(details.join("\n"));
  }
  function exportLife() {
    if (!s) return;
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "one-sea-life-" + s.age + "-" + Date.now() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast("인생 기록을 JSON으로 저장했습니다.");
  }
  document.addEventListener("DOMContentLoaded", () => {
    $("birth-form").addEventListener("submit", birth);
    document.querySelectorAll('input[name="originMode"]').forEach(input => {
      input.addEventListener("change", () => {
        const choose = document.querySelector('input[name="originMode"]:checked')?.value === "choose";
        $("choose-sea-field").classList.toggle("hidden", !choose);
        $("choose-sea-field").hidden = !choose;
      });
    });
    $("resume-life").addEventListener("click", () => s && showGame());
    $("history-link").addEventListener("click", () => { showLanding(); $("history-section").scrollIntoView({ behavior:"smooth" }); });
    $("brand").addEventListener("click", ev => { ev.preventDefault(); showLanding(); });
    $("new-life-link").addEventListener("click", newLife);
    $("next-year").addEventListener("click", () => {
      advanceYear();
      scrollToNewStory();
    });
    $("auto-button").addEventListener("click", toggleAuto);
    $("speed-select").addEventListener("change", () => { if (interval != null) { stopAuto(); toggleAuto(); } });
    $("focus-select").addEventListener("change", () => { if (s) { s.focus = $("focus-select").value; store(); } });
    $("actions").addEventListener("click", ev => {
      const btn = ev.target.closest("button[data-id]");
      if (btn) {
        stopAuto();
        handleChoice(btn.getAttribute("data-id"));
        scrollToNewStory();
      }
    });
    $("mobile-dock").addEventListener("click", ev => {
      const button = ev.target.closest("button[data-jump]");
      if (!button) return;
      const targetId = button.getAttribute("data-jump");
      if (!["scene-title", "choices-wrap", "profile-card", "journal-card"].includes(targetId)) return;
      $(targetId).scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("free-action-form").addEventListener("submit", ev => {
      ev.preventDefault();
      const input = $("free-action");
      const t = input.value.trim();
      input.value = "";
      if (t) {
        stopAuto();
        input.blur?.();
        customAction(t);
        scrollToNewStory();
      }
    });
    $("clear-history").addEventListener("click", () => {
      if (window.confirm("완료한 모든 인생 기록을 삭제하시겠습니까? 되돌릴 수 없습니다.")) {
        try { localStorage.removeItem(PAST); } catch (_) {}
        renderHistory(); toast("지난 인생 기록을 비웠습니다.");
      }
    });
    $("history-list").addEventListener("click", ev => {
      const card = ev.target.closest("[data-past]");
      if (card) viewHistory(card.getAttribute("data-past"));
    });
    $("ending-panel").addEventListener("click", ev => {
      if (ev.target.closest("[data-new-life]")) newLife();
      if (ev.target.closest("[data-history]")) { showLanding(); $("history-section").scrollIntoView({ behavior:"smooth" }); }
    });
    $("export-life").addEventListener("click", exportLife);
    revive(); render();
    if (s) showLanding();
  });
})();