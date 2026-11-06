// Named stops follow places shown in the original story; the exact voyage is this game's fiction.
import { crewTie } from "./canon-crews.js";

// Rule 16 stretches the canon era (Luffy's few years at sea) over ERA_YEARS of the protagonist's life,
// like its long serialization. The protagonist ages normally; canon people keep their canon ages.
export const ERA_YEARS = 24;
export const ERA_WAR = 10;
export const ERA_REUNION = 13;
export const stretched = (life) => life.creationVersion >= 16;
// The age at which Luffy sets out: two canon years before the present.
export const eraStart = (life) => life.birth.yearsBeforeCurrent - 2;
export const presentAge = (life) => stretched(life) ? eraStart(life) + ERA_YEARS : life.birth.yearsBeforeCurrent;

// Canon years before the present at the protagonist's age. Inside a stretched era it steps 2 (to the war),
// 1 (the two years apart) and 0 (the New World), so canon-dated content keeps its own calendar.
export function storyBefore(life, age = life.age) {
  const raw = life.birth.yearsBeforeCurrent - age;
  if (!stretched(life) || raw >= 2) return raw;
  const into = age - eraStart(life);
  return into <= ERA_WAR ? 2 : into < ERA_REUNION ? 1 : 0;
}
const BLUE_ROUTE = ["리버스 마운틴", "쌍둥이 언덕", "위스키 피크", "리틀 가든", "드럼섬", "알라바스타 · 나노하나", "자야 · 모크 타운", "롱 링 롱 랜드", "워터 세븐", "샤본디 제도", "어인섬", "드레스로자", "그린 비트", "조", "스핑크스 섬", "엘바프"];
const GRAND_ROUTE = BLUE_ROUTE.slice(6);
const NEW_ROUTE = ["스핑크스 섬", "드레스로자", "그린 비트", "조", "엘바프", "하치노스 근해", "와노국 외해", "홀케이크 아일랜드 외해"];

// Rule-4 routes branch at islands. Older saves keep their linear route lists below.
const ROUTES_V4 = {
  "리버스 마운틴": ["쌍둥이 언덕", "위스키 피크"],
  "쌍둥이 언덕": ["위스키 피크", "리틀 가든"],
  "위스키 피크": ["리틀 가든", "드럼섬"],
  "리틀 가든": ["드럼섬", "알라바스타 · 나노하나"],
  "드럼섬": ["알라바스타 · 나노하나", "자야 · 모크 타운"],
  "알라바스타 · 나노하나": ["자야 · 모크 타운", "롱 링 롱 랜드"],
  "자야 · 모크 타운": ["롱 링 롱 랜드", "워터 세븐"],
  "롱 링 롱 랜드": ["워터 세븐", "샤본디 제도"],
  "워터 세븐": ["샤본디 제도", "롱 링 롱 랜드"],
  "샤본디 제도": ["어인섬", "워터 세븐"],
  "어인섬": ["펑크 하자드", "드레스로자"],
  "펑크 하자드": ["드레스로자", "그린 비트"],
  "스핑크스 섬": ["드레스로자", "조"],
  "드레스로자": ["그린 비트", "조"],
  "그린 비트": ["조", "홀케이크 아일랜드 외해"],
  "조": ["와노국 외해", "홀케이크 아일랜드 외해"],
  "홀케이크 아일랜드 외해": ["와노국 외해", "엘바프"],
  "와노국 외해": ["에그헤드 외해", "엘바프"],
  "에그헤드 외해": ["엘바프", "조"],
  "엘바프": ["스핑크스 섬", "하치노스 근해"],
  "하치노스 근해": ["스핑크스 섬", "조"]
};

// Places where pirates gather; marines start with less goodwill there and pirates with more.
const PIRATE_HAVENS = ["자야 · 모크 타운", "하치노스 근해", "샤본디 제도"];

