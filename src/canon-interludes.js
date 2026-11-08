import { travelScene, yearRoll } from "./world.js";
import { eraAdventure } from "./adventures.js";
import { personalBeat } from "./people.js";

const DAYS = ["이틀 뒤", "사흘 뒤", "며칠 뒤", "나흘 뒤", "한 주쯤 뒤"];
export const MOMENTS = [
  { title: "다시 묶은 밧줄", art: "deck", body: (life) => `${life.location}의 부두에서 낡은 밧줄을 새것으로 바꿨다. 먼 바다의 큰 사건이 들려와도 배는 오늘의 매듭으로 떠났다.`,
    choices: [
      { id: "tighten", label: "이중 매듭으로 단단히 묶는다", risk: "기술 +5", personality: { caution: 4 }, apply: (s) => { s.skill += 5; return "거친 파도에도 풀리지 않도록 단단히 결속했다."; } },
      { id: "share_knot", label: "동료에게 새 매듭법을 보여준다", risk: "친구와의 유대 +5", personality: { empathy: 4, loyalty: 3 }, apply: (s) => { s.friendBond += 5; return "동료가 고개를 끄덕이며 다음 줄을 함께 당겼다."; } }
    ] },
  { title: "항구의 식탁", art: "workbench", body: (life) => `${life.affiliation}의 사람들이 같은 식탁에 앉았다. 신문에서 싸움을 읽다가도 자기 몫의 국이 식기 전에 내일 일할 순서를 정했다.`,
    choices: [
      { id: "serve_others", label: "동료들의 국그릇부터 채운다", risk: "친구와의 유대 +5 · 배려심이 자람", personality: { empathy: 5 }, apply: (s) => { s.friendBond += 5; return "뜨거운 김이 오르는 그릇을 나누며 피로를 덜었다."; } },
      { id: "read_aloud", label: "신문 속 사건에 대해 의견을 나눈다", risk: "지역의 신뢰 +4", personality: { ambition: 3, caution: 3 }, apply: (s) => { s.trust += 4; return "바다의 정세와 안전한 항로를 함께 토론했다."; } }
    ] },
  { title: "짧아진 물자 목록", art: "workbench", body: (life) => `${life.location}에서 식량과 약값을 다시 셌다. 다른 섬의 소문이 커진 만큼 작은 배에 돌아갈 몫도 신중히 나눠야 했다.`,
    choices: [
      { id: "frugal", label: "식량을 아끼며 다음 항구까지 버틴다", risk: "건강 +3 · 신중함", personality: { caution: 5 }, apply: (s) => { s.health += 3; return "배급량을 조절해 위기 상황에 대비했다."; } },
      { id: "buy_cheap", label: "부두 시장에서 건어물을 조금 사 둔다", cost: 5, risk: "물자 -5 · 물자 +10", personality: { ambition: 3 }, apply: (s) => { s.supplies += 5; return "저렴하고 오래 보관할 수 있는 염장 생선을 채워 넣었다."; } }
    ] },
  { title: "밤 당직의 목소리", art: "deck", body: (life) => `${life.birth.name}은 어두운 물길을 살피며 당직을 섰다. 멀리서 불빛 하나가 보였지만, 다가올 배가 누구의 편인지는 아침까지 알 수 없었다.`,
    choices: [
      { id: "raise_lantern", label: "망루의 불빛을 높여 경계를 알린다", risk: "신중함 · 기술 +4", personality: { caution: 5 }, apply: (s) => { s.skill += 4; return "경계 신호를 올리자 낯선 불빛이 서서히 뱃머리를 돌렸다."; } },
      { id: "watch_silently", label: "불을 낮추고 어둠 속에서 동태를 지킨다", risk: "친구와의 유대 +4", personality: { loyalty: 4, freedom: 3 }, apply: (s) => { s.friendBond += 4; return "동료들을 깨우지 않고 혼자 조용히 밤바다를 지켜냈다."; } }
    ] },
  { title: "두 장의 서로 다른 신문", art: "workbench", body: "같은 사건을 다룬 신문 두 장의 제목이 달랐다. 항구 사람들은 직접 본 일과 전해 들은 일을 나눠 말하기 시작했다.",
    choices: [
      { id: "listen_market", label: "상인들이 하는 소문을 더 들어본다", risk: "지역의 신뢰 +5", personality: { empathy: 4 }, apply: (s) => { s.trust += 5; return "여러 사람의 목소리를 듣고 진실의 윤곽을 짚었다."; } },
      { id: "trust_eyes", label: "직접 눈으로 본 것만 믿기로 한다", risk: "기술 +4 · 자유로움", personality: { freedom: 4, caution: 4 }, apply: (s) => { s.skill += 4; return "선동에 흔들리지 않고 항해 준비에 집중했다."; } }
    ] },
  { title: "돌아온 전보벌레", art: "deck", body: "전보벌레가 한참 울리다가 잠들었다. 다시 깨워 받은 연락은 세계의 비밀이 아니라 다음 기항지에 필요한 돛감의 수량이었다.",
    choices: [
      { id: "confirm_order", label: "주문 수량을 꼼꼼히 확인하고 기록한다", risk: "기술 +4 · 물자 +3", personality: { caution: 4 }, apply: (s) => { s.skill += 4; s.supplies += 3; return "오차 없이 돛감을 확보해 항해 일정에 차질이 없도록 했다."; } },
      { id: "send_regards", label: "상대 지부의 안부를 짧게 묻는다", risk: "지역의 신뢰 +5", personality: { loyalty: 4, empathy: 4 }, apply: (s) => { s.trust += 5; return "무사하라는 한마디 인사가 전보벌레의 입을 통해 전해졌다."; } }
    ] },
  { title: "낯선 섬의 표식", art: "deck", body: (life) => `${life.location}의 낡은 안내 표식이 바뀌었다. 처음 오는 배가 길을 잃지 않도록 누군가 이름과 방향을 새로 적어 두었다.`,
    choices: [
      { id: "repaint_sign", label: "헷갈리지 않게 표식을 더 굵게 덧칠한다", risk: "지역의 신뢰 +5", personality: { empathy: 5 }, apply: (s) => { s.trust += 5; return "다음 배의 선원들이 안도할 모습을 생각하며 페인트를 칠했다."; } },
      { id: "copy_chart", label: "해도에 새 표식의 위치를 기록한다", risk: "기술 +5", personality: { caution: 4 }, apply: (s) => { s.skill += 5; return "지도 한구석에 변경된 암초와 항로 표식을 추가했다."; } }
    ] },
  { title: "친구의 안부", art: "workbench", body: (life) => `${life.friendName || "옛 친구"}의 이름이 편지 끝에 있었다. ${life.birth.name}은 큰 소식보다 그 사람이 오늘 무사한지를 먼저 확인했다.`,
    choices: [
      { id: "write_reply", label: "무사하다는 답장을 즉시 띄운다", risk: "친구와의 유대 +8", personality: { loyalty: 5 }, apply: (s) => { s.friendBond += 8; return "먼바다에서도 변치 않는 안부를 편지에 담아 띄웠다."; } },
      { id: "enclose_token", label: "작은 조개껍데기를 편지에 동봉한다", risk: "친구와의 유대 +10", personality: { empathy: 5 }, apply: (s) => { s.friendBond += 10; return "기항지 해변에서 주운 반짝이는 조개를 함께 보냈다."; } }
    ] },
  { title: "비를 피한 오후", art: "deck", body: "비가 잠깐 항해를 막았다. 선원들은 돛을 말리고 젖은 지도를 펴 놓았다. 출항을 못 한 날에도 해야 할 일은 남았다.",
    choices: [
      { id: "dry_map", label: "선창 아래서 젖은 지도를 꼼꼼히 말린다", risk: "기술 +5", personality: { caution: 4 }, apply: (s) => { s.skill += 5; return "소금기를 닦아내고 번진 먹선을 덧칠해 살려냈다."; } },
      { id: "listen_rain", label: "빗소리를 들으며 차분히 휴식을 취한다", risk: "건강 +8", personality: { freedom: 3, caution: 3 }, apply: (s) => { s.health += 8; return "출항 전 누적된 피로를 풀고 내일의 항해를 준비했다."; } }
    ] },
  { title: "새로 온 일손", art: "workbench", body: "새 일꾼이 매듭을 반대로 묶었다. 한 번 웃고 다시 가르치는 사이 부두에는 조금 다른 손길이 더해졌다.",
    choices: [
      { id: "patient_guide", label: "웃으며 올바른 매듭법을 차근차근 알려준다", risk: "친구와의 유대 +5", personality: { empathy: 5 }, apply: (s) => { s.friendBond += 5; return "신참의 서툰 손이 두 번째에는 제법 그럴듯한 매듭을 만들었다."; } },
      { id: "show_speed", label: "작업 속도를 맞추며 손수 시범을 보인다", risk: "기술 +5", personality: { ambition: 3, loyalty: 3 }, apply: (s) => { s.skill += 5; return "빠르고 견고한 손놀림을 보여주자 일꾼의 눈이 반짝였다."; } }
    ] },
  { title: "소문보다 가까운 일", art: "workbench", body: (life) => `${life.location}에 또 다른 전보가 닿았다. ${life.birth.name}은 내용을 적어 두고 눈앞의 고장 난 배부터 살폈다.`,
    choices: [
      { id: "fix_hull", label: "눈앞의 배를 먼저 확실하게 고친다", risk: "기술 +6 · 지역의 신뢰 +4", personality: { caution: 4 }, apply: (s) => { s.skill += 6; s.trust += 4; return "멀리서 울리는 풍파보다 눈앞 배의 물샘을 먼저 잡았다."; } },
      { id: "safe_archive", label: "전보 내용을 기록해 안전한 곳에 보관한다", risk: "신중함 · 기술 +4", personality: { caution: 5 }, apply: (s) => { s.skill += 4; return "중요한 항로 변동 사항을 항해 일지에 철저히 적어 두었다."; } }
    ] },
  { title: "작은 배의 출항", art: "deck", body: "이름난 배가 아니어도 떠나는 사람에게는 큰 날이었다. 부두에 선 이들은 무사히 돌아올 물때를 함께 확인했다.",
    choices: [
      { id: "wave_goodbye", label: "부두 끝까지 나가 손을 흔들어 배웅한다", risk: "지역의 신뢰 +5", personality: { empathy: 5 }, apply: (s) => { s.trust += 5; return "출항하는 작은 배에서 고맙다며 뱃고동을 울렸다."; } },
      { id: "advise_tide", label: "다음 물때의 조류와 바람을 확인해 준다", risk: "기술 +5", personality: { caution: 4 }, apply: (s) => { s.skill += 5; return "암초를 피할 최적의 물길을 일러주어 안전한 출항을 도왔다."; } }
    ] },
  { title: "동료의 다른 생각", art: "deck", body: "같은 소식을 듣고도 동료는 다른 판단을 내렸다. 누가 옳은지 결론 내리기보다 각자 지킬 사람의 이름을 먼저 말했다.",
    choices: [
      { id: "stand_together", label: "동료의 판단을 존중하고 뒷받침한다", risk: "친구와의 유대 +6", personality: { loyalty: 5 }, apply: (s) => { s.friendBond += 6; return "서로 생각이 달라도 신뢰는 흔들리지 않는다는 걸 확인했다."; } },
      { id: "find_compromise", label: "각자의 생각을 절충해 안전한 대안을 찾는다", risk: "신중함 · 기술 +4", personality: { caution: 5 }, apply: (s) => { s.skill += 4; return "둘의 장점만 모은 새로운 항로 계획을 세웠다."; } }
    ] },
  { title: "장부에 남은 한 줄", art: "workbench", body: (life) => `${life.birth.name}은 지난 항해에서 쓴 물자를 한 줄씩 적었다. 영웅의 이름은 신문에 남고, 다음 배를 띄우는 숫자는 장부에 남았다.`,
    choices: [
      { id: "exact_audit", label: "동전 한 닢까지 장부를 오차 없이 맞춘다", risk: "물자 +5 · 기술 +4", personality: { caution: 5 }, apply: (s) => { s.supplies += 5; s.skill += 4; return "누락된 잔금을 찾아내 배의 비상금 주머니를 불렸다."; } },
      { id: "reward_crew", label: "고생한 동료들의 몫을 조금 더 얹어 적는다", risk: "친구와의 유대 +5 · 지역의 신뢰 +4", personality: { empathy: 5, loyalty: 4 }, apply: (s) => { s.friendBond += 5; s.trust += 4; return "동료들이 장부를 보며 선선한 미소를 지었다."; } }
    ] },
  { title: "바늘이 가리킨 곳", art: "deck", body: "기록지침이 흔들리는 동안 선원들은 물통을 채웠다. 다음 섬을 알아도 거기까지 버틸 방법은 별도로 마련해야 했다.",
    choices: [
      { id: "fill_water", label: "동료들과 함께 식수통을 가득 채운다", risk: "물자 +8", personality: { caution: 4 }, apply: (s) => { s.supplies += 8; return "깨끗한 우물물을 길어 맑은 물통을 채웠다."; } },
      { id: "steady_needle", label: "흔들리는 바늘을 여러 번 대조해 기록한다", risk: "기술 +5", personality: { caution: 4 }, apply: (s) => { s.skill += 5; return "기록지침의 미세한 떨림을 읽어 출항 시간을 계산했다."; } }
    ] },
  { title: "거래가 끝난 저녁", art: "workbench", body: "상인은 값이 오른 이유를 길게 설명했다. 일꾼들은 가격보다 오늘 필요한 양을 다시 물었다. 저녁이 되자 창고 문이 닫혔다.",
    choices: [
      { id: "prep_stage", label: "내일 실을 짐들을 미리 창고 앞에 둔다", risk: "기술 +5", personality: { caution: 4 }, apply: (s) => { s.skill += 5; return "선적 순서대로 상자를 분류해 내일의 시간을 아꼈다."; } },
      { id: "share_tea", label: "상인과 따뜻한 차 한 잔을 나누며 인사를 한다", risk: "지역의 신뢰 +6", personality: { empathy: 5 }, apply: (s) => { s.trust += 6; return "거친 흥정 뒤에도 따뜻한 온기가 남았다."; } }
    ] },
  { title: "항로를 모르는 손님", art: "deck", body: "방문객이 섬의 지름길을 물었다. 가장 짧은 길과 가장 안전한 길이 달라서, 부두 사람들은 둘 다 알려 주었다.",
    choices: [
      { id: "calm_route", label: "파도가 잔잔하고 안전한 길을 권한다", risk: "지역의 신뢰 +5", personality: { empathy: 4, caution: 4 }, apply: (s) => { s.trust += 5; return "손님은 초심자라며 안전한 길을 택하고 연신 감사 인사를 했다."; } },
      { id: "fast_tide", label: "시간을 아낄 수 있는 빠른 물길을 일러준다", risk: "기술 +4 · 자유로움", personality: { freedom: 4 }, apply: (s) => { s.skill += 4; return "물때와 조류의 타이밍을 상세히 적어 손에 쥐여주었다."; } }
    ] },
  { title: "수리할 순서", art: "workbench", body: "세 척의 배가 한꺼번에 수리를 청했다. 가장 큰 배부터 고치자는 말에 작은 배의 선장이 찡그렸다. 일꾼들은 손상된 곳부터 살폈다.",
    choices: [
      { id: "triage_small", label: "가장 파손이 심한 작은 배부터 손본다", risk: "지역의 신뢰 +6", personality: { empathy: 5 }, apply: (s) => { s.trust += 6; return "침수 위기에 놓인 어선을 먼저 건져 올려 고마움을 샀다."; } },
      { id: "divide_tools", label: "효율적으로 공구를 나눠 동시에 진행한다", risk: "기술 +6", personality: { caution: 4, ambition: 3 }, apply: (s) => { s.skill += 6; return "일손을 재배치해 세 척 모두 해 질 녘 전에 수리를 마쳤다."; } }
    ] },
  { title: "잠깐 비운 자리", art: "deck", body: (life) => `${life.birth.name}이 잠시 자리를 비운 사이 동료가 일을 이어 했다. 돌아와 보니 서로 다른 방법으로도 같은 매듭을 만들 수 있었다.`,
    choices: [
      { id: "compliment_mate", label: "동료의 솜씨를 칭찬하며 감사를 표한다", risk: "친구와의 유대 +6", personality: { loyalty: 5, empathy: 4 }, apply: (s) => { s.friendBond += 6; return "서로의 손재주를 추켜세우며 유쾌하게 작업을 마쳤다."; } },
      { id: "learn_method", label: "두 사람의 방식을 합쳐 더 튼튼하게 고친다", risk: "기술 +5", personality: { caution: 4 }, apply: (s) => { s.skill += 5; return "서로 다른 비결을 교환해 작업 속도를 배로 늘렸다."; } }
    ] },
  { title: "약 한 봉지", art: "workbench", body: "작은 상처를 치료할 약이 모자랐다. 큰 배가 오기 전에도 마을 사람은 아프다는 사실을 장부에 남겼다.",
    choices: [
      { id: "share_medicine", label: "남은 약을 환자들에게 아낌없이 나눈다", risk: "지역의 신뢰 +7", personality: { empathy: 6 }, apply: (s) => { s.trust += 7; return "약통은 비었지만 마을 사람들의 눈가에 안도감이 돌았다."; } },
      { id: "forage_herbs", label: "약초를 더 구하기 위해 마을 뒷산을 살핀다", risk: "기술 +4 · 건강 +4", personality: { caution: 4 }, apply: (s) => { s.skill += 4; s.health += 4; return "산기슭에서 지혈에 좋은 약초를 한 바구니 캐 왔다."; } }
    ] },
  { title: "대답 없는 편지", art: "workbench", body: "지난번에 보낸 편지는 아직 답이 없었다. 기다리는 사람은 배가 늦는 이유를 짐작했지만, 확인되지 않은 불행을 먼저 쓰지 않았다.",
    choices: [
      { id: "pray_safety", label: "상대가 무사하길 바라며 마음을 전한다", risk: "친구와의 유대 +5", personality: { loyalty: 5 }, apply: (s) => { s.friendBond += 5; return "바다의 바람을 타고 소식이 닿길 조용히 기원했다."; } },
      { id: "send_followup", label: "다음 배편에 짧은 안부 편지를 한 통 더 부친다", risk: "친구와의 유대 +7", personality: { empathy: 5 }, apply: (s) => { s.friendBond += 7; return "조급해하지 않고 건강히 지내라는 한 줄을 다시 띄웠다."; } }
    ] },
  { title: "서로 다른 깃발", art: "deck", body: "낯선 깃발의 배 두 척이 같은 부두를 원했다. 항구 사람들은 이름보다 먼저 실은 물자와 다친 사람이 있는지를 물었다.",
    choices: [
      { id: "treat_wounded", label: "부상자가 먼저 치료받을 수 있게 주선한다", risk: "지역의 신뢰 +6", personality: { empathy: 6 }, apply: (s) => { s.trust += 6; return "깃발의 색깔과 상관없이 피 흘리는 선원부터 구호소로 이끌었다."; } },
      { id: "separate_berths", label: "두 배가 부딪치지 않게 정박 구역을 나눈다", risk: "기술 +5 · 신중함", personality: { caution: 5 }, apply: (s) => { s.skill += 5; return "공평하게 닻자리를 나눠 칼부림 없이 부두를 정돈했다."; } }
    ] },
  { title: "길어진 그림자", art: "deck", body: "해가 낮아질수록 창고의 그림자가 길어졌다. 먼 곳의 전쟁 이야기는 잠시 멎었고, 일꾼들은 내일 쓸 나무를 안으로 옮겼다.",
    choices: [
      { id: "tidy_timbers", label: "해 질 녘까지 남은 자재를 말끔히 정리한다", risk: "기술 +5 · 물자 +3", personality: { caution: 4 }, apply: (s) => { s.skill += 5; s.supplies += 3; return "비바람을 막을 방수포를 꼼꼼히 덮어 두었다."; } },
      { id: "watch_sunset", label: "동료들과 노을을 바라보며 하루를 마무리한다", risk: "건강 +5 · 친구와의 유대 +4", personality: { empathy: 4, freedom: 4 }, apply: (s) => { s.health += 5; s.friendBond += 4; return "붉게 물든 수평선을 보며 고단한 하루의 숨을 골랐다."; } }
    ] },
  { title: "빈 의자 하나", art: "workbench", body: "식탁의 빈 의자에 누구를 앉힐지 정하지 못했다. 돌아올 사람을 기다리는 일에도 서로 다른 시간이 필요했다.",
    choices: [
      { id: "save_seat", label: "언제든 돌아오면 앉을 수 있게 자리를 비워 둔다", risk: "친구와의 유대 +6 · 의리", personality: { loyalty: 6 }, apply: (s) => { s.friendBond += 6; return "그 자리에 놓인 물잔 하나가 오랜 약속처럼 남았다."; } },
      { id: "welcome_newcomer", label: "오늘 처음 온 손님을 따뜻하게 그 자리에 앉힌다", risk: "지역의 신뢰 +5", personality: { empathy: 5 }, apply: (s) => { s.trust += 5; return "새로 온 여행자가 감사의 미소를 지으며 자리에 앉았다."; } }
    ] },
  { title: "기다린 물때", art: "deck", body: "지금 떠나면 빠르다는 선원도 있었다. 그러나 물때가 바뀌길 기다린 뒤에야 짐을 실을 수 있었다. 늦은 출항이 곧 잘못은 아니었다.",
    choices: [
      { id: "wait_safely", label: "서두르지 않고 바다가 허락할 때까지 기다린다", risk: "건강 +4 · 신중함", personality: { caution: 6 }, apply: (s) => { s.health += 4; return "조류가 잔잔해지자 배는 미끄러지듯 수로를 빠져나갔다."; } },
      { id: "clean_barnacles", label: "기다리는 동안 배 밑바닥의 따개비를 긁어낸다", risk: "기술 +6", personality: { ambition: 4 }, apply: (s) => { s.skill += 6; return "선체 저항을 줄여 다음 항해 속도가 훨씬 빨라졌다."; } }
    ] },
  { title: "새로 적은 가격", art: "workbench", body: "장터의 물값이 바뀌었다. 상인은 먼 사건을 이유로 들었고 주민은 가까운 우물을 가리켰다. 서로의 계산이 맞지 않는 날이었다.",
    choices: [
      { id: "pay_quietly", label: "오른 가격에도 묵묵히 제값을 치른다", risk: "지역의 신뢰 +5", personality: { caution: 4 }, apply: (s) => { s.trust += 5; return "실랑이를 줄이고 상인과 원만한 관계를 유지했다."; } },
      { id: "offer_well", label: "동네 사람들과 우물을 함께 쓰자고 제안한다", risk: "지역의 신뢰 +7", personality: { empathy: 6 }, apply: (s) => { s.trust += 7; return "이웃들이 두레박을 함께 당기며 물 걱정을 덜었다."; } }
    ] },
  { title: "누구의 실수인가", art: "workbench", body: "젖은 물자가 창고에서 발견됐다. 책임자를 찾는 소리가 먼저 나왔지만, 빗물이 어디로 흘렀는지 확인하는 일이 더 급했다.",
    choices: [
      { id: "dry_supplies", label: "탓하지 않고 젖은 물자부터 햇볕에 넌다", risk: "지역의 신뢰 +5 · 물자 +3", personality: { empathy: 5 }, apply: (s) => { s.trust += 5; s.supplies += 3; return "상하기 전에 물자를 말려 피해를 최소한으로 막았다."; } },
      { id: "repair_roof", label: "물길이 샌 지붕 틈을 단단히 메운다", risk: "기술 +6", personality: { caution: 5 }, apply: (s) => { s.skill += 6; return "기와를 덧대고 역청을 발라 다음 비에 대비했다."; } }
    ] },
  { title: "늦은 낮잠", art: "deck", body: "당직을 마친 사람이 부두 그늘에서 잠들었다. 전보벌레도 그 옆에서 잠깐 울다 말았다. 오후의 일은 깨어 있는 사람들이 나눴다.",
    choices: [
      { id: "give_coat", label: "자고 있는 당직자에게 겉옷을 덮어 준다", risk: "친구와의 유대 +6", personality: { empathy: 6 }, apply: (s) => { s.friendBond += 6; return "바닷바람에 감기 들지 않도록 외투를 살며시 둘러주었다."; } },
      { id: "silent_chores", label: "조용히 발걸음을 죽이며 오후 작업을 이어간다", risk: "기술 +4 · 신중함", personality: { caution: 4 }, apply: (s) => { s.skill += 4; return "동료의 단잠을 깨우지 않고 밧줄 정리를 끝마쳤다."; } }
    ] },
  { title: "깃발을 꿰맨 날", art: "workbench", body: (life) => `${life.affiliation}의 낡은 깃발에 작은 구멍이 났다. 새 깃발을 살지 꿰맬지 의논하다가, 결국 바늘을 든 사람이 먼저 일을 시작했다.`,
    choices: [
      { id: "sturdy_stitch", label: "굵은 실로 해풍에도 찢기지 않게 꿰맨다", risk: "기술 +5 · 의리 +4", personality: { loyalty: 5 }, apply: (s) => { s.skill += 5; return "단단한 바느질로 꿰맨 자리가 오히려 깃발의 멋이 되었다."; } },
      { id: "flag_toast", label: "동료들과 깃발의 의미를 다시 새긴다", risk: "친구와의 유대 +6 · 야망 +4", personality: { ambition: 4, loyalty: 5 }, apply: (s) => { s.friendBond += 6; return "깃발 아래 모였던 첫날의 약속을 다시 떠올렸다."; } }
    ] },
  { title: "항구의 웃음소리", art: "deck", body: "짐을 잘못 내린 선원이 자기 배 이름을 크게 외쳤다. 한바탕 웃고 짐을 다시 옮겼다. 저녁에는 모두 어느 배였는지 정확히 기억했다.",
    choices: [
      { id: "laugh_and_help", label: "함께 호탕하게 웃으며 짐 옮기는 걸 돕는다", risk: "친구와의 유대 +5", personality: { empathy: 5, freedom: 4 }, apply: (s) => { s.friendBond += 5; return "무거운 궤짝을 둘이 맞들고 뛰며 한바탕 웃음을 터뜨렸다."; } },
      { id: "correct_manifest", label: "짐표를 다시 확인해 원래 배로 정확히 보낸다", risk: "기술 +5 · 지역의 신뢰 +4", personality: { caution: 4 }, apply: (s) => { s.skill += 5; s.trust += 4; return "화물 목록을 대조해 주인을 제대로 찾아주었다."; } }
    ] },
  { title: "지도 바깥의 길", art: "deck", body: "오래된 해도에 없는 얕은 물길이 보였다. 누구도 바로 배를 밀어 넣지 않았다. 낯선 길을 발견한 하루와 그 길을 쓰는 하루는 달랐다.",
    choices: [
      { id: "climb_and_scout", label: "높은 곳에 올라 새 물길의 너머를 관측한다", risk: "기술 +7 · 신중함", personality: { caution: 5, ambition: 4 }, apply: (s) => { s.skill += 7; return "망루에서 암초의 배열과 수심을 정확히 헤아렸다."; } },
      { id: "note_on_chart", label: "기록지침의 각도와 함께 해도 여백에 적어 둔다", risk: "기술 +6 · 자유로움", personality: { freedom: 5 }, apply: (s) => { s.skill += 6; return "훗날 위급할 때 쓸 비밀 우회로를 해도 구석에 남겼다."; } }
    ] }
];


