# 상세 리팩토링 검토 보고서

> **작성일**: 2026-01-15
> **대상**: `src` 디렉토리 전체
> **작성자**: Antigravity (AI Assistant)

## 1. 개요
현재 프로젝트는 Phase 1~4 리팩토링을 통해 주요 컴포넌트 분리와 구조 개선이 이루어졌습니다. 하지만 코드의 유지보수성, 확장성, 성능을 더욱 개선하기 위해 추가적인 리팩토링 포인트들을 식별했습니다. 특히 **상태 관리의 현대화(Custom Hooks)**와 **UI 로직의 분리**가 핵심 과제입니다.

---

## 2. 주요 개선 제안

### 2.1 상태 관리 개선 (Custom Hooks 도입) 🛠️
현재 `utils/storage.js`는 단순 함수형태로 구현되어 있어, 데이터 변경 시 React 컴포넌트의 리렌더링을 유발하지 않습니다. 이를 커스텀 훅으로 감싸 리액티브하게 만들어야 합니다.

*   **`useMBTI`**: MBTI 상태를 전역적으로 공유하고 변경 시 구독 중인 모든 컴포넌트 업데이트.
*   **`useSettings`**: 설정 변경 시 즉시 반영되도록 개선.
*   **`usePortfolio`**: 포트폴리오 데이터 실시간 동기화.

### 2.2 비즈니스 로직 분리 (Hook Pattern) 🧩
페이지 컴포넌트(`Page.jsx`)에 UI 렌더링 코드와 데이터 처리 로직이 섞여 있습니다.

*   **`MainPage`**:
    *   `useStockRecommendation`: 추천 종목 필터링 로직 분리.
    *   `useMarketCondition`: 시장 상황(상승/하락장) 상태 관리 및 갱신 로직 분리.
*   **`LandingPage`**:
    *   스크롤 애니메이션 로직을 별도 훅이나 컴포넌트로 분리.

### 2.3 데이터 및 상수 상수화 (Constants) 📦
하드코딩된 데이터들을 별도 파일로 관리하여 유지보수성을 높여야 합니다.

*   **`src/constants/landing.js`**: `LandingPage`의 Feature 목록, MBTI 샘플 등.
*   **`src/constants/mbti.js`**: `OnboardingPage`의 MBTI 설명, 이모지 매핑, 그룹 정의 등.
*   **`src/constants/settings.js`**: 설정 기본값, 앱 정보 등.

### 2.4 컴포넌트 추가 분리 🧱
아직 비대한 페이지 컴포넌트들이 남아있습니다.

*   **`LandingPage`**:
    *   `HeroSection`, `FeatureSection`, `PreviewSection` 등으로 섹션 단위 컴포넌트 분리 권장.
    *   `FloatingParticles`는 이미 내부 컴포넌트로 있지만, 별도 파일로 추출(`src/components/effects`)하여 재사용성 증대.
*   **`OnboardingPage`**:
    *   MBTI 선택 그리드(`MBTISelectionGrid`)를 별도 컴포넌트로 분리.

### 2.5 접근성(A11y) 및 SEO 강화 ♿
접근성을 고려한 마크업 개선이 필요합니다.

*   **이모지 사용**: 단순히 텍스트로 이모지를 넣는 대신 `<span role="img" aria-label="설명">emoji</span>` 패턴 사용.
*   **시맨틱 태그**: `div` 대신 `section`, `article`, `nav` 등을 더욱 적극적으로 활용.
*   **버튼 레이블**: 아이콘만 있는 버튼에 `aria-label` 속성 필수 적용.

---

## 3. 파일별 상세 검토

### `src/utils/storage.js`
*   **현황**: `localStorage` 직접 접근 방식.
*   **제안**: `zustand`나 `Context API`를 도입하거나, 최소한 `useState` + `useEffect`를 캡슐화한 커스텀 훅(`src/hooks/useLocalStorage.js`) 도입 필요.

### `src/pages/LandingPage.jsx` (~420 lines)
*   **현황**: 단일 파일에 모든 섹션과 애니메이션 로직 포함.
*   **제안**:
    1. `src/pages/landing/` 디렉토리 생성.
    2. 각 섹션을 하위 컴포넌트로 분리.
    3. 하드코딩된 텍스트들을 `data/` 또는 `constants/`로 이동.

### `src/pages/OnboardingPage.jsx`
*   **현황**: MBTI 데이터(`MBTI_EMOJI`, `MBTI_DESC`)가 컴포넌트 파일 내부에 존재.
*   **제안**: `src/data/mbti-data.js`와 같은 공용 데이터 파일로 이동하여 다른 페이지(`MainPage` 등)에서도 재사용 가능하게 변경.

### `src/pages/SettingsPage.jsx`
*   **현황**: 모달(`ResetConfirm`, `MBTIChange`)이 인라인으로 정의됨.
*   **제안**: 공통 모달 컴포넌트(`ConfirmModal`)를 만들어 재사용.

---

## 4. 우선순위 제안

1.  **High**: `utils/storage.js`를 커스텀 훅 패턴으로 리팩토링 (앱 안정성 및 버그 예방).
2.  **Medium**: `LandingPage` 컴포넌트 분리 및 상수 추출 (코드 가독성 향상).
3.  **Low**: 접근성 개선 및 공통 모달 추출 (점진적 개선 가능).

## 5. 결론
현재 코드 베이스는 초기 리팩토링 덕분에 꽤 깔끔한 상태이나, 프로젝트 규모가 커짐에 따라 **상태 관리의 체계화**가 시급해 보입니다. 특히 `localStorage` 의존성을 줄이고 리액트스러운(React-ish) 상태 관리 패턴을 도입하는 것이 다음 단계의 가장 중요한 과제입니다.
