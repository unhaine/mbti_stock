
import { Post } from '../../types'

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]

function getRandomMBTI(): string {
  return MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)]
}

function getRandomSentiment(): 'bull' | 'bear' | 'neutral' {
  const rand = Math.random()
  if (rand > 0.6) return 'bull'
  if (rand > 0.3) return 'bear'
  return 'neutral'
}

export const crawlerService = {
  /**
   * 네이버 금융 종목토론실 크롤링 (via Vite Proxy)
   */
  async getNaverDiscussions(ticker: string): Promise<Post[]> {
    try {
      // 로컬 프록시 서버를 통해 요청 (CORS 및 리다이렉트 완벽 해결)
      const response = await fetch(`http://localhost:3001/api/naver/discussion?code=${ticker}`)
      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      const rows = doc.querySelectorAll('table.type2 tbody tr')
      const posts: Post[] = []

      rows.forEach((row, index) => {
        // 제목 요소 찾기 (여러가지 케이스 대응)
        const titleEl = row.querySelector('td.title a')
        if (!titleEl) return 

        const title = titleEl.getAttribute('title') || titleEl.textContent?.trim() || ''
        const link = titleEl.getAttribute('href')
        
        // 작성자
        const authorEl = row.querySelector('td.p11') || row.querySelector('td:nth-child(4)')
        
        // 날짜 (보통 5번째 td이나 변동 가능성 있음)
        let dateRaw = ''
        const dateEl = row.querySelector('td:nth-child(5) span') || row.querySelector('td:nth-child(5)')
        if (dateEl) dateRaw = dateEl.textContent?.trim() || ''

        // 공지사항 등 필터링 (날짜가 없거나 제목이 너무 짧으면 무시)
        if (!title || !dateRaw) return

        // 🧹 클린봇: 퀄리티 낮은 글 필터링
        // 1. 너무 짧은 글 (5글자 미만)
        if (title.length < 5) return

        // 2. 자음/모음만 있는 글 (ㅋㅋㅋㅋ, ㅎㅎㅎ 등)
        if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(title.replace(/\s/g, ''))) return

        // 3. 특수문자가 절반 이상인 글
        const specialCharCount = (title.match(/[^a-zA-Z0-9가-힣\s]/g) || []).length
        if (specialCharCount > title.length * 0.5) return
        
        // 16개 MBTI 중 하나 랜덤 할당
        const mbti = getRandomMBTI()
        const sentiment = getRandomSentiment()

        posts.push({
          id: `naver_${ticker}_${index}_${Math.random().toString(36).substr(2, 9)}`,
          title: title,
          category: 'external',
          mbti: mbti,
          emoji: '🌐', 
          author: authorEl?.textContent?.trim() || '익명',
          likes: Math.floor(Math.random() * 20),
          comments: 0,
          views: 0,
          timeAgo: dateRaw, 
          isHot: false,
          preview: title,
          sentiment: sentiment
        })
      })

      // 만약 파싱된 데이터가 없다면 에러 로그 출력 (디버깅용)
      if (posts.length === 0) {
        console.warn('Crawler: HTML fetched but no posts parsed. Selectors might be wrong.')
        // console.log(html) // 필요시 주석 해제하여 HTML 구조 확인
      }

      // 상위 10~15개만 반환
      return posts.slice(0, 15)
    } catch (error) {
      console.error('Crawler Error:', error)
      return []
    }
  }
}
