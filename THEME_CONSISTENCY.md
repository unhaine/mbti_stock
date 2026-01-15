# 스타일 테마 일관성 가이드 (Theme Consistency Guide)

본 문서는 `src/` 디렉토리 내의 스타일 불일치 문제를 해결하고, 일관된 디자인 시스템을 구축하기 위한 가이드라인입니다.

## 🧐 현황 분석

현재 프로젝트 (`src/`) 내 스타일 설정이 두 가지 방식으로 파편화되어 있습니다.

| 구분 | tailwind.config.js (설정 파일) | src/index.css (CSS 파일) |
|------|--------------------------------|--------------------------|
| **Primary Color** | Sky Blue (`#0ea5e9`) | **Kakao Yellow (`#fee500`)** |
| **Dark Mode** | 설정 불명확 | Light Theme 색상 하드코딩 (`#f2f4f6`) |
| **스타일 방식** | Standard Tailwind Config | Custom BEM Classes (`.btn-primary`) & CSS Variables |

### ⚠️ 주요 문제점
1. **Source of Truth 부재**: 색상 정의가 두 곳에 나뉘어 있어, `bg-primary-500` 사용 시 의도치 않은 색상(Sky Blue)이 적용될 위험이 큽니다.
2. **스타일 격리 실패**: `index.css`의 전역 클래스(`.card`, `.btn-primary`)는 컴포넌트별 캡슐화를 방해하고 사이드 이펙트를 유발할 수 있습니다.
3. **다크 모드 미지원**: 현재 색상 팔레트가 Light Mode에 고정되어 있어 시스템 테마 대응이 불가능합니다.

---

## 🛠️ 개선 실행 계획 (Action Plan)

### Step 1: Tailwind Config 동기화 (SSOT 구축)
`tailwind.config.js`를 유일한 스타일 설정 원천(Source of Truth)으로 만듭니다. `src/index.css`의 Kakao Yellow 테마를 설정 파일로 이관합니다.

**변경 전 (`src/index.css`)**:
```css
/* 제거 대상 */
--color-primary-500: #fee500;
--color-dark-900: #f2f4f6;
```

**변경 후 (`tailwind.config.js`)**:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#fee500', // Kakao Yellow 메인 컬러
          // ... 50~900 전체 스펙 이관
        },
        background: '#f2f4f6', // Semantic Name 사용 권장
        surface: '#ffffff',
      }
    }
  }
}
```

### Step 2: Semantic Color 사용
색상 코드를 직접 쓰는 대신 **의미(Role)**를 나타내는 이름을 사용합니다.

- `bg-primary-500` → 브랜드 메인 액션
- `bg-red-500` → **`bg-danger`** (에러/삭제)
- `bg-gray-100` → **`bg-background`** (배경)
- `text-gray-900` → **`text-main`** (본문)

### Step 3: 공통 CSS 클래스 제거 및 컴포넌트화
`index.css`의 `.btn-primary` 등을 삭제하고, React 컴포넌트(`Button.jsx`) 내부로 스타일 로직을 이동합니다. `class-variance-authority (cva)` 라이브러리 도입을 추천합니다.

**예시 (`src/components/common/Button.jsx`)**:
```jsx
// CVA를 활용한 스타일 관리 패턴
import { cva } from "class-variance-authority";

const buttonVariants = cva("rounded-lg font-bold transition-all", {
  variants: {
    variant: {
      primary: "bg-primary-500 text-dark-900 hover:bg-primary-600",
      secondary: "bg-surface border border-dark-200 hover:bg-dark-50",
    },
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

---

## 📋 바로 적용할 수 있는 Tailwind Config (추천)

현재 프로젝트의 `src/index.css` 테마(Kakao)를 반영하여 `tailwind.config.js`를 다음과 같이 수정하는 것을 강력히 권장합니다.

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Kakao Brand Colors
                primary: {
                    50: '#fffde7',
                    100: '#fff9c4',
                    200: '#fff59d',
                    300: '#fff176',
                    400: '#ffee58',
                    500: '#fee500', // Main
                    600: '#fdd835',
                    700: '#fbc02d',
                    800: '#f9a825',
                    900: '#f57f17',
                },
                secondary: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#eeeeee',
                    300: '#e0e0e0',
                    400: '#bdbdbd',
                    500: '#9e9e9e',
                    600: '#757575',
                    700: '#616161',
                    800: '#424242',
                    900: '#212121',
                },
                // Semantic Colors
                background: '#f2f4f6', 
                surface: '#ffffff',
                text: {
                    main: '#191f28',
                    sub: '#7b8694',
                }
            },
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
```

이 가이드를 따라 리팩토링을 진행하면 스타일 불일치 문제를 해결할 수 있습니다.