// Rule 20 route network: integrates canon islands and custom (임의 지명) uncharted stops
// with distance-proportional supply costs (단거리 8~12, 중거리 16~22, 원거리 26~32, 심해 잠항 30).
export const ROUTES_V20 = {
  // 1. 위대한 항로 전반부 · 낙원 (Paradise)
  "리버스 마운틴": [
    { dest: "쌍둥이 언덕", dist: "단거리", cost: 10, note: "운하를 타고 등대 입구로 진입" },
    { dest: "위스키 피크", dist: "중거리", cost: 18, note: "기록지침 첫 번째 기항지" },
    { dest: "물안개 암초군(임의 지명)", dist: "원거리", cost: 26, note: "리버스 마운틴 기슭의 안개 바다" }
  ],
  "쌍둥이 언덕": [
    { dest: "위스키 피크", dist: "단거리", cost: 10, note: "선인장 바위산 환영의 마을" },
    { dest: "리틀 가든", dist: "중거리", cost: 18, note: "태고의 거인과 공룡이 사는 숲" },
    { dest: "돌소금 여울(임의 지명)", dist: "원거리", cost: 26, note: "소금바람 부는 무인 암초대" }
  ],
  "위스키 피크": [
    { dest: "리틀 가든", dist: "단거리", cost: 10, note: "거인족 결투가 울리는 섬" },
    { dest: "드럼섬", dist: "중거리", cost: 18, note: "설산과 사쿠라 왕국" },
    { dest: "해류목 군도(임의 지명)", dist: "원거리", cost: 28, note: "표류목이 모이는 외딴 군도" }
  ],
  "리틀 가든": [
    { dest: "드럼섬", dist: "단거리", cost: 10, note: "의술과 눈 덮인 겨울섬" },
    { dest: "알라바스타 · 나노하나", dist: "중거리", cost: 20, note: "사막 왕국의 분주한 무역항" },
    { dest: "산호별 환초(임의 지명)", dist: "원거리", cost: 28, note: "캄 벨트 인근의 얕은 산호섬" }
  ],
  "드럼섬": [
    { dest: "알라바스타 · 나노하나", dist: "단거리", cost: 10, note: "모래바람 부는 사막 항구" },
    { dest: "자야 · 모크 타운", dist: "중거리", cost: 20, note: "해적과 건달들의 무법지대" },
    { dest: "소용돌이 갯길(임의 지명)", dist: "원거리", cost: 28, note: "변덕스러운 와류가 도는 해협" }
  ],
  "알라바스타 · 나노하나": [
    { dest: "자야 · 모크 타운", dist: "단거리", cost: 12, note: "술집과 현상금 사냥꾼의 항구" },
    { dest: "롱 링 롱 랜드", dist: "중거리", cost: 20, note: "끝없는 평원과 유목민의 바다" },
    { dest: "바람길 암초(임의 지명)", dist: "원거리", cost: 28, note: "돌풍이 잦아드는 외딴 바위섬" }
  ],
  "자야 · 모크 타운": [
    { dest: "롱 링 롱 랜드", dist: "단거리", cost: 10, note: "길쭉한 동물과 유목민들의 섬" },
    { dest: "워터 세븐", dist: "중거리", cost: 20, note: "분수와 바다열차가 달리는 수로 도시" },
    { dest: "하늘구름 외곽(임의 지명)", dist: "원거리", cost: 30, note: "돌출 해류 너머 구름바다 언저리" }
  ],
  "롱 링 롱 랜드": [
    { dest: "워터 세븐", dist: "단거리", cost: 10, note: "조선공들의 거대한 물의 도시" },
    { dest: "샤본디 제도", dist: "중거리", cost: 22, note: "맹그로브 숲과 비누방울 항구" },
    { dest: "스릴러 바크 외해(임의 지명)", dist: "원거리", cost: 28, note: "마의 삼각지대 짙은 안개 바다" }
  ],
  "워터 세븐": [
    { dest: "샤본디 제도", dist: "단거리", cost: 12, note: "레드 라인 앞의 마지막 기항지" },
    { dest: "롱 링 롱 랜드", dist: "중거리", cost: 18, note: "평온한 초원 바다로의 역항해" },
    { dest: "소금바람 요새(임의 지명)", dist: "원거리", cost: 28, note: "정부 전용 타라이 해류 부근" }
  ],
  "샤본디 제도": [
    { dest: "어인섬", dist: "심해 잠항", cost: 30, note: "선박 코팅 포함 · 해저 1만m 항해" },
    { dest: "워터 세븐", dist: "중거리", cost: 18, note: "기록지침 역방향 수로 도시" },
    { dest: "거품여울 군도(임의 지명)", dist: "단거리", cost: 10, note: "야르키만 맹그로브 외곽 섬" }
  ],

  // 2. 심해 및 신세계 (New World)
  "어인섬": [
    { dest: "펑크 하자드", dist: "단거리", cost: 12, note: "신세계 부상 후 첫 번째 금지 구역" },
    { dest: "드레스로자", dist: "중거리", cost: 22, note: "꽃과 정열의 번영한 섬" },
    { dest: "해저 산호길(임의 지명)", dist: "원거리", cost: 28, note: "심해 해류를 타고 도는 외곽 암초" }
  ],
  "펑크 하자드": [
    { dest: "드레스로자", dist: "단거리", cost: 10, note: "콜로세움과 왕궁이 있는 번화한 섬" },
    { dest: "그린 비트", dist: "중거리", cost: 18, note: "거대한 식물과 요정의 숲" },
    { dest: "용암빙벽 암초(임의 지명)", dist: "원거리", cost: 28, note: "불과 얼음 해류가 맞부딪치는 바다" }
  ],
  "드레스로자": [
    { dest: "그린 비트", dist: "단거리", cost: 8, note: "철교 너머 난쟁이들의 섬" },
    { dest: "조", dist: "중거리", cost: 20, note: "안개 속에 숨은 거대 코끼리의 등" },
    { dest: "붉은 이끼 환초(임의 지명)", dist: "원거리", cost: 28, note: "신세계 남동쪽 따뜻한 모래톱" }
  ],
  "그린 비트": [
    { dest: "조", dist: "단거리", cost: 12, note: "기록지침에 잡히지 않는 살아있는 섬" },
    { dest: "홀케이크 아일랜드 외해", dist: "중거리", cost: 22, note: "사황의 영역 토트랜드 외곽" },
    { dest: "투어의 서식지(임의 지명)", dist: "원거리", cost: 28, note: "사나운 투어 떼가 뛰노는 절벽 바다" }
  ],
  "조": [
    { dest: "와노국 외해", dist: "단거리", cost: 12, note: "폭포 절벽 아래 거친 파도의 바다" },
    { dest: "홀케이크 아일랜드 외해", dist: "중거리", cost: 20, note: "과자 섬들이 둘러싼 사황의 영해" },
    { dest: "안개코끼리 바닷길(임의 지명)", dist: "원거리", cost: 28, note: "즈니샤의 발자국을 따르는 해류" }
  ],
  "홀케이크 아일랜드 외해": [
    { dest: "와노국 외해", dist: "단거리", cost: 12, note: "구름과 번개가 치는 쇄국의 외해" },
    { dest: "엘바프", dist: "중거리", cost: 22, note: "세계 최강 거인 전사들의 왕국" },
    { dest: "사탕소금 군도(임의 지명)", dist: "원거리", cost: 28, note: "토트랜드 국경 경비정의 순찰선" }
  ],
  "와노국 외해": [
    { dest: "에그헤드 외해", dist: "단거리", cost: 12, note: "미래섬의 거대 돔 바다" },
    { dest: "엘바프", dist: "중거리", cost: 20, note: "거대한 보물나무 아담이 솟은 섬" },
    { dest: "검은 번개 여울(임의 지명)", dist: "원거리", cost: 30, note: "와노국 근해의 험악한 와류" }
  ],
  "에그헤드 외해": [
    { dest: "엘바프", dist: "단거리", cost: 10, note: "거인 전사들이 기다리는 북방의 바다" },
    { dest: "조", dist: "중거리", cost: 22, note: "안개 바다 속으로 돌아가는 역항해" },
    { dest: "철거인 해구(임의 지명)", dist: "원거리", cost: 28, note: "고대 병기의 파편이 잠든 바다" }
  ],
  "엘바프": [
    { dest: "스핑크스 섬", dist: "단거리", cost: 12, note: "흰 수염의 조용한 고향 마을" },
    { dest: "하치노스 근해", dist: "중거리", cost: 20, note: "해적섬 벌집의 술렁이는 바다" },
    { dest: "거인나무 환초(임의 지명)", dist: "원거리", cost: 28, note: "엘바프 외곽의 울창한 목재 바위섬" }
  ],
  "스핑크스 섬": [
    { dest: "드레스로자", dist: "단거리", cost: 12, note: "정열의 항구로 돌아가는 뱃길" },
    { dest: "조", dist: "중거리", cost: 20, note: "살아있는 거상 즈니샤를 찾는 길" },
    { dest: "흰모래 묘지(임의 지명)", dist: "원거리", cost: 28, note: "옛 해적들의 무덤이 있는 외딴섬" }
  ],
  "하치노스 근해": [
    { dest: "스핑크스 섬", dist: "단거리", cost: 12, note: "비가맹국의 조용한 해안" },
    { dest: "조", dist: "중거리", cost: 20, note: "기록지침 너머로 향하는 방랑 항해" },
    { dest: "해적소굴 여울(임의 지명)", dist: "원거리", cost: 28, note: "약탈선들이 숨어드는 무법 암초" }
  ],

  // 3. 4대 블루 및 출신지
  "이스트 블루 · 로그 타운": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "위대한 항로 입구 관문 운하" },
    { dest: "풍차언덕 암초(임의 지명)", dist: "중거리", cost: 16, note: "이스트 블루의 온화한 바다" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "운하를 넘어 첫 번째 항로로 직행" }
  ],
  "사우스 블루 · 바테리라": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "사우스 블루 쪽 해류 운하" },
    { dest: "남십자 환초(임의 지명)", dist: "중거리", cost: 18, note: "남쪽 바다의 따뜻한 여울" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "위대한 항로로의 직행 항해" }
  ],
  "웨스트 블루 · 카노 나라": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "웨스트 블루 해류 운하" },
    { dest: "서풍 암초(임의 지명)", dist: "중거리", cost: 18, note: "팔보수군 선단이 다니는 길" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "운하를 넘어 그랜드 라인 진입" }
  ],
  "노스 블루 · 루브니르 왕국": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "노스 블루의 거센 해류 운하" },
    { dest: "북극성 모래섬(임의 지명)", dist: "중거리", cost: 18, note: "차가운 북방 바람의 모래톱" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "리버스 마운틴을 넘는 원거리 항해" }
  ],
  "위대한 항로 상공 · 스카이피아": [
    { dest: "자야 · 모크 타운", dist: "단거리", cost: 10, note: "청해로 내려가는 해류길" },
    { dest: "롱 링 롱 랜드", dist: "중거리", cost: 18, note: "청해의 드넓은 초원 바다" },
    { dest: "하늘구름 외곽(임의 지명)", dist: "원거리", cost: 26, note: "백백해 언저리의 구름 암초" }
  ],
  "위대한 항로 해저 · 어인섬": [
    { dest: "펑크 하자드", dist: "단거리", cost: 12, note: "신세계 부상 항로" },
    { dest: "드레스로자", dist: "중거리", cost: 22, note: "신세계 번영한 해역" },
    { dest: "해저 산호길(임의 지명)", dist: "원거리", cost: 28, note: "해저 심해 외곽 암초" }
  ],
  "신세계 · 조": [
    { dest: "와노국 외해", dist: "단거리", cost: 12, note: "폭포 절벽의 거센 바다" },
    { dest: "홀케이크 아일랜드 외해", dist: "중거리", cost: 20, note: "사황 빅 맘의 영해" },
    { dest: "안개코끼리 바닷길(임의 지명)", dist: "원거리", cost: 28, note: "즈니샤 발자국 해류" }
  ],
  "신세계 · 스핑크스 섬": [
    { dest: "드레스로자", dist: "단거리", cost: 12, note: "정열의 항구 뱃길" },
    { dest: "조", dist: "중거리", cost: 20, note: "살아있는 거상의 길" },
    { dest: "흰모래 묘지(임의 지명)", dist: "원거리", cost: 28, note: "외딴 무덤의 모래톱" }
  ],
  "신세계 · 엘바프": [
    { dest: "스핑크스 섬", dist: "단거리", cost: 12, note: "흰 수염의 고향 마을" },
    { dest: "하치노스 근해", dist: "중거리", cost: 20, note: "해적섬 벌집의 바다" },
    { dest: "거인나무 환초(임의 지명)", dist: "원거리", cost: 28, note: "울창한 목재 바위섬" }
  ],

  // 4. 임의 지명에서의 연결
  "물안개 암초군(임의 지명)": [
    { dest: "쌍둥이 언덕", dist: "단거리", cost: 10, note: "등대 불빛을 따라 귀항" },
    { dest: "위스키 피크", dist: "중거리", cost: 18, note: "기록지침 첫 기항지" },
    { dest: "돌소금 여울(임의 지명)", dist: "원거리", cost: 26, note: "바깥쪽 암초 해역" }
  ],
  "돌소금 여울(임의 지명)": [
    { dest: "위스키 피크", dist: "단거리", cost: 10, note: "선인장 마을" },
    { dest: "리틀 가든", dist: "중거리", cost: 18, note: "원시림과 화산" },
    { dest: "해류목 군도(임의 지명)", dist: "원거리", cost: 26, note: "표류목이 모이는 무인도" }
  ],
  "해류목 군도(임의 지명)": [
    { dest: "리틀 가든", dist: "단거리", cost: 10, note: "거인들의 섬" },
    { dest: "드럼섬", dist: "중거리", cost: 18, note: "눈 덮인 겨울섬" },
    { dest: "산호별 환초(임의 지명)", dist: "원거리", cost: 28, note: "캄 벨트 인접 산호지대" }
  ],
  "산호별 환초(임의 지명)": [
    { dest: "드럼섬", dist: "단거리", cost: 10, note: "사쿠라 설산 왕국" },
    { dest: "알라바스타 · 나노하나", dist: "중거리", cost: 20, note: "사막 왕국의 무역항" },
    { dest: "소용돌이 갯길(임의 지명)", dist: "원거리", cost: 28, note: "와류 해협" }
  ],
  "소용돌이 갯길(임의 지명)": [
    { dest: "알라바스타 · 나노하나", dist: "단거리", cost: 10, note: "나노하나 부두" },
    { dest: "자야 · 모크 타운", dist: "중거리", cost: 20, note: "해적들의 무법항" },
    { dest: "바람길 암초(임의 지명)", dist: "원거리", cost: 28, note: "외딴 바위 암초" }
  ],
  "바람길 암초(임의 지명)": [
    { dest: "자야 · 모크 타운", dist: "단거리", cost: 10, note: "모크 타운" },
    { dest: "롱 링 롱 랜드", dist: "중거리", cost: 18, note: "유목민 평원" },
    { dest: "워터 세븐", dist: "원거리", cost: 26, note: "물의 도시" }
  ],
  "하늘구름 외곽(임의 지명)": [
    { dest: "롱 링 롱 랜드", dist: "단거리", cost: 12, note: "청해 평원으로 하강" },
    { dest: "워터 세븐", dist: "중거리", cost: 20, note: "수로 도시" },
    { dest: "샤본디 제도", dist: "원거리", cost: 28, note: "맹그로브 군도" }
  ],
  "스릴러 바크 외해(임의 지명)": [
    { dest: "샤본디 제도", dist: "단거리", cost: 12, note: "안개를 벗어나 비누방울 섬으로" },
    { dest: "워터 세븐", dist: "중거리", cost: 18, note: "바다열차 수로 도시" },
    { dest: "거품여울 군도(임의 지명)", dist: "원거리", cost: 26, note: "맹그로브 외곽 여울" }
  ],
  "소금바람 요새(임의 지명)": [
    { dest: "샤본디 제도", dist: "단거리", cost: 12, note: "비누방울 군도" },
    { dest: "워터 세븐", dist: "중거리", cost: 18, note: "조선소 도시" },
    { dest: "거품여울 군도(임의 지명)", dist: "원거리", cost: 26, note: "샤본디 외곽 섬" }
  ],
  "거품여울 군도(임의 지명)": [
    { dest: "샤본디 제도", dist: "단거리", cost: 8, note: "본섬 부두로 진입" },
    { dest: "워터 세븐", dist: "중거리", cost: 18, note: "역방향 수로 도시" },
    { dest: "어인섬", dist: "원거리", cost: 30, note: "선박 코팅 포함 · 심해 잠항" }
  ],
  "해저 산호길(임의 지명)": [
    { dest: "어인섬", dist: "단거리", cost: 8, note: "어인섬 궁전으로 귀환" },
    { dest: "펑크 하자드", dist: "중거리", cost: 16, note: "신세계 부상 항로" },
    { dest: "드레스로자", dist: "원거리", cost: 26, note: "정열의 섬" }
  ],
  "용암빙벽 암초(임의 지명)": [
    { dest: "드레스로자", dist: "단거리", cost: 10, note: "번화한 왕국" },
    { dest: "그린 비트", dist: "중거리", cost: 16, note: "난쟁이 숲" },
    { dest: "조", dist: "원거리", cost: 26, note: "거대 코끼리의 등" }
  ],
  "붉은 이끼 환초(임의 지명)": [
    { dest: "드레스로자", dist: "단거리", cost: 10, note: "드레스로자 항구" },
    { dest: "그린 비트", dist: "중거리", cost: 16, note: "식물의 숲" },
    { dest: "조", dist: "원거리", cost: 24, note: "모코모 공국" }
  ],
  "투어의 서식지(임의 지명)": [
    { dest: "그린 비트", dist: "단거리", cost: 10, note: "철교 너머 숲" },
    { dest: "조", dist: "중거리", cost: 18, note: "움직이는 섬" },
    { dest: "홀케이크 아일랜드 외해", dist: "원거리", cost: 26, note: "토트랜드 외곽" }
  ],
  "안개코끼리 바닷길(임의 지명)": [
    { dest: "조", dist: "단거리", cost: 8, note: "즈니샤의 등 위로 귀환" },
    { dest: "와노국 외해", dist: "중거리", cost: 18, note: "폭포 절벽 바다" },
    { dest: "홀케이크 아일랜드 외해", dist: "원거리", cost: 24, note: "과자 섬 군도" }
  ],
  "사탕소금 군도(임의 지명)": [
    { dest: "홀케이크 아일랜드 외해", dist: "단거리", cost: 10, note: "토트랜드 영해" },
    { dest: "와노국 외해", dist: "중거리", cost: 18, note: "무사의 외해" },
    { dest: "엘바프", dist: "원거리", cost: 26, note: "거인의 나라" }
  ],
  "검은 번개 여울(임의 지명)": [
    { dest: "와노국 외해", dist: "단거리", cost: 10, note: "와노국 근해" },
    { dest: "에그헤드 외해", dist: "중거리", cost: 18, note: "미래섬 바다" },
    { dest: "엘바프", dist: "원거리", cost: 26, note: "전사들의 섬" }
  ],
  "철거인 해구(임의 지명)": [
    { dest: "에그헤드 외해", dist: "단거리", cost: 10, note: "미래섬 부두" },
    { dest: "엘바프", dist: "중거리", cost: 18, note: "거인 왕국" },
    { dest: "스핑크스 섬", dist: "원거리", cost: 26, note: "흰 수염의 고향" }
  ],
  "거인나무 환초(임의 지명)": [
    { dest: "엘바프", dist: "단거리", cost: 8, note: "엘바프 항구" },
    { dest: "스핑크스 섬", dist: "중거리", cost: 16, note: "조용한 비가맹국" },
    { dest: "하치노스 근해", dist: "원거리", cost: 24, note: "벌집 해적섬" }
  ],
  "흰모래 묘지(임의 지명)": [
    { dest: "스핑크스 섬", dist: "단거리", cost: 10, note: "스핑크스 해안" },
    { dest: "드레스로자", dist: "중거리", cost: 18, note: "정열의 항구" },
    { dest: "조", dist: "원거리", cost: 26, note: "움직이는 코끼리" }
  ],
  "해적소굴 여울(임의 지명)": [
    { dest: "하치노스 근해", dist: "단거리", cost: 10, note: "벌집 외해" },
    { dest: "스핑크스 섬", dist: "중거리", cost: 18, note: "스핑크스 섬" },
    { dest: "조", dist: "원거리", cost: 26, note: "모코모 공국" }
  ],
  "풍차언덕 암초(임의 지명)": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "관문 운하" },
    { dest: "이스트 블루 · 로그 타운", dist: "단거리", cost: 10, note: "로그 타운" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "그랜드 라인" }
  ],
  "남십자 환초(임의 지명)": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "관문 운하" },
    { dest: "사우스 블루 · 바테리라", dist: "단거리", cost: 10, note: "바테리라" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "그랜드 라인" }
  ],
  "서풍 암초(임의 지명)": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "관문 운하" },
    { dest: "웨스트 블루 · 카노 나라", dist: "단거리", cost: 10, note: "카노 나라" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "그랜드 라인" }
  ],
  "북극성 모래섬(임의 지명)": [
    { dest: "리버스 마운틴", dist: "단거리", cost: 10, note: "관문 운하" },
    { dest: "노스 블루 · 루브니르 왕국", dist: "단거리", cost: 10, note: "루브니르" },
    { dest: "위스키 피크", dist: "원거리", cost: 26, note: "그랜드 라인" }
  ]
};

