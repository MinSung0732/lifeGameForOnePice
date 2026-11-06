import { formatBounty, pursuerFor } from "./bounty.js";
import { sailToNextPort, yearRoll } from "./world.js";
import { rollTier } from "./fates.js";
import { FRUIT_POWER, POWER_CHOICES, fruitSynergy } from "./power-choices.js";

// Rule 7: loud, comic One Piece-style mishaps plus dangers that can end a life mid-way.
// Every roll is seeded, so a save replays to the same outcome.
const giant = (life) => life.birth.species === "거인족";
const adult = (life) => giant(life) ? 112 : 17;
const batchim = (word) => { const last = word.codePointAt(word.length - 1); return last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0; };
const ig = (word) => `${word}${batchim(word) ? "이" : "가"}`;
const eun = (word) => `${word}${batchim(word) ? "은" : "는"}`;
const eul = (word) => `${word}${batchim(word) ? "을" : "를"}`;
const lucky = (life, salt, percent) => yearRoll(life.seed ^ salt, life.age) % 100 < percent;
const atSea = (life) => life.leftHome && !life.homebound;
const outlaw = (life) => ["pirate", "liberator"].includes(life.path) && !life.homebound;

// A heavy blow kills only when it empties health; otherwise it leaves a scar the ending can mention.
function wound(life, damage, cause) {
  life.health -= damage;
  life.scars = (life.scars || 0) + 1;
  if (life.health > 0) return false;
  life.ending = "death";
  life.deathCause = cause;
  return true;
}

