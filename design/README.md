# 검토용 시안과 원본 그림

그림은 OpenAI 내장 `image_gen`으로 생성했고 공식 원피스 이미지·로고·음성을 참조하거나 복사하지 않았다. [시범판](../docs/BUILD_STATUS.md)의 인간 경로는 [출생](assets/birth-harbor.png) → [폭풍](assets/storm-harbor-neutral.png) → [수리](assets/repaired-harbor-neutral.png) → [현재 항구](assets/harbor-now.png) → [구조 위기](assets/rescue-storm-neutral.png) → [은퇴](assets/retirement-harbor-neutral.png) 그림을 사용한다. PNG는 편집용 원본이며, 웹게임은 같은 이름의 WebP 압축본을 불러온다. 인물이 전면에 나오는 초기 [폭풍](assets/storm-harbor.png)·[수리](assets/repaired-harbor.png)·[구조 위기](assets/rescue-storm.png)·[은퇴](assets/retirement-harbor.png) 그림은 비교용 시안으로 남겼다. 현재 플레이용 장면은 무작위 성별·나이와 충돌하지 않도록 배와 항구를 중심으로 다시 만들었다. PC·휴대폰의 제작 전 선택 장면은 각각 [PC SVG](scene-desktop.svg), [휴대폰 SVG](scene-mobile.svg)에 있고, [성장 비교 SVG](growth-before-after.svg)는 두 시점을 나란히 놓았다. SVG는 실행되는 UI가 아니다.

## 종족별 생활·위기 그림

| 경로 | 생활 | 위기 |
| --- | --- | --- |
| 어인 | [어인섬 물길](assets/fishman-home.png) | [해류 통로](assets/fishman-crisis.png) |
| 밍크족 | [조의 나무길](assets/mink-home.png) | [흔들리는 다리](assets/mink-crisis.png) |
| 하늘섬 사람 | [스카이피아 구름길](assets/sky-home.png) | [바람에 밀린 구름 배](assets/sky-crisis.png) |
| 거인족 | [엘바프 연안](assets/giant-home.png) | [큰 배의 계류](assets/giant-crisis.png) |

최종 프롬프트의 공통 조건: 원본 `harbor-now.png`를 색·질감 참고 이미지로 사용한다. 가로형 게임 장면, 따뜻한 종이색과 절제된 수채·잉크 질감, 멀리 있는 주민, 일상적인 규모의 사건을 보여 준다. 정해진 성별·얼굴의 주인공, 글자·로고·깃발·공식 캐릭터·원작 디자인·UI·광택 3D 효과는 넣지 않는다. 각 위기 그림은 해당 생활 그림을 편집 참조로 사용했다.

- 어인 생활: 어인섬의 창작 물속 주거 구역, 조개·산호 건축, 이동 통로와 물자 운반. 위기: 같은 통로에 거센 해류가 밀려와 주민들이 표식과 밧줄을 지킨다.
- 밍크족 생활: 거대한 코끼리의 등 위 숲 마을, 동물형 주민과 나무다리, 실제 생활 동선. 위기: 같은 길목의 다리가 비바람에 흔들려 주민들이 우회로를 만든다.
- 하늘섬 생활: 구름 바다 위 창작 해안 마을, 구름길·작은 배·바람 표식. 위기: 같은 마을의 폭풍에 구름길이 끊기고 배가 밀려나 주민들이 밧줄과 불빛을 준비한다.
- 거인족 생활: 엘바프의 창작 연안 마을, 일반 선실보다 큰 거인 주민과 작업 도구. 위기: 같은 해안의 폭풍에 큰 배가 밀려나 거인들이 계류 밧줄을 당긴다.

## 생성 프롬프트

### 폭풍 직후