function firstTrust(life, place) {
  let hash = 0;
  for (const char of place) hash = Math.imul(hash ^ char.codePointAt(0), 0x01000193) >>> 0;
  const lean = PIRATE_HAVENS.includes(place) ? { pirate: 15, marine: -15 }[life.path] || 0 : 0;
  return [15, 30, 45][yearRoll(life.seed ^ hash, 3) % 3] + lean;
}

// Standing inside an organization follows the best reputation built anywhere, not the island the ship happens to be at.
export function standing(life) {
  return life.creationVersion >= 3 ? Math.max(life.trust, ...Object.values(life.trustBy)) : life.trust;
}

export function knownTrust(life, place) {
  return place === life.location ? life.trust : life.trustBy?.[place];
}

// Rule 3 keeps one trust value per place: leaving stores it, arriving loads it (or a first impression).
export function moveTo(life, place) {
  if (life.creationVersion >= 3 && place !== life.location) {
    life.trustBy[life.location] = life.trust;
    life.trust = life.trustBy[place] ?? firstTrust(life, place);
  }
  life.location = place;
  life.travelHistory.push(place);
}

// Moves a ship to the next adjacent or logical port on its route when leaving an island.
export function sailToNextPort(life) {
  // The Straw Hats depart at their canon beats, not at random side events.
  if (life.creationVersion >= 21 && life.canonCrew === "밀짚모자 일당" && !life.independent) return life.location;
  const cur = life.location;
  const v20Routes = ROUTES_V20[cur];
  let dest;
  if (v20Routes && v20Routes.length > 0) {
    dest = v20Routes[0].dest;
  } else {
    const route = routeFor(life);
    const curIdx = route.indexOf(cur);
    dest = curIdx >= 0 && curIdx + 1 < route.length ? route[curIdx + 1] : (route[0] !== cur ? route[0] : (route[1] || "쌍둥이 언덕"));
  }
  if (!life.leftHome) {
    life.leftHome = true;
    life.homebound = false;
  }
  if (dest && dest !== cur) {
    moveTo(life, dest);
  }
  return life.location;
}

