# 데이터 구조 (DATABASE)

> LocalStorage 기반 데이터 구조 및 JSON 스키마

---

## 📊 데이터 저장 방식

### Phase 1: LocalStorage
```javascript
// 브라우저 LocalStorage 사용
// - 간단한 key-value 저장
// - 최대 5-10MB
// - 서버 불필요
```

### Phase 2: Backend DB (향후)
```javascript
// PostgreSQL 또는 MongoDB
// - 사용자 계정 시스템
// - 북마크, 포트폴리오 저장
// - 커뮤니티 데이터
```

---

## 1. LocalStorage 구조

### 1.1 전체 구조
```javascript
{
  // 사용자 MBTI
  "userMBTI": "INTJ",
  
  // 온보딩 완료 여부
  "onboardingCompleted": "true",
  
  // 마지막 방문 시간
  "lastVisit": "2026-01-15T09:00:00Z",
  
  // 가상 포트폴리오
  "portfolio": {
    "mbti": "INTJ",
    "initialValue": 10000000,
    "currentValue": 10250000,
    "change": 250000,
    "changePercent": 2.5,
    "lastUpdated": "2026-01-15T09:00:00Z"
  },
  
  // 북마크 (Phase 2)
  "bookmarks": ["005930", "005380"],
  
  // 설정
  "settings": {
    "theme": "light",
    "notifications": false
  }
}
```

---

## 2. JSON 데이터 파일

### 2.1 MBTI 프로필 (`mbti-profiles.json`)

```json
{
  "INTJ": {
    "id": "INTJ",
    "name": "신중한 전략가",
    "tagline": "데이터로 승부하는 장기 투자자",
    "description": "INTJ 성향의 당신은 철저한 분석을 통해 투자 결정을 내립니다. 단기 변동에 흔들리지 않고 장기적 관점에서 포트폴리오를 구성하는 것을 선호합니다.",
    "traits": ["분석적", "인내심", "장기 관점"],
    "riskTolerance": "medium",
    "decisionStyle": "analytical",
    "investmentStyle": "long-term",
    "emoji": "🎭",
    "gradient": ["#667eea", "#764ba2"]
  },
  "ENFP": {
    "id": "ENFP",
    "name": "열정적인 모험가",
    "tagline": "직관으로 기회를 포착하는 투자자",
    "description": "ENFP 성향의 당신은 직관과 열정으로 새로운 투자 기회를 찾습니다. 다양한 분야에 관심이 많고 트렌드를 빠르게 캐치하는 스타일입니다.",
    "traits": ["직관적", "도전적", "다양성"],
    "riskTolerance": "high",
    "decisionStyle": "intuitive",
    "investmentStyle": "growth",
    "emoji": "🎉",
    "gradient": ["#f093fb", "#f5576c"]
  }
  // ... 나머지 14개 MBTI
}
```

### 2.2 테마 데이터 (`themes.json`)

```json
{
  "INTJ": [
    {
      "id": "intj-theme-1",
      "mbti": "INTJ",
      "emoji": "🏰",
      "title": "불장은 온다... 존버의 달인을 위한",
      "description": "안정적인 성장주",
      "category": "stability",
      "stocks": [
        "005930", "005380", "035720", "051910", "006400",
        "035420", "000660", "017670", "096770", "207940"
      ]
    },
    {
      "id": "intj-theme-2",
      "mbti": "INTJ",
      "emoji": "🔬",
      "title": "데이터가 말해주는 숨겨진 진주",
      "description": "저평가 가치주",
      "category": "value",
      "stocks": [
        "005930", "005380", "035720", "051910", "006400",
        "035420", "000660", "017670", "096770", "207940"
      ]
    }
    // ... 3개 더 (총 5개)
  ],
  "ENFP": [
    // ... 5개 테마
  ]
  // ... 나머지 14개 MBTI
}
```

### 2.3 종목 데이터 (`stocks.json`)