// Rule 11 adds dailies with their own small choices, so long stretches of the canon era are not all reading.
export const MOMENTS_V11 = [
  { title: "갈매기가 떨어뜨린 신문", art: "deck", body: "뉴스 쿠가 떨어뜨린 신문 사이로 새 수배서 몇 장이 미끄러져 나왔다. 처음 보는 얼굴과 낯익은 얼굴이 섞여 있었다.",
    choices: [{ id: "pin", label: "수배서를 부두 게시판에 붙인다", risk: "지역의 신뢰가 오를 수 있음", personality: { loyalty: 3 }, apply: (s) => { s.trust += 5; return "사람들이 게시판 앞에 모여 이름을 하나씩 읽었다."; } },
      { id: "keep", label: "몰래 한 장 챙겨 둔다", risk: "언젠가 쓸모가 있을지 모름", personality: { freedom: 3 }, apply: (s) => { s.skill += 3; return "접어 넣은 수배서의 얼굴을 밤마다 한 번씩 떠올렸다."; } }] },
  { title: "비싸진 기록지침", art: "workbench", body: "위대한 항로로 가려는 신참 해적이 늘면서 기록지침 값이 두 배로 뛰었다. 상인은 다음 배가 언제 올지 모른다고 했다.",
    choices: [{ id: "buy", label: "여분 하나를 미리 사 둔다", cost: 10, risk: "물자가 든다", personality: { caution: 4 }, apply: (s) => { s.supplies -= 10; s.skill += 5; return "바늘이 둘이면 길을 잃을 걱정도 반이 됐다."; } },
      { id: "haggle", label: "값을 깎아 본다", risk: "결과는 알 수 없음", personality: { ambition: 3 }, apply: (s) => { if (yearRoll(s.seed ^ 0x51, s.canonDailyIndex) % 2) { s.supplies += 5; return "상인이 졌다는 듯 웃으며 덤까지 얹어 주었다."; } return "상인은 끝까지 버텼다. 오늘은 빈손으로 돌아섰다."; } }] },
  { title: "밀짚모자를 흉내 내는 아이들", art: "deck", body: "부두의 아이들이 낡은 밀짚모자를 돌려 쓰며 해적 놀이를 했다. 서로 자기가 선장이라며 다투는 중이었다.",
    choices: [{ id: "play", label: "해군 역할을 맡아 준다", risk: "친구와의 유대가 오를 수 있음", personality: { empathy: 4 }, apply: (s) => { s.friendBond += 5; return "한참을 쫓겨 다닌 끝에 아이들에게 붙잡혔다. 모두 숨이 차도록 웃었다."; } },
      { id: "story", label: "진짜 바다 이야기를 들려준다", risk: "아이들이 귀를 기울임", personality: { loyalty: 3 }, apply: (s) => { s.trust += 5; return "아이들은 이야기가 끝나자 언젠가 바다로 나가겠다고 약속했다."; } }] },
  { title: "항구에 들른 낯선 군함", art: "deck", body: "평소 보지 못한 깃발의 군함이 물을 채우러 들렀다. 수병들은 말을 아꼈고 장교 하나가 부두의 배들을 오래 바라보았다.",
    choices: [{ id: "trade", label: "물과 식량을 팔아 준다", risk: "물자가 늘 수 있음", personality: { ambition: 3 }, apply: (s) => { s.supplies += 10; return "장교는 값을 깎지 않았다. 떠나면서 다음 항로의 날씨를 귀띔해 주었다."; } },
      { id: "avoid", label: "배를 뒤쪽 부두로 옮긴다", risk: "눈에 띄지 않음", personality: { caution: 4 }, apply: (s) => { s.health += 3; return "군함이 떠날 때까지 조용히 그물을 손질했다."; } }] },
  { title: "주점의 무용담", art: "workbench", body: "주점 한쪽에서 누군가 밀짚모자와 같은 배를 탔었다고 떠들었다. 듣는 사람마다 표정이 달랐다.",
    choices: [{ id: "buy", label: "술 한 잔 사고 끝까지 듣는다", cost: 5, risk: "이야기가 진짜일지는 모름", personality: { freedom: 3 }, apply: (s) => { s.supplies -= 5; s.skill += 3; return "절반은 거짓말 같았지만 바다 이야기 하나는 진짜였다."; } },
      { id: "doubt", label: "허풍이라며 웃어넘긴다", risk: "주점 분위기가 식을 수 있음", personality: { caution: 3 }, apply: () => "사내는 머쓱하게 잔을 비웠다. 그래도 이야기는 다음 테이블로 옮겨 갔다." }] },
  { title: "폭풍이 지나간 해변", art: "deck", body: "밤새 폭풍이 지나간 해변에 부서진 상자와 밧줄이 잔뜩 떠밀려 왔다. 어느 배의 것인지는 알 수 없었다.",
    choices: [{ id: "collect", label: "쓸 만한 것을 줍는다", risk: "물자가 늘 수 있음", personality: { ambition: 3 }, apply: (s) => { s.supplies += 8; return "멀쩡한 밧줄 두 타래와 젖은 통조림 몇 개를 건졌다."; } },
      { id: "search", label: "조난자가 없는지 먼저 살핀다", risk: "시간이 걸림", personality: { empathy: 5 }, apply: (s) => { s.trust += 6; return "바위 틈에서 지친 선원 하나를 찾아 마을로 업고 왔다."; } }] },
  { title: "새 현상금 소식에 술렁인 부두", art: "workbench", body: "새로 나온 수배서 금액을 두고 부두가 술렁였다. 누군가는 겁을 먹었고, 누군가는 언젠가 저 금액을 넘기겠다고 했다.",
    choices: [{ id: "dream", label: "언젠가의 자기 금액을 상상한다", risk: "야망이 자람", personality: { ambition: 5 }, apply: () => "수배서 속 숫자 옆에 자기 얼굴을 대 보았다. 동료가 등을 툭 쳤다." },
      { id: "worry", label: "가족에게 조심하라는 편지를 쓴다", risk: "양육자와의 유대가 오를 수 있음", personality: { caution: 4 }, apply: (s) => { s.bond += 5; return "답장에는 오히려 이쪽 걱정이 가득했다."; } }] }
];