> Create one original editorial story illustration for a Korean browser life-simulation game's scene art. A quiet coastal harbor in a fictional East Blue-like fantasy world on the morning after a violent storm: a small family fishing boat is broken against the pier, its mast splintered; a weathered adult guardian, seen three-quarter back, holds a cracked brass compass; a child protagonist, approximately 10 years old, stands close beside them looking at the wreck. Weather clearing, muted sea green and warm paper cream palette, hand-painted gouache and restrained ink texture, compassionate human scale. Strong readable silhouettes and clearly recognizable boat, compass, two people, pier. Landscape wide composition suitable for an image panel in a game. No words, typography, maps, flags, skull emblems, famous characters, official One Piece designs, logos, UI panels, glossy gradients, 3D rendering, or generic game concept art effects. The art should feel like a specific lived moment, not a promotional poster.

**시각 검수:** 배와 인물은 보이지만 나침반의 균열은 분명하지 않았다. 원고에서는 보이는 사실에 맞춰 ‘가족의 나침반’으로 표현했다.

### 수리한 배

> Edit the referenced illustration as the next chapter of the SAME original family's life, about 12 years later. Keep the same harbor geography, pier, hand-painted gouache and ink look, sea-green and warm-paper palette, landscape-wide composition, and recognizable faces and clothing cues. The former child is now a young adult boat carpenter in a practical worn work apron, standing in the foreground with the same brass compass now carefully repaired; the same guardian is older, nearby, watching with quiet pride. Their formerly wrecked small wooden fishing boat is now seaworthy with visible repaired planks and fresh rigging, moored to the same pier. Make the changed boat and grown protagonist legible at a glance; emotional tone of earned growth and continuity, not triumphal spectacle. No words, typography, flags, skull symbols, famous characters, logos, UI, glossy gradients, or 3D rendering.

### 은퇴와 계승

> Edit this SAME original coastal-harbor story illustration to show the closing scene of one possible lifetime, roughly 45 years after the reference image. Preserve the harbor geography, the same repaired wooden fishing boat, wide landscape framing, warm-paper and muted-sea-green hand-painted gouache/ink texture, and the former young boat carpenter's recognizable facial and hair features now as an elderly person. The elder stands on the same pier and gently hands the same brass compass to a young adult successor who is about to take the repaired boat to sea; a small safe harbor workshop and returning boats are visible in the background as evidence of a lifetime's work. The guardian from the childhood scene is not present. The elder's expression is quiet relief, a life handed on, not a triumphal pose. No text, logos, maps, flags, skull symbols, famous characters, official One Piece designs, UI panels, glossy gradients or 3D rendering. This is a final story panel for a game, not a poster.

두 번째 그림은 첫 번째 그림을, 세 번째 그림은 두 번째 그림을 이미지 편집의 참조로 사용했다. 실제 카드 제작 전에 종족·장소·나이·소속별 시각 키와 원고가 맞는지 별도로 검사해야 한다.

### 출생

> Edit the referenced ORIGINAL hand-painted harbor illustration into an earlier, peaceful birth-memory scene in the SAME fictional East Blue coastal town. Keep the same recognizable pier, shoreline, lighthouse, family fishing boat, and restrained ink and gouache texture with warm paper and muted sea greens. A younger adult caregiver sits outside a modest harbor home, holding a swaddled newborn whose face and gender are not emphasized; a second adult friend brings a basin of warm water. The same family boat is fully intact and moored safely. Gentle morning light, ordinary work and care, no storm damage yet. Wide landscape composition suitable as story illustration in a web game. Clear silhouettes and no ornate fantasy spectacle. No text, logos, official characters, skull emblems, flags, UI, maps, glossy gradients, or 3D rendering.

### 구조 위기

> Create a later, perilous storm-rescue scene as an edit of this SAME original gouache-and-ink coastal harbor illustration. Preserve the recognizable harbor, lighthouse, pier, repaired small wooden fishing boat and muted sea-green / warm-paper visual language. The former young boat carpenter is now a mature adult at the pier with local harbor workers; in heavy rain and wind they are preparing the repaired boat to rescue a distant damaged vessel. Show visible rope, lantern, rough waves, workers bracing together, and a clear choice between going out and organizing a safer shore response. No deaths or injuries depicted, no famous characters, official One Piece designs, skull flags, words, UI, glossy gradients or 3D render. Wide landscape game-story illustration, human scale and readable silhouettes.

