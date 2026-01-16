# Phase 1-C: 긴급 개선 실행 계획

> 📅 기간: 2026-01-16 ~ 2026-01-30 (2주)  
> 🎯 목표: 사용자 경험 즉시 개선 + ChatGPT API 준비  
> 📊 예상 완성도: 60% → 75%

---

## 📋 목차

1. [개요](#1-개요)
2. [작업 항목](#2-작업-항목)
3. [일별 실행 계획](#3-일별-실행-계획)
4. [ChatGPT API 연동 준비](#4-chatgpt-api-연동-준비)
5. [체크리스트](#5-체크리스트)

---

## 1. 개요

### 1.1 Phase 1-C 목표

```
긴급 개선 사항
├─ 🔴 랜딩 페이지 수정 (Hero 섹션)
├─ 🔴 Pull-to-refresh 구현
├─ 🔴 검색 기능 추가
├─ 🟡 정렬 옵션 추가
├─ 🟡 토스트 알림 시스템
├─ 🟡 로딩 상태 개선
└─ 🟢 ChatGPT API 연동 준비
```

### 1.2 실시간 연동 정책 변경

**기존 계획:** WebSocket 기반 실시간 주가 업데이트  
**변경 계획:** 사용자 요청 시 수동 업데이트

**장점:**

- API 비용 절감 (실시간 연결 불필요)
- 서버 부하 감소
- 사용자가 원할 때만 업데이트

**구현 방식:**

- Pull-to-refresh로 주가 업데이트
- "새로고침" 버튼 클릭 시 업데이트
- 백그라운드 자동 업데이트 없음

---

## 2. 작업 항목

### 2.1 랜딩 페이지 수정 (우선순위: 🔴 높음)

#### 현재 문제

- 첫 화면이 비어 보임 (스크롤 필요)
- Hero 섹션이 뷰포트 중앙에 없음
- CTA 버튼이 즉시 보이지 않음

#### 해결 방안

```jsx
// src/pages/landing/HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        {/* 메인 타이틀 */}
        <h1 className="text-4xl md:text-5xl font-bold text-dark-50 mb-4">
          MBTI로 알아보는
          <br />
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            나의 투자 성향
          </span>
        </h1>

        {/* 부제목 */}
        <p className="text-lg text-dark-200 mb-8">성격 유형 기반 맞춤형 주식 추천 서비스</p>

        {/* CTA 버튼 */}
        <Button
          size="lg"
          onClick={() => navigate('/onboarding')}
          className="shadow-lg hover:shadow-xl transition-shadow"
        >
          무료로 시작하기 →
        </Button>

        {/* 스크롤 힌트 */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-dark-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
```

#### 작업 파일

- `src/pages/landing/HeroSection.jsx`
- `src/pages/LandingPage.jsx`

#### 예상 소요 시간

- 2시간

---

### 2.2 Pull-to-Refresh 구현 (우선순위: 🔴 높음)

#### 목표

- MainPage, CommunityPage, PortfolioPage에 Pull-to-refresh 추가
- 주가 데이터 수동 업데이트 기능

#### 구현 방법

##### A. 라이브러리 설정

```bash
# 이미 설치됨
npm list react-simple-pull-to-refresh
```

##### B. MainPage 적용

```jsx
// src/pages/MainPage.jsx
import PullToRefresh from 'react-simple-pull-to-refresh'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MainPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      // 1. 주가 데이터 업데이트 (향후 API 연동)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 2. 포트폴리오 재계산
      // updatePortfolio()

      // 3. 시장 상황 업데이트
      // updateMarketCondition()

      toast.success('데이터가 업데이트되었습니다')
    } catch (error) {
      toast.error('업데이트 실패')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-dark-900 overflow-hidden">
      <Header />

      <PullToRefresh
        onRefresh={handleRefresh}
        pullingContent={
          <div className="text-center py-4">
            <span className="text-dark-400">당겨서 새로고침</span>
          </div>
        }
        refreshingContent={
          <div className="text-center py-4">
            <Spinner size="sm" />
            <span className="text-dark-400 ml-2">업데이트 중...</span>
          </div>
        }
      >
        <div className="flex-1 overflow-y-auto">{/* 기존 콘텐츠 */}</div>
      </PullToRefresh>

      <FooterNav />
    </div>
  )
}
```

##### C. 수동 새로고침 버튼 추가

```jsx
// Header에 새로고침 버튼 추가
<button
  onClick={handleRefresh}
  className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
  disabled={isRefreshing}
>
  <RefreshCw className={cn('w-5 h-5 text-dark-200', isRefreshing && 'animate-spin')} />
</button>
```

#### 작업 파일

- `src/pages/MainPage.jsx`
- `src/pages/CommunityPage.jsx`
- `src/pages/PortfolioPage.jsx`
- `src/components/layout/Header.jsx`

#### 예상 소요 시간

- MainPage: 2시간
- CommunityPage: 1시간
- PortfolioPage: 1시간
- Header 버튼: 30분

---

### 2.3 검색 기능 추가 (우선순위: 🔴 높음)

#### A. 종목 검색 (MainPage)

```jsx
// src/components/features/StockSearch.jsx
import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StockSearch({ stocks, onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredStocks = useMemo(() => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    return stocks
      .filter(
        (stock) =>
          stock.name.toLowerCase().includes(lowerQuery) ||
          stock.ticker.includes(lowerQuery) ||
          stock.sector.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 10) // 최대 10개만 표시
  }, [stocks, query])

  return (
    <div className="relative">
      {/* 검색 입력 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="종목명 또는 코드 검색..."
          className="w-full pl-10 pr-10 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-dark-50 placeholder-dark-400 focus:border-primary-500 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-dark-400 hover:text-dark-200" />
          </button>
        )}
      </div>

      {/* 검색 결과 */}
      <AnimatePresence>
        {isOpen && filteredStocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-dark-800 border border-dark-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {filteredStocks.map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => {
                  onSelect(stock)
                  setQuery('')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-700 transition-colors border-b border-dark-700 last:border-0"
              >
                <div className="text-left">
                  <div className="font-medium text-dark-50">{stock.name}</div>
                  <div className="text-xs text-dark-400">
                    {stock.ticker} · {stock.sector}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-dark-50">{stock.price.toLocaleString()}원</div>
                  <div
                    className={cn(
                      'text-xs',
                      stock.changePercent > 0 ? 'text-red-400' : 'text-blue-400'
                    )}
                  >
                    {stock.changePercent > 0 ? '+' : ''}
                    {stock.changePercent}%
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 검색 결과 없음 */}
      {isOpen && query && filteredStocks.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-dark-800 border border-dark-600 rounded-lg shadow-lg p-4 text-center text-dark-400">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  )
}
```

#### B. MainPage에 통합

```jsx
// src/pages/MainPage.jsx
import StockSearch from '../components/features/StockSearch'

// 검색 섹션 추가
;<div className="px-4 py-3 bg-dark-900 border-b border-dark-600">
  <StockSearch stocks={allStocks} onSelect={handleStockClick} />
</div>
```

#### 작업 파일

- `src/components/features/StockSearch.jsx` (신규)
- `src/pages/MainPage.jsx`

#### 예상 소요 시간

- StockSearch 컴포넌트: 2시간
- MainPage 통합: 30분

---

### 2.4 정렬 옵션 추가 (우선순위: 🟡 중간)

#### PortfolioPage 정렬 기능

```jsx
// src/components/features/SortDropdown.jsx
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SORT_OPTIONS = [
  { value: 'profit', label: '수익률순', icon: '📈' },
  { value: 'amount', label: '금액순', icon: '💰' },
  { value: 'name', label: '이름순', icon: '🔤' },
  { value: 'recent', label: '최근 거래순', icon: '🕐' },
]

export default function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 hover:border-dark-500 transition-colors"
      >
        <span>{selectedOption?.icon}</span>
        <span className="text-sm">{selectedOption?.label}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-dark-800 border border-dark-600 rounded-lg shadow-lg z-50 min-w-[150px]"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2.5 flex items-center gap-2 hover:bg-dark-700 transition-colors border-b border-dark-700 last:border-0',
                  value === option.value && 'bg-dark-700'
                )}
              >
                <span>{option.icon}</span>
                <span className="text-sm text-dark-50">{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

#### PortfolioPage에 적용

```jsx
// src/pages/PortfolioPage.jsx
const [sortBy, setSortBy] = useState('profit')

const sortedStocks = useMemo(() => {
  const stocks = [...portfolioStocks]

  switch (sortBy) {
    case 'profit':
      return stocks.sort((a, b) => b.profitRate - a.profitRate)
    case 'amount':
      return stocks.sort((a, b) => b.totalValue - a.totalValue)
    case 'name':
      return stocks.sort((a, b) => a.name.localeCompare(b.name))
    case 'recent':
      return stocks.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
    default:
      return stocks
  }
}, [portfolioStocks, sortBy])

// UI에 추가
<div className="flex items-center justify-between px-4 py-3">
  <h2 className="font-bold text-dark-50">보유 종목</h2>
  <SortDropdown value={sortBy} onChange={setSortBy} />
</div>
```

#### 작업 파일

- `src/components/features/SortDropdown.jsx` (신규)
- `src/pages/PortfolioPage.jsx`

#### 예상 소요 시간

- SortDropdown 컴포넌트: 1.5시간
- PortfolioPage 통합: 1시간

---

### 2.5 토스트 알림 시스템 (우선순위: 🟡 중간)

#### 설치 및 설정

```bash
npm install react-hot-toast
```

#### 전역 설정

```jsx
// src/App.jsx
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <Routes>{/* ... */}</Routes>

      {/* 토스트 알림 */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  )
}
```

#### 사용 예시

```jsx
import toast from 'react-hot-toast'

// 성공 알림
toast.success('종목이 추가되었습니다')

// 에러 알림
toast.error('잔액이 부족합니다')

// 로딩 알림
const toastId = toast.loading('처리 중...')
// 완료 후
toast.success('완료되었습니다', { id: toastId })

// 커스텀 알림
toast.custom((t) => (
  <div className="bg-dark-800 px-4 py-3 rounded-lg shadow-lg">
    <p className="text-dark-50">커스텀 메시지</p>
  </div>
))
```

#### 적용 위치

- 매수/매도 완료 시
- 데이터 업데이트 완료 시
- 에러 발생 시
- MBTI 변경 시
- 설정 저장 시

#### 작업 파일

- `src/App.jsx`
- 모든 페이지 (toast 호출 추가)

#### 예상 소요 시간

- 설정: 30분
- 전체 적용: 2시간

---

### 2.6 로딩 상태 개선 (우선순위: 🟡 중간)

#### 스켈레톤 로더 컴포넌트

```jsx
// src/components/common/Skeleton.jsx
import { motion } from 'framer-motion'

export default function Skeleton({
  width = '100%',
  height = '20px',
  className = '',
  count = 1,
  gap = '12px',
}) {
  return (
    <div className="space-y-3" style={{ gap }}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`bg-dark-700 rounded-lg ${className}`}
          style={{ width, height }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// 종목 카드 스켈레톤
export function StockCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-dark-700">
      <div className="flex items-center gap-4">
        <Skeleton width="48px" height="48px" className="rounded-full" />
        <div className="flex-1">
          <Skeleton width="120px" height="16px" className="mb-2" />
          <Skeleton width="80px" height="14px" />
        </div>
        <div className="text-right">
          <Skeleton width="80px" height="18px" className="mb-2" />
          <Skeleton width="60px" height="14px" />
        </div>
      </div>
    </div>
  )
}
```

#### 사용 예시

```jsx
// src/pages/MainPage.jsx
import { StockCardSkeleton } from '../components/common/Skeleton'

{
  isLoading ? (
    <div className="space-y-4">
      <StockCardSkeleton />
      <StockCardSkeleton />
      <StockCardSkeleton />
    </div>
  ) : (
    <StockList stocks={stocks} />
  )
}
```

#### 작업 파일

- `src/components/common/Skeleton.jsx` (신규)
- `src/pages/MainPage.jsx`
- `src/pages/PortfolioPage.jsx`
- `src/pages/CommunityPage.jsx`

#### 예상 소요 시간

- Skeleton 컴포넌트: 1.5시간
- 전체 적용: 2시간

---

## 3. 일별 실행 계획

### Week 1: 핵심 기능 개선

#### Day 1 (2026-01-16 목요일)

**목표:** 랜딩 페이지 수정 + 토스트 시스템 설정

- [ ] 09:00-11:00: HeroSection 컴포넌트 수정
  - min-h-screen flex center 적용
  - 스크롤 힌트 애니메이션 추가
- [ ] 11:00-12:00: LandingPage 레이아웃 조정
- [ ] 13:00-14:00: react-hot-toast 설치 및 설정
  - App.jsx에 Toaster 추가
  - 테마 커스터마이징
- [ ] 14:00-16:00: 테스트 및 반응형 확인

**산출물:**

- ✅ 랜딩 페이지 첫 화면 개선
- ✅ 토스트 알림 시스템 준비

---

#### Day 2 (2026-01-17 금요일)

**목표:** Pull-to-refresh 구현 (MainPage)

- [ ] 09:00-11:00: MainPage Pull-to-refresh 적용
  - PullToRefresh 컴포넌트 래핑
  - handleRefresh 함수 구현
- [ ] 11:00-12:00: Header에 새로고침 버튼 추가
- [ ] 13:00-15:00: 데이터 업데이트 로직 구현
  - 포트폴리오 재계산
  - 시장 상황 업데이트
- [ ] 15:00-16:00: 토스트 알림 연동

**산출물:**

- ✅ MainPage Pull-to-refresh 완성
- ✅ 수동 새로고침 버튼

---

#### Day 3 (2026-01-18 토요일)

**목표:** 검색 기능 구현

- [ ] 09:00-11:00: StockSearch 컴포넌트 개발
  - 검색 입력 UI
  - 자동완성 드롭다운
- [ ] 11:00-12:00: 검색 필터 로직 구현
- [ ] 13:00-14:00: MainPage에 통합
- [ ] 14:00-16:00: 애니메이션 및 UX 개선

**산출물:**

- ✅ StockSearch 컴포넌트
- ✅ MainPage 검색 기능

---

#### Day 4 (2026-01-19 일요일)

**목표:** Pull-to-refresh (CommunityPage, PortfolioPage)

- [ ] 09:00-11:00: CommunityPage Pull-to-refresh
  - 게시글 새로고침
  - 필터 유지
- [ ] 11:00-12:00: PortfolioPage Pull-to-refresh
  - 자산 현황 업데이트
  - 차트 재렌더링
- [ ] 13:00-15:00: 테스트 및 버그 수정
- [ ] 15:00-16:00: 토스트 알림 통합

**산출물:**

- ✅ CommunityPage Pull-to-refresh
- ✅ PortfolioPage Pull-to-refresh

---

#### Day 5 (2026-01-20 월요일)

**목표:** 정렬 기능 구현

- [ ] 09:00-11:00: SortDropdown 컴포넌트 개발
  - 드롭다운 UI
  - 애니메이션
- [ ] 11:00-12:00: PortfolioPage 정렬 로직
  - 수익률순, 금액순, 이름순, 최근순
- [ ] 13:00-15:00: PortfolioPage 통합
- [ ] 15:00-16:00: 테스트

**산출물:**

- ✅ SortDropdown 컴포넌트
- ✅ PortfolioPage 정렬 기능

---

### Week 2: 로딩 상태 + ChatGPT API 준비

#### Day 6 (2026-01-21 화요일)

**목표:** 스켈레톤 로더 구현

- [ ] 09:00-11:00: Skeleton 컴포넌트 개발
  - 기본 Skeleton
  - StockCardSkeleton
  - PostCardSkeleton
- [ ] 11:00-12:00: MainPage 적용
- [ ] 13:00-15:00: PortfolioPage, CommunityPage 적용
- [ ] 15:00-16:00: 애니메이션 최적화

**산출물:**

- ✅ Skeleton 컴포넌트 세트
- ✅ 전체 페이지 로딩 상태 개선

---

#### Day 7-8 (2026-01-22-23 수-목요일)

**목표:** ChatGPT API 연동 준비

- [ ] Day 7 오전: OpenAI SDK 설치 및 설정
- [ ] Day 7 오후: API 키 관리 시스템
- [ ] Day 8 오전: MBTI 맞춤 설명 생성 함수
- [ ] Day 8 오후: 캐싱 시스템 구현

**산출물:**

- ✅ ChatGPT API 연동 완료
- ✅ MBTI 맞춤 설명 생성 기능

---

#### Day 9-10 (2026-01-24-25 금-토요일)

**목표:** 통합 테스트 및 버그 수정

- [ ] Day 9: 전체 기능 통합 테스트
- [ ] Day 9: 버그 수정 및 최적화
- [ ] Day 10: 성능 테스트
- [ ] Day 10: 문서 업데이트

**산출물:**

- ✅ Phase 1-C 완료
- ✅ 테스트 보고서

---

## 4. ChatGPT API 연동 준비

### 4.1 OpenAI SDK 설치

```bash
npm install openai
```

### 4.2 환경 변수 설정

```bash
# .env.local
VITE_OPENAI_API_KEY=sk-proj-...
VITE_OPENAI_MODEL=gpt-4o-mini
```

```js
// .gitignore에 추가
.env.local
.env.*.local
```

### 4.3 API 서비스 구현

```javascript
// src/services/openai.js
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 주의: 프로덕션에서는 백엔드 사용 권장
})

/**
 * MBTI 맞춤 종목 설명 생성
 * @param {Object} stock - 종목 정보
 * @param {string} mbti - MBTI 유형
 * @returns {Promise<string>} - 생성된 설명
 */
export async function generateMBTIExplanation(stock, mbti) {
  const prompt = `
당신은 ${mbti} 성향의 투자자를 위한 투자 조언가입니다.

종목 정보:
- 이름: ${stock.name}
- 업종: ${stock.sector}
- 시가총액: ${stock.marketCap}
- 변동성: ${stock.volatility}
- 배당률: ${stock.dividendYield}%

${mbti} 성향의 투자자 관점에서 이 종목을 은유적으로 설명해주세요.
(예: "천천히 쌓이는 성", "로켓 발사", "안정적인 항해" 등)

조건:
1. 2-3문장으로 간결하게
2. ${mbti} 성향의 특징을 반영
3. 긍정적이고 흥미로운 표현 사용
4. 투자 조언이 아닌 은유적 설명

설명:
`.trim()

  try {
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a creative investment storyteller who uses metaphors to explain stocks based on MBTI personality types.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('설명 생성 실패')
  }
}

/**
 * 여러 종목에 대한 설명 일괄 생성
 * @param {Array} stocks - 종목 배열
 * @param {string} mbti - MBTI 유형
 * @returns {Promise<Object>} - { ticker: explanation } 형태
 */
export async function generateBatchExplanations(stocks, mbti) {
  const results = {}

  // 병렬 처리 (최대 5개씩)
  const batchSize = 5
  for (let i = 0; i < stocks.length; i += batchSize) {
    const batch = stocks.slice(i, i + batchSize)
    const promises = batch.map((stock) =>
      generateMBTIExplanation(stock, mbti)
        .then((explanation) => ({ ticker: stock.ticker, explanation }))
        .catch((error) => ({ ticker: stock.ticker, error: error.message }))
    )

    const batchResults = await Promise.all(promises)
    batchResults.forEach(({ ticker, explanation, error }) => {
      if (explanation) {
        results[ticker] = explanation
      } else {
        console.error(`Failed to generate explanation for ${ticker}:`, error)
      }
    })
  }

  return results
}
```

### 4.4 캐싱 시스템

```javascript
// src/utils/cache.js
const CACHE_PREFIX = 'mbti_stock_cache_'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24시간

/**
 * 캐시에서 데이터 가져오기
 */
export function getCache(key) {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)

    // 만료 확인
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }

    return data
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

/**
 * 캐시에 데이터 저장
 */
export function setCache(key, data) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

/**
 * 캐시 삭제
 */
export function clearCache(key) {
  if (key) {
    localStorage.removeItem(CACHE_PREFIX + key)
  } else {
    // 모든 캐시 삭제
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  }
}
```

### 4.5 사용 예시

```jsx
// src/pages/MainPage.jsx
import { generateMBTIExplanation } from '../services/openai'
import { getCache, setCache } from '../utils/cache'
import toast from 'react-hot-toast'

export default function MainPage() {
  const [mbti] = useMBTI()
  const [aiExplanations, setAiExplanations] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)

  // AI 설명 생성 (사용자 요청 시)
  const handleGenerateExplanation = async (stock) => {
    const cacheKey = `explanation_${stock.ticker}_${mbti}`

    // 캐시 확인
    const cached = getCache(cacheKey)
    if (cached) {
      setAiExplanations((prev) => ({
        ...prev,
        [stock.ticker]: cached,
      }))
      return
    }

    setIsGenerating(true)
    const toastId = toast.loading('AI가 분석 중입니다...')

    try {
      const explanation = await generateMBTIExplanation(stock, mbti)

      // 캐시 저장
      setCache(cacheKey, explanation)

      setAiExplanations((prev) => ({
        ...prev,
        [stock.ticker]: explanation,
      }))

      toast.success('분석 완료!', { id: toastId })
    } catch (error) {
      toast.error('분석 실패. 다시 시도해주세요.', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      {/* 종목 카드에 AI 설명 버튼 추가 */}
      <StockCard
        stock={stock}
        aiExplanation={aiExplanations[stock.ticker]}
        onGenerateExplanation={() => handleGenerateExplanation(stock)}
        isGenerating={isGenerating}
      />
    </div>
  )
}
```

### 4.6 StockCard에 AI 버튼 추가

```jsx
// src/components/features/StockCard.jsx
import { Sparkles } from 'lucide-react'

export default function StockCard({ stock, aiExplanation, onGenerateExplanation, isGenerating }) {
  return (
    <div className="stock-card">
      {/* 기존 콘텐츠 */}

      {/* AI 설명 섹션 */}
      {aiExplanation ? (
        <div className="mt-3 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
            <p className="text-sm text-dark-100 leading-relaxed">{aiExplanation}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onGenerateExplanation()
          }}
          disabled={isGenerating}
          className="mt-3 w-full py-2 px-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-sm text-dark-200 hover:text-dark-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'AI 분석 중...' : 'AI 맞춤 설명 생성'}
        </button>
      )}
    </div>
  )
}
```

### 4.7 비용 관리

```javascript
// src/utils/apiUsage.js
const USAGE_KEY = 'openai_usage'
const DAILY_LIMIT = 100 // 일일 요청 제한