export const MOMENTS_V20 = [
  {
    title: "갑작스러운 급변 폭풍", art: "lifeStorm",
    body: (life) => `${life.location} 인근 해역에서 기상이 급변하며 거대한 용오름과 폭풍우가 몰아쳤다. 바닷물이 갑판을 집어삼킬 듯 솟구쳤다.`,
    choices: [
      { id: "brave_helm", label: "위험을 무릅쓰고 키를 직접 잡고 폭풍을 정면 돌파한다",
        needs: { skill: 50, health: 45 },
        risk: "기술 50 · 건강 45 필요 · 성공 시 항해 기술 +12 · 실패 시 건강 -20",
        failRisk: "건강 -20 · 파도에 휩쓸림",
        personality: { ambition: 7, freedom: 5, caution: -4 },
        apply: (s) => { s.skill += 12; s.trust += 8; return "거센 돌풍을 노련한 조타로 뚫어냈다. 갑판 위 선원들이 환호성을 질렀다."; },
        fail: (s) => { s.health = Math.max(10, s.health - 20); return "거대한 파도가 갑판을 덮쳤다. 돛대에 부딪혀 늑골을 다쳤지만 간신히 배를 지켜냈다."; } },
      { id: "shelter_hold", label: "돛을 모두 접고 선창으로 피신해 파도가 지나가길 기다린다",
        risk: "물자 -10 · 건강 +5 · 안전한 선택",
        personality: { caution: 6, freedom: -3 },
        apply: (s) => { s.supplies -= 10; s.health += 5; return "안전을 택했지만 파도에 실려 온 바닷물로 식량 일부가 상했다."; } }
    ]
  },
  {
    title: "굶주린 소형 해왕류의 습격", art: "dangerSeaKing",
    body: "항해 중 바다 밑에서 솟구쳐 오른 해왕류가 뱃전을 물어뜯으려 했다. 갑판의 선원들이 무기를 챙기며 비명을 질렀다.",
    choices: [
      { id: "slay_beast", label: "선두에 서서 무기를 들고 해왕류와 정면 격돌한다",
        needs: { skill: 55, health: 50 },
        risk: "기술 55 · 건강 50 필요 · 성공 시 식량/물자 +25 · 실패 시 건강 -20",
        failRisk: "건강 -20 · 부상 위험",
        personality: { ambition: 8, caution: -5 },
        apply: (s) => {
          s.supplies += 25; s.skill += 10;
          if (s.path === "marine") s.reputation = (s.reputation || 0) + 10;
          return "거대한 턱을 내리치고 해왕류를 쓰러뜨렸다. 선창 가득 고기를 확보했다.";
        },
        fail: (s) => { s.health = Math.max(10, s.health - 20); return "괴수의 지느러미에 맞아 바다로 날아갈 뻔했다. 동료들이 간신히 끌어올렸지만 중상을 입었다."; } },
      { id: "bait_distract", label: "작은 작살과 미끼를 던져 바깥으로 유인한다",
        cost: 8,
        risk: "물자 -8 · 기술 +5",
        personality: { caution: 5, empathy: 3 },
        apply: (s) => { s.supplies -= 8; s.skill += 5; return "미끼를 던져 괴수의 주의를 끄는 사이 배를 전속력으로 빼냈다."; } }
    ]
  },
  {
    title: "괴질과 괴혈병의 습격", art: "workbench",
    body: "긴 항해 끝에 선원들 사이에 잇몸이 무너지고 열이 끓는 괴질이 번졌다. 약통은 빠르게 비어 가고 있었다.",
    choices: [
      { id: "sacrifice_nurse", label: "자신의 체력을 깎으며 밤낮으로 환자들을 간호한다",
        risk: "건강 -15 · 친구와의 유대 +18 · 신뢰 +10",
        personality: { empathy: 9, loyalty: 6 },
        apply: (s) => { s.health = Math.max(10, s.health - 15); s.friendBond += 18; s.trust += 10; return "몸을 사리지 않은 헌신 덕에 선원들이 모두 목숨을 건졌다. 병상에서 일어난 이들이 눈물을 글썽였다."; } },
      { id: "strict_ration", label: "다음 섬의 약재상에 닿을 때까지 엄격히 통제하고 버틴다",
        cost: 10,
        risk: "물자 -10 · 건강 -8",
        personality: { caution: 7 },
        apply: (s) => { s.supplies -= 10; s.health = Math.max(10, s.health - 8); return "엄격한 통제 속에서 간신히 다음 섬까지 버텼다. 모두의 체력이 크게 깎였다."; } }
    ]
  },
  {
    title: "한계를 시험하는 극한의 선상 단련", art: "workbenchHakiTraining",
    body: (life) => `${life.location} 앞바다에서 파도를 맞으며 스스로의 한계를 시험할 기회가 왔다. 평범한 단련으로는 도달할 수 없는 영역이었다.`,
    choices: [
      { id: "break_limits", label: "뼈와 근육이 비명을 지를 때까지 온 힘을 다해 수련한다",
        risk: "건강 -12 · 기술 +15 · 야망 +8",
        personality: { ambition: 9, caution: -6 },
        apply: (s) => { s.health = Math.max(10, s.health - 12); s.skill += 15; return "피땀 흘린 수련 끝에 주먹과 발끝에 새로운 감각이 깃들었다. 신체와 기술이 비약적으로 단련됐다."; } },
      { id: "steady_drill", label: "무리하지 않고 기본 동작만 반복하며 컨디션을 조절한다",
        risk: "건강 +8 · 기술 +4",
        personality: { caution: 5 },
        apply: (s) => { s.health += 8; s.skill += 4; return "무리한 부상을 피하며 몸의 균형을 안정적으로 유지했다."; } }
    ]
  },
  {
    title: "심해로 침몰한 보물선 탐사", art: "deck",
    body: "암초 너머 가라앉은 난파선의 잔해가 보였다. 어두운 수심 아래 반짝이는 궤짝들이 손짓하고 있었다.",
    choices: [
      { id: "deep_dive", label: "폐활량의 한계를 걸고 거친 수압 속으로 잠수한다",
        needs: { health: 50, skill: 45 },
        risk: "건강 50 · 기술 45 필요 · 성공 시 물자 +30 · 실패 시 건강 -18",
        failRisk: "건강 -18 · 익사 위기",
        personality: { ambition: 8, freedom: 5, caution: -6 },
        apply: (s) => { s.supplies += 30; s.skill += 8; return "심해의 부서진 상자에서 막대한 금은보화와 보급품을 건져 올렸다!"; },
        fail: (s) => { s.health = Math.max(10, s.health - 18); return "수압과 산소 부족으로 기절 직전 동료들에게 끌어올려졌다. 바닷물만 잔뜩 마시고 폐를 다쳤다."; } },
      { id: "hook_salvage", label: "갈고리 밧줄만 내려 닿는 것만 조심스럽게 건진다",
        risk: "물자 +8 · 기술 +4",
        personality: { caution: 5 },
        apply: (s) => { s.supplies += 8; s.skill += 4; return "안전하게 밧줄을 걸어 작은 궤짝 하나를 건졌다."; } }
    ]
  },
  {
    title: "암초 지대의 벼랑 끝 항해", art: "deck",
    body: "칼날처럼 솟은 암초 지대가 앞길을 가로막았다. 돌아가면 며칠이 걸리지만 한 줄기 좁은 물길이 눈에 띄었다.",
    choices: [
      { id: "razor_cut", label: "선체의 파손을 각오하고 최단거리 수로를 뚫는다",
        needs: { skill: 55 },
        risk: "기술 55 필요 · 성공 시 기술 +14 · 실패 시 건강 -18, 물자 -15",
        failRisk: "건강 -18 · 물자 -15",
        personality: { ambition: 7, freedom: 6, caution: -5 },
        apply: (s) => { s.skill += 14; return "날카로운 암초 사이를 깃털처럼 빠져나갔다. 전설적인 조타 솜씨였다."; },
        fail: (s) => { s.health = Math.max(10, s.health - 18); s.supplies -= 15; return "배 밑바닥이 암초에 부딪히며 부서졌다. 파편에 다리를 다치고 침수를 메우느라 고생했다."; } },
      { id: "wide_detour", label: "시간이 걸리더라도 널찍한 외해로 크게 돌아간다",
        cost: 8,
        risk: "물자 -8 · 건강 +4",
        personality: { caution: 6 },
        apply: (s) => { s.supplies -= 8; s.health += 4; return "항해는 길어졌지만 배와 선원 모두 무사했다."; } }
    ]
  }
];