// "로" after a vowel or ㄹ, "으로" after any other final consonant.
export function ro(word) {
  const code = word.codePointAt(word.length - 1) - 0xac00;
  return `${word}${code >= 0 && code <= 11171 && code % 28 !== 0 && code % 28 !== 8 ? "으로" : "로"}`;
}

// Canon crews a nameless deckhand could join; from/to are years before the original present.
const CANON_CREWS = [
  { name: "로저 해적단", from: 30, to: 25 },
  { name: "흰 수염 해적단", from: 60, to: 3 },
  { name: "빅 맘 해적단", from: 60, to: 1 },
  { name: "백수 해적단", from: 30, to: 1 },
  { name: "붉은 머리 해적단", from: 20, to: 0 },
  { name: "태양 해적단", from: 15, to: 12, species: "어인" },
  // Rule 15 only: the Straw Hats take someone in only in free mode, after Luffy and his crew came to trust them.
  { name: "밀짚모자 일당", from: 2, to: 0, rule: 15, freeOnly: true }
];

export function openCanonCrews(life, age = life.age) {
  const before = storyBefore(life, age);
  return CANON_CREWS.filter((crew) => before <= crew.from && before >= crew.to && (!crew.species || crew.species === life.birth.species)
    && (!crew.rule || life.creationVersion >= crew.rule) && (!crew.freeOnly || life.mode === "free")).map((crew) => crew.name);
}

