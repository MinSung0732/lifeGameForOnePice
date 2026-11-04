# 한 사람의 바다

원피스 세계에서 무작위로 태어난 한 사람이 유년기부터 생애의 끝 또는 현재 시점까지 살아가는 비공식 웹게임입니다. 현재는 **동쪽 바다 인간/민간인 경로를 완주할 수 있는 시범판**입니다. 전체 원고와 소속 경로는 제작 중입니다.

## 로컬 실행

이 폴더에서 `npm run dev`를 실행하고 `http://localhost:4173`을 엽니다. **`index.html`을 더블클릭해 `file:///` 주소로 열면 JavaScript 모듈이 차단되어 게임이 시작되지 않습니다.** 이 명령은 설치된 Python의 정적 파일 서버를 사용하며 추가 패키지를 설치하지 않습니다. `npm test`는 이야기 분기·세 결말·저장 재현을 검사합니다.

- [현재 구현 범위와 남은 작업](docs/BUILD_STATUS.md): 49장 카드, 세 엔딩, 1,000개 시드 검사 결과

- [게임 기획서](docs/GAME_DESIGN.md): 네 막, 출생·선택·관찰, 40~60분 구성, 화면과 제작 범위
- [시작 모드 설계](docs/MODES.md): 캐릭터 추첨 전 원작 모드·더 자유로운 모드 선택과 세계선 분기
- [한 생애의 시작과 끝](docs/STORY_ARC.md): 유년기의 첫 장면부터 사망·은퇴·현재 시점 엔딩까지의 연결
- [소속·직책 설계](docs/AFFILIATIONS.md): 사건에 따른 가입·승진·전향과 사황·최고 간부 IF 분기
- [이벤트 수·반복 검수](docs/CONTENT_AUDIT.md): 339개 목표 장면 카드, 분기 수의 정의, 10회 반복 기준
- [화면·그림·문장·성장 기준](docs/UX_ART_DIRECTION.md): 짧은 글, 설명하는 그림, 고유한 UI와 성장 경험
- [세 장면 검토 원고](docs/SCENE_EXAMPLE.md): 한 항구 생애의 첫 선택·성장·은퇴 예시
- [제작 착수 전 검수 기록](docs/PLANNING_GATE.md): 기획 단계의 확인된 점과 미검증 항목
- [원작 설정 규칙](docs/CANON_RULES.md): 2026-11-04 기준 자료 상한, 연표·이동·능력·원작 인물 검수

PC·휴대폰의 [선택 장면 시안](design/scene-desktop.svg) · [휴대폰 시안](design/scene-mobile.svg)과 [성장 전후 비교](design/growth-before-after.svg)가 있습니다. 시안은 실행되는 게임이 아닙니다.

코딩에는 [Ponytail full 규칙](AGENTS.md)을 적용하고, 픽셀 효과 작업에는 프로젝트 안의 [pixelfx 스킬](.agents/skills/pixelfx/SKILL.md)을 사용합니다.