// Some arcs follow closely; others leave space for several ordinary scenes.
export function canonGapFor(life, phase, step) {
  const salt = phase === "before" ? 0x31b7c5a9 : 0x7da4e26f;
  if (life.creationVersion >= 20) {
    const raw = [1, 0, 1, 2, 0, 1, 1, 0, 2, 1][yearRoll(life.seed ^ salt, step) % 10];
    const prevRaw = step > 0 ? [1, 0, 1, 2, 0, 1, 1, 0, 2, 1][yearRoll(life.seed ^ salt, step - 1) % 10] : 1;
    return raw === 0 && (step === 0 || prevRaw === 0) ? 1 : raw;
  }
  if (life.creationVersion >= 10) return [1, 2, 1, 3, 2, 1, 2, 0, 3, 1][yearRoll(life.seed ^ salt, step) % 10];
  if (phase === "before") return [0, 1, 2, 0, 3, 1][yearRoll(life.seed ^ salt, step) % 6];
  const gap = [1, 2, 3, 1, 0, 2, 1, 3][yearRoll(life.seed ^ salt, step) % 8];
  const previousWasZero = step > 0 && yearRoll(life.seed ^ salt, step - 1) % 8 === 4;
  return gap === 0 && (step === 0 || previousWasZero) ? 1 : gap;
}

