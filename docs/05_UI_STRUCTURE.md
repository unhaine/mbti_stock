# UI 구조 (UI STRUCTURE)

> 화면 구조, 와이어프레임, 컴포넌트 계층

---

## 📱 전체 화면 구조

```
앱 구조:
├── / (랜딩페이지)
├── /onboarding (MBTI 선택)
├── /loading (로딩 화면)
├── /main (메인페이지) ⭐
├── /community (커뮤니티 - 목업)
├── /portfolio (자산현황 - 목업)
└── /settings (설정)

모달:
└── StockDetailModal (종목 상세)
```

---

## 1. 컴포넌트 계층 구조

### 1.1 전체 앱 구조

```
App
├── Router
│   ├── LandingPage
│   │   ├── Header
│   │   ├── HeroSection
│   │   ├── FeaturesSection
│   │   ├── PreviewSection
│   │   └── Footer
│   │
│   ├── OnboardingPage
│   │   ├── MBTIGrid
│   │   │   └── MBTIButton × 16
│   │   └── NextButton
│   │
│   ├── LoadingPage
│   │   ├── Spinner
│   │   └── LoadingMessage
│   │
│   ├── MainPage ⭐
│   │   ├── Header
│   │   ├── PortfolioCard
│   │   ├── ThemeSwiper
│   │   │   ├── ThemeHeader
│   │   │   └── StockList
│   │   │       └── StockCard × 10
│   │   └── FooterNav
│   │
│   ├── CommunityPage (목업)
│   ├── PortfolioPage (목업)
│   └── SettingsPage
│
└── StockDetailModal (전역)
```

---

## 2. 주요 컴포넌트 상세

### 2.1 Header

```jsx
// components/Header.jsx
<header className="h-15 sticky top-0 bg-white border-b">
  <div className="flex items-center justify-between px-4">
    <Logo />
    <div className="flex gap-4">
      <NotificationIcon />
      <SettingsIcon />
    </div>
  </div>
</header>
```

**Props:**
- `showIcons`: boolean (아이콘 표시 여부)

**상태:**
- 없음 (stateless)

---

### 2.2 PortfolioCard (가상 자산 카드)

```jsx
// components/PortfolioCard.jsx
<div className="bg-white rounded-2xl p-5 m-4 shadow-sm">
  <div className="text-sm text-gray-600">💰 내 가상 자산</div>
  
  <div className="text-3xl font-bold mt-2">
    {formatCurrency(portfolio.currentValue)}
  </div>
  
  <div className={`text-base mt-1 ${changeColor}`}>
    {formatChange(portfolio.change)} ({portfolio.changePercent}%) {arrow}
  </div>
  
  <hr className="my-4" />
  
  <div className="text-xs text-gray-500">💬 {mbti}의 한마디:</div>
  <div className="text-sm font-medium text-gray-700 mt-1">
    "{comment}"
  </div>
</div>
```

**Props:**
- `portfolio`: Portfolio 객체
- `mbti`: string
- `comment`: string

**상태:**
- 없음 (props로 받음)

---

### 2.3 ThemeSwiper

```jsx
// components/ThemeSwiper.jsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={handleDragEnd}
  className="overflow-hidden"
>
  <AnimatePresence mode="wait">
    <motion.div
      key={currentTheme}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <ThemeHeader theme={themes[currentTheme]} />
      <StockList stocks={currentStocks} />
    </motion.div>
  </AnimatePresence>
</motion.div>
```

**Props:**
- `themes`: Theme[]
- `currentTheme`: number
- `onThemeChange`: (index: number) => void

**상태:**
- `currentTheme`: number (현재 테마 인덱스)

---

### 2.4 ThemeHeader

```jsx
// components/ThemeHeader.jsx
<div className="sticky top-15 bg-gradient-to-b from-white to-gray-50 p-4 text-center border-b">
  <div className="text-lg font-bold">
    {theme.emoji} {theme.title}
  </div>
  <div className="text-sm text-gray-600 mt-1">
    {theme.description}
  </div>
  <div className="flex justify-center gap-2 mt-3">
    {indicators.map((_, i) => (
      <div 
        key={i}
        className={`h-1.5 rounded-full transition-all ${
          i === currentIndex 
            ? 'w-5 bg-primary' 
            : 'w-1.5 bg-gray-300'
        }`}
      />
    ))}
  </div>
</div>
```

**Props:**
- `theme`: Theme 객체
- `currentIndex`: number
- `totalCount`: number

---

### 2.5 StockCard

```jsx
// components/StockCard.jsx
<div 
  className="bg-white border rounded-lg p-3 cursor-pointer hover:border-primary transition"
  onClick={() => onStockClick(stock)}
>
  <div className="flex justify-between items-baseline mb-1">
    <span className="text-base font-bold">{stock.name}</span>
    <span className="text-sm text-gray-500">({stock.ticker})</span>
  </div>
  
  <div className="text-xs text-gray-600 mb-2">
    {stock.sector} · {stock.metaphor.tag}
  </div>
  
  <div className="flex justify-between items-center">
    <div className="text-xs text-amber-500">
      ⭐ {stock.matchScore}%
    </div>
    <div className="text-right">
      <div className="text-base font-bold">
        {formatCurrency(stock.price)}
      </div>
      <div className={`text-xs ${changeColor}`}>
        {formatChange(stock.change)} {arrow}
      </div>
    </div>
  </div>
</div>
```

**Props:**
- `stock`: Stock 객체
- `onStockClick`: (stock: Stock) => void

---

### 2.6 StockDetailModal

