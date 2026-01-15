# 리팩토링 분석 보고서

> **프로젝트**: MBTI 투자 캐릭터 생성기  
> **분석일자**: 2026-01-15  
> **분석 범위**: `src/components`, `src/data`, `src/pages`, `src/utils`

---

## 1. 전체 구조 요약

### 1.1 디렉토리 구조
```
src/
├── components/
│   ├── common/        # 공통 UI 컴포넌트 (4개)
│   ├── features/      # 기능별 컴포넌트 (1개)
│   └── layout/        # 레이아웃 컴포넌트 (2개)
├── data/              # JSON 데이터 파일 (4개)
├── pages/             # 페이지 컴포넌트 (7개)
└── utils/             # 유틸리티 함수 (5개)
```

### 1.2 파일 크기 현황
| 구분 | 파일명 | 크기 | 비고 |
|------|--------|------|------|
| **Pages** | CommunityPage.jsx | 31KB | ⚠️ 가장 큰 파일 |
| | LandingPage.jsx | 16KB | |
| | MainPage.jsx | 16KB | |
| | PortfolioPage.jsx | 16KB | |
| | SettingsPage.jsx | 13KB | |
| | LoadingPage.jsx | 9KB | |
| | OnboardingPage.jsx | 7KB | |
| **Components** | StockDetailModal.jsx | 12KB | ⚠️ 분리 검토 필요 |
| | FooterNav.jsx | 10KB | |
| | Header.jsx | 5KB | |
| **Data** | themes.json | 28KB | 투자 테마 데이터 |
| | stocks.json | 25KB | 종목 데이터 |
| | mbti-comments.json | 10KB | MBTI별 코멘트 |
| | mbti-profiles.json | 7KB | MBTI 프로필 |

---

## 2. 상세 분석

### 2.1 Components 분석

#### `common/` (공통 컴포넌트)
| 파일명 | 역할 | 문제점 |
|--------|------|--------|
| `Button.jsx` | 버튼 컴포넌트 | ✅ 잘 정리됨, variant 패턴 사용 |
| `Card.jsx` | 카드 컴포넌트 | ✅ 잘 정리됨 |
| `Spinner.jsx` | 로딩 스피너 | ✅ 단순 컴포넌트 |
| `PullToRefreshWrapper.jsx` | PTR 래퍼 | ✅ 단일 책임 |

#### `layout/` (레이아웃)
| 파일명 | 역할 | 문제점 |
|--------|------|--------|
| `Header.jsx` | 상단 헤더 | ⚠️ 인라인 SVG 아이콘 다수 |
| `FooterNav.jsx` | 하단 네비게이션 | ⚠️ 9.5KB, 인라인 SVG 과다 |

#### `features/` (기능 컴포넌트)
| 파일명 | 역할 | 문제점 |
|--------|------|--------|
| `StockDetailModal.jsx` | 종목 상세 모달 | ⚠️ 12KB, 차트 생성 로직 포함 |

**공통 문제점**:
1. **인라인 SVG 아이콘**: Header, FooterNav에 SVG 코드가 직접 삽입되어 있음
2. **아이콘 라이브러리 미사용**: Heroicons 등을 직접 import하지 않고 복붙

---

### 2.2 Pages 분석

#### 문제가 심각한 페이지

##### `CommunityPage.jsx` (638줄, 31KB) ❌
```
내부 컴포넌트:
- generatePosts() - 게시글 생성 함수
- PostCard - 게시글 카드 (별도 파일로 분리 필요)
- PostDetailModal - 상세 모달 (200줄+, 분리 필수)
- WritePostModal - 글쓰기 모달 (100줄, 분리 권장)
- CommunityPage - 메인 컴포넌트
```
**문제점**:
- 한 파일에 5개의 컴포넌트/함수 정의
- 게시글 상세 모달이 220줄로 거대함
- 코드 재사용 불가

##### `PortfolioPage.jsx` (394줄, 16KB) ⚠️
```
내부 컴포넌트:
- CircularProgress - 원형 차트 (공통 컴포넌트로 분리 가능)
- PortfolioItem - 포트폴리오 항목 (분리 권장)
- PortfolioPage - 메인 컴포넌트
```
**문제점**:
- CircularProgress는 재사용 가능한 공통 컴포넌트
- 포트폴리오 데이터 생성 로직이 컴포넌트 내부에 있음