### 현재 항구

> Transform the referenced original gouache-and-ink illustration into a character-neutral view of the SAME fictional coastal harbor many years later, suitable as reusable story art for several different life paths. Keep the recognizable sea cliffs, lighthouse, stone pier, small wooden working boats, muted sea green and warm paper palette, visible workaday harbor details and hand-painted ink texture. No close-up or identifiable main character; a few tiny distant workers only, so players of different randomized identities can imagine themselves here. One brass compass rests on a weathered pier railing in the foreground, a quiet memory linking past and present. Wide landscape composition, clear human-scale storytelling, no text, logos, maps, skull flags, official characters, UI, glossy gradients, or 3D rendering.

### 무작위 외형에 공용으로 쓰는 장면

폭풍 공용 그림은 초기 그림과 같은 항구에서 파손된 가족 배, 먼 뒤태의 작은 인물 두 명, 부두의 나침반을 보여 달라고 요청했다. 얼굴·성별 표현을 드러내지 않고 배의 손실을 첫눈에 읽을 수 있게 했다.

수리 공용 그림의 최종 프롬프트:

> Use case: illustration-story. Asset type: wide landscape scene art in a Korean browser life-simulation game. Edit the referenced original harbor illustration to show the same family wooden fishing boat twelve years after the storm: now afloat and seaworthy, with visibly replaced planks and careful rigging at the SAME stone pier. Keep the distinctive blue-and-cream hull, cliffside village, distant lighthouse, sea-green water, warm-paper light, hand-painted gouache and restrained ink texture. Place the same brass compass prominently on a workbench on the pier with planing tools and a few fresh wood shavings. Any workers are small, back-facing and far away, with no visible face, gender expression or identifying clothing; the randomized player can imagine themself in the scene. The boat's transformation from wreck to repaired vessel must read at a glance. Quiet earned progress, human scale. No text, typography, flags, skull emblems, famous characters, official One Piece designs, logos, UI, glossy gradients, 3D rendering or poster-style spectacle.

은퇴 공용 그림의 최종 프롬프트:

> Use case: illustration-story. Asset type: wide landscape final scene art for a Korean browser life-simulation game. Edit the reference illustration into the SAME harbor several decades later. Preserve the recognizable blue-and-cream repaired family fishing boat, stone pier, cliffside village and lighthouse, hand-painted gouache and restrained ink texture, sea-green and warm-paper palette. On the pier near the boat, two small people seen only from behind quietly pass the family brass compass from an older worker to a younger apprentice. Their faces, hair and gender expression must NOT be discernible because the player character's gender is randomized. Show age through posture and steady hands, not face or hair. The compass exchange should be legible, but the boat and harbor remain the central subjects. A modest workshop and returning boats show a lifetime of useful work; the boat is seaworthy. Calm late-afternoon closure, no grand triumph. No text, typography, flags, skull emblems, famous characters, official One Piece designs, logos, UI, glossy gradients, 3D rendering or poster composition.

구조 위기 공용 그림의 최종 프롬프트:

> Use case: illustration-story. Asset type: wide landscape rescue-crisis scene art for a Korean browser life-simulation game. Edit the SAME original coastal harbor from the reference illustration into a stormy night several decades later. Keep the distinctive blue-and-cream repaired family fishing boat, stone pier, cliffside village, lighthouse, muted sea-green and warm-paper gouache/ink texture. The repaired boat is ready to depart from the pier while a separate small damaged vessel is visible far offshore in rough waves. Show a clear shore-side rescue effort through taut ropes, two lanterns, a coil of line and a few small local workers bracing together; the workers must be distant, seen from behind or obscured by rain, without identifiable faces, ages, hair or gender expression, so no person is implied to be the randomized player. Focus on the boat, the dangerous gap of water and the prepared shore response. No inset diagrams, maps, text, typography, flags, skull symbols, famous characters, official One Piece designs, logos, UI, glossy effects, 3D rendering or promotional-poster composition. Human scale and readable visual stakes.