export const MISHAPS = [
  { id: "feast", art: "mishapFeast", when: atSea, title: "고기 쟁탈 연회",
    body: (life) => `섬에 닿은 첫날 밤, 누가 시작했는지 모를 연회가 터졌다! 갑판 한가운데 놓인 해왕류 고기 한 덩이를 두고 모두가 눈빛을 번뜩였다. ${eun(life.birth.name)} 접시를 든 채 기회를 노렸다.`,
    choices: [
      { id: "dive", label: "고기 더미로 몸을 날린다", needs: { health: 45 }, risk: "건강 45 필요 · 이기면 배부름과 명성", failRisk: "건강 -10 · 동료들의 놀림",
        personality: { ambition: 6, freedom: 5 },
        apply: (life) => { life.health += 5; life.friendBond += 10; return "뼈다귀를 번쩍 들어 올리자 갑판 전체가 박수를 쳤다. 그날 밤 별명이 하나 생겼다."; },
        fail: (life) => { life.health -= 10; return "고기 대신 동료의 팔꿈치를 정통으로 맞았다. 다음 날까지 모두가 그 장면을 흉내 냈다."; } },
      { id: "sing", label: "뱃노래로 분위기를 띄운다", cost: 10, risk: "물자 -10 · 친구와의 유대 +10", personality: { empathy: 5, freedom: 5 },
        apply: (life) => { life.supplies -= 10; life.friendBond += 10; return "노래가 세 바퀴째 돌자 모두 고기를 잊고 어깨동무를 했다. 술통이 하나 비었다."; } },
      { id: "corner", label: "구석에서 조용히 남은 것을 먹는다", risk: "건강 +10", personality: { caution: 6 },
        apply: (life) => { life.health += 10; return "아무도 노리지 않은 생선구이가 의외로 가장 맛있었다."; } }
    ] },
  { id: "poster_photo", art: (life) => life?.creationVersion >= 20 ? "harborBountyInspection" : "deck", when: (life) => life.bounty > 0, title: "망친 수배서 사진",
    body: (life) => `새로 붙은 수배서를 본 동료들이 배를 잡고 굴렀다. ${formatBounty(life.bounty)}짜리 사진 속 ${eun(life.birth.name)} 하필 재채기하던 순간이었다!`,
    choices: [
      { id: "protest", label: "해군 지부에 항의 편지를 보낸다", bounty: 2_000_000, risk: "결과는 알 수 없음 · 현상금이 오를지도", personality: { freedom: 7, caution: -5 },
        apply: () => "답장은 없었다. 대신 다음 수배서에 '해군을 조롱한 자'라는 문구와 조금 오른 금액이 붙었다." },
      { id: "brag", label: "오히려 자랑하고 다닌다", risk: "친구와의 유대 +10", personality: { freedom: 6, ambition: 4 },
        apply: (life) => { life.friendBond += 10; return "항구마다 수배서 옆에서 같은 표정을 지어 보였다. 아이들이 따라 했다."; } },
      { id: "peel", label: "밤마다 몰래 수배서를 떼어 낸다", risk: "기술 +5 · 물자 -10", cost: 10, personality: { caution: 5 },
        apply: (life) => { life.supplies -= 10; life.skill += 5; return "사흘 동안 수배서 마흔 장을 뗐다. 나흘째 아침에는 두 배로 붙어 있었다."; } }
    ] },
  { id: "drinking", when: (life) => true, title: "술집의 술 마시기 대결",
    body: "항구 술집의 터줏대감이 술잔을 탁 내려놓았다. 지는 쪽이 오늘 밤 모든 술값을 낸다는 것이었다. 구경꾼들은 벌써 판돈을 걸고 있었다.",
    choices: [
      { id: "accept", label: "잔을 들어 맞붙는다", needs: { health: 55 }, risk: "건강 55 필요 · 이기면 물자 +20", failRisk: "물자 -20 · 건강 -10",
        personality: { ambition: 6, caution: -4 },
        apply: (life) => { life.supplies += 20; return "터줏대감이 스르르 탁자 밑으로 사라졌다. 술집 전체가 오늘의 영웅을 연호했다."; },
        fail: (life) => { life.supplies -= 20; life.health -= 10; return "눈을 떠 보니 다음 날 오후였고 지갑은 가벼웠다. 무슨 노래를 불렀는지는 아무도 말해 주지 않았다."; } },
      { id: "referee", label: "심판을 자처하고 판돈을 관리한다", risk: "지역의 신뢰 +10", personality: { caution: 5, loyalty: 3 },
        apply: (life) => { life.trust += 10; return "공정한 심판 덕에 싸움 없이 밤이 끝났다. 다음 날 술집 주인이 식량 한 상자를 보냈다."; } }
    ] },
  { id: "upside_map", art: (life) => life?.creationVersion >= 20 ? "stormNavigationError" : "deck", when: atSea, title: "거꾸로 든 해도",
    body: "사흘째 같은 섬이 보였다. 알고 보니 항해를 맡은 동료가 해도를 거꾸로 들고 있었다! 동료는 이쪽이 더 멋진 길이라고 우겼다.",
    choices: [
      { id: "fix", label: "해도를 바로잡고 항로를 다시 짠다", risk: "기술 +10", personality: { caution: 6 },
        apply: (life) => { life.skill += 10; return "별자리와 해류를 맞춰 길을 되찾았다. 동료는 해도에 '위'라고 크게 적었다."; } },
      { id: "follow", label: "재밌으니 그대로 가 본다", risk: "결과는 알 수 없음", personality: { freedom: 9, caution: -6 },
        apply: (life) => {
          if (lucky(life, 0x6a11, 45)) { life.supplies += 25; return "엉뚱한 물길 끝에서 아무도 모르는 무인도를 찾았다. 열매가 주렁주렁 열린 섬이었다!"; }
          life.supplies -= 20; return "끝없는 바다만 이어졌다. 식량을 아껴 먹으며 겨우 원래 항로로 돌아왔다.";
        } }
    ] },
  { id: "marine_kitchen", when: (life) => life.path === "pirate" && !life.homebound, title: "해군 식당의 냄새",
    body: "기지 담장 너머에서 고기 굽는 냄새가 넘어왔다. 동료들은 배가 고파 쓰러지기 직전이었다. 누군가 해군 옷을 빌려 입자고 속삭였다.",
    choices: [
      { id: "sneak", label: "해군으로 변장해 식당에 들어간다", needs: { skill: 45 }, bounty: 3_000_000, risk: "기술 45 필요 · 성공하면 물자 +20 · 현상금이 오를 수 있음", failRisk: "건강 -15",
        personality: { freedom: 7, caution: -6 },
        apply: (life) => { life.supplies += 20; if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) - 6; return "배식 줄에 서서 세 번이나 더 받았다. 나올 때는 주방장에게 맛있다고 인사까지 했다."; },
        fail: (life) => { life.health -= 15; return "모자가 거꾸로였다. 국자를 든 주방장에게 기지 밖까지 쫓겨났다."; } },
      { id: "fish", label: "얌전히 바다에서 고기를 잡는다", risk: "물자 +10", personality: { caution: 6 },
        apply: (life) => { life.supplies += 10; return "생선 열 마리를 굽자 기지 쪽에서 오히려 냄새를 맡고 고개를 내밀었다."; } }
    ] },
  { id: "treasure_map", when: (life) => true, title: "수상한 보물지도",
    body: "골목의 장사꾼이 보물지도를 흔들었다. 전설의 해적이 묻은 금화가 있다고 했다. 지도 귀퉁이에는 어딘가 익숙한 커피 얼룩이 있었다.",
    choices: [
      { id: "buy", label: "지도를 사서 보물을 찾아 나선다", cost: 10, risk: "물자 -10 · 결과는 알 수 없음", personality: { ambition: 7, freedom: 6 },
        apply: (life) => {
          life.supplies -= 10;
          if (lucky(life, 0x6a12, 25)) { life.supplies += 45; return "정말로 상자가 나왔다! 금화는 반쯤 녹이 슬었지만 반년치 식량이 됐다."; }
          return "X 표시 아래에서 나온 돌에는 '또 속았지?'라고 새겨져 있었다. 장사꾼은 이미 섬을 떠났다.";
        } },
      { id: "expose", label: "가짜라고 사람들에게 알린다", risk: "지역의 신뢰 +10", personality: { empathy: 5, caution: 4 },
        apply: (life) => { life.trust += 10; return "같은 지도를 산 사람이 열두 명이나 됐다. 다 같이 장사꾼을 찾으러 다녔다."; } }
    ] },
  { id: "giant_fish", when: atSea, title: "낚싯줄 끝의 괴물",
    body: "느긋하게 드리운 낚싯대가 갑자기 활처럼 휘었다. 수면 아래 그림자가 배보다 컸다. 손을 놓으면 끝이지만 놓지 않으면 배째로 끌려갈 판이었다.",
    choices: [
      { id: "pull", label: "온몸으로 버텨 끌어 올린다", needs: { skill: 35, health: 50 }, risk: "기술 35 · 건강 50 필요 · 성공하면 물자 +30", failRisk: "물자 -10 · 건강 -10",
        personality: { ambition: 7, caution: -5 },
        apply: (life) => { life.supplies += 30; return "거대한 생선이 갑판에 떨어지자 배가 기우뚱했다. 일주일 내내 생선 요리였다."; },
        fail: (life) => { life.supplies -= 10; life.health -= 10; return "물고기가 배를 끌고 반나절을 달렸다. 결국 낚싯대만 남았다."; } },
      { id: "cut", label: "줄을 끊고 배를 지킨다", risk: "신중함이 자람", personality: { caution: 7 },
        apply: () => "줄을 끊자 그림자가 천천히 멀어졌다. 동료들이 아쉬운 듯 수면을 오래 내려다봤다." }
    ] },
  { id: "disguise", when: (life) => outlaw(life) && life.bounty > 0, title: "엉터리 변장",
    body: (life) => `항구 입구마다 해군이 수배서를 들고 서 있었다. 동료가 가짜 수염과 커다란 깃털 모자를 내밀며 이거면 아무도 ${eul(life.birth.name)} 못 알아볼 거라고 장담했다.`,
    choices: [
      { id: "wear", label: "변장하고 정문으로 당당히 걷는다", needs: { skill: 50 }, risk: "기술 50 필요 · 실패하면 현상금이 오름", failRisk: "건강 -15 · 현상금 상승",
        personality: { freedom: 8, caution: -5 },
        apply: (life) => { life.supplies += 10; return "해군이 정중하게 길을 비켜 주었다. 심지어 멋진 모자라는 칭찬까지 들었다."; },
        fail: (life) => { life.health -= 15; life.bounty += 5_000_000; return "수염이 바람에 날아갔다. 추격전 끝에 빠져나왔지만 다음 수배서에는 수염 그림이 추가됐다."; } },
      { id: "sewer", label: "하수도로 돌아간다", risk: "건강 -5 · 안전", personality: { caution: 7 },
        apply: (life) => { life.health -= 5; return "냄새는 사흘 동안 빠지지 않았지만 아무도 쫓아오지 않았다. 아무도 가까이 오지도 않았다."; } }
    ] },
  { id: "odd_merchant", when: (life) => true, title: "이상한 행상인",
    body: "등에 상자를 잔뜩 진 행상인이 길을 막았다. 마시면 키가 큰다는 음료, 날씨를 맞힌다는 조개, 말을 한다는 앵무새를 차례로 꺼내 보였다.",
    choices: [
      { id: "shell", label: "날씨 조개를 산다", cost: 10, risk: "물자 -10 · 결과는 알 수 없음", personality: { freedom: 5 },
        apply: (life) => { life.supplies -= 10; if (lucky(life, 0x6a13, 50)) { life.skill += 10; return "조개가 우는 날마다 정말 비가 왔다! 동료들은 조개에게 이름까지 붙였다."; } return "조개는 날씨와 상관없이 하루 종일 울었다. 시끄러워서 바다에 돌려보냈다."; } },
      { id: "parrot", label: "앵무새를 산다", cost: 10, risk: "물자 -10 · 친구와의 유대 +10", personality: { empathy: 4, freedom: 4 },
        apply: (life) => { life.supplies -= 10; life.friendBond += 10; return "앵무새가 배운 첫마디는 동료의 코골이 소리였다. 갑판이 웃음바다가 됐다."; } },
      { id: "pass", label: "웃으며 지나간다", risk: "신중함이 자람", personality: { caution: 5 },
        apply: () => "행상인은 다음 손님에게 같은 음료를 꺼내 보였다. 그 손님은 이미 두 병째였다." }
    ] },
  { id: "cake_thief", when: (life) => life.path === "marine" && !life.homebound, title: "사라진 생일 케이크",
    body: "고지식한 상관의 생일 케이크가 냉장고에서 사라졌다! 범인을 찾기 전까지 아무도 퇴근할 수 없다는 명령이 떨어졌다. 갈매기 한 마리가 수상하게 입가를 닦고 있었다.",
    choices: [
      { id: "investigate", label: "흔적을 따라 범인을 찾는다", risk: "기술 +10 · 지역의 신뢰 +5", personality: { caution: 5, loyalty: 4 },
        apply: (life) => { life.skill += 10; life.trust += 5; return "크림 묻은 발자국은 갈매기를 지나 부관의 방까지 이어졌다. 그날 기지의 분위기는 묘했다."; } },
      { id: "bake", label: "새 케이크를 직접 굽는다", cost: 10, risk: "물자 -10 · 지역의 신뢰 +10", personality: { empathy: 7 },
        apply: (life) => { life.supplies -= 10; life.trust += 10; return "모양은 엉망이었지만 상관이 처음으로 웃는 얼굴을 보였다."; } }
    ] },
  { id: "silly_code", when: (life) => life.path === "liberator", title: "부끄러운 암호",
    body: "새로 정해진 접선 암호는 '고양이는 바다를 싫어하지만 생선은 좋아한다'였다. 상대가 답할 차례에 항구 사람들 전부가 쳐다보고 있었다.",
    choices: [
      { id: "say", label: "진지한 얼굴로 끝까지 말한다", needs: { skill: 30 }, risk: "기술 30 필요 · 성공하면 지역의 신뢰 +10", failRisk: "지역의 신뢰 -5",
        personality: { loyalty: 6 },
        apply: (life) => { life.trust += 10; return "상대도 진지하게 '생선은 바다를 모른다'고 답했다. 둘 다 웃음을 참느라 어깨가 떨렸다."; },
        fail: (life) => { life.trust -= 5; return "중간에 웃음이 터졌다. 접선은 다음 날 다른 암호로 다시 했다."; } },
      { id: "change", label: "연락망에 암호를 바꾸자고 건의한다", risk: "기술 +5", personality: { caution: 5 },
        apply: (life) => { life.skill += 5; return "새 암호는 '날씨가 좋다'였다. 이번에는 진짜 날씨 이야기와 헷갈렸다."; } }
    ] },
  { id: "eating_contest", when: (life) => life.homebound || life.path === "civilian", title: "마을 대식가 대회",
    body: "해마다 열리는 대식가 대회에 올해는 낯선 거한이 나타났다. 마을 사람들은 고향의 명예가 걸렸다며 일제히 이쪽을 쳐다봤다.",
    choices: [
      { id: "enter", label: "고향의 명예를 걸고 나선다", needs: { health: 50 }, risk: "건강 50 필요 · 이기면 지역의 신뢰 +20", failRisk: "건강 -10",
        personality: { loyalty: 7, ambition: 5 },
        apply: (life) => { life.trust += 20; return "스물세 그릇째에 거한이 숟가락을 내려놓았다. 마을 입구에 이름이 걸렸다."; },
        fail: (life) => { life.health -= 10; return "열 그릇째에 눈앞이 하얘졌다. 그래도 끝까지 버틴 배짱은 칭찬받았다."; } },
      { id: "cook", label: "요리 담당으로 대회를 돕는다", risk: "친구와의 유대 +10", personality: { empathy: 6 },
        apply: (life) => { life.friendBond += 10; return "솥을 몇 개나 비웠는지 셀 수 없었다. 대회가 끝나고 모두가 남은 음식을 나눴다."; } }
    ] },
  { id: "mate_dream", when: (life) => Boolean(life.people?.mate) && life.people.mate.fate !== "잃음", title: "엉뚱한 꿈의 선언",
    body: (life) => `${ig(life.people.mate.name)} 갑판 끝에 올라서더니 세상에서 제일 큰 고기를 먹고 말겠다고 바다를 향해 외쳤다. 지나가던 배의 선원들까지 박수를 쳤다.`,
    choices: [
      { id: "cheer", label: "같이 외치며 응원한다", risk: "친구와의 유대 +10 · 자유로움이 자람", personality: { freedom: 6, empathy: 4 },
        apply: (life) => { life.friendBond += 10; if (life.people?.mate) life.people.mate.bond = (life.people.mate.bond || 0) + 10; return "둘은 목이 쉴 때까지 꿈을 외쳤다. 그날부터 고기는 둘의 암호가 됐다."; } },
      { id: "tease", label: "현실을 보라며 놀린다", risk: "친구와의 유대 -10", personality: { caution: 5, empathy: -4 },
        apply: (life) => { life.friendBond -= 10; if (life.people?.mate) life.people.mate.bond = (life.people.mate.bond || 0) - 10; return "친구는 삐쳐서 사흘 동안 말을 하지 않았다. 나흘째에 고기를 내밀자 겨우 풀렸다."; } }
    ] },
  { id: "fruit_show", art: (life) => life?.creationVersion >= 20 ? "workbenchFruitPractice" : "deck", when: (life) => Boolean(life.devilFruit) && atSea(life), title: "능력 자랑의 대가",
    body: (life) => `${eun(life.birth.name)} 항구 아이들 앞에서 열매의 힘을 자랑하다 발을 헛디뎠다. 첨벙! 힘이 쭉 빠진 몸이 그대로 가라앉기 시작했다.`,
    choices: [
      { id: "shout", label: "물을 먹으며 동료를 부른다", risk: "건강 -10 · 동료의 도움", personality: { caution: 4 },
        apply: (life) => { life.health -= 10; life.friendBond += 5; return "동료가 뛰어들어 머리채를 잡고 끌어올렸다. 아이들은 그게 더 재미있었다고 했다."; } },
      { id: "again", label: "올라오자마자 다시 자랑한다", risk: "지역의 신뢰 +10 · 건강 -10", personality: { freedom: 7, caution: -7 },
        apply: (life) => { life.trust += 10; life.health -= 10; return "흠뻑 젖은 채 다시 힘을 보여 주자 아이들이 환호했다. 이번에는 바닷가에서 멀리 떨어져서."; } }
    ] },
  { id: "haki_bet", when: (life) => life.haki?.observation > 0, title: "견문색 숨바꼭질",
    body: "동료들이 견문색이 정말 있는지 증명해 보라며 배 안 어딘가에 간식을 숨겼다. 맞히면 오늘 밤 당직이 면제였다.",
    choices: [
      { id: "sense", label: "눈을 감고 기척을 읽는다", needs: { skill: 50 }, risk: "기술 50 필요 · 성공하면 친구와의 유대 +10", failRisk: "밤 당직",
        personality: { ambition: 5 },
        apply: (life) => { life.friendBond += 10; return "돛대 꼭대기, 화약통 뒤, 요리사의 앞치마 속까지 전부 맞혔다. 동료들은 질렸다는 표정이었다."; },
        fail: (life) => { life.health -= 5; return "기척이 아니라 냄새로 찾다가 들켰다. 그날 밤 당직은 유난히 길었다."; } },
      { id: "decline", label: "수련은 장난이 아니라며 사양한다", risk: "신중함이 자람", personality: { caution: 6 },
        apply: () => "동료들은 시시하다며 간식을 나눠 먹었다. 하나는 몰래 남겨 두었다." }
    ] }
];