```json
{
  "005930": {
    "ticker": "005930",
    "name": "삼성전자",
    "sector": "반도체",
    "marketCap": "450조",
    "price": 75000,
    "change": 500,
    "changePercent": 0.67,
    "volume": 1000000,
    "metaphors": {
      "INTJ": {
        "tag": "천천히 쌓이는 성",
        "emoji": "🏰",
        "description": "당신의 신중한 INTJ 성향에 맞는 안정적인 대형주입니다. 마치 천천히 쌓이는 성처럼, 단기 변동에 흔들리지 않고 장기적으로 견고하게 성장하는 스타일입니다."
      },
      "ENFP": {
        "tag": "든든한 기반",
        "emoji": "🏛️",
        "description": "새로운 도전을 위한 안정적인 기반이 되어줄 종목입니다. 다양한 사업 영역으로 확장하며 끊임없이 혁신하는 모습이 당신의 ENFP 성향과 잘 맞습니다."
      }
      // ... 나머지 14개 MBTI
    },
    "matchScore": {
      "INTJ": 85,
      "ENFP": 72
      // ... 나머지 14개 MBTI
    },
    "volatility": "low",
    "updatedAt": "2026-01-15T09:00:00Z"
  },
  "005380": {
    "ticker": "005380",
    "name": "현대차",
    "sector": "자동차",
    // ...
  }
  // ... 나머지 종목들
}
```

### 2.4 MBTI 코멘트 (`mbti-comments.json`)

```json
{
  "INTJ": {
    "bull": [
      "계획대로 되고 있어. 하지만 방심은 금물이야",
      "데이터가 맞았네. 다음 전략을 준비할 시간이야",
      "예상 범위 내 수익. 감정을 배제하고 다음 단계로"
    ],
    "neutral": [
      "변동성이 낮네. 관망하면서 데이터 수집 중",
      "아직 버틸 수 있지? 데이터를 믿어봐",
      "안정적인 흐름. 전략을 재점검할 시간이야"
    ],
    "bear": [
      "예상된 조정이야. 장기 관점을 잃지 말자",
      "감정 배제. 전략을 재점검할 시간이야",
      "이럴 때일수록 데이터에 집중해야 해"
    ]
  },
  "ENFP": {
    "bull": [
      "가즈아~! 이 기세 그대로! 🚀",
      "역시 내 직관이 맞았어! 다음은 뭐 살까?",
      "완전 신나! 이 느낌 최고야!"
    ],
    "neutral": [
      "음... 좀 심심한데? 재미있는 거 없나?",
      "잠깐의 휴식 시간! 다음 기회를 기다려보자",
      "이것도 나름 괜찮아. 새로운 걸 찾아볼까?"
    ],
    "bear": [
      "어... 이럴 땐 어떡하지? 일단 버텨보자!",
      "괜찮아, 다시 올라갈 거야! 긍정 에너지! ✨",
      "실패도 경험이야! 배우고 다시 도전하자!"
    ]
  }
  // ... 나머지 14개 MBTI
}
```

---

## 3. 데이터 흐름

### 3.1 초기 로딩
```
1. 앱 시작
   ↓
2. LocalStorage 확인
   - userMBTI 있음? → 메인페이지
   - userMBTI 없음? → 온보딩
   ↓
3. JSON 파일 로드
   - mbti-profiles.json
   - themes.json
   - stocks.json
   - mbti-comments.json
   ↓
4. 데이터 캐싱 (메모리)
```

### 3.2 MBTI 선택 시
```
1. 사용자 MBTI 선택 (예: INTJ)
   ↓
2. LocalStorage 저장
   - userMBTI: "INTJ"
   - onboardingCompleted: "true"
   ↓
3. 포트폴리오 초기화
   - initialValue: 10,000,000
   - currentValue: 10,000,000
   ↓
4. 메인페이지로 이동
```

### 3.3 메인페이지 데이터 로드
```
1. userMBTI 읽기 (예: INTJ)
   ↓
2. MBTI 프로필 로드
   - mbti-profiles.json["INTJ"]
   ↓
3. 테마 로드
   - themes.json["INTJ"] (5개)
   ↓
4. 각 테마별 종목 로드
   - stocks.json[ticker] (10개 × 5테마)
   ↓
5. 코멘트 선택
   - portfolio.changePercent 기반
   - mbti-comments.json["INTJ"][mood]
```

---

## 4. 데이터 관리 함수

### 4.1 LocalStorage 유틸리티

```javascript
// storage.js

export const storage = {
  // MBTI 저장
  setMBTI: (mbti) => {
    localStorage.setItem('userMBTI', mbti);
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('lastVisit', new Date().toISOString());
  },
  
  // MBTI 읽기
  getMBTI: () => {
    return localStorage.getItem('userMBTI');
  },
  
  // 온보딩 완료 여부
  isOnboardingCompleted: () => {
    return localStorage.getItem('onboardingCompleted') === 'true';
  },
  
  // 포트폴리오 초기화
  initPortfolio: (mbti) => {
    const portfolio = {
      mbti,
      initialValue: 10000000,
      currentValue: 10000000,
      change: 0,
      changePercent: 0,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  },
  
  // 포트폴리오 읽기
  getPortfolio: () => {
    const data = localStorage.getItem('portfolio');
    return data ? JSON.parse(data) : null;
  },
  
  // 포트폴리오 업데이트
  updatePortfolio: (updates) => {
    const portfolio = storage.getPortfolio();
    const updated = { ...portfolio, ...updates };
    localStorage.setItem('portfolio', JSON.stringify(updated));
  },
  
  // 전체 초기화
  clear: () => {
    localStorage.clear();
  }
};
```