/**
 * API 사용량 확인
 */
export function checkUsageLimit() {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    // 새로운 날짜면 초기화
    resetUsage()
    return true
  }

  return usage.count < DAILY_LIMIT
}

/**
 * 사용량 증가
 */
export function incrementUsage() {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    setUsage({ date: today, count: 1 })
  } else {
    setUsage({ ...usage, count: usage.count + 1 })
  }
}

/**
 * 사용량 가져오기
 */
function getUsage() {
  try {
    const data = localStorage.getItem(USAGE_KEY)
    return data ? JSON.parse(data) : { date: '', count: 0 }
  } catch {
    return { date: '', count: 0 }
  }
}

/**
 * 사용량 저장
 */
function setUsage(usage) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
}

/**
 * 사용량 초기화
 */
function resetUsage() {
  setUsage({ date: new Date().toDateString(), count: 0 })
}

/**
 * 남은 사용량 확인
 */
export function getRemainingUsage() {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    return DAILY_LIMIT
  }

  return Math.max(0, DAILY_LIMIT - usage.count)
}
```

### 4.8 사용량 제한 적용

```javascript
// src/services/openai.js에 추가
import { checkUsageLimit, incrementUsage, getRemainingUsage } from '../utils/apiUsage'

export async function generateMBTIExplanation(stock, mbti) {
  // 사용량 확인
  if (!checkUsageLimit()) {
    throw new Error(`일일 사용 한도를 초과했습니다. (남은 횟수: ${getRemainingUsage()})`)
  }

  try {
    const response = await openai.chat.completions.create({
      // ... 기존 코드
    })

    // 성공 시 사용량 증가
    incrementUsage()

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}
```

---

## 5. 체크리스트

### 5.1 개발 체크리스트

#### 랜딩 페이지 수정

- [ ] HeroSection 중앙 배치
- [ ] CTA 버튼 즉시 표시
- [ ] 스크롤 힌트 애니메이션
- [ ] 반응형 테스트

#### Pull-to-Refresh

- [ ] MainPage 구현
- [ ] CommunityPage 구현
- [ ] PortfolioPage 구현
- [ ] Header 새로고침 버튼
- [ ] 토스트 알림 연동

#### 검색 기능

- [ ] StockSearch 컴포넌트
- [ ] 자동완성 드롭다운
- [ ] 검색 결과 하이라이트
- [ ] 빈 결과 처리

#### 정렬 기능

- [ ] SortDropdown 컴포넌트
- [ ] 수익률순 정렬
- [ ] 금액순 정렬
- [ ] 이름순 정렬
- [ ] 최근 거래순 정렬

#### 토스트 알림

- [ ] react-hot-toast 설치
- [ ] 전역 설정
- [ ] 성공 알림 적용
- [ ] 에러 알림 적용
- [ ] 로딩 알림 적용

#### 로딩 상태

- [ ] Skeleton 컴포넌트
- [ ] StockCardSkeleton
- [ ] PostCardSkeleton
- [ ] 전체 페이지 적용

#### ChatGPT API

- [ ] OpenAI SDK 설치
- [ ] 환경 변수 설정
- [ ] API 서비스 구현
- [ ] 캐싱 시스템
- [ ] 사용량 제한
- [ ] StockCard AI 버튼
- [ ] 에러 처리

### 5.2 테스트 체크리스트

#### 기능 테스트

- [ ] 랜딩 페이지 첫 화면 확인
- [ ] Pull-to-refresh 동작 확인
- [ ] 검색 기능 정확도
- [ ] 정렬 기능 정확도
- [ ] 토스트 알림 표시
- [ ] 로딩 상태 표시
- [ ] ChatGPT API 응답

#### 성능 테스트

- [ ] 페이지 로딩 속도
- [ ] 애니메이션 부드러움
- [ ] 검색 응답 속도
- [ ] API 응답 시간

#### 호환성 테스트

- [ ] Chrome 테스트
- [ ] Safari 테스트
- [ ] Firefox 테스트
- [ ] 모바일 Chrome
- [ ] 모바일 Safari

#### 반응형 테스트

- [ ] 데스크톱 (1920px)
- [ ] 태블릿 (768px)
- [ ] 모바일 (375px)
- [ ] 가로 모드

### 5.3 문서 체크리스트

- [ ] Phase 1-C 완료 보고서
- [ ] 변경 사항 문서화
- [ ] API 사용 가이드
- [ ] 트러블슈팅 가이드
- [ ] PROGRESS.md 업데이트

---

## 📊 예상 결과

### 개선 전 (60%)

```
사용자 경험
├─ 랜딩 페이지: ⚠️ 첫 화면 빈 공간
├─ 새로고침: ❌ 미지원
├─ 검색: ❌ 없음
├─ 정렬: ❌ 없음
├─ 알림: ❌ 없음
└─ 로딩: ⚠️ 일부만 표시
```

### 개선 후 (75%)

```
사용자 경험
├─ 랜딩 페이지: ✅ 즉시 CTA 표시
├─ 새로고침: ✅ Pull-to-refresh
├─ 검색: ✅ 실시간 검색
├─ 정렬: ✅ 4가지 옵션
├─ 알림: ✅ 토스트 시스템
├─ 로딩: ✅ 스켈레톤 로더
└─ AI: ✅ ChatGPT 맞춤 설명
```

---

## 🎯 성공 기준

### 필수 (Must Have)

- ✅ 랜딩 페이지 첫 화면 개선
- ✅ Pull-to-refresh 3개 페이지
- ✅ 검색 기능 동작
- ✅ 토스트 알림 시스템

### 권장 (Should Have)

- ✅ 정렬 기능
- ✅ 스켈레톤 로더
- ✅ ChatGPT API 연동

### 선택 (Nice to Have)

- ⭐ AI 설명 일괄 생성
- ⭐ 사용량 통계 대시보드
- ⭐ 캐시 관리 UI

---

_작성: Antigravity AI_  
_최종 업데이트: 2026-01-16_
