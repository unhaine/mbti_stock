export interface LandingFeature {
  emoji: string
  title: string
  desc: string
  gradient: string
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    emoji: '🎭',
    title: '16가지 MBTI 유형',
    desc: '각 유형별 맞춤형 투자 성향 분석',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    emoji: '🎯',
    title: '80개 투자 테마',
    desc: 'MBTI별 5개의 특별한 테마',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    emoji: '📊',
    title: '150+ 종목 분석',
    desc: '당신의 성향에 맞는 은유적 설명',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    emoji: '💬',
    title: '144개 맞춤 코멘트',
    desc: '시장 상황별 MBTI 맞춤 메시지',
    gradient: 'from-amber-500 to-orange-500',
  },
]

export interface SampleMBTI {
  mbti: string
  emoji: string
}

export const SAMPLE_MBTIS: SampleMBTI[] = [
  { mbti: 'INTJ', emoji: '🧙‍♂️' },
  { mbti: 'ENFP', emoji: '🦄' },
  { mbti: 'ISTP', emoji: '🛠️' },
  { mbti: 'ESFJ', emoji: '❤️' },
]
