/* GRAND LINE — single-player, browser-only, unofficial fan text RPG */
(function () {
  "use strict";
  var KEY = "grand-line-rpg-v1";
  var state = null;
  var locations = {
    "이스트 블루": ["새벽항", "해초섬", "갈매기 항구", "붉은 등대섬", "바람개비 마을"],
    "웨스트 블루": ["황혼의 부두", "안개섬", "포도빛 항구", "검은 암초섬", "백조 마을"],
    "사우스 블루": ["산호항", "비취섬", "남풍의 마을", "초록 등대섬", "불꽃 항구"],
    "노스 블루": ["설원항", "은빛 만", "서리섬", "북쪽 등대섬", "푸른 지붕 마을"],
    "위대한 항로": ["쌍둥이 곶", "별무리섬", "안개의 왕관섬", "시계바늘 항구", "황금빛 암초"]
  };
  var roleOpening = {
    "해적": "가슴속에는 아직 아무도 보지 못한 자유의 깃발이 펄럭인다. 사람들은 바다를 두려워하지만 당신은 그 너머를 꿈꾼다.",
    "해군": "정의를 상징하는 군복이 어깨에 묵직하게 내려앉는다. 당신에게 이 바다는 지켜야 할 약속이자 시험대다.",
    "혁명군": "당신에게는 바꿔야 할 세상이 있다. 이 바다의 작은 항구에도 불의에 맞서려는 목소리들이 숨어 있다.",
    "현상금 사냥꾼": "현상 수배서 한 장이 밥값이 되고, 실력 하나가 생사를 가른다. 당신은 오늘도 사냥감을 찾는다.",
    "상인": "보물보다 값진 것은 좋은 거래와 믿을 만한 인연. 당신의 장부에는 아직 수많은 빈 페이지가 남아 있다.",
    "모험가": "누구의 명령도, 어떤 깃발도 당신을 묶지 못한다. 수평선 너머에는 이름조차 없는 이야기가 기다린다."
  };

  function $(id) { return document.getElementById(id); }
  function html(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function fmt(n) { return Math.round(n).toLocaleString("ko-KR"); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function random(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function toast(msg) {
    $("toast").textContent = msg;
    $("toast").classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { $("toast").classList.remove("show"); }, 2700);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast("브라우저에 기록을 저장할 수 없습니다."); } }
  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      if (data && data.version === 1 && typeof data.name === "string" && data.stats && Array.isArray(data.log) && data.scene) { state = data; return true; }
    } catch (e) { /* Corrupted save is ignored. */ }
    return false;
  }
  function choices(items) {
    return items.map(function (item) { return { kind: item[0], label: item[1], tip: item[2] }; });
  }
  function baseChoices() {
    if (state && state.grandLine) return choices([["explore","미지의 섬 탐색","숨겨진 장소와 보물"],["rumor","정보 수집","의뢰와 소문"],["market","상점과 선술집","장비와 보급"],["sail","다음 섬으로 항해","새로운 항로 개척"]]);
    if (state && state.voyages >= 3) return choices([["explore","섬 안쪽을 탐험","보물과 흔적 찾기"],["rumor","사건과 의뢰 수색","현상금과 단서"],["market","항구 정비","물자 구매와 휴식"],["mountain","리버스 마운틴 도전","위대한 항로 진입 · 위험"]]);
    return choices([["explore","주변을 탐색한다","보물과 위험"],["rumor","소문을 모은다","정보와 의뢰"],["train","수련한다","능력치 향상"],["sail","다음 섬으로 항해","항해 판정"]]);
  }
  function introChoices() {
    return choices([["explore","항구 주변을 살핀다","숨겨진 흔적 조사"],["rumor","선술집으로 향한다","바다의 소문 수집"],["inspect","장비와 배를 점검한다","모험 준비"],["sail","바로 출항한다","첫 항해 시작"]]);
  }
  function battleChoices() {
    return choices([["attack","정면 공격","힘 판정 · 강력한 일격"],["quick","회피 후 반격","민첩 판정 · 안전한 전투"],["negotiate","대화로 해결 시도","협상 판정"],["flee","전장에서 후퇴","민첩 판정 · 실패 시 피해"]]);
  }
  function fruitChoices() {
    return choices([["eatfruit","열매를 먹는다","특별한 능력 / 수영 불가"],["sellfruit","수집가에게 판매","많은 베리 획득"],["keepfruit","가방에 보관","나중에 결정"],["leavefruit","그대로 놓아둔다","위험을 피한다"]]);
  }
  function scene(title, text, actions, note, tone) {
    state.scene = { title: title, text: text, actions: actions || baseChoices(), note: note || "", tone: tone || "" };
  }
  function addLog(title, detail) {
    state.log.unshift({ turn: state.turn, title: title, detail: detail });
    if (state.log.length > 40) state.log.length = 40;
  }
  function step() {
    state.turn += 1;
    state.day = Math.floor((state.turn - 1) / 3) + 1;
  }
  function dice(stat, dc, bonus) {
    var n = random(1, 20);
    var modifier = Math.floor((state.stats[stat] - 10) / 2) + (bonus || 0);
    var total = n + modifier;
    return { n: n, modifier: modifier, total: total, success: n === 20 || (n !== 1 && total >= dc), dc: dc, stat: stat };
  }
  function result(r) {
    var label = r.stat === "strength" ? "힘" : r.stat === "agility" ? "민첩" : "맷집";
    return "🎲 D20 [" + r.n + "] + " + label + " 보정 [" + (r.modifier >= 0 ? "+" : "") + r.modifier + "] = " + r.total + " / 목표 " + r.dc + " · " + (r.success ? "성공!" : "실패");
  }
  function modifyHp(n) { state.hp = Math.max(0, Math.min(state.maxHp, state.hp + n)); }
  function modifyShip(n) { state.shipHp = Math.max(0, Math.min(state.maxShipHp, state.shipHp + n)); }
  function defeat() {
    if (state.hp > 0 && state.shipHp > 0) return false;
    var loss = Math.min(state.money, Math.max(500, Math.round(state.money * .2)));
    state.money -= loss;
    state.hp = Math.ceil(state.maxHp * .45);
    state.shipHp = Math.max(25, Math.ceil(state.maxShipHp * .4));
    state.enemy = null;
    scene("파도에 떠밀려 온 생존자", "의식을 되찾은 곳은 낯선 해변. 누군가 당신을 구조해 주었지만 그동안 소지금 " + fmt(loss) + "베리가 사라졌다.\n\n이곳에서 다시 시작할 수 있다. 바다는 살아남은 자에게 언제나 새로운 기회를 준다.", baseChoices(), "패배 · 체력과 배가 일부 회복되고 " + fmt(loss) + "베리를 잃었습니다.", "fail");
    addLog("조난과 구조", "소지금 " + fmt(loss) + "베리 손실");
    return true;
  }
  function createCharacter(ev) {
    ev.preventDefault();
    var form = ev.currentTarget;
    var name = $("char-name").value.trim();
    if (!name) { toast("캐릭터의 이름을 입력해 주세요."); return; }
    var sea = form.querySelector('input[name="sea"]:checked').value;
    var role = $("char-role").value;
    var weapon = $("char-weapon").value.trim() || "맨주먹";
    var look = $("char-look").value.trim() || "아직 알려지지 않은 여행자";
    state = {
      version: 1, name: name, sea: sea, origin: sea, role: role, look: look, weapon: weapon,
      ability: "비능력자", bounty: 0, rank: role === "해군" ? "해군 이등병" : "-",
      stats: { strength: 10, agility: 10, toughness: 10 }, haki: "미각성", hakiTraining: 0,
      money: 10000, hp: 100, maxHp: 100, shipHp: 100, maxShipHp: 100,
      ship: role === "해군" ? "소형 순찰정" : "낡은 소형 범선", location: locations[sea][0],
      crew: 0, voyages: 0, turn: 1, day: 1, wins: 0, fruitPending: false,
      heldFruit: false, enemy: null, grandLine: false, upgrades: 0, log: [], scene: null
    };
    var opener = roleOpening[role] || roleOpening["모험가"];
    scene("첫 번째 항해, 첫 번째 선택", "여기는 " + sea + "의 작은 항구, " + state.location + ".\n\n" + opener + "\n\n당신의 이름은 " + name + ". 손에는 " + weapon + "이(가) 들려 있고, 항구의 종이 새로운 하루를 알린다. 부두 끝에서 한 노인이 다가와 낮은 목소리로 말한다.\n\n“젊은이, 이 바다에서는 누구의 이야기도 정해져 있지 않다네. 자, 어디부터 가겠나?”", introChoices(), "모험 시작 · 이름과 출신 바다, 신분이 결정되었습니다.", "good");
    addLog("새로운 모험", sea + " · " + state.location + "에서 출발");
    save(); render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function explore() {
    var r = dice("agility", state.grandLine ? 15 : 11, state.crew > 0 ? 1 : 0);
    if (!r.success) {
      var damage = random(3, 10);
      modifyHp(-damage);
      scene("섬의 깊은 골목에서", "습한 바람을 따라 돌계단 아래로 내려갔다. 하지만 낡은 발판이 무너지며 몸을 부딪쳤다.\n\n부서진 바닥에서 작은 지도를 발견했지만, 중요한 부분은 물에 번져 알아볼 수 없다. 탐험을 이어갈지, 다른 길을 찾을지 결정해야 한다.", baseChoices(), result(r) + " · 체력 -" + damage, "fail");
      addLog("탐험 중 사고", "체력 " + damage + " 감소");
      return;
    }
    if (state.ability === "비능력자" && !state.heldFruit && Math.random() < (state.grandLine ? .085 : .055)) {
      state.fruitPending = true;
      scene("수상한 보랏빛 상자", "오래된 창고의 이중 바닥에서 특이한 소용돌이 무늬를 가진 과일 한 알을 발견했다.\n\n해도에 그려진 경고 문구를 보니 이것은 악마의 열매, '잉크잉크 열매'로 보인다. 먹으면 잉크를 자유롭게 다루는 능력을 얻지만, 바다에서 수영할 수 없게 된다고 한다.\n\n당신은 어떻게 하겠는가?", fruitChoices(), result(r) + " · 희귀한 악마의 열매 발견!", "good");
      addLog("악마의 열매 발견", "상자 속 잉크잉크 열매");
      return;
    }
    var reward = random(8, 35) * 100;
    state.money += reward;
    var finds = [
      "부두 아래 밀수꾼들이 버리고 간 금속 상자에서 물에 젖지 않은 베리 묶음을 발견했다.",
      "바닷가 동굴의 오래된 수로를 따라가다 버려진 보급품을 찾아냈다.",
      "등대 뒤편의 폐허를 조사하던 중 바위틈에 숨겨진 작은 보물 상자를 발견했다.",
      "수상한 발자국을 쫓던 끝에 아무도 모르는 작은 해적 은신처에 도착했다."
    ];
    scene("숨은 흔적을 찾아서", pick(finds) + "\n\n당신은 신중하게 주변을 확인하고 위험한 장소에서 빠져나왔다. 수중에는 이전보다 묵직한 보상이 남아 있다.", baseChoices(), result(r) + " · " + fmt(reward) + " 베리 획득", "good");
    addLog("섬 탐색 성공", fmt(reward) + " 베리 발견");
  }
  function rumor() {
    var hints = [
      "검은 돛을 단 해적들이 오늘 밤 어촌에 나타난다는 소문이 들린다.",
      "부두 책임자가 물자를 훔친 밀수업자를 잡을 사람을 찾고 있다.",
      "한 항해사가 리버스 마운틴에 관한 위험한 항로를 기록해 두었다고 한다.",
      "낡은 현상 수배서의 인물이 이 섬 주변에서 목격되었다."
    ];
    scene("선술집의 은밀한 소문", "시끌벅적한 선술집에서 사람들의 말을 모았다. 선장이 오래된 나무 탁자 위에 수배서를 펼쳐 보인다.\n\n“" + pick(hints) + " 용기가 있다면 확인해 보게.”\n\n주변에서는 함께 항해할 사람을 구하는 이들도 보인다.", choices([["hunt","수배범을 추적한다","전투 · 보상"],["investigate","수상한 창고 조사","단서와 보물"],["recruit","동료를 구한다","모집 판정"],["market","항구 시장으로 이동","정비와 보급"]]), "새로운 의뢰와 소문을 발견했습니다.", "good");
    addLog("정보 수집", "선술집에서 새로운 단서 발견");
  }
  function inspect() {
    scene("출항 전 마지막 점검", state.ship + "의 나무판을 두드려 보고 " + state.weapon + "의 손잡이를 점검한다.\n\n튼튼한 배와 제대로 손질한 장비가 모험가의 목숨을 구한다. 항구의 정비공은 낡은 선체를 보고 고개를 갸웃거린다.", choices([["market","시장과 정비소","보급과 장비"],["train","무기 사용 연습","실력 향상"],["recruit","동료를 찾아본다","모집 판정"],["sail","준비를 마치고 출항","항해 판정"]]), "선체 " + state.shipHp + "/" + state.maxShipHp + " · 무기 " + state.weapon);
    addLog("출항 준비", "장비와 선박 점검");
  }
  function train(haki) {
    if (haki) {
      state.hakiTraining += 1;
      var rr = dice("toughness", state.haki === "미각성" ? 17 : 16, Math.floor(state.hakiTraining / 3));
      if (rr.success && state.hakiTraining >= 3) {
        state.haki = state.haki === "미각성" ? "견문색 패기" : "견문색 · 무장색 패기";
        scene("잠든 패기가 깨어나다", "파도 소리와 자신의 숨결만이 들린다. 의식을 극한까지 밀어 넣은 순간, 이전에는 느끼지 못한 감각이 몸을 가로지른다.\n\n수련 끝에 당신은 " + state.haki + "의 경지에 다다랐다.", choices([["train","기본 체력 훈련","능력치 향상"],["haki","패기 수련 계속","고난도 판정"],["rumor","항구로 돌아가기","의뢰 찾기"],["sail","출항하기","다음 섬"]]), result(rr) + " · " + state.haki + " 각성!", "good");
        addLog("패기 각성", state.haki + " 획득");
      } else {
        scene("파도 위에서의 집중", "당신은 눈을 감고 마음을 가라앉힌다. 바람의 변화와 멀리서 울리는 갈매기 소리에 집중했지만, 패기는 쉽게 모습을 드러내지 않는다.\n\n이 힘은 단숨에 얻을 수 없다. 지금의 노력도 미래의 밑거름이 된다.", choices([["haki","다시 패기 수련","집중 훈련"],["train","기초 훈련으로 전환","힘 · 민첩 · 맷집"],["rumor","사람들을 만나기","다른 기회"],["sail","바다로 나서기","실전 경험"]]), result(rr) + " · 패기 수련 " + state.hakiTraining + "회", rr.success ? "good" : "fail");
        addLog("패기 수련", rr.success ? "감각이 조금 선명해졌다" : "각성을 위해 반복 훈련");
      }
      return;
    }
    var stat = pick(["strength","agility","toughness"]);
    var label = stat === "strength" ? "힘" : stat === "agility" ? "민첩" : "맷집";
    var r = dice(stat, 10);
    if (r.success) {
      state.stats[stat] += 1;
      state.maxHp += stat === "toughness" ? 5 : 0;
      modifyHp(stat === "toughness" ? 5 : 0);
      scene("한 단계 성장한 실력", "항구 뒤편의 모래사장에서 구슬땀을 흘리며 수련했다. 나무 기둥에 부딪히는 소리, 모래를 가르는 발소리가 끊이지 않았다.\n\n반복한 노력은 배신하지 않았다. " + label + "이(가) 한 단계 성장했다.", choices([["train","계속 수련하기","능력치 성장"],["haki","패기 수련에 도전","고난도 · 각성"],["rumor","선술집으로 가기","새 의뢰"],["sail","바다로 출발","항해 판정"]]), result(r) + " · " + label + " +1", "good");
      addLog("수련 성공", label + " +1");
    } else {
      modifyHp(-2);
      scene("쉽지 않은 수련", "하루 종일 수련했지만 동작이 마음처럼 따라주지 않는다. 손바닥에 물집이 잡히고 온몸이 뻐근해졌다.\n\n당신은 훈련의 실패 또한 경험으로 받아들인다.", choices([["train","수련 재도전","다시 주사위 굴림"],["haki","정신 수련","패기 도전"],["rest","잠시 휴식","체력 회복"],["sail","항해 시작","다음 섬"]]), result(r) + " · 체력 -2", "fail");
      addLog("수련 실패", "무리한 훈련으로 체력 감소");
    }
  }
  function sail(mountain) {
    if (mountain && (state.voyages < 3 || state.grandLine)) {
      scene("아직 준비가 부족하다", "리버스 마운틴을 오르기에는 아직 항해 경험이 부족하다. 이 바다에서 적어도 세 번의 항해를 마친 뒤 도전하는 편이 좋겠다.", baseChoices(), "일반 항해 3회 이상 필요", "fail");
      return;
    }
    if (state.shipHp < 25) {
      scene("출항할 수 없는 배", "선체에 금이 가고 돛대가 심하게 흔들린다. 이 상태로 출항하면 배가 뒤집힐 수 있다.\n\n항구의 정비소를 찾아가거나 다른 방안을 마련해야 한다.", choices([["market","수리소를 찾는다","선박 복구"],["rest","휴식하며 정비","체력 회복"],["explore","섬을 탐험","수리비 마련"],["rumor","일거리를 찾는다","의뢰와 보상"]]), "선체 내구도가 낮아 항해할 수 없습니다.", "fail");
      return;
    }
    var r = dice("agility", mountain ? 17 : state.grandLine ? 15 : 12, Math.min(state.crew, 3));
    state.voyages += 1;
    if (r.success) {
      if (mountain) { state.grandLine = true; state.sea = "위대한 항로"; }
      var pool = locations[state.sea].filter(function (p) { return p !== state.location; });
      state.location = mountain ? "쌍둥이 곶" : pick(pool);
      modifyShip(-random(2, 7));
      scene(mountain ? "위대한 항로, 마침내 진입!" : "새로운 수평선의 섬", mountain
        ? "폭포처럼 솟구치는 해류를 거슬러 배가 리버스 마운틴을 넘어선다. 거친 물살과 아슬아슬한 암벽 사이를 통과한 끝에 마침내 위대한 항로의 입구, 쌍둥이 곶에 닻을 내렸다.\n\n모든 바다의 전설들이 이제 이 항로 위에 있다."
        : "새벽의 바람을 따라 돛을 펼쳤다. 파도는 거셌지만 조타를 놓치지 않았고, 긴 항해 끝에 새로운 해안선이 눈앞에 나타났다.\n\n" + state.location + ". 아직 당신을 모르는 사람들이 살아가는 새로운 섬이다.", baseChoices(), result(r) + " · " + state.location + " 도착! 항해 횟수 " + state.voyages, "good");
      addLog(mountain ? "위대한 항로 진입" : "새 섬 도착", state.location + " 도착");
    } else {
      var loss = random(12, 24);
      var hpLoss = random(4, 10);
      modifyShip(-loss); modifyHp(-hpLoss);
      scene("거센 폭풍과 난파의 위기", "출항 직후 먹구름이 수평선을 덮었다. 배가 옆으로 크게 기울고 거대한 파도가 갑판을 강타한다.\n\n간신히 가까운 해안으로 돌아왔지만 선체 곳곳이 부서졌다. 선원들은 무사한지 확인해야 한다.", choices([["market","배를 수리한다","선체 회복"],["rest","몸을 추스른다","체력 회복"],["rumor","항구에서 도움 요청","일거리 찾기"],["sail","다시 출항한다","내구도 25 이상 필요"]]), result(r) + " · 선체 -" + loss + " / 체력 -" + hpLoss, "fail");
      addLog("항해 실패", "폭풍으로 선체 " + loss + ", 체력 " + hpLoss + " 손실");
    }
  }
  function market() {
    scene("소금 냄새 나는 항구 시장", "신선한 식량, 낡은 해도, 날카로운 무기들이 가득한 시장이다. 정비공이 망치를 두드리는 소리가 들리고, 여관에서는 따뜻한 국물 냄새가 흘러나온다.\n\n상인은 당신을 보며 손가락 네 개를 편다.\n“무기를 강화할 텐가? 배를 수리할 텐가? 아니면 잠시 쉬겠나?”", choices([["buy","무기 강화 · 4,000 베리","힘 +1 · 최대 3회"],["repair","배 수리 · 2,500 베리","선체 +40"],["rest","여관 휴식 · 700 베리","체력 +30"],["rumor","시장 사람과 대화","소문과 의뢰"]]), "소지금 " + fmt(state.money) + " 베리");
    addLog("시장 방문", "보급과 정비를 위한 항구 방문");
  }
  function buy() {
    if (state.upgrades >= 3) {
      scene("손에 익은 명품 무기", "무기 장인은 당신의 " + state.weapon + "을(를) 살펴보고 고개를 끄덕인다.\n\n“이 무기는 지금 기술로 더 강화하기 어렵겠군. 중요한 건 그것을 다루는 자의 솜씨지.”", choices([["train","사용법 수련","실력 성장"],["repair","선박 정비","내구도 회복"],["rest","잠시 쉬기","체력 회복"],["sail","항해하기","새로운 섬"]]), "무기 강화 최대 횟수(3회)에 도달했습니다.");
      return;
    }
    if (state.money < 4000) { noMoney("무기 강화", 4000); return; }
    state.money -= 4000; state.upgrades += 1; state.stats.strength += 1;
    scene("새롭게 벼려진 칼날", "항구의 무기 장인이 당신의 " + state.weapon + "을(를) 오랫동안 손질했다. 전보다 균형이 좋아지고 날카로움이 살아났다.\n\n이제 전투에서 좀 더 자신 있게 무기를 휘두를 수 있다.", choices([["buy","추가 무기 강화","4,000 베리"],["repair","선박 정비","2,500 베리"],["train","훈련하기","능력치 성장"],["sail","출항하기","새 섬으로"]]), "4,000 베리 지출 · 힘 +1 (" + state.upgrades + "/3)", "good");
    addLog("무기 강화", "힘 +1");
  }
  function noMoney(item, cost) {
    scene("주머니가 가벼운 날", "상인이 필요한 금액을 듣고 고개를 저었다.\n\n" + item + "에는 " + fmt(cost) + "베리가 필요하다. 현재 소지금은 " + fmt(state.money) + "베리뿐이다. 다른 방법으로 돈을 모을 수 있다.", choices([["explore","섬 탐험으로 돈 모으기","보물 찾기"],["hunt","현상범 추적","전투 보상"],["rumor","일거리 알아보기","의뢰"],["rest","무료로 잠시 쉬기","체력 소량 회복"]]), "소지금 부족 · " + fmt(cost) + " 베리 필요", "fail");
  }
  function repair() {
    if (state.money < 2500) { noMoney("선박 수리", 2500); return; }
    state.money -= 2500; modifyShip(40);
    scene("다시 바다를 달릴 준비", "정비공들이 배의 이음새를 고치고 찢어진 돛을 꿰맸다. 나무망치 소리가 해 질 무렵까지 이어졌다.\n\n이제 " + state.ship + "은(는) 다시 거친 파도를 버틸 수 있다.", choices([["market","다시 시장 둘러보기","상점"],["rest","푹 쉬고 출발","체력 회복"],["explore","섬에서 탐험","보물 찾기"],["sail","닻을 올린다","출항"]]), "2,500 베리 지출 · 선체 " + state.shipHp + "/" + state.maxShipHp, "good");
    addLog("선박 정비", "선체 내구도 회복");
  }
  function rest() {
    var paid = state.money >= 700;
    var heal = paid ? 30 : 10;
    if (paid) state.money -= 700;
    modifyHp(heal);
    scene("긴 항해 중의 짧은 평화", paid
      ? "해안 여관에서 따뜻한 음식을 먹고 편안한 침대에 몸을 눕혔다. 긴장이 풀리고 어제의 부상이 조금씩 나아간다."
      : "돈이 부족해 부두 그늘에서 잠시 눈을 붙였다. 파도 소리 덕분인지 피로가 조금 가신다.", choices([["rumor","다른 항해자와 대화","정보 수집"],["market","시장으로 가기","보급"],["train","몸을 풀며 수련","능력치 향상"],["sail","다시 출항","항해 판정"]]), (paid ? "700 베리 지출 · " : "무료 휴식 · ") + "체력 +" + heal + " (현재 " + state.hp + ")", "good");
    addLog("휴식", "체력 회복 +" + heal);
  }
  function recruit() {
    var r = dice("agility", 13, state.crew > 0 ? 1 : 0);
    if (r.success) {
      var name = pick(["꿈 많은 견습 항해사", "침착한 포수", "명랑한 요리사", "부지런한 선의", "이름 없는 조타수"]);
      state.crew += 1;
      scene("새로운 항해의 동료", "선술집 한구석에서 당신의 계획을 경청하던 " + name + "이(가) 자리에서 일어선다.\n\n“당신과 함께라면 분명 재미있는 일이 일어날 것 같군. 내 자리를 배에 마련해 줘!”\n\n새로운 동료가 배에 합류했다.", baseChoices(), result(r) + " · 동료 +1 (총 " + state.crew + "명)", "good");
      addLog("새로운 동료", name + " 합류");
    } else {
      scene("거절당한 동료 모집", "선술집에서 몇 사람에게 동행을 제안했지만 모두 고개를 저었다.\n\n“미안하네. 아직은 그 배에 탈 용기가 없어.”\n\n다음 섬에서 다른 인연을 만날 수 있을지도 모른다.", choices([["recruit","다시 동료 모집","다시 판정"],["train","혼자 수련하기","능력치 향상"],["rumor","다른 소문 찾기","새로운 기회"],["sail","출항하기","항해 판정"]]), result(r) + " · 모집 실패", "fail");
      addLog("동료 모집 실패", "새로운 인연을 기다림");
    }
  }
  function startBattle() {
    var enemies = state.role === "해적" || state.role === "혁명군"
      ? ["해군 정찰병", "검은 돛의 약탈자", "항구를 괴롭히는 용병"]
      : ["현상 수배된 해적", "암시장의 밀수꾼", "무장한 약탈자"];
    var difficulty = state.grandLine ? 5 : 2;
    var enemy = { name: pick(enemies), hp: random(30, 43) + difficulty * 2, attack: random(5, 9) + difficulty, dc: 12 + difficulty, reward: random(30, 70) * 100 };
    enemy.maxHp = enemy.hp;
    state.enemy = enemy;
    scene("피할 수 없는 대치", "수상한 발자국을 추적한 끝에 창고 뒤편에서 " + enemy.name + "과(와) 마주쳤다.\n\n상대가 무기를 뽑고 말한다.\n“이제 돌아가긴 늦었어. 네 실력을 보여 봐!”\n\n적의 체력은 " + enemy.hp + "/" + enemy.maxHp + ". 승리하려면 신중하게 행동해야 한다.", battleChoices(), "전투 시작 · 적 " + enemy.name + " / HP " + enemy.hp, "fail");
    addLog("전투 시작", enemy.name + " 등장");
  }
  function battle(kind) {
    var enemy = state.enemy;
    if (!enemy) { scene("적을 찾을 수 없다", "지금은 대치 중인 적이 없다. 다른 길을 탐험하거나 새로운 의뢰를 찾아보자.", baseChoices()); return; }
    var r, damage = 0, response = "";
    if (kind === "flee") {
      r = dice("agility", 11 + (state.grandLine ? 3 : 0), Math.min(state.crew, 2));
      if (r.success) {
        state.enemy = null;
        scene("무사히 전장에서 이탈", "주변의 지형을 이용해 상대의 시야에서 빠르게 사라졌다. 무리해서 목숨을 거는 것보다 다음 기회를 기다리는 편이 나을 때도 있다.", baseChoices(), result(r) + " · 도주 성공", "good");
        addLog("전투에서 후퇴", "부상 없이 이탈");
        return;
      }
      response = "도주로를 막힌 순간 적에게 등을 보이고 말았다.";
    } else if (kind === "negotiate") {
      r = dice("agility", 16, state.role === "상인" ? 3 : 0);
      if (r.success) {
        var amount = Math.floor(enemy.reward / 3);
        state.money += amount; state.enemy = null;
        scene("칼 대신 말로 얻은 승리", "긴장된 공기 속에서 당신은 무기를 내리고 상대의 사정을 들었다. 끝내 합의에 이르렀고, 적은 더 싸우지 않기로 했다.\n\n당신은 평화적으로 다툼을 해결했다.", baseChoices(), result(r) + " · 합의금 " + fmt(amount) + " 베리 획득", "good");
        addLog("전투 없이 협상", fmt(amount) + " 베리 획득");
        return;
      }
      response = "협상을 제안했지만 상대가 코웃음을 치며 무기를 겨눈다.";
    } else {
      var quick = kind === "quick";
      r = dice(quick ? "agility" : "strength", enemy.dc + (quick ? -1 : 0), state.haki !== "미각성" ? 2 : 0);
      if (r.success) {
        damage = quick ? random(8, 14) + Math.floor(state.stats.agility / 3) : random(13, 22) + Math.floor(state.stats.strength / 3);
        if (state.ability !== "비능력자") damage += 5;
        enemy.hp = Math.max(0, enemy.hp - damage);
        response = quick ? "몸을 낮춰 공격을 피하고 재빠르게 반격했다." : state.weapon + "을(를) 휘둘러 강력한 일격을 가했다.";
        if (enemy.hp <= 0) { winBattle(r, damage, response); return; }
      } else { response = quick ? "공격을 흘려보내려 했으나 타이밍을 놓쳤다." : "상대가 당신의 공격을 읽고 간신히 피했다."; }
    }
    var counter = random(1, 20) + (state.grandLine ? 3 : 1);
    var avoid = 9 + Math.floor((state.stats.agility - 10) / 2);
    var hurt = counter >= avoid ? random(4, enemy.attack) : 0;
    if (hurt) modifyHp(-hurt);
    var hitText = hurt ? "적의 반격을 받아 체력 " + hurt + "을 잃었다." : "다행히 상대의 반격은 빗나갔다.";
    var note = result(r) + (damage ? " · 적에게 " + damage + " 피해" : "") + (hurt ? " · 체력 -" + hurt : " · 반격 회피");
    scene("격돌! " + enemy.name, response + "\n\n" + hitText + "\n\n적의 남은 체력: " + enemy.hp + "/" + enemy.maxHp + ". 다음 한 수가 승부를 바꿀 수 있다.", battleChoices(), note, hurt ? "fail" : "good");
    addLog("전투 진행", (damage ? "적 -" + damage + " / " : "") + (hurt ? "체력 -" + hurt : "반격 회피"));
  }
  function winBattle(r, damage, desc) {
    var enemy = state.enemy;
    state.money += enemy.reward;
    state.wins += 1;
    if (state.role === "해적" && enemy.name.indexOf("해군") >= 0) state.bounty += random(20, 90) * 1000;
    if (state.role === "혁명군" && enemy.name.indexOf("해군") >= 0) state.bounty += random(10, 50) * 1000;
    if (state.role === "해군" && state.wins % 3 === 0) state.rank = state.wins >= 6 ? "해군 하사" : "해군 일등병";
    state.enemy = null;
    scene("승리! 전투의 끝", desc + "\n\n마지막 일격에 상대가 쓰러졌다. 주위 사람들이 놀란 눈으로 당신을 바라보고, 누군가는 작은 환호성을 질렀다.\n\n당신의 이름이 이 항구에서 조금씩 알려지기 시작한다.", baseChoices(), result(r) + " · 최후의 일격 " + damage + " 피해 · " + fmt(enemy.reward) + " 베리 획득" + (state.bounty ? " · 현상금 " + fmt(state.bounty) : ""), "good");
    addLog("전투 승리", enemy.name + " 제압 · " + fmt(enemy.reward) + " 베리");
  }
  function fruit(kind) {
    if (!state.fruitPending && !state.heldFruit) { scene("찾지 못한 열매", "아직 손에 악마의 열매가 없다. 섬을 탐색하다 보면 희귀한 기회를 만날지도 모른다.", baseChoices()); return; }
    if (kind === "eatfruit") {
      state.ability = "잉크잉크 열매 (초인계)";
      state.stats.agility += 3; state.stats.strength += 2;
      state.fruitPending = false; state.heldFruit = false;
      scene("악마의 열매를 먹은 자", "한입 베어 문 순간 입안에 끔찍한 쓴맛이 퍼진다. 곧 검은 잉크가 손끝에서 실처럼 흘러나오기 시작한다.\n\n잉크를 흘려 장애물을 만들고 적을 묶을 수 있게 되었다. 하지만 대가로 바다에서 헤엄칠 수 없는 몸이 되었다.", baseChoices(), "잉크잉크 열매 능력 획득 · 힘 +2, 민첩 +3 · 수영 불가", "good");
      addLog("악마의 열매 복용", state.ability + " 획득");
    } else if (kind === "sellfruit") {
      state.money += 35000; state.fruitPending = false; state.heldFruit = false;
      scene("거액의 거래", "항구의 수집가에게 조심스럽게 열매를 내밀었다. 수집가는 눈을 휘둥그레 뜨더니 두꺼운 돈주머니를 탁자에 올려놓았다.\n\n능력 대신 새로운 항해 자금을 선택했다.", baseChoices(), "35,000 베리 획득", "good");
      addLog("희귀한 열매 판매", "35,000 베리 획득");
    } else if (kind === "keepfruit") {
      state.fruitPending = false; state.heldFruit = true;
      scene("보관된 미지의 힘", "열매를 천으로 감싸 안전한 상자에 넣었다. 언젠가는 이 힘이 필요할지도 모른다.\n\n직접 행동 입력에 '보관한 열매를 먹는다' 또는 '열매를 판다'라고 입력하면 나중에 사용할 수 있다.", baseChoices(), "인벤토리에 잉크잉크 열매 보관", "good");
      addLog("열매 보관", "나중에 먹거나 판매 가능");
    } else {
      state.fruitPending = false;
      scene("유혹을 뒤로한 선택", "당신은 위험한 열매를 그대로 두고 바다 쪽으로 걸어 나왔다. 모든 힘을 가져야만 강해지는 것은 아니다.", baseChoices(), "열매를 놓아두었습니다.");
      addLog("열매를 포기", "특별한 힘 대신 자신의 길 선택");
    }
  }
  function investigate() {
    var r = dice("strength", 12);
    if (r.success) {
      var amount = random(20, 55) * 100;
      state.money += amount;
      scene("비밀 창고의 뒤편", "수상한 창고의 잠금쇠를 열고 안으로 들어갔다. 선반 뒤쪽에 숨겨진 현금 상자와 낡은 항해일지를 발견했다.\n\n일지에는 리버스 마운틴의 거센 해류를 조심하라는 메모가 적혀 있다.", choices([["hunt","주인을 추적한다","전투 가능"],["explore","주변을 더 조사","보물 탐색"],["market","물자를 사러 간다","항구 정비"],["sail","다음 목적지로","출항"]]), result(r) + " · " + fmt(amount) + " 베리 발견", "good");
      addLog("창고 조사 성공", fmt(amount) + " 베리 발견");
    } else {
      modifyHp(-4);
      scene("잠긴 창고의 함정", "창고 안에 숨겨진 방아쇠를 잘못 건드렸다. 낡은 나무 상자가 무너지면서 어깨에 부딪쳤고, 소란을 들은 누군가가 달려오는 소리가 들린다.", choices([["hunt","다가오는 상대와 싸운다","전투"],["explore","뒷문으로 빠져나간다","탐색"],["rest","상처를 치료한다","체력 회복"],["rumor","다시 정보를 모은다","새로운 의뢰"]]), result(r) + " · 체력 -4", "fail");
      addLog("창고 함정", "체력 -4");
    }
  }
  function changeRole(role) {
    state.role = role;
    state.rank = role === "해군" ? "해군 이등병" : "-";
    scene("새로운 깃발 아래에서", "오늘 당신은 자신의 길을 다시 선택했다.\n\n이전의 이름이나 여정이 사라지는 것은 아니다. 이제 " + role + "으로서 바다의 새로운 미래를 만들어 나간다.", baseChoices(), "신분 변경 · " + role, "good");
    addLog("신분 변경", role + "의 길을 선택");
  }
  function customAction(input) {
    var t = input.trim();
    if (!t) return;
    if (/^[1-4]$/.test(t)) {
      var item = state.scene.actions[Number(t) - 1];
      if (item) { act(item.kind); return; }
    }
    if (state.enemy) {
      if (/도망|후퇴|탈출|피하/.test(t)) { act("flee"); return; }
      if (/협상|대화|설득|항복|평화/.test(t)) { act("negotiate"); return; }
      if (/회피|재빠르|기습|반격/.test(t)) { act("quick"); return; }
      if (/공격|싸우|무기|때리|베|찌르|능력/.test(t)) { act("attack"); return; }
    }
    if (/열매.*먹|먹.*열매/.test(t) && (state.heldFruit || state.fruitPending)) { act("eatfruit"); return; }
    if (/열매.*팔|팔.*열매/.test(t) && (state.heldFruit || state.fruitPending)) { act("sellfruit"); return; }
    if (state.fruitPending && /보관|간직/.test(t)) { act("keepfruit"); return; }
    if (state.enemy) {
      act(/피하|눈|모래|방어|속도|발|유인|뒤/.test(t) ? "quick" : "attack");
      state.scene.text = "당신의 즉흥 전투 행동: “" + t + "”\n\n" + state.scene.text;
      save(); render(); return;
    }
    if (state.fruitPending) { toast("발견한 열매를 먼저 먹거나, 팔거나, 보관해 주세요."); return; }
    if (/해군.*입대|해군.*지원|해군이 되|해군으로 전향/.test(t)) { step(); changeRole("해군"); save(); render(); return; }
    if (/해적.*되|해적.*전향|해적단.*결성/.test(t)) { step(); changeRole("해적"); save(); render(); return; }
    if (/혁명군.*가입|혁명군.*되/.test(t)) { step(); changeRole("혁명군"); save(); render(); return; }
    if (/현상금 사냥꾼.*되/.test(t)) { step(); changeRole("현상금 사냥꾼"); save(); render(); return; }
    if (/리버스|위대한 항로|그랜드 라인/.test(t)) { act("mountain"); return; }
    if (/패기/.test(t)) { act("haki"); return; }
    if (/배.*수리|수리|정비/.test(t)) { act("repair"); return; }
    if (/휴식|잠|치료|쉬|체력 회복/.test(t)) { act("rest"); return; }
    if (/동료|선원|모집/.test(t)) { act("recruit"); return; }
    if (/구매|쇼핑|상점|시장|장비/.test(t)) { act("market"); return; }
    if (/훈련|수련|연습|단련/.test(t)) { act("train"); return; }
    if (/항해|출항|출발|다음 섬|돛/.test(t)) { act("sail"); return; }
    if (/찾|탐험|탐색|조사|단서|열매|보물/.test(t)) { act("explore"); return; }
    if (/정보|소문|대화|선술집|의뢰|이야기/.test(t)) { act("rumor"); return; }
    if (/전투|싸움|사냥|체포|해적.*공격|결투/.test(t)) { act("hunt"); return; }
    // A free-form action remains possible without an AI API: interpret it as an improvised skill check.
    step();
    var r = dice(/달리|뛰|몰래|숨어|살금|민첩/.test(t) ? "agility" : /힘|부수|들어|올리|밀어/.test(t) ? "strength" : "toughness", 13);
    if (r.success) {
      var bonus = random(3, 14) * 100;
      state.money += bonus;
      scene("예상치 못한 선택의 결과", "당신은 스스로 정한 행동을 실행했다.\n\n“" + t + "”\n\n누구도 예상하지 못한 시도였지만, 기지를 발휘해 상황을 유리하게 만들었다. 지나가던 상인이 당신에게 고마움을 표하며 작은 사례금을 건넨다.", baseChoices(), result(r) + " · 즉흥 행동 성공 · " + fmt(bonus) + " 베리 획득", "good");
      addLog("자유 행동 성공", t.slice(0, 45));
    } else {
      modifyHp(-3);
      scene("뜻대로 흘러가지 않은 일", "당신은 스스로 정한 행동을 시도했다.\n\n“" + t + "”\n\n하지만 예상과 달리 일이 꼬여 버렸고 작은 부상을 입었다. 실패한 경험도 당신의 다음 선택에 영향을 줄 것이다.", baseChoices(), result(r) + " · 즉흥 행동 실패 · 체력 -3", "fail");
      addLog("자유 행동 실패", t.slice(0, 45));
    }
    if (!defeat()) { save(); render(); }
  }
  function act(kind) {
    if (!state) return;
    if (state.enemy && !["attack","quick","negotiate","flee"].includes(kind)) { toast("전투 중입니다. 먼저 적에게 대응하세요."); return; }
    if (state.fruitPending && !["eatfruit","sellfruit","keepfruit","leavefruit"].includes(kind)) { toast("발견한 악마의 열매를 먼저 결정하세요."); return; }
    step();
    switch (kind) {
      case "explore": explore(); break;
      case "rumor": rumor(); break;
      case "inspect": inspect(); break;
      case "train": train(false); break;
      case "haki": train(true); break;
      case "sail": sail(false); break;
      case "mountain": sail(true); break;
      case "market": market(); break;
      case "buy": buy(); break;
      case "repair": repair(); break;
      case "rest": rest(); break;
      case "recruit": recruit(); break;
      case "investigate": investigate(); break;
      case "hunt": startBattle(); break;
      case "attack": case "quick": case "negotiate": case "flee": battle(kind); break;
      case "eatfruit": case "sellfruit": case "keepfruit": case "leavefruit": fruit(kind); break;
      default: scene("새로운 갈림길", "주변을 살피면 또 다른 이야기가 시작될 것이다.", baseChoices()); break;
    }
    defeat(); save(); render();
  }
  function statusMarkup() {
    var rankOrBounty = state.role === "해군" ? html(state.rank) : fmt(state.bounty) + " 베리 / -";
    return "<strong>[이름]</strong> " + html(state.name) + " | <strong>[신분]</strong> " + html(state.role) +
      "<br><strong>[능력]</strong> " + html(state.ability) + " | <strong>[현상금/계급]</strong> " + rankOrBounty +
      "<br><strong>[능력치]</strong> 힘: " + state.stats.strength + " | 민첩: " + state.stats.agility + " | 맷집: " + state.stats.toughness + " | 패기: " + html(state.haki) +
      "<br><strong>[소지금]</strong> " + fmt(state.money) + " 베리 | <strong>[현재 위치]</strong> " + html(state.sea) + " · " + html(state.location);
  }
  function renderSidebar() {
    var hpPct = Math.round(state.hp / state.maxHp * 100);
    var shipPct = Math.round(state.shipHp / state.maxShipHp * 100);
    var rankOrBounty = state.role === "해군" ? state.rank : fmt(state.bounty) + " 베리";
    $("side-character").innerHTML =
      '<div class="character-name">' + html(state.name) + '</div>' +
      '<div class="character-role">' + html(state.role) + ' · ' + html(state.sea) + '</div>' +
      '<div class="health-row"><span>♥ 체력</span><span>' + state.hp + ' / ' + state.maxHp + '</span></div>' +
      '<div class="track"><span style="width:' + hpPct + '%"></span></div>' +
      '<div class="health-row"><span>⚓ 선체 내구도</span><span>' + state.shipHp + ' / ' + state.maxShipHp + '</span></div>' +
      '<div class="track ship"><span style="width:' + shipPct + '%"></span></div>' +
      '<div class="stat-grid">' +
      '<div class="stat-box"><div class="label">힘 STR</div><div class="value">' + state.stats.strength + '</div></div>' +
      '<div class="stat-box"><div class="label">민첩 AGI</div><div class="value">' + state.stats.agility + '</div></div>' +
      '<div class="stat-box"><div class="label">맷집 VIT</div><div class="value">' + state.stats.toughness + '</div></div>' +
      '<div class="stat-box"><div class="label">소지금</div><div class="value">' + fmt(state.money) + '<small style="font-size:10px;color:#91a8b1"> B</small></div></div>' +
      '</div><dl class="details">' +
      '<div class="detail-line"><dt>현재 위치</dt><dd>' + html(state.location) + '</dd></div>' +
      '<div class="detail-line"><dt>악마의 열매</dt><dd>' + html(state.ability) + (state.heldFruit ? " · 보관 1개" : "") + '</dd></div>' +
      '<div class="detail-line"><dt>패기</dt><dd>' + html(state.haki) + '</dd></div>' +
      '<div class="detail-line"><dt>현상금 / 계급</dt><dd>' + html(rankOrBounty) + '</dd></div>' +
      '<div class="detail-line"><dt>무기</dt><dd>' + html(state.weapon) + '</dd></div>' +
      '<div class="detail-line"><dt>동료</dt><dd>' + state.crew + '명</dd></div>' +
      '<div class="detail-line"><dt>항해</dt><dd>' + state.voyages + '회 · ' + state.wins + '승</dd></div>' +
      '<div class="detail-line"><dt>특징</dt><dd>' + html(state.look) + '</dd></div></dl>';
    $("side-log").innerHTML = state.log.slice(0, 5).map(function (item) {
      return '<div class="log-entry"><strong>TURN ' + String(item.turn).padStart(2, "0") + ' · ' + html(item.title) + '</strong>' + html(item.detail) + '</div>';
    }).join("");
  }
  function render() {
    if (!state) { $("intro").classList.remove("hidden"); $("game").classList.add("hidden"); $("header-new").classList.add("hidden"); return; }
    $("intro").classList.add("hidden"); $("game").classList.remove("hidden"); $("header-new").classList.remove("hidden");
    $("scene-kicker").textContent = state.sea.toUpperCase() + " · DAY " + String(state.day).padStart(2, "0");
    $("turn-pill").textContent = "TURN " + String(state.turn).padStart(2, "0");
    $("art-label").textContent = state.location.toUpperCase() + " · " + (state.enemy ? "BATTLE" : "ADVENTURE");
    $("scene-title").textContent = state.scene.title;
    $("story-text").textContent = state.scene.text;
    var note = $("narrative-note");
    if (state.scene.note) {
      note.textContent = state.scene.note;
      note.className = "narrative-note " + (state.scene.tone || "");
    } else { note.className = "narrative-note hidden"; }
    $("action-list").innerHTML = state.scene.actions.slice(0, 4).map(function (a, i) {
      return '<button class="action-btn" type="button" data-kind="' + html(a.kind) + '"><span class="action-num">' + (i + 1) + '</span><span><span class="action-name">' + html(a.label) + '</span><span class="action-sub">' + html(a.tip) + '</span></span></button>';
    }).join("");
    $("inline-status").innerHTML = statusMarkup();
    renderSidebar();
  }
  function exportSave() {
    var b = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = "grandline-" + state.turn + "-save.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    toast("항해 일지를 파일로 저장했습니다.");
  }
  function importSave(file) {
    if (!file || file.size > 2 * 1024 * 1024) { toast("2MB 이하의 JSON 저장 파일을 선택하세요."); return; }
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || data.version !== 1 || typeof data.name !== "string" || !data.scene || !Array.isArray(data.scene.actions) || !data.stats || !Array.isArray(data.log) || typeof data.hp !== "number" || typeof data.money !== "number") throw Error("invalid");
        state = data; save(); render(); toast("항해 기록을 불러왔습니다.");
      } catch (err) { toast("유효한 GRAND LINE 저장 파일이 아닙니다."); }
    };
    reader.readAsText(file);
  }
  document.addEventListener("DOMContentLoaded", function () {
    $("create-form").addEventListener("submit", createCharacter);
    $("action-list").addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-kind]");
      if (btn) { act(btn.getAttribute("data-kind")); }
    });
    $("free-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = $("free-input").value.trim();
      $("free-input").value = "";
      if (input) customAction(input);
    });
    $("header-new").addEventListener("click", function () {
      if (window.confirm("현재 모험 기록을 삭제하고 새로운 캐릭터를 만드시겠습니까? 먼저 '기록 내보내기'로 백업할 수 있습니다.")) {
        localStorage.removeItem(KEY); state = null; render(); window.scrollTo({top: 0, behavior:"smooth"});
      }
    });
    $("export-save").addEventListener("click", exportSave);
    $("import-save").addEventListener("click", function () { $("import-file").click(); });
    $("import-file").addEventListener("change", function (ev) { importSave(ev.target.files[0]); ev.target.value = ""; });
    load(); render();
  });
})();