export const DANGERS = [
  { id: "sea_king", art: "dangerSeaKing", when: atSea, title: "해왕류의 습격",
    body: "잔잔하던 바다가 갑자기 솟아올랐다. 배보다 큰 해왕류가 아가리를 벌리고 뱃머리를 노렸다. 동료들의 비명이 바람에 묻혔다.",
    choices: [
      { id: "fight", label: "뱃머리에 서서 맞선다", needs: { skill: 60, health: 50 }, risk: "기술 60 · 건강 50 필요 · 성공하면 엄청난 식량", failRisk: "건강 -35 · 목숨이 위험",
        personality: { ambition: 8, loyalty: 6, caution: -6 },
        apply: (life) => { life.supplies += 30; life.trust += 10; return "해왕류가 바다에 쓰러졌다. 그날부터 한 달 동안 갑판에서 고기 굽는 연기가 끊이지 않았다."; },
        fail: (life) => wound(life, 35, "해왕류의 습격") ? "거대한 꼬리가 갑판을 내리쳤다. 동료들은 끝까지 손을 뻗었지만 바다가 더 빨랐다." : "꼬리에 맞아 갑판 끝까지 날아갔다. 동료들이 배를 돌리는 동안 의식이 오락가락했다." },
      { id: "flee", label: "돛을 전부 펴고 달아난다", risk: "물자를 버려야 할 수도 있음 · 결과는 알 수 없음", personality: { caution: 7 },
        apply: (life) => { if (lucky(life, 0x7d01, 60)) { life.supplies -= 10; return "짐을 몇 개 던져 배를 가볍게 했다. 해왕류는 짐 상자를 삼키고 물러났다."; } life.supplies -= 30; return wound(life, 20, "해왕류의 습격") ? "배의 뒷부분이 물렸다. 가라앉는 배에서 끝내 빠져나오지 못했다." : "배의 뒷부분이 물려 짐 절반을 잃었다. 겨우 가까운 섬에 닿았다."; } }
    ] },
  { id: "storm", art: (life) => life?.creationVersion >= 20 ? "stormSeaRescue" : "deck", when: atSea, title: "삼키는 폭풍",
    body: "기록지침이 미친 듯이 흔들리고 하늘이 검게 갈라졌다. 위대한 항로의 날씨는 예고가 없었다. 돛이 찢어지기 직전이었다.",
    choices: [
      { id: "sail", label: "돛대에 몸을 묶고 돛을 지킨다", needs: { skill: 55, health: 45 }, risk: "기술 55 · 건강 45 필요", failRisk: "건강 -35 · 배를 잃을 수 있음",
        personality: { loyalty: 7, caution: -4 },
        apply: (life) => { life.skill += 10; return "폭풍이 지나간 새벽, 찢어진 돛 아래에서 모두가 살아 있었다."; },
        fail: (life) => {
          if (wound(life, 35, "폭풍 속 난파")) {
            if (lucky(life, 0x7d02, 40)) { life.ending = "missing"; life.deathCause = "폭풍 속에서 배와 함께 실종"; return "파도가 배를 통째로 삼켰다. 그 뒤로 배를 본 사람은 없었다."; }
            return "돛대가 부러지며 바다로 휩쓸렸다. 아침에 떠오른 것은 부서진 판자뿐이었다.";
          }
          return "돛대가 부러졌다. 밧줄에 매달린 채 밤을 버텼고, 몸 곳곳에 상처가 남았다.";
        } },
      { id: "boat", label: "동료들을 구명정에 먼저 태운다", risk: "물자 -30 · 건강 -15 · 동료를 지킴", personality: { empathy: 9, loyalty: 8 },
        apply: (life) => { life.supplies -= 30; life.health -= 15; life.friendBond += 20; return wound(life, 0, "폭풍 속 난파") ? "마지막 구명정을 밀어 보낸 뒤 배와 함께 가라앉았다." : "마지막으로 구명정에 뛰어올랐다. 배는 잃었지만 한 명도 잃지 않았다."; } }
    ] },
  { id: "poison", art: "workbench", when: (life) => true, title: "독이 든 잔",
    body: "환영의 술을 마신 지 한 시간 뒤, 손끝부터 감각이 사라졌다. 잔을 건넨 사람은 이미 사라지고 없었다. 해독제를 구할 시간은 많지 않았다.",
    choices: [
      { id: "antidote", label: "가진 물자를 털어 해독제를 산다", cost: 30, risk: "물자 -30 · 확실한 치료", personality: { caution: 7 },
        apply: (life) => { life.supplies -= 30; life.health -= 10; return "의원의 문을 두드려 해독제를 받았다. 사흘을 앓은 뒤 겨우 일어났다."; } },
      { id: "carry", label: "동료에게 의원을 업어 달라고 한다", risk: "건강 -20 · 친구와의 유대 +10", personality: { loyalty: 5 },
        apply: (life) => { life.friendBond += 10; return wound(life, life.creationVersion >= 11 ? 12 : 20, "독살") ? "의원의 집 앞에서 숨이 멎었다. 동료는 그 문을 오래 두드렸다." : "동료가 밤길을 달려 의원을 깨웠다. 쓴 약을 먹고 열흘 만에 일어났다."; } },
      { id: "endure", label: "몸 하나로 버틴다", needs: { health: 65 }, risk: "건강 65 필요 · 실패하면 목숨이 위험", failRisk: "건강 -35",
        personality: { ambition: 5, caution: -6 },
        apply: (life) => { life.health -= 10; return "열이 끓는 사흘 밤을 버텼다. 아침에 일어나자 동료들이 울면서 웃었다."; },
        fail: (life) => wound(life, 35, "독살") ? "독은 생각보다 빨랐다. 동료들이 의원을 데려왔을 때는 이미 늦었다." : "몸의 반쪽이 오래 말을 듣지 않았다. 살아남은 것만으로도 기적이라고 했다." }
    ] },
  { id: "capture", art: "dangerPrison", when: (life) => outlaw(life) && life.bounty >= 30_000_000, title: "닫히는 포위망",
    body: (life) => `${formatBounty(life.bounty)}의 이름을 노린 ${pursuerFor(life.bounty).name}이 섬 전체를 에워쌌다. 항구와 숲, 하늘까지 막혔다. 확성기 너머로 투항하라는 목소리가 들렸다.`,
    choices: [
      { id: "break", label: "정면으로 포위망을 뚫는다", needs: { skill: 70, health: 50 }, risk: "기술 70 · 건강 50 필요 · 현상금 상승", bounty: 20_000_000, failRisk: "건강 -40 · 체포나 죽음",
        personality: { ambition: 8, freedom: 7, caution: -6 },
        apply: (life) => { life.health -= 15; if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) - 15; return "포탄 사이를 뚫고 바다로 빠져나왔다. 다음 날 신문 일면에 이름이 실렸다."; },
        fail: (life) => {
          if (wound(life, 40, "포위망 돌파 중 전사")) return "마지막 포위선 앞에서 쓰러졌다. 동료들은 그 이름을 깃발에 새겼다.";
          if (lucky(life, 0x7d03, 50)) { life.ending = "prison"; life.deathCause = "체포되어 임펠 다운에 수감"; return "해루석 수갑이 손목에 채워졌다. 호송선은 바다 밑 감옥으로 향했다."; }
          return "피투성이로 숲에 숨어들었다. 포위는 사흘 뒤에야 풀렸다.";
        } },
      { id: "decoy", label: "동료를 미끼로 남기고 홀로 빠진다", risk: "친구와의 유대 -30 · 탈출", personality: { ambition: 6, loyalty: -12, empathy: -8 },
        apply: (life) => { life.friendBond -= 30; return "혼자 빠져나온 배 위에서 등 뒤의 섬이 점점 작아졌다. 누구도 그 이야기를 다시 꺼내지 않았다."; } },
      { id: "surrender", label: "동료를 살리는 조건으로 투항한다", risk: "체포 · 동료는 풀려남", personality: { loyalty: 10, empathy: 8 },
        apply: (life) => { life.ending = "prison"; life.deathCause = "동료를 살리고 스스로 투항해 임펠 다운에 수감"; return "손을 들고 걸어 나갔다. 떠나는 동료들의 배를 끝까지 바라보았다."; } }
    ] },
  { id: "duel", art: (life) => life?.creationVersion >= 20 ? "deckDuelChallenge" : "deck", when: (life) => life.skill >= 45 && !life.homebound, title: "이름난 검객의 도전",
    body: (life) => `${eul(life.birth.name)} 찾아 세 개의 바다를 건너왔다는 검객이 부두에 섰다. 이긴 쪽이 진 쪽의 이름을 가져간다는 오래된 방식의 결투였다.`,
    choices: [
      { id: "accept", label: "결투를 받아들인다", needs: { skill: 70, health: 50 }, risk: "기술 70 · 건강 50 필요 · 이기면 명성", failRisk: "건강 -35 · 목숨이 위험",
        personality: { ambition: 9, caution: -7 },
        apply: (life) => { life.trust += 20; life.skill += 5; if (life.bounty > 0) life.bounty += 10_000_000; if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) + 10; return "검이 부러지는 소리와 함께 승부가 났다. 검객은 무릎을 꿇고 다음에는 지지 않겠다고 했다."; },
        fail: (life) => wound(life, 35, "결투") ? "마지막 일격을 막지 못했다. 검객은 쓰러진 상대의 이름을 오래 기억하겠다고 말했다." : "깊은 상처를 입고 쓰러졌다. 검객은 목숨을 거두지 않고 떠났다." },
      { id: "refuse", label: "싸울 이유가 없다며 거절한다", risk: "지역의 신뢰 -10 · 겁쟁이라는 소문", personality: { caution: 8 },
        apply: (life) => { life.trust -= 10; return "검객은 실망한 얼굴로 돌아섰다. 항구에는 좋지 않은 소문이 돌았다."; } }
    ] },
  { id: "mutiny", art: (life) => life?.creationVersion >= 20 ? "deckMutiny" : "deck", when: (life) => life.path === "pirate" && (life.independent || life.rankTier >= 2), title: "갑판 위의 반란",
    body: "몫이 적다는 불만이 쌓이고 쌓인 끝에, 선원 절반이 무기를 들고 선장실 앞에 모였다. 누군가 배의 주인이 바뀔 때가 됐다고 외쳤다.",
    choices: [
      { id: "talk", label: "칼을 내려놓고 몫을 다시 나눈다", cost: 20, risk: "물자 -20 · 결과는 알 수 없음", personality: { empathy: 7, loyalty: 6 },
        apply: (life) => { life.supplies -= 20; if (lucky(life, 0x7d04, 70)) { life.friendBond += 10; if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) + 8; return "장부를 펼쳐 놓고 밤새 이야기했다. 아침에는 모두가 같은 배의 선원으로 돌아왔다."; } return wound(life, 30, "선상 반란") ? "말이 끝나기 전에 칼이 날아왔다. 배는 다른 이름의 깃발을 달고 떠났다." : "협상은 깨졌다. 반란은 막았지만 등에 깊은 상처가 남았다."; } },
      { id: "crush", label: "앞장선 자를 힘으로 제압한다", needs: { skill: 60, health: 45 }, risk: "기술 60 · 건강 45 필요", failRisk: "건강 -35",
        personality: { ambition: 7, empathy: -6 },
        apply: (life) => { life.trust -= 5; if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) - 10; return "주동자를 바다에 던졌다. 배는 조용해졌지만 웃음소리도 함께 사라졌다."; },
        fail: (life) => wound(life, 35, "선상 반란") ? "혼자서는 막을 수 없었다. 배는 반란자들의 것이 됐다." : "간신히 제압했지만 갈비뼈가 여러 대 부러졌다." }
    ] },
  { id: "plague", art: (life) => life?.creationVersion >= 20 ? "harborPlague" : "workbench", when: (life) => true, title: "열병이 도는 항구",
    body: "항구에 열병이 번졌다. 거리에는 문이 닫힌 집이 늘었고, 의원은 손이 모자랐다. 배에 남으면 안전했지만 도움을 청하는 목소리가 들렸다.",
    choices: [
      { id: "help", label: "남아서 환자를 돌본다", needs: { health: 55 }, risk: "건강 55 필요 · 성공하면 지역의 신뢰 +20", failRisk: "건강 -30 · 감염 위험",
        personality: { empathy: 10, loyalty: 5 },
        apply: (life) => { life.trust += 20; life.health -= 10; if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) + 10; return "보름 동안 물을 끓이고 약을 날랐다. 열병이 물러간 날 항구가 처음으로 종을 울렸다."; },
        fail: (life) => wound(life, 30, "항구의 열병") ? "환자를 돌보던 손이 먼저 뜨거워졌다. 항구 사람들은 그 이름을 종탑에 새겼다." : "열병에 걸려 한 달을 앓았다. 그래도 돌본 환자들이 번갈아 간호해 주었다." },
      { id: "leave", label: "배를 띄워 섬을 떠난다", risk: "지역의 신뢰 -10 · 안전", personality: { caution: 8, empathy: -5 },
        apply: (life) => {
          life.trust -= 10;
          if (life.creationVersion >= 20) {
            const nextPlace = sailToNextPort(life);
            return `멀어지는 항구에서 종소리가 들리지 않았다. 그 침묵을 뒤로하고 배는 ${nextPlace}에 닿았다.`;
          }
          return "멀어지는 항구에서 종소리가 들리지 않았다. 그 침묵이 오래 마음에 남았다.";
        } }
    ] },
  { id: "base_raid", art: (life) => life?.creationVersion >= 20 ? "marineBaseRaid" : "deck", when: (life) => life.path === "marine" && !life.homebound, title: "기지를 덮친 해적",
    body: "한밤중에 이름난 해적단이 기지를 기습했다. 상관은 부상으로 쓰러졌고, 남은 병사들의 시선이 이쪽으로 모였다.",
    choices: [
      { id: "command", label: "남은 병사를 모아 지휘한다", needs: { skill: 60, health: 45 }, risk: "기술 60 · 건강 45 필요 · 성공하면 평판 상승", failRisk: "건강 -40 · 목숨이 위험",
        personality: { loyalty: 8, ambition: 6 },
        apply: (life) => {
          life.trust += 20;
          if (life.creationVersion >= 20) {
            life.arrestCount = (life.arrestCount || 0) + 1;
            life.arrestBounty = (life.arrestBounty || 0) + 30_000_000;
            life.reputation = (life.reputation || 0) + 15;
          }
          return "새벽이 오기 전에 해적들을 제압해 수감했다. 본부에서 이름을 물어 왔다.";
        },
        fail: (life) => wound(life, 40, "해적의 기지 기습") ? "마지막까지 정문을 지켰다. 동료들은 그 자리에 작은 비석을 세웠다." : "정문을 지키다 크게 다쳤다. 기지는 지켰지만 한동안 일어날 수 없었다." },
      { id: "civilians", label: "기지 근처 주민부터 대피시킨다", risk: "지역의 신뢰 +10 · 건강 -10", personality: { empathy: 9 },
        apply: (life) => {
          life.trust += 10;
          life.health -= 10;
          if (life.creationVersion >= 20) life.reputation = (life.reputation || 0) + 12;
          return "주민을 모두 언덕으로 옮겼다. 기지는 불탔지만 마을 사람은 한 명도 다치지 않았다.";
        } }
    ] }
];

