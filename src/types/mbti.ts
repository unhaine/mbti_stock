/**
 * MBTI 타입 정의
 */

// 16가지 MBTI 유형
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

// MBTI 배열 (검증용)
export const MBTI_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

// MBTI 유형 검증
export function isValidMBTI(value: string): value is MBTIType {
  return MBTI_TYPES.includes(value as MBTIType)
}

// MBTI 그룹
export type MBTIGroup = 'NT' | 'NF' | 'SJ' | 'SP'

export const MBTI_GROUPS: Record<MBTIGroup, MBTIType[]> = {
  NT: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], // 분석가형
  NF: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], // 외교관형
  SJ: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], // 수호자형
  SP: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], // 탐험가형
}

// MBTI 그룹 가져오기
export function getMBTIGroup(mbti: MBTIType): MBTIGroup {
  for (const [group, types] of Object.entries(MBTI_GROUPS)) {
    if (types.includes(mbti)) {
      return group as MBTIGroup
    }
  }
  return 'NT' // 기본값
}

// MBTI 프로필 타입
export interface MBTIProfile {
  id: MBTIType
  name: string
  tagline: string
  description: string
  traits: string[]
  riskTolerance: 'low' | 'medium' | 'high'
  decisionStyle: 'analytical' | 'intuitive' | 'practical' | 'emotional'
  investmentStyle: 'long-term' | 'growth' | 'value' | 'momentum'
  emoji: string
  gradient: [string, string]
}

// MBTI 투자 성향
export interface MBTIInvestmentStyle {
  preferredSectors: string[]
  riskLevel: 1 | 2 | 3 | 4 | 5
  holdingPeriod: 'short' | 'medium' | 'long'
  decisionSpeed: 'slow' | 'moderate' | 'fast'
}