##### `MainPage.jsx` (386줄, 16KB) ⚠️
```
내부 컴포넌트:
- StockCard - 종목 카드 (MainPage 전용이  아님, 분리 필요)
- MainPage - 메인 컴포넌트
```
**문제점**:
- StockCard는 다른 페이지에서도 사용 가능한 공통 컴포넌트
- 테마 캐러셀 로직이 복잡함

##### `SettingsPage.jsx` (355줄, 13KB) ⚠️
```
내부 컴포넌트:
- SettingItem - 설정 항목 (공통 컴포넌트로 분리 가능)
- Toggle - 토글 스위치 (공통 컴포넌트로 분리 필수)
- SettingsPage - 메인 컴포넌트
```
**문제점**:
- Toggle 컴포넌트는 다른 곳에서도 재사용 가능
- SettingItem도 공통화 가능

##### `LandingPage.jsx` (424줄, 16KB) ⚠️
```
내부 컴포넌트:
- FloatingParticles - 플로팅 파티클 효과
- MBTIPreviewCard - MBTI 미리보기 카드
- LandingPage - 메인 컴포넌트
```
**문제점**:
- 애니메이션 관련 컴포넌트들이 내장되어 있음

---

### 2.3 Utils 분석

| 파일명 | 함수 수 | 역할 | 상태 |
|--------|---------|------|------|
| `helpers.js` | 14개 | 범용 헬퍼 함수 | ⚠️ 기능별 분리 검토 |
| `formatters.js` | 7개 | 포맷팅 함수 | ✅ 잘 정리됨 |
| `storage.js` | 12개 | LocalStorage 관리 | ✅ 잘 정리됨 |
| `dataLoader.js` | 10개 | JSON 데이터 로드 | ⚠️ 현재 미사용 가능성 |
| `validators.js` | 7개 | 유효성 검증 | ✅ 잘 정리됨 |

**helpers.js 세부 분석**:
```javascript
// 서로 다른 성격의 함수들이 혼재
- randomChoice, randomInt          // 랜덤 유틸
- getMarketCondition, getMBTIComment // 비즈니스 로직
- getChangeColor, getChangeBgColor, getChangeArrow // UI 헬퍼
- debounce, throttle               // 성능 유틸
- cn                               // 클래스명 조합
- delay, copyToClipboard           // 기타 유틸
```

---

### 2.4 Data 분석

| 파일명 | 용도 | 데이터 구조 |
|--------|------|-------------|
| `mbti-profiles.json` | 16개 MBTI 프로필 | `{id, name, tagline, emoji, gradient[], description, traits[], riskTolerance}` |
| `themes.json` | 투자 테마 목록 | `{id, name, mbti, description, stocks[], icon}` |
| `stocks.json` | 종목 정보 | `{ticker, name, sector, price, change, volatility, ...}` |
| `mbti-comments.json` | 시장 상황별 코멘트 | `{MBTI: {bull: [], neutral: [], bear: []}}` |

**문제점**:
- 타입 정의 없음 (TypeScript 미사용 시 JSDoc 활용 가능)
- dataLoader.js가 있지만 대부분 직접 import 사용

---

## 3. 리팩토링 권장사항

### 3.1 우선순위 높음 (High Priority)

#### 🔴 1. CommunityPage 분리
```
AS-IS: CommunityPage.jsx (638줄)

TO-BE:
├── components/features/community/
│   ├── PostCard.jsx
│   ├── PostDetailModal.jsx
│   ├── WritePostModal.jsx
│   └── index.js (re-export)
├── utils/postGenerator.js
└── pages/CommunityPage.jsx (200줄 이하로 축소)
```

#### 🔴 2. 공통 컴포넌트 추출
```
AS-IS: 페이지 내부에 정의된 컴포넌트들

TO-BE:
├── components/common/
│   ├── Toggle.jsx          (from SettingsPage)
│   ├── CircularProgress.jsx (from PortfolioPage)
│   ├── StockCard.jsx       (from MainPage)
│   └── SettingItem.jsx     (from SettingsPage - optional)
```