export function canonInterludeScene(life) {
  if (life.creationVersion < 5 || life.canonGapRemaining <= 0) return null;
  const time = DAYS[yearRoll(life.seed ^ 0x298ca7d3, life.canonDailyIndex) % DAYS.length];
  if (life.leftHome && !life.homebound && yearRoll(life.seed ^ 0x52ac417e, life.canonDailyIndex) % 8 === 0) {
    const voyage = travelScene(life, life.age);
    // Rule 29: avoid near-identical voyage titles; do not alter older save replays.
    const alreadyTitled = life.creationVersion >= 29
      && life.journal.slice(-10).some((entry) => entry.title === voyage.title);
    const voyageCount = life.journal.filter((entry) => entry.title === voyage.title
      || entry.title.startsWith(voyage.title + " ·")).length;
    return { ...voyage, title: alreadyTitled ? voyage.title + " · " + (voyageCount + 1) + "번째 항해" : voyage.title,
      id: `life_canon_daily_${life.canonDailyIndex}`, act: 3, canonDaily: true,
      timeLabel: `${time} · ${life.location}`, choices: [...voyage.choices,
        { id: "stay", label: "이번 물때는 여기서 지낸다", risk: "지역의 신뢰 +5 · 현재 섬에 머묾",
          personality: { caution: 3 }, apply: (state) => { state.trust += 5; return "다음 바늘이 움직일 때까지 이곳 사람들의 일을 도왔다."; } }] };
  }
  const v11 = life.creationVersion >= 11;
  const v20 = life.creationVersion >= 20;
  if (v11) {
    // Every few slots the era lets a mishap, danger or a recurring person's scene through.
    const roll = yearRoll(life.seed ^ 0x2d4f81b3, life.canonDailyIndex) % (v20 ? 4 : 5);
    const slotBase = { age: life.age, act: 3, species: "all", yearly: true, canonDaily: true, timeLabel: `${time} · ${life.location}` };
    const event = (roll === 0 || (v20 && roll === 2)) ? eraAdventure(life, life.canonDailyIndex, slotBase) : roll === 1 ? personalBeat(life, life.age, slotBase) : null;
    if (event) return { ...event, canonDaily: true, timeLabel: `${time} · ${life.location}` };
  }
  const recent = life.journal.slice(-10).map((entry) => entry.title);
  const pool = v20 ? [...MOMENTS_V20, ...MOMENTS, ...MOMENTS_V11] : v11 ? [...MOMENTS, ...MOMENTS_V11] : MOMENTS;
  // Rule 11 also avoids any daily already seen in this life until the pool runs out.
  const seenTitles = v11 ? new Set(life.journal.map((entry) => entry.title)) : new Set();
  let index = yearRoll(life.seed ^ 0x5cd98e41, life.canonDailyIndex) % pool.length;
  for (let tries = 0; tries < pool.length && (seenTitles.has(pool[index].title) || recent.includes(pool[index].title)); tries += 1) index = (index + 1) % pool.length;
  while (recent.includes(pool[index].title)) index = (index + 1) % pool.length;
  const moment = pool[index];
  const decision = !moment.choices && yearRoll(life.seed ^ 0x4629fb10, life.canonDailyIndex) % (v11 ? 3 : 7) === 0;
  // Rule 33: repeated small tasks should not keep rewarding a nearly capped skill or bond.
  const sharedWork = life.creationVersion >= 33 && life.friendBond >= 95;
  const sharedRest = sharedWork && life.trust >= 95;
  const wellTrained = life.creationVersion >= 33 && life.skill >= 95;
  const equipmentRest = wellTrained && life.supplies >= 95;
  return { id: `life_canon_daily_${life.canonDailyIndex}`, age: life.age, act: 3, species: "all",
    yearly: true, urgent: true, canonDaily: true, art: moment.art, title: moment.title,
    timeLabel: `${time} · ${life.location}`, body: moment.body,
    ...(moment.choices ? { choices: moment.choices } : {}),
    ...(decision ? { choices: [
      { id: "listen",
        label: sharedRest ? "함께 일을 마치고 잠시 쉬며 몸을 돌본다"
          : sharedWork ? "기항지 사람들과 오늘의 배움을 나눈다" : "곁의 사람과 오늘 일을 함께 정한다",
        risk: sharedRest ? "건강 +5" : sharedWork ? "지역 신뢰 +5" : "친구와의 유대 +5",
        personality: { empathy: 3, loyalty: 3 },
        apply: (state) => {
          if (sharedRest) { state.health += 5; return "오늘의 일을 마치고 몸을 돌보며 다음 날의 피로를 덜었다."; }
          if (sharedWork) { state.trust += 5; return "새로 배운 일을 이웃과 나누며 기항지의 신뢰를 쌓았다."; }
          state.friendBond += 5; return "서로 듣지 못했던 사정을 나누고 내일의 순서를 정했다.";
        } },
      { id: "prepare",
        label: equipmentRest ? "쓰던 도구를 정리하고 몸을 회복한다"
          : wellTrained ? "남은 자재를 정리해 다음 작업의 물자를 확보한다" : "다음 일을 위한 도구를 먼저 챙긴다",
        risk: equipmentRest ? "건강 +5" : wellTrained ? "물자 +5" : "기술 +5",
        personality: { caution: 3 },
        apply: (state) => {
          if (equipmentRest) { state.health += 5; return "장비를 손보고 휴식을 취해 다음 일을 준비했다."; }
          if (wellTrained) { state.supplies += 5; return "흩어진 자재를 회수해 다음 작업의 물자를 정리했다."; }
          state.skill += 5; return "도구를 손보니 다음 날의 첫 일이 조금 수월해졌다.";
        } }
    ] } : {}) };
}