export const DUTIES = [
  // 1. Marine Duties
  {
    id: "marine_patrol_intercept",
    art: (life) => life?.creationVersion >= 20 ? "specialMarineDeck" : "deck",
    when: (life) => life.path === "marine" && !life.homebound && (life.rankTier || 0) <= 1,
    title: "연안 초계 중 만난 해적선",
    body: "연안 초계 도중 상선을 위협하던 작은 해적선을 발견했다. 상대는 경고 방송을 무시하고 방향을 틀어 도주하려 했다.",
    choices: [
      { id: "board", label: "포위망을 좁혀 해적선에 진입해 나포한다", needs: { skill: 30, health: 30 },
        risk: "기술 30 · 건강 30 필요 · 해적 수감 실적 획득", failRisk: "건강 -15",
        personality: { loyalty: 6, ambition: 5 },
        apply: (life) => {
          life.arrestCount = (life.arrestCount || 0) + 1;
          life.arrestBounty = (life.arrestBounty || 0) + 5_000_000;
          life.reputation = (life.reputation || 0) + 8;
          life.trust += 10;
          return "선내에 진입해 저항하던 해적들을 제압하고 나포했다. 선장의 수배서와 함께 본부에 인도했다.";
        },
        fail: (life) => { life.health -= 15; return "도주하는 배에서 쏜 쇠뇌에 다쳤다. 해적선은 놓쳤지만 상선은 안전하게 지켜냈다."; }
      },
      { id: "block", label: "마을 방향으로 도주하지 못하게 기동로를 차단한다",
        risk: "민간 피해 방지 · 신뢰 상승",
        personality: { caution: 5, loyalty: 5 },
        apply: (life) => {
          life.trust += 15;
          life.reputation = (life.reputation || 0) + 5;
          life.skill += 5;
          return "도주로를 막아 민간 선박을 지켰다. 해적들은 해안 경비대에 나포되었다.";
        }
      }
    ]
  },
  {
    id: "marine_corsair_clash",
    art: (life) => life?.creationVersion >= 20 ? "harborStandoff" : "deck",
    when: (life) => life.path === "marine" && !life.homebound && (life.rankTier || 0) >= 1 && (life.rankTier || 0) <= 2,
    title: "항로를 어지럽히는 무장 해적단",
    body: "수천만 베리의 현상금이 걸린 해적단이 군함의 순찰 구역에 진입했다. 적선의 포문이 일제히 열렸다.",
    choices: [
      { id: "assault", label: "포탄을 뚫고 적선 갑판으로 도약해 수괴를 벤다", needs: { skill: 45, health: 40 },
        risk: "기술 45 · 건강 40 필요 · 고액 수배범 체포", failRisk: "건강 -25",
        personality: { ambition: 8, loyalty: 6 },
        apply: (life) => {
          life.arrestCount = (life.arrestCount || 0) + 1;
          life.arrestBounty = (life.arrestBounty || 0) + 20_000_000;
          life.reputation = (life.reputation || 0) + 15;
          life.skill += 5;
          return "치열한 백병전 끝에 악명 높은 수배범을 굴복시켰다. 수병들이 승리의 함성을 질렀다.";
        },
        fail: (life) => { life.health -= 25; return "적 선장의 칼에 깊은 상처를 입었다. 동료들의 엄호 사격 덕에 간신히 후퇴했다."; }
      },
      { id: "bombard", label: "조타실과 돛대를 집중 포격해 기동을 멈춘다", needs: { skill: 40 },
        risk: "기술 40 필요 · 안전한 제압", failRisk: "물자 -15",
        personality: { caution: 7, loyalty: 5 },
        apply: (life) => {
          life.arrestCount = (life.arrestCount || 0) + 1;
          life.arrestBounty = (life.arrestBounty || 0) + 15_000_000;
          life.reputation = (life.reputation || 0) + 10;
          life.supplies += 10;
          return "정밀한 포격으로 적선의 기동을 마비시킨 뒤 전원 수감했다. 본부에서 실적을 기록했다.";
        },
        fail: (life) => { life.supplies -= 15; return "포탄이 빗나가며 적선이 짙은 안개 속으로 도주했다."; }
      }
    ]
  },
  {
    id: "marine_fleet_siege",
    art: (life) => life?.creationVersion >= 20 ? "deckCommand" : "deck",
    when: (life) => life.path === "marine" && !life.homebound && (life.rankTier || 0) >= 2,
    title: "연합 해적단의 항구 포위망",
    body: "복수의 해적단이 연합하여 중요 보급 항구를 봉쇄했다. 본부의 증원군은 하루 뒤에나 도착할 예정이었다.",
    choices: [
      { id: "lead_charge", label: "직접 지휘선을 이끌고 적 연합 기함을 강습한다", needs: { skill: 58, health: 45 },
        risk: "기술 58 · 건강 45 필요 · 대규모 군공", failRisk: "건강 -30",
        personality: { ambition: 9, loyalty: 7 },
        apply: (life) => {
          life.arrestCount = (life.arrestCount || 0) + 2;
          life.arrestBounty = (life.arrestBounty || 0) + 50_000_000;
          life.reputation = (life.reputation || 0) + 22;
          life.trust += 15;
          return "적 기함의 지휘부를 와해시키며 연합 선단을 격파했다. 본부 장성들이 군공을 높이 평가했다.";
        },
        fail: (life) => { life.health -= 30; return "적의 집중 포화에 기함이 손상되었다. 항구 방어선으로 철수해야 했다."; }
      },
      { id: "defend_port", label: "항구 방어포대를 정비하고 민간인 피난을 엄호한다",
        risk: "지역의 신뢰 대폭 상승 · 명성 획득",
        personality: { empathy: 8, caution: 6 },
        apply: (life) => {
          life.trust += 25;
          life.reputation = (life.reputation || 0) + 15;
          life.health -= 10;
          return "해적들의 파상공세를 끝까지 막아내 항구를 사수했다. 주민들이 영웅이라 칭송했다.";
        }
      }
    ]
  },

  // 2. Pirate Duties
  {
    id: "pirate_convoy_raid",
    art: (life) => life?.creationVersion >= 20 ? "harborBountyInspection" : "deck",
    when: (life) => life.path === "pirate" && !life.homebound && (life.rankTier || 0) <= 1,
    title: "탐욕스러운 귀족의 보물선",
    body: "과중한 세금과 귀금속을 싣고 본국으로 향하는 귀족의 수송선이 시야에 들어왔다. 경비병들이 긴장한 채 총을 겨눴다.",
    choices: [
      { id: "plunder", label: "경비대를 제압하고 보물 창고를 전부 턴다", needs: { skill: 35, health: 30 },
        bounty: 15_000_000,
        risk: "기술 35 · 건강 30 필요 · 현상금 상승 및 악명 축적", failRisk: "건강 -15",
        personality: { ambition: 8, freedom: 6, empathy: -4 },
        apply: (life) => {
          life.supplies += 25;
          life.reputation = (life.reputation || 0) - 12;
          return "상선의 금고를 털고 깃발을 흔들었다. 해군 수배서에 악명 높은 이름이 굵게 새겨졌다.";
        },
        fail: (life) => { life.health -= 15; return "경비대의 총격에 부상을 입고 물러났다. 전리품은 거의 건지지 못했다."; }
      },
      { id: "chivalry", label: "세금 상자만 가로채고 서민 선원들은 다치지 않게 풀어준다", needs: { skill: 35 },
        bounty: 10_000_000,
        risk: "기술 35 필요 · 현상금 상승 및 의적 명성", failRisk: "물자 -10",
        personality: { empathy: 8, freedom: 7, loyalty: 5 },
        apply: (life) => {
          life.supplies += 15;
          life.trust += 12;
          life.reputation = (life.reputation || 0) + 15;
          return "부당한 세금만 가로채고 선원들을 풀어주었다. 다음 항구에서 의적이라는 소문이 퍼졌다.";
        },
        fail: (life) => { life.supplies -= 10; return "선원들을 배려하다 탈출 시간을 놓쳐 해군 함선의 추격을 받았다."; }
      }
    ]
  },
  {
    id: "pirate_rival_showdown",
    art: (life) => life?.creationVersion >= 20 ? "harborStandoff" : "deck",
    when: (life) => life.path === "pirate" && !life.homebound && (life.rankTier || 0) >= 1,
    title: "외해에서 마주친 라이벌 해적단",
    body: "바다의 패권을 다투는 라이벌 해적단과 좁은 해협에서 맞닥뜨렸다. 상대 선장이 갑판에서 칼을 겨누며 도발했다.",
    choices: [
      { id: "clash", label: "앞장서서 상대 선장을 꺾고 깃발을 꺾는다", needs: { skill: 52, health: 45 },
        bounty: 35_000_000,
        risk: "기술 52 · 건강 45 필요 · 거액 현상금 도약", failRisk: "건강 -25",
        personality: { ambition: 9, freedom: 6 },
        apply: (life) => {
          life.skill += 5;
          life.supplies += 20;
          if ((life.reputation || 0) < 0) life.reputation = (life.reputation || 0) - 15;
          else life.reputation = (life.reputation || 0) + 18;
          return "적장을 쓰러뜨리고 바다의 지배권을 증명했다. 신문에 새 현상금이 대서특필되었다.";
        },
        fail: (life) => { life.health -= 25; return "상대 선장의 일격에 밀려 갑판 아래로 굴러떨어졌다. 무승부로 물러섰다."; }
      },
      { id: "seize_vessel", label: "적선의 화물을 압류하고 부하들을 굴복시킨다",
        risk: "물자 대폭 확보 · 선단 평판 상승",
        personality: { ambition: 7, caution: 5 },
        apply: (life) => {
          life.supplies += 30;
          life.friendBond += 10;
          return "적선 전체를 무력화하고 항복을 받아냈다. 선원들이 우리 배의 실력을 환호했다.";
        }
      }
    ]
  },

  // 3. Liberator Duties
  {
    id: "liberator_slave_rescue",
    art: (life) => life?.creationVersion >= 20 ? "dangerPrison" : "deck",
    when: (life) => life.path === "liberator" && !life.homebound,
    title: "노예 호송대의 족쇄",
    body: "천룡인에게 바칠 노예들이 갇힌 지하 창고의 위치가 입수됐다. 경비병들이 교대하는 틈은 십 분 남짓이었다.",
    choices: [
      { id: "strike", label: "철창을 자르고 사람들을 안전가옥으로 피신시킨다", needs: { skill: 40, health: 35 },
        risk: "기술 40 · 건강 35 필요 · 구호 명성과 신뢰 상승", failRisk: "건강 -20",
        personality: { empathy: 9, freedom: 8 },
        apply: (life) => {
          life.rescued = (life.rescued || 0) + 3;
          life.trust += 20;
          life.reputation = (life.reputation || 0) + 18;
          return "족쇄를 끊어내고 갇혀 있던 이들을 바다 너머로 탈출시켰다. 감사의 눈물이 손등에 떨어졌다.";
        },
        fail: (life) => { life.health -= 20; return "철창을 자르는 소리에 경비대가 들이닥쳤다. 부상자를 업고 간신히 탈출했다."; }
      },
      { id: "diversion", label: "부두에 연막탄을 터뜨려 혼란 속에서 탈출로를 연다", needs: { skill: 35 },
        risk: "기술 35 필요 · 안전한 공작", failRisk: "물자 -10",
        personality: { caution: 7, empathy: 6 },
        apply: (life) => {
          life.trust += 15;
          life.reputation = (life.reputation || 0) + 12;
          life.skill += 5;
          return "경비대의 시선을 돌려 한 명도 다치지 않고 탈출로를 확보했다.";
        },
        fail: (life) => { life.supplies -= 10; return "연막이 바람에 흩어지며 계획이 반쯤 틀어졌다. 일부 인원만 피신시켰다."; }
      }
    ]
  },

  // 4. Civilian Duties
  {
    id: "civilian_salvage_mission",
    art: (life) => life?.creationVersion >= 20 ? "workbench" : "deck",
    when: (life) => life.path === "civilian" && !life.homebound,
    title: "암초에 좌초된 대형 무역선",
    body: "암초에 걸려 기울어지는 상선에서 구조 신호가 올랐다. 선체가 두 동강 나기 전에 부력을 확보해야 했다.",
    choices: [
      { id: "engineer", label: "조선 기술과 임시 가설재로 선체를 떠받친다", needs: { skill: 40 },
        risk: "기술 40 필요 · 기술과 조합 평판 대폭 상승", failRisk: "물자 -10",
        personality: { caution: 7, ambition: 5 },
        apply: (life) => {
          life.skill += 10;
          life.trust += 20;
          life.reputation = (life.reputation || 0) + 15;
          life.supplies += 20;
          return "선체 밑바닥을 지지하고 안전하게 독으로 예인했다. 상단주가 막대한 보상금을 전했다.";
        },
        fail: (life) => { life.supplies -= 10; return "가설재가 조류에 쓸려나갔다. 배는 침몰했지만 인명은 구했다."; }
      },
      { id: "crew_evac", label: "화물보다 먼저 사람들을 구명정으로 대피시킨다",
        risk: "지역의 신뢰 상승 · 인명 구조",
        personality: { empathy: 8, loyalty: 6 },
        apply: (life) => {
          life.trust += 25;
          life.reputation = (life.reputation || 0) + 12;
          life.health -= 5;
          return "단 한 명의 실종자도 없이 선원 전원을 구출했다. 부두 전체가 안도했다.";
        }
      }
    ]
  }
];