```jsx
// components/StockDetailModal.jsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-h-[80vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {stock.name} ({stock.ticker})
          </h2>
          <button onClick={onClose}>✕</button>
        </div>
        
        <div className="bg-primary-50 text-primary-700 rounded-lg px-4 py-2 inline-block mb-4">
          {stock.metaphor.emoji} {stock.metaphor.tag}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          {/* 종목 정보 */}
        </div>
        
        <div>
          <h3 className="font-bold mb-2">💡 왜 추천했을까요?</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {stock.metaphor.description}
          </p>
        </div>
        
        <button className="w-full bg-primary text-white rounded-lg py-3 mt-6">
          관심 종목 추가
        </button>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Props:**
- `isOpen`: boolean
- `stock`: Stock | null
- `onClose`: () => void

---

### 2.7 FooterNav

```jsx
// components/FooterNav.jsx
<nav className="fixed bottom-0 left-0 right-0 h-17.5 bg-white border-t flex justify-around items-center z-30">
  {navItems.map(item => (
    <NavItem
      key={item.path}
      icon={item.icon}
      label={item.label}
      path={item.path}
      active={currentPath === item.path}
    />
  ))}
</nav>
```

**Props:**
- `currentPath`: string

**NavItems:**
```javascript
[
  { icon: '🏠', label: '홈', path: '/main' },
  { icon: '💬', label: '커뮤니티', path: '/community' },
  { icon: '💰', label: '자산', path: '/portfolio' },
  { icon: '⚙️', label: '설정', path: '/settings' }
]
```

---

## 3. 와이어프레임

### 3.1 메인페이지 (핵심)

```
┌─────────────────────────────────────┐
│  [MBTI 투자]           [🔔] [⚙️]    │ ← Header (60px)
├─────────────────────────────────────┤
│                                     │
│   ┌─────────────────────────────┐  │
│   │ 💰 내 가상 자산              │  │
│   │ 10,250,000원                 │  │
│   │ +250,000원 (+2.50%) ↗️       │  │ ← PortfolioCard
│   │ ─────────────────────────   │  │
│   │ 💬 INTJ의 한마디:            │  │
│   │ "아직 버틸 수 있지?..."      │  │
│   └─────────────────────────────┘  │
│                                     │
│   ◀ 테마 스와이프 ▶                 │
│   ┌─────────────────────────────┐  │
│   │ 🏰 불장은 온다...            │  │ ← ThemeHeader
│   │    안정적인 성장주            │  │   (sticky)
│   │    ● ○ ○ ○ ○                │  │
│   ├─────────────────────────────┤  │
│   │ ┌───────────────────────┐   │  │
│   │ │ 삼성전자 (005930)      │   │  │
│   │ │ 반도체·천천히 쌓이는성 │   │  │ ← StockCard
│   │ │ ⭐ 85%    75,000원     │   │  │
│   │ └───────────────────────┘   │  │
│   │ ... (9개 더)                 │  │
│   └─────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  [🏠] [💬] [💰] [⚙️]                │ ← FooterNav (70px)
└─────────────────────────────────────┘
```

상세 와이어프레임은 [design/와이어프레임.md](../design/와이어프레임.md) 참조

---

## 4. 스타일 가이드

### 4.1 디자인 토큰

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          300: '#d1d5db',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          900: '#111827',
        }
      },
      spacing: {
        15: '60px',   // Header 높이
        17.5: '70px', // Footer 높이
      }
    }
  }
}
```

### 4.2 공통 스타일

```css
/* 카드 */
.card {
  @apply bg-white rounded-2xl p-5 shadow-sm;
}

/* 버튼 - Primary */
.btn-primary {
  @apply bg-gradient-to-r from-primary-500 to-primary-700 
         text-white font-bold py-3 px-6 rounded-lg
         hover:scale-105 active:scale-95 transition;
}

/* 버튼 - Secondary */
.btn-secondary {
  @apply bg-white border-2 border-primary-500 
         text-primary-500 font-medium py-3 px-6 rounded-lg
         hover:bg-primary-50 transition;
}

/* 종목 카드 */
.stock-card {
  @apply bg-white border border-gray-200 rounded-lg p-3
         cursor-pointer hover:border-primary-500 
         hover:shadow-md transition;
}
```

---

## 5. 반응형 디자인

### 5.1 브레이크포인트

```javascript
// Mobile First
sm: '640px',   // 태블릿
md: '768px',   // 태블릿 가로
lg: '1024px',  // 데스크톱
xl: '1280px',  // 대형 데스크톱
```

### 5.2 반응형 레이아웃

```jsx
// 모바일 (기본)
<div className="grid grid-cols-1 gap-3">
  {stocks.map(stock => <StockCard key={stock.ticker} stock={stock} />)}
</div>

// 태블릿 이상
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  {stocks.map(stock => <StockCard key={stock.ticker} stock={stock} />)}
</div>
```

---

## 6. 애니메이션

### 6.1 페이지 전환

```jsx
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### 6.2 스와이프 제스처

```jsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      nextTheme();
    } else if (swipe > swipeConfidenceThreshold) {
      prevTheme();
    }
  }}
>
```

---

## 7. 접근성

### 7.1 키보드 네비게이션

```jsx
// Tab으로 이동 가능
<button tabIndex={0} aria-label="INTJ 선택">
  INTJ
</button>

// Enter/Space로 클릭
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
}}
```

### 7.2 스크린 리더

```jsx
<button aria-label="삼성전자 상세 정보 보기">
  <span aria-hidden="true">삼성전자</span>
</button>

<div role="status" aria-live="polite">
  {loadingMessage}
</div>
```

---

## 🔗 관련 문서

- [02_FEATURES.md](./02_FEATURES.md) - 기능 명세
- [03_DATABASE.md](./03_DATABASE.md) - 데이터 구조
- [design/와이어프레임.md](../design/와이어프레임.md) - 상세 와이어프레임

---

*최종 업데이트: 2026-01-15*