### 4.2 JSON 데이터 로더

```javascript
// dataLoader.js

class DataLoader {
  constructor() {
    this.cache = {
      profiles: null,
      themes: null,
      stocks: null,
      comments: null
    };
  }
  
  // MBTI 프로필 로드
  async loadProfiles() {
    if (this.cache.profiles) return this.cache.profiles;
    
    const response = await fetch('/data/mbti-profiles.json');
    this.cache.profiles = await response.json();
    return this.cache.profiles;
  }
  
  // 테마 로드
  async loadThemes() {
    if (this.cache.themes) return this.cache.themes;
    
    const response = await fetch('/data/themes.json');
    this.cache.themes = await response.json();
    return this.cache.themes;
  }
  
  // 종목 로드
  async loadStocks() {
    if (this.cache.stocks) return this.cache.stocks;
    
    const response = await fetch('/data/stocks.json');
    this.cache.stocks = await response.json();
    return this.cache.stocks;
  }
  
  // 코멘트 로드
  async loadComments() {
    if (this.cache.comments) return this.cache.comments;
    
    const response = await fetch('/data/mbti-comments.json');
    this.cache.comments = await response.json();
    return this.cache.comments;
  }
  
  // 특정 MBTI 데이터 가져오기
  async getMBTIData(mbti) {
    const [profiles, themes, comments] = await Promise.all([
      this.loadProfiles(),
      this.loadThemes(),
      this.loadComments()
    ]);
    
    return {
      profile: profiles[mbti],
      themes: themes[mbti],
      comments: comments[mbti]
    };
  }
  
  // 종목 정보 가져오기
  async getStock(ticker) {
    const stocks = await this.loadStocks();
    return stocks[ticker];
  }
}

export const dataLoader = new DataLoader();
```

---

## 5. 데이터 검증

### 5.1 MBTI 유효성 검사

```javascript
const VALID_MBTI = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export function isValidMBTI(mbti) {
  return VALID_MBTI.includes(mbti);
}

export function validateMBTI(mbti) {
  if (!mbti) {
    throw new Error('MBTI is required');
  }
  if (!isValidMBTI(mbti)) {
    throw new Error(`Invalid MBTI: ${mbti}`);
  }
  return true;
}
```

### 5.2 데이터 무결성 검사

```javascript
export function validatePortfolio(portfolio) {
  const required = ['mbti', 'initialValue', 'currentValue', 'change', 'changePercent'];
  
  for (const field of required) {
    if (!(field in portfolio)) {
      throw new Error(`Missing field: ${field}`);
    }
  }
  
  if (portfolio.initialValue <= 0) {
    throw new Error('Initial value must be positive');
  }
  
  return true;
}
```

---

## 6. 데이터 마이그레이션

### 6.1 버전 관리

```javascript
const DATA_VERSION = '1.0.0';

export function migrateData() {
  const version = localStorage.getItem('dataVersion');
  
  if (!version || version !== DATA_VERSION) {
    // 마이그레이션 로직
    console.log('Migrating data...');
    
    // 예: 구 버전 데이터 변환
    // ...
    
    localStorage.setItem('dataVersion', DATA_VERSION);
  }
}
```

---

## 📝 데이터 현황

### ✅ 완료
- MBTI 리스트 (16개)
- 투자 테마 (80개)
- MBTI 코멘트 (144개)
- 코스닥150 샘플 (50개)

### ⏳ 작업 필요
- [ ] JSON 파일 생성
  - [ ] mbti-profiles.json
  - [ ] themes.json
  - [ ] stocks.json
  - [ ] mbti-comments.json
- [ ] 테마별 종목 매칭 (80 × 10)
- [ ] 은유 표현 작성 (종목별 × 16 MBTI)

---

## 🔗 관련 문서

- [02_FEATURES.md](./02_FEATURES.md) - 기능 명세
- [05_UI_STRUCTURE.md](./05_UI_STRUCTURE.md) - UI 구조

---

*최종 업데이트: 2026-01-15*