const pick = (pool, life, age, salt) => pool[yearRoll(life.seed ^ salt, age) % pool.length];

export function adventureScene(life, age, base) {
  if (life.creationVersion < 7 || life.ending || !life.path || age < adult(life)) return null;
  const fresh = (entry, prefix) => !life.seen.includes(`${prefix}${entry.id}`) && entry.when(life, age);
  const dangerGap = giant(life) ? 25 : 6;
  if (age - (life.lastDangerAge ?? -100) >= dangerGap && yearRoll(life.seed ^ 0x7c3e91b5, age) % 5 === 0) {
    const options = DANGERS.filter((entry) => fresh(entry, "life_danger_"));
    if (options.length) {
      const entry = pick(options, life, age, 0x1d9a4c37);
      return { ...base, id: `life_danger_${entry.id}`, urgent: true, art: entry.art || "lifeStorm", title: entry.title,
        body: typeof entry.body === "function" ? entry.body(life) : entry.body,
        choices: withPower(life, `danger_${entry.id}`, entry.choices).map((choice) => ({ ...choice,
          apply: (state) => { state.lastDangerAge = age; return choice.apply(state); },
          ...(choice.fail ? { fail: (state) => { state.lastDangerAge = age; return choice.fail(state); } } : {}) })) };
    }
  }
  if (life.creationVersion >= 20 && life.path && !life.homebound) {
    const dutyGap = giant(life) ? 20 : 3;
    if (age - (life.lastDutyAge ?? -100) >= dutyGap) {
      const duties = DUTIES.filter((entry) => fresh(entry, "life_duty_"));
      if (duties.length) {
        const duty = pick(duties, life, age, 0x3d7b);
        return {
          ...base, id: `life_duty_${duty.id}`, urgent: true,
          art: typeof duty.art === "function" ? duty.art(life) : duty.art,
          title: duty.title,
          body: typeof duty.body === "function" ? duty.body(life) : duty.body,
          choices: withTrait(life, withPower(life, `duty_${duty.id}`, duty.choices)).map((choice) => ({
            ...choice,
            apply: (state) => { state.lastDutyAge = age; return choice.apply(state); },
            ...(choice.fail ? { fail: (state) => { state.lastDutyAge = age; return choice.fail(state); } } : {})
          }))
        };
      }
    }
  }
  if (yearRoll(life.seed ^ 0x2b8e6d14, age) % 3 !== 0) return null;
  const drawn = (entry) => life.creationVersion < 9 || yearRoll(life.seed ^ [...entry.id].reduce((h, c) => Math.imul(h ^ c.codePointAt(0), 0x01000193) >>> 0, 0), 2) % 100 < 55;
  if (life.creationVersion >= 9 && life.seen.filter((id) => id.startsWith("life_mishap_")).length >= 7) return null;
  const options = MISHAPS.filter((entry) => fresh(entry, "life_mishap_") && drawn(entry));
  if (!options.length) return null;
  const entry = pick(options, life, age, 0x5e2f8a61);
  return { ...base, id: `life_mishap_${entry.id}`, urgent: true, art: entry.art || "deck", title: entry.title,
    body: typeof entry.body === "function" ? entry.body(life) : entry.body, choices: withTrait(life, withPower(life, `mishap_${entry.id}`, entry.choices)) };
}

