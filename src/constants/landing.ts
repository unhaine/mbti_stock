export interface LandingFeature {
  title: string
  desc: string
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    title: '16가지 MBTI 유형',
    desc: '각 유형별 맞춤형 투자 성향 분석',
  },
  {
    title: '80개 투자 테마',
    desc: 'MBTI별 5개의 특별한 테마',
  },
  {
    title: '150+ 종목 분석',
    desc: '당신의 성향에 맞는 은유적 설명',
  },
  {
    title: '144개 맞춤 코멘트',
    desc: '시장 상황별 MBTI 맞춤 메시지',
  },
]

export interface SampleMBTI {
  mbti: string
  group: string
}

export const SAMPLE_MBTIS: SampleMBTI[] = [
  { mbti: 'INTJ', group: '분석가' },
  { mbti: 'ENFP', group: '외교관' },
  { mbti: 'ISTP', group: '탐험가' },
  { mbti: 'ESFJ', group: '관리자' },
]
