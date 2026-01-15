import profilesData from '../data/mbti-profiles.json'
import { randomChoice } from './helpers'

// MBTI 그룹
export const MBTI_GROUPS = [
  { name: '전체', types: [] },
  { name: '분석가 NT', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] },
  { name: '외교관 NF', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] },
  { name: '관리자 SJ', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] },
  { name: '탐험가 SP', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] },
]

// 가상 닉네임 생성
const NICKNAMES = [
  '주린이탈출', '버핏의후예', '존버만세', '단타의신', '가치투자러',
  '배당주매니아', '성장주헌터', '리스크테이커', '안전제일', '분산투자왕',
  '차트분석가', '펀더멘털주의', '감성투자러', '논리적사색가', '전략가K',
  '투자초보', '수익률달성', '포트폴리오', '장기투자자', '시장관찰자',
]

/**
 * 가상 게시글을 생성합니다
 * @returns {Array} 생성된 가상 게시글 목록
 */
export function generatePosts() {
  const posts = []
  const topics = [
    { title: '오늘 드디어 수익 봤어요! 🎉', category: '수익 인증' },
    { title: '이 종목 어때요? 의견 부탁드려요', category: '종목 토론' },
    { title: '장기 투자 vs 단타, 여러분의 선택은?', category: '투자 토론' },
    { title: '처음으로 주식 샀는데 떨리네요', category: '첫 투자' },
    { title: '요즘 2차전지 너무 좋은 것 같아요', category: '테마 분석' },
    { title: 'AI 관련주 정리해봤습니다', category: '정보 공유' },
    { title: '배당주 포트폴리오 공유합니다', category: '포트폴리오' },
    { title: '손절이 정답일까요? 물타기가 정답일까요?', category: '투자 질문' },
    { title: '오늘의 시장 분석 📊', category: '시장 분석' },
    { title: '내 MBTI에 맞는 종목 찾았어요!', category: 'MBTI 투자' },
    { title: '이번 주 수익률 +15% 달성! 비결 공유', category: '투자 팁' },
    { title: '주식 초보인데 어디서부터 시작해야 할까요?', category: '초보 질문' },
    { title: '삼성전자 vs SK하이닉스, 반도체 투자', category: '종목 비교' },
    { title: '바이오 주식 들어가도 될까요?', category: '종목 토론' },
    { title: '나만의 투자 철학을 세웠습니다', category: '투자 철학' },
  ]
  
  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
                     'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
  
  for (let i = 0; i < 20; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)]
    const mbti = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)]
    const profile = profilesData.find(p => p.id === mbti)
    
    posts.push({
      id: i + 1,
      title: topic.title,
      category: topic.category,
      mbti,
      emoji: profile?.emoji || '😊',
      author: NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)],
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 50),
      views: Math.floor(Math.random() * 1000) + 100,
      timeAgo: randomChoice(['방금 전', '5분 전', '10분 전', '30분 전', '1시간 전', '2시간 전', '3시간 전', '오늘', '어제']),
      isHot: Math.random() > 0.7,
      preview: randomChoice([
        '정말 좋은 정보 감사합니다!',
        '저도 궁금했던 내용이에요.',
        '오늘 시장이 정말 재미있네요.',
        '같은 MBTI로서 공감합니다.',
        '투자는 항상 신중하게!',
      ]),
    })
  }
  
  return posts.sort((a, b) => b.likes - a.likes)
}

export default {
  MBTI_GROUPS,
  generatePosts,
}