// Rule 9: a strong trait (62+) adds its own way to handle an everyday decision or mishap.
const TRAIT_CHOICES = {
  empathy: { label: "[배려] 모두의 사정부터 먼저 듣는다", risk: "시간이 걸림", personality: { empathy: 4 },
    apply: (life) => { life.trust += 10; life.friendBond += 5; return "서두르지 않고 한 사람씩 사정을 들었다. 다음 날 그 자리에 있던 사람들이 먼저 인사를 건넸다."; } },
  ambition: { label: "[야망] 이참에 판을 크게 벌인다", needs: { skill: 45 }, risk: "기술 45 필요 · 크게 얻거나 크게 잃음", failRisk: "물자 -15", personality: { ambition: 4 },
    fail: (life) => { life.supplies -= 15; return "욕심만큼 일이 따라오지 않았다. 남은 건 빈 상자와 배짱뿐이었다."; },
    apply: (life) => { life.supplies += 20; life.trust += 5; return "남들이 망설이는 사이 한 발 먼저 움직였다. 판이 커진 만큼 몫도 커졌다."; } },
  loyalty: { label: "[의리] 동료가 원하는 쪽을 따른다", risk: "동료의 뜻을 따름", personality: { loyalty: 4 },
    apply: (life) => { life.friendBond += 10; return "내 생각은 접어 두고 동료의 뜻을 따랐다. 일이 끝나자 동료가 어깨를 두드렸다."; } },
  caution: { label: "[신중함] 한 발 물러서 판을 읽는다", risk: "느리지만 안전함", personality: { caution: 4 },
    apply: (life) => { life.skill += 5; life.health += 5; return "끼어들기 전에 오래 지켜보았다. 다들 놓친 작은 틈이 그제야 보였다."; } },
  freedom: { label: "[자유로움] 아무도 생각 못 한 길로 간다", risk: "결과는 알 수 없음", personality: { freedom: 4 },
    apply: (life) => { if (lucky(life, 0x9e01, 55)) { life.supplies += 15; life.skill += 5; return "다들 말렸지만 엉뚱한 길이 오히려 지름길이었다."; } life.health -= 5; return "엉뚱한 길은 정말 엉뚱한 곳으로 이어졌다. 그래도 웃으며 돌아왔다."; } }
};

