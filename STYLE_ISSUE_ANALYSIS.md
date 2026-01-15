# 스타일 이슈 분석 보고서

## 1. 현재 상황 분석
- **증상**: 페이지 전체의 스타일이 깨져서 순수 HTML처럼 보임 (Unstyled content).
- **확인 내용**:
  - `src/index.css`에는 Tailwind v4 문법 (`@import "tailwindcss";`, `@theme`)이 적용되어 있음.
  - `package.json`에는 `tailwindcss` v4.1.18이 설치되어 있음.
  - 브라우저 상에서 Tailwind 유틸리티 클래스(`bg-dark-800` 등)가 전혀 적용되지 않음.

## 2. 원인 추정
가장 유력한 원인은 **PostCSS 설정과 Tailwind v4 간의 호환성 문제**입니다.
Tailwind v4는 `postcss.config.js`에서 `tailwindcss` 플러그인 대신 `@tailwindcss/postcss`를 사용하는 것을 권장하며, 설정 방식이 v3와 다릅니다.

현재 `postcss.config.js`가 v3 방식(`plugins: { tailwindcss: {}, ... }`)으로 되어 있다면, v4 패키지가 설치되어 있어도 빌드 과정에서 CSS 변환이 제대로 일어나지 않을 수 있습니다.

## 3. 해결 방안 (Action Plan)
1.  **`postcss.config.js` 수정**:
    - v4 전용 플러그인인 `@tailwindcss/postcss`를 사용하도록 설정을 변경합니다.
2.  **`vite.config.js` 확인**:
    - 특별한 설정이 필요한지 점검합니다 (보통은 PostCSS 설정만으로 충분).
3.  **서버 재시작**:
    - 설정 파일 변경 후 개발 서버를 재시작하여 캐시를 지우고 빌드를 다시 수행합니다.

이 조치를 통해 스타일이 정상적으로 빌드되고 적용될 것으로 예상됩니다.