export function canonCrew(life, age = life.age) {
  // Rule 15: a named crew makes an offer only to someone its people already know.
  const open = openCanonCrews(life, age).filter((name) => !(life.creationVersion >= 15) || crewTie(life, name) > 0);
  return open.length ? open[yearRoll(life.seed ^ 0x2c1b3c6d, age) % open.length] : null;
}

export function routeFor(life) {
  if (life.birth.species === "거인족" || life.birth.species === "밍크족" || life.birth.home.includes("신세계")) return NEW_ROUTE;
  if (life.birth.species === "어인") return ["샤본디 제도", "어인섬", ...NEW_ROUTE];
  if (life.birth.species === "하늘섬 사람") return ["자야 · 모크 타운", ...GRAND_ROUTE.slice(1)];
  if (life.birth.home.includes("위대한 항로")) return GRAND_ROUTE;
  return BLUE_ROUTE;
}

const ENCOUNTERS = [
  { id: "dorry_brogy", place: "리틀 가든", earliest: 100, latest: 3, name: "도리와 브로기", canon: "https://one-piece.com/story/alabasta/index.html",
    body: "리틀 가든에서 도리와 브로기의 결투 소리가 들렸다. 둘은 오래된 승부를 이어 가고 있었다. 지나가는 배는 싸움에 끼어들지 않고 해안에 닻을 내렸다.",
    choices: [
      { id: "share", label: "두 거인에게 식량을 나눈다", available: (life) => life.supplies >= 20, risk: "물자 20 필요 · 지역의 신뢰 +10", personality: { empathy: 8, loyalty: 5 }, apply: (life) => { life.supplies -= 20; life.trust += 10; return "두 거인은 식량을 받아 들고 다시 자기들의 승부로 돌아갔다."; } },
      { id: "watch", label: "멀리서 결투를 보고 떠난다", risk: "결투에 끼어들지 않음 · 기술 +10", personality: { caution: 6 }, apply: (life) => { life.skill += 10; return "물러설 때를 아는 것도 오래 남는 배움이었다."; } }
    ] },
  { id: "kureha", place: "드럼섬", earliest: 30, latest: 3, latestV3: 0, name: "닥터 쿠레하", canon: "https://one-piece.com/character/Dr_Kureha/index.html",
    body: "드럼섬에서 오래 일한 의사 닥터 쿠레하를 만났다. 쿠레하는 환자의 몸보다 먼저 여행 준비가 허술하다고 지적했다.",
    choices: [
      { id: "treat", label: "치료와 진찰을 부탁한다", available: (life) => life.supplies >= 20, risk: "물자 20 필요 · 건강 +20", personality: { caution: 5 }, apply: (life) => { life.supplies -= 20; life.health += 20; return "진찰은 거칠었지만 돌아갈 힘이 생겼다."; } },
      { id: "listen", label: "준비에 관한 말을 듣는다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "약보다 먼저 필요한 물자와 쉬는 날을 적었다."; } }
    ] },
  { id: "crocus", place: "쌍둥이 언덕", earliest: 24, latest: 3, latestV3: 0, name: "크로커스", canon: "https://one-piece.com/character/Crocus/index.html", art: "arcTwinCape",
    body: "쌍둥이 언덕의 등대에서 크로커스를 만났다. 항로를 묻자 그는 기록지침과 기다릴 시간을 먼저 확인했다.",
    choices: [
      { id: "ask", label: "기록지침을 살펴 달라고 한다", cost: 10, risk: "기술 +10 · 물자 -10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; life.supplies -= 10; return "새 항로보다 먼저 틀린 기록을 고쳤다."; } },
      { id: "go", label: "인사를 하고 길을 떠난다", risk: "현재 상태 유지", apply: () => "등대의 불빛을 뒤로하고 출항했다." }
    ] },
  { id: "rayleigh", place: "샤본디 제도", earliest: 10, latest: 3, name: "실버즈 레일리", canon: "https://one-piece.com/character/Silvers_Rayleigh/index.html", art: "arcSabaody",
    body: "샤본디 제도에서 코팅 일을 하던 실버즈 레일리를 잠깐 만났다. 그는 배의 상태를 살피고 깊은 바다에 필요한 준비를 물었다.",
    choices: [
      { id: "prepare", label: "코팅과 안전 장비를 의논한다", available: (life) => life.supplies >= 30, risk: "물자 30 필요 · 건강 +10", personality: { caution: 6 }, apply: (life) => { life.supplies -= 30; life.health += 10; return "코팅과 비상 밧줄을 갖춘 뒤에야 출항 날짜를 정했다."; } },
      { id: "wait", label: "더 준비할 때까지 머문다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "서두르지 않고 배의 약한 곳부터 고쳤다."; } }
    ] },
  { id: "tom", place: "워터 세븐", earliest: 30, latest: 11, name: "톰", canon: "https://one-piece.com/character/Tom/index.html", art: "arcWater7",
    body: "워터 세븐의 조선소에서 톰을 만났다. 낡은 배를 다시 쓰려면 배의 약점을 숨기지 말고 먼저 살펴야 한다는 이야기를 들었다.",
    choices: [
      { id: "learn", label: "배의 구조를 함께 점검한다", available: (life) => life.supplies >= 10, risk: "물자 10 필요 · 기술 +20", personality: { caution: 5, ambition: 4 }, apply: (life) => { life.supplies -= 10; life.skill += 20; return "나무가 물을 먹는 자리와 보강할 부분을 기록했다."; } },
      { id: "thank", label: "조언을 듣고 일터로 돌아간다", risk: "기술 +10", personality: { loyalty: 4 }, apply: (life) => { life.skill += 10; return "톰의 작업을 방해하지 않고 자기 배로 돌아왔다."; } }
    ] },
  { id: "luffy_elbaf", place: "엘바프", earliest: 0, latest: 0, name: "몽키 D. 루피", canon: "https://one-piece.com/story/elbaph/index.html", art: "arcElbaf",
    body: "엘바프에서 밀짚모자 루피를 잠깐 마주쳤다. 그는 동료들이 있는 쪽을 묻고 있었고, 항구의 길은 여러 갈래였다.",
    choices: [
      { id: "guide", label: "동료들이 지나간 길을 가리킨다", risk: "짧은 대화 · 지역의 신뢰 +10", personality: { empathy: 5 }, apply: (life) => { life.trust += 10; return "루피는 고맙다며 손을 흔들었다. 이어지는 모험은 그의 동료들과 함께할 일이었다."; } },
      { id: "pass", label: "다른 길목을 살피러 간다", risk: "기술 +10 · 각자의 항로", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "떠들썩한 항구를 뒤로하고 자기 배의 길을 확인했다."; } }
    ] },
  { id: "jarul", place: "엘바프", earliest: 63, latest: 3, latestV17: 0, name: "야를", canon: "https://one-piece.com/character/Jarul/index.html", art: "arcElbaf",
    body: "엘바프에 기항한 날, 장로 야를을 만났다. 그는 다른 배가 무엇을 얻으러 왔는지보다 누구와 함께 돌아갈지를 먼저 물었다.",
    choices: [
      { id: "share", label: "동행의 사정을 솔직히 말한다", risk: "지역의 신뢰 +10", personality: { loyalty: 6, empathy: 5 }, apply: (life) => { life.trust += 10; return "야를은 짧게 고개를 끄덕이고 기항할 자리를 알려 주었다."; } },
      { id: "observe", label: "예의를 갖추고 섬을 둘러본다", risk: "기술 +10", personality: { caution: 5 }, apply: (life) => { life.skill += 10; return "낯선 땅에서는 먼저 길과 일상을 익히기로 했다."; } }
    ] }
];

export function encounterAt(life) {
  const beforePresent = storyBefore(life);
  // latestV3/latestV17: canon still shows them there in the present; older rules keep their original window for replay.
  const latest = (entry) => life.creationVersion >= 17 && entry.latestV17 !== undefined ? entry.latestV17
    : life.creationVersion >= 3 && entry.latestV3 !== undefined ? entry.latestV3 : entry.latest;
  // Rule 20 ties the side encounter to the actual Elbaf arrival beat, not the coarse post-reunion era.
  return ENCOUNTERS.find((entry) => life.location === entry.place && beforePresent <= entry.earliest && beforePresent >= latest(entry)
    && (entry.id !== "luffy_elbaf" || life.creationVersion < 20 || life.seen.includes("canon_arc_elbaf_0"))
    && !life.seen.includes(`life_meet_${entry.id}`))?.id || null;
}

export function encounterScene(life) {
  const encounter = ENCOUNTERS.find((entry) => entry.id === life.pendingEncounter);
  if (!encounter) throw new Error("만남 기록을 찾을 수 없습니다.");
  return { id: `life_meet_${encounter.id}`, age: life.age, act: 2, species: "all", yearly: true, encounter: true,
    art: encounter.art || "deck", title: `${encounter.name}와의 마주침`, body: encounter.body, canon: encounter.canon, choices: encounter.choices };
}

export function isNewWorld(place) {
  if (!place) return false;
  return place.includes("신세계") || NEW_ROUTE.includes(place) || [
    "어인섬", "펑크 하자드", "드레스로자", "그린 비트", "조",
    "홀케이크 아일랜드 외해", "와노국 외해", "에그헤드 외해",
    "엘바프", "스핑크스 섬", "하치노스 근해", "로드스타 섬 근해",
    "해저 산호길", "용암빙벽 암초", "붉은 이끼 환초", "투어의 서식지",
    "안개코끼리 바닷길", "사탕소금 군도", "검은 번개 여울", "철거인 해구",
    "거인나무 환초", "흰모래 묘지", "해적소굴 여울"
  ].some((name) => place.includes(name));
}

function crewVoyageScene(life, age) {
  const strawHat = life.canonCrew === "밀짚모자 일당";
  const captain = strawHat ? "루피와 나미" : "선장과 항해사";
  const depart = (state) => {
    if (!strawHat) sailToNextPort(state);
    return strawHat
      ? "항로는 선장과 항해사가 정했다. 일행은 다음 목적지까지 함께 움직이기로 했다."
      : `선장이 정한 항로를 따라 ${state.location}에 도착했다.`;
  };
  return {
    id: `life_voyage_${age}`, age, act: 2, species: "all", yearly: true, urgent: true,
    art: "deck", title: `${captain}의 항로`,
    body: `${captain}가 다음 목적지를 정했다. 선원인 ${life.birth.name}은 어디로 갈지 고르는 대신 항해 중 맡을 일을 결정했다.`,
    choices: [
      { id: "sail", label: "항해와 조타 준비를 돕는다", risk: "기술 +5 · 선장의 항로에 동행",
        personality: { loyalty: 5 }, apply: (state) => { state.skill += 5; return depart(state); } },
      { id: "prepare", label: "식량과 선체를 점검한다", risk: "건강 +5 · 선장의 항로에 동행",
        personality: { caution: 5 }, apply: (state) => { state.health += 5; return depart(state); } }
    ]
  };
}

export function travelScene(life, age) {
  if (life.creationVersion >= 21 && life.path === "pirate" && !life.independent && life.role !== "선장") return crewVoyageScene(life, age);
  if (life.creationVersion >= 20) return distanceProportionalTravelScene(life, age);
  if (life.creationVersion >= 4) return branchingTravelScene(life, age);
  const route = routeFor(life);
  const nearIndex = (life.routeIndex + 1) % route.length;
  const farIndex = (life.routeIndex + 2) % route.length;
  function visit(state, index, cost) {
    state.routeIndex = index;
    moveTo(state, route[index]);
    state.age = age;
    state.supplies -= cost;
    state.pendingEncounter = encounterAt(state);
    if (state.creationVersion < 3) return `${state.birth.name}의 배는 ${state.location}에 닿았다. 새 기항지의 물길과 사람을 살피기 시작했다.`;
    const mood = state.trust >= 45 ? "반기는 얼굴이 많았다" : state.trust <= 20 ? "낯선 배를 경계하는 눈길이 날카로웠다" : "사람들은 아직 지켜보기만 했다";
    return `${state.birth.name}의 배는 ${state.location}에 닿았다. 부두에서는 ${mood}.`;
  }
  const place = (index) => {
    if (life.creationVersion < 3) return "";
    const known = knownTrust(life, route[index]);
    return known === undefined ? " · 처음 가는 곳" : ` · 그곳의 신뢰 ${known}`;
  };
  return { id: `life_voyage_${age}`, age, act: 2, species: "all", yearly: true, urgent: true, art: "deck",
    title: life.creationVersion === 1 ? "다음 기항지를 고르다" : `${life.location}에서의 출항`,
    body: `${life.location}에서 다음 항로를 정할 때가 왔다. 기록지침과 동행의 준비를 확인했다. 먼 섬으로 갈수록 식량과 배를 손볼 물자가 더 필요했다.`, choices: [
      { id: "near", label: `${ro(route[nearIndex])} 간다`, available: (state) => state.supplies >= 10, risk: `물자 10 필요 · 가까운 항로${place(nearIndex)}`, personality: { freedom: 5 }, apply: (state) => visit(state, nearIndex, 10) },
      { id: "far", label: `${ro(route[farIndex])} 긴 항해를 한다`, available: (state) => state.supplies >= 20, risk: `물자 20 필요 · 긴 항로${place(farIndex)}`, personality: { ambition: 7, freedom: 5 }, apply: (state) => visit(state, farIndex, 20) },
      { id: "convoy", label: `동행 선단과 ${ro(route[nearIndex])} 간다`, risk: `물자 없이 이동 · 친구와의 유대 -5${place(nearIndex)}`, personality: { loyalty: 4, freedom: -3 }, apply: (state) => { const result = visit(state, nearIndex, 0); state.friendBond -= 5; return result; } }
    ] };
}

function distanceProportionalTravelScene(life, age) {
  const routes = ROUTES_V20[life.location] || ROUTES_V20[routeFor(life)[0]] || [
    { dest: "위스키 피크", dist: "단거리", cost: 10, note: "기록지침 항로" },
    { dest: "리틀 가든", dist: "중거리", cost: 18, note: "중거리 항로" },
    { dest: "돌소금 여울(임의 지명)", dist: "원거리", cost: 26, note: "원거리 항로" }
  ];
  const newWorld = isNewWorld(life.location);
  const candidates = newWorld
    ? ["드레스로자", "그린 비트", "조", "와노국 외해", "엘바프", "스핑크스 섬", "하치노스 근해", "에그헤드 외해", "붉은 이끼 환초(임의 지명)", "거인나무 환초(임의 지명)"]
    : ["쌍둥이 언덕", "위스키 피크", "리틀 가든", "드럼섬", "알라바스타 · 나노하나", "자야 · 모크 타운", "롱 링 롱 랜드", "워터 세븐", "샤본디 제도", "물안개 암초군(임의 지명)", "해류목 군도(임의 지명)"];
  const currentDestNames = routes.map((r) => r.dest);
  const poseOptions = candidates.filter((place) => place !== life.location && place !== "어인섬" && !currentDestNames.includes(place));
  const poseDestination = poseOptions[yearRoll(life.seed ^ 0x6d3c, age) % (poseOptions.length || 1)] || (newWorld ? "엘바프" : "워터 세븐");

  function visit(state, place, cost) {
    state.age = age;
    state.supplies -= cost;
    moveTo(state, place);
    state.pendingEncounter = encounterAt(state);
    if (place.includes("(임의 지명)")) {
      return `${state.birth.name}의 배는 지도에 임의 지명으로 적힌 ${place}에 닻을 내렸다. 해도에는 없던 작은 부두와 거친 암초 너머로 새로운 풍경이 펼쳐졌다.`;
    }
    return `${state.birth.name}의 배는 ${place}에 닿았다. 낡은 해도에는 없던 부두의 소란이 먼저 들렸다.`;
  }

  const title = `${life.location}에서 바늘이 갈라질 때`;
  let displayTitle = title;
  const departures = life.journal.filter((entry) => entry.title === title || entry.title.startsWith(`${title} · `)).length;
  if (departures) displayTitle = `${title} · ${departures + 1}번째 출항`;

  const near = routes[0];
  const mid = routes[1] || routes[0];
  const far = routes[2] || routes[1] || routes[0];

  const nearCost = life.location === "샤본디 제도" && near.dest === "어인섬" ? 30 : near.cost;
  const midCost = life.location === "샤본디 제도" && mid.dest === "어인섬" ? 30 : mid.cost;
  const farCost = life.location === "샤본디 제도" && far.dest === "어인섬" ? 30 : far.cost;

  const nearRisk = near.dest === "어인섬"
    ? `물자 ${nearCost} 필요 · 선박 코팅 포함 (${near.note})`
    : `물자 ${nearCost} 필요 · ${near.dist} 항로 (${near.note})`;
  const midRisk = mid.dest === "어인섬"
    ? `물자 ${midCost} 필요 · 선박 코팅 포함 (${mid.note})`
    : `물자 ${midCost} 필요 · ${mid.dist} 항로 (${mid.note})`;
  const farRisk = far.dest === "어인섬"
    ? `물자 ${farCost} 필요 · 선박 코팅 포함 (${far.note})`
    : `물자 ${farCost} 필요 · ${far.dist} 항로 (${far.note})`;

  const choices = [
    {
      id: "near",
      label: `[단거리] 기록지침을 따라 ${ro(near.dest)} 간다`,
      available: (state) => state.supplies >= nearCost,
      risk: nearRisk,
      personality: { caution: 4 },
      apply: (state) => visit(state, near.dest, nearCost)
    },
    {
      id: "mid",
      label: `[중거리] 바닷길을 넓혀 ${ro(mid.dest)} 간다`,
      available: (state) => state.supplies >= midCost,
      risk: midRisk,
      personality: { freedom: 4 },
      apply: (state) => visit(state, mid.dest, midCost)
    },
    {
      id: "far",
      label: `[원거리] 먼 바다를 건너 ${ro(far.dest)} 간다`,
      available: (state) => state.supplies >= farCost,
      risk: farRisk,
      personality: { ambition: 6, freedom: 5 },
      apply: (state) => visit(state, far.dest, farCost)
    },
    {
      id: "convoy",
      label: `동행 선단과 ${ro(near.dest)} 간다`,
      risk: `${near.dest === "어인섬" ? "코팅된 선박에 동승" : "물자 없이 이동"} · 친구와의 유대 -5`,
      personality: { loyalty: 4 },
      apply: (state) => { state.friendBond -= 5; return visit(state, near.dest, 0); }
    },
    {
      id: "pose",
      label: `영구 지침으로 ${ro(life.eternalPose || near.dest)} 간다`,
      when: (state) => Boolean(state.eternalPose) && state.eternalPose !== state.location && isNewWorld(state.eternalPose) === newWorld,
      available: (state) => state.supplies >= 15,
      risk: "물자 15 필요 · 가지고 있는 영구 지침 사용",
      personality: { caution: 4 },
      apply: (state) => visit(state, state.eternalPose, 15)
    },
    {
      id: "buy_pose",
      label: `영구 지침을 사서 ${ro(poseDestination)} 간다`,
      when: () => Boolean(poseDestination),
      available: (state) => state.supplies >= 30,
      risk: "물자 30 필요 · 영구 지침 보유",
      personality: { ambition: 5 },
      apply: (state) => { state.eternalPose = poseDestination; return visit(state, poseDestination, 30); }
    }
  ];

  return {
    id: `life_voyage_${age}`,
    age,
    act: 2,
    species: "all",
    yearly: true,
    urgent: true,
    art: "deck",
    title: displayTitle,
    body: `기록지침과 나침반의 바늘이 제각기 다른 물길을 가리켰다. 거리에 따라 채워 넣을 물자와 식량이 달랐고, 지도에 없는 임의 지명의 작은 섬이나 미개척 암초를 경유할 수도 있었다.`,
    choices
  };
}

function branchingTravelScene(life, age) {
  const log = ROUTES_V4[life.location] || ROUTES_V4[routeFor(life)[0]];
  const isNewWorld = (place) => place.includes("신세계") || NEW_ROUTE.includes(place) || ["펑크 하자드", "에그헤드 외해"].includes(place);
  const newWorld = isNewWorld(life.location);
  const candidates = newWorld ? ["드레스로자", "조", "와노국 외해", "엘바프", "스핑크스 섬"]
    : ["워터 세븐", "샤본디 제도", "어인섬", "자야 · 모크 타운", "알라바스타 · 나노하나"];
  const poseOptions = candidates.filter((place) => place !== life.location && place !== "어인섬" && !log.includes(place));
  const poseDestination = poseOptions[yearRoll(life.seed ^ 0x6d3c, age) % poseOptions.length];
  const passageCost = (place, ordinary) => life.location === "샤본디 제도" && place === "어인섬" ? 30 : ordinary;
  function visit(state, place, cost) {
    state.age = age;
    state.supplies -= cost;
    moveTo(state, place);
    state.pendingEncounter = encounterAt(state);
    return `${state.birth.name}의 배는 ${place}에 닿았다. 낡은 해도에는 없던 부두의 소란이 먼저 들렸다.`;
  }
  const title = `${life.location}에서 바늘이 갈라질 때`;
  let displayTitle = title;
  if (life.creationVersion >= 5) {
    const departures = life.journal.filter((entry) => entry.title === title || entry.title.startsWith(`${title} · `)).length;
    if (departures) displayTitle = `${title} · ${departures + 1}번째 출항`;
  } else if (life.journal.slice(-10).some((entry) => entry.title === title)) {
    displayTitle = `${title} · ${age}세의 재출항`;
  }
  return { id: `life_voyage_${age}`, age, act: 2, species: "all", yearly: true, urgent: true, art: "deck",
    title: displayTitle,
    body: `기록지침이 서로 다른 섬을 가리켰다. 선원들은 식량을 세고 한쪽을 고르자고 했다. 영구 지침이 있으면 익숙한 목적지로 길을 틀 수도 있었다.`,
    choices: [
      { id: "near", label: `기록지침을 따라 ${ro(log[0])} 간다`, available: (state) => state.supplies >= passageCost(log[0], 10),
        risk: `물자 ${passageCost(log[0], 10)} 필요 · ${log[0] === "어인섬" ? "선박 코팅 포함" : "기록지침 첫 항로"}`,
        personality: { caution: 4 }, apply: (state) => visit(state, log[0], passageCost(log[0], 10)) },
      { id: "far", label: `다른 바늘을 따라 ${ro(log[1])} 간다`, available: (state) => state.supplies >= passageCost(log[1], 20),
        risk: `물자 ${passageCost(log[1], 20)} 필요 · ${log[1] === "어인섬" ? "선박 코팅 포함" : "다른 항로"}`,
        personality: { freedom: 5 }, apply: (state) => visit(state, log[1], passageCost(log[1], 20)) },
      { id: "convoy", label: `동행 선단과 ${ro(log[0])} 간다`, risk: `${log[0] === "어인섬" ? "코팅된 선박에 동승" : "물자 없이 이동"} · 친구와의 유대 -5`,
        personality: { loyalty: 4 }, apply: (state) => { state.friendBond -= 5; return visit(state, log[0], 0); } },
      { id: "pose", label: `영구 지침으로 ${ro(life.eternalPose || log[0])} 간다`,
        when: (state) => Boolean(state.eternalPose) && state.eternalPose !== state.location && isNewWorld(state.eternalPose) === newWorld,
        available: (state) => state.supplies >= 15, risk: "물자 15 필요 · 가지고 있는 영구 지침 사용",
        personality: { caution: 4 }, apply: (state) => visit(state, state.eternalPose, 15) },
      { id: "buy_pose", label: `영구 지침을 사서 ${ro(poseDestination)} 간다`, when: () => Boolean(poseDestination),
        available: (state) => state.supplies >= 30, risk: "물자 30 필요 · 영구 지침 보유",
        personality: { ambition: 5 }, apply: (state) => { state.eternalPose = poseDestination; return visit(state, poseDestination, 30); } }
    ] };
}

export function yearRoll(seed, age) {
  let value = (seed ^ Math.imul(age, 0x9e3779b1)) >>> 0;
  value = Math.imul(value ^ value >>> 16, 0x7feb352d);
  value = Math.imul(value ^ value >>> 15, 0x846ca68b);
  return (value ^ value >>> 16) >>> 0;
}

// A one-line public summary of the canon crew's whereabouts in the same year, in this game's own words.
export function crewNews(life, age = life.age) {
  const before = storyBefore(life, age);
  const line = before > 19 ? "아직 없다. 훗날의 선장도 태어나기 전이다."
    : before > 12 ? "훗날의 선장 루피는 이스트 블루 푸샤 마을의 어린아이다."
      : before === 12 ? "푸샤 마을을 떠나는 샹크스가 어린 루피에게 밀짚모자를 맡겼다."
        : before > 2 ? "루피는 코르보산의 산적 다단 일가에서 자라며 바다로 나갈 날을 기다린다."
          : before === 2 ? "루피가 바다로 나가 동료를 모았다. 마린포드 전쟁 뒤 일당은 흩어져 수련에 들어갔다."
            : before === 1 ? "흩어진 일당이 각자의 섬에서 2년의 수련을 이어 간다."
              : before === 0 ? "다시 모인 일당이 신세계를 건너 엘바프에 닿았다."
                : "원작이 아직 그리지 않은 시간이다. 일당의 다음 항해는 공개되지 않았다.";
  const taken = life.people?.fruitOwner;
  return taken ? `${line} (이 세계선의 ${taken.owner}는 ${taken.fruit}를 먹지 않았다.)` : line;
}

export function crewVesselKind(life, sceneAge = life?.age ?? 0) {
  if (!life || life.rules !== 3) return "hat";
  if (life.seen?.includes("life_marineford_news")) return "sunny";
  if (sceneAge < eraStart(life)) return "hat";
  const step = life.preCanonStep || 0;
  const v = life.creationVersion || 20;
  const sunnyAt = v >= 17 ? 34 : v >= 10 ? 33 : 20;
  const merryAt = v >= 10 ? 4 : 3;
  return step >= sunnyAt ? "sunny" : step >= merryAt ? "merry" : "dinghy";
}