// Rule 15: who you are changes what you can try. A fruit user, a haki user and someone without a fruit
// each get their own bold way through a danger or mishap; the power level raises the odds.
export function withPower(life, key, choices) {
  const set = life.creationVersion >= 15 && POWER_CHOICES[key];
  if (!set) return choices;
  const haki = Math.max(life.haki.observation, life.haki.armament, life.haki.conqueror);
  const fruitName = life.devilFruit?.replace(/\(.*\)$/, "");
  const syn = life.creationVersion >= 20 && fruitName ? fruitSynergy(fruitName, key) : null;
  const fruitBonus = syn?.tier === "bad"
    ? syn.delta + 4 * Math.max(0, life.fruitMastery - 1)
    : 12 * Math.max(1, life.fruitMastery) + (syn?.delta || 0);
  const extra = [
    life.devilFruit && set.fruit && ["fruit", set.fruit, fruitBonus],
    haki && set.haki && ["haki", set.haki, 12 * haki],
    !life.devilFruit && set.nonuser && ["nonuser", set.nonuser, 0]
  ].filter(Boolean);
  const power = FRUIT_POWER[fruitName] || FRUIT_POWER[life.devilFruit] || "열매의 힘을 끌어내";
  return [...choices, ...extra.map(([kind, choice, bonus]) => ({
    id: `power_${kind}`,
    label: choice.label,
    personality: choice.personality,
    risk: kind === "fruit" && syn?.tier === "good" ? `열매 상성 유리 (${syn.tag}) · ${choice.hint}`
      : kind === "fruit" && syn?.tier === "bad" ? `열매 상성 불리 (${syn.tag}) · 역효과 위험`
      : `${choice.hint} · 크게 얻거나 크게 잃음`,
    apply: (state) => {
      const res = rollTier(state, `${key}:${kind}`, choice, bonus);
      const baseText = res.text.replaceAll("{power}", power);
      if (kind === "fruit" && syn?.note) {
        if (syn.tier === "good" && res.tier !== "bad") return `${baseText} ${syn.note}`;
        if (syn.tier === "bad") return res.tier === "bad" ? `${baseText} ${syn.note}` : `${baseText} (${syn.tag} 탓에 역효과가 날 뻔했으나 숙련도로 간신히 억눌렀다.)`;
      }
      return baseText;
    }
  }))];
}