#### 🔴 3. 아이콘 시스템 도입
```bash
npm install @heroicons/react
```
```jsx
// AS-IS: 인라인 SVG
<svg className="w-6 h-6" ...>
  <path ... />
</svg>

// TO-BE: 아이콘 라이브러리
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
<HomeIcon className="w-6 h-6" />
```

---

### 3.2 우선순위 중간 (Medium Priority)

#### 🟡 4. helpers.js 기능별 분리
```
AS-IS: utils/helpers.js (14개 함수 혼재)

TO-BE:
├── utils/random.js         # randomChoice, randomInt
├── utils/market.js         # getMarketCondition, getMBTIComment
├── utils/uiHelpers.js      # getChangeColor, getChangeArrow, cn
├── utils/performance.js    # debounce, throttle
└── utils/misc.js           # delay, copyToClipboard
```

#### 🟡 5. 타입 정의 추가 (JSDoc 또는 TypeScript)
```javascript
/**
 * @typedef {Object} MBTIProfile
 * @property {string} id - MBTI 코드 (예: "INTJ")
 * @property {string} name - 유형 이름
 * @property {string} tagline - 한 줄 설명
 * @property {string} emoji - 대표 이모지
 * @property {string[]} gradient - 그라데이션 색상
 */
```

#### 🟡 6. StockDetailModal 리팩토링
```
AS-IS: features/StockDetailModal.jsx (242줄)

TO-BE:
├── features/stock/
│   ├── StockDetailModal.jsx (뷰 로직만)
│   ├── StockChart.jsx       (차트 컴포넌트)
│   ├── StockInfo.jsx        (종목 정보)
│   └── useStockData.js      (데이터 훅)
```

---

### 3.3 우선순위 낮음 (Low Priority)

#### 🟢 7. dataLoader.js 활용 또는 제거
- 현재 대부분 페이지에서 직접 JSON import 사용
- dataLoader를 활용하거나, 미사용 시 제거 검토

#### 🟢 8. CSS 변수 및 테마 관리 개선
- 현재 Tailwind v4의 `@theme` 블록 사용
- 색상 팔레트 문서화 필요

#### 🟢 9.  컴포넌트 스타일 분리 검토
```
선택적으로 적용:
├── components/common/Button/
│   ├── Button.jsx
│   ├── Button.styles.js
│   └── index.js
```

---

## 4. 리팩토링 진행 순서 (권장)

| 순서 | 작업 | 예상 시간 | 영향도 |
|------|------|----------|--------|
| 1 | Toggle, CircularProgress 분리 | 30분 | 낮음 |
| 2 | StockCard 분리 | 30분 | 낮음 |
| 3 | @heroicons/react 설치 및 교체 | 1시간 | 중간 |
| 4 | CommunityPage 모달 분리 | 1시간 | 중간 |
| 5 | PostCard 분리 | 30분 | 낮음 |
| 6 | helpers.js 분리 | 30분 | 중간 |
| 7 | PortfolioPage 정리 | 30분 | 낮음 |

**총 예상 시간**: 약 4~5시간

---

## 5. 코드 품질 개선 지표

### 현재 상태
- **단일 책임 원칙 위반**: 여러 페이지에서 내부 컴포넌트 정의
- **DRY 원칙 위반**: 비슷한 UI 패턴이 중복 구현됨
- **코드 재사용성**: 낮음 (Toggle, CircularProgress 등)
- **테스트 용이성**: 낮음 (컴포넌트 결합도 높음)

### 리팩토링 후 목표
- 모든 페이지 300줄 이하
- 공통 컴포넌트 7개 이상
- 단일 책임 원칙 준수
- 테스트 가능한 구조

---

## 6. 참고: 현재 의존성

```json
{
  "dependencies": {
    "framer-motion": "^12.26.2",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-router-dom": "^7.12.0",
    "react-simple-pull-to-refresh": "^1.3.4",
    "recharts": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "tailwindcss": "^4.1.18",
    "vite": "^7.3.1"
  }
}
```

---

*이 보고서는 코드베이스의 현재 상태를 분석하고 개선 방향을 제시합니다. 리팩토링은 점진적으로 진행하며, 각 단계에서 테스트를 통해 기능 정상 동작을 확인하시기 바랍니다.*