export function withTrait(life, choices) {
  if (life.creationVersion < 9) return choices;
  const [key, value] = Object.entries(life.personality).sort((a, b) => b[1] - a[1])[0];
  return value >= 62 && TRAIT_CHOICES[key] ? [...choices, { id: `trait_${key}`, ...TRAIT_CHOICES[key] }] : choices;
}

// Rule 11: the canon era spans many scenes inside one game year, so its daily slots draw mishaps and
// dangers by slot index instead of by age.
export function eraAdventure(life, slot, base) {
  if (life.creationVersion < 11 || life.ending || !life.path) return null;
  const fresh = (entry, prefix) => !life.seen.includes(`${prefix}${entry.id}`) && entry.when(life, life.age);
  // The era is short in years, so dangers stay rare there: one per long stretch of days.
  if (slot - (life.lastDangerSlot ?? -99) >= 45 && yearRoll(life.seed ^ 0x7c3e91b5, slot + 5000) % 6 === 0) {
    const options = DANGERS.filter((entry) => fresh(entry, "life_danger_"));
    if (options.length) {
      const entry = pick(options, life, slot + 5000, 0x1d9a4c37);
      return { ...base, id: `life_danger_${entry.id}`, urgent: true, art: entry.art || "lifeStorm", title: entry.title,
        body: typeof entry.body === "function" ? entry.body(life) : entry.body,
        choices: withPower(life, `danger_${entry.id}`, entry.choices).map((choice) => ({ ...choice,
          apply: (state) => { state.lastDangerSlot = slot; return choice.apply(state); },
          ...(choice.fail ? { fail: (state) => { state.lastDangerSlot = slot; return choice.fail(state); } } : {}) })) };
    }
  }
  if (life.creationVersion >= 20 && life.path && !life.homebound) {
    if (slot - (life.lastDutySlot ?? -99) >= 8 && yearRoll(life.seed ^ 0x4b1e, slot) % 2 === 0) {
      const duties = DUTIES.filter((entry) => fresh(entry, "life_duty_"));
      if (duties.length) {
        const duty = pick(duties, life, slot + 3000, 0x7a2f);
        return {
          ...base, id: `life_duty_${duty.id}`, urgent: true,
          art: typeof duty.art === "function" ? duty.art(life) : duty.art,
          title: duty.title,
          body: typeof duty.body === "function" ? duty.body(life) : duty.body,
          choices: withTrait(life, withPower(life, `duty_${duty.id}`, duty.choices)).map((choice) => ({
            ...choice,
            apply: (state) => { state.lastDutySlot = slot; return choice.apply(state); },
            ...(choice.fail ? { fail: (state) => { state.lastDutySlot = slot; return choice.fail(state); } } : {})
          }))
        };
      }
    }
  }
  const options = MISHAPS.filter((entry) => fresh(entry, "life_mishap_"));
  if (!options.length) return null;
  const entry = pick(options, life, slot + 5000, 0x5e2f8a61);
  return { ...base, id: `life_mishap_${entry.id}`, urgent: true, art: entry.art || "deck", title: entry.title,
    body: typeof entry.body === "function" ? entry.body(life) : entry.body, choices: withTrait(life, withPower(life, `mishap_${entry.id}`, entry.choices)) };
}

export const adventureCounts = { mishaps: MISHAPS.length, dangers: DANGERS.length, duties: DUTIES.length };
