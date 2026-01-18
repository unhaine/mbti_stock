import { useState, useMemo, useEffect } from 'react'
import gamificationData from '../data/gamification.json'

interface GamificationItem {
  id: string
  type: string
}

export function useGamification(mbti: string) {
  const [activeGamificationIndex, setActiveGamificationIndex] = useState(0)

  // 오늘의 투자 운세 (MBTI 기반)
  const todaysFortune = useMemo(() => {
    const fortunes = (gamificationData.fortunes as any)[mbti] || gamificationData.fortunes.INTJ
    const randIndex = Math.floor(Math.random() * fortunes.length)
    return fortunes[randIndex]
  }, [mbti])

  // 일일 미션 (MBTI 기반)
  const dailyMission = useMemo(() => {
    if (!mbti) return null
    const lastChar = mbti[3] // J or P
    const thirdChar = mbti[2] // T or F
    
    // J/P 미션과 T/F 미션 중 랜덤 1개
    const missionTypes = [lastChar, thirdChar]
    const targetType = missionTypes[Math.floor(Math.random() * missionTypes.length)]
    
    const missions = (gamificationData.dailyMissions as any)[targetType] || []
    if (missions.length === 0) return null
    
    return missions[Math.floor(Math.random() * missions.length)]
  }, [mbti])

  // 게이미피케이션 아이템 준비 (무한 루프 롤링을 위해 첫 번째 아이템 복제본 추가)
  const gamificationItems = useMemo<GamificationItem[]>(() => {
    const base = [
      { id: 'insight', type: 'insight' },
      ...(dailyMission ? [{ id: 'mission', type: 'mission' }] : [])
    ]
    if (base.length > 1) return [...base, { id: 'insight-clone', type: 'insight' }]
    return base
  }, [dailyMission])

  // 자동 롤링 (5초마다)
  useEffect(() => {
    if (gamificationItems.length <= 1) return

    const interval = setInterval(() => {
      setActiveGamificationIndex((prev) => (prev + 1) % gamificationItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [gamificationItems.length])

  // 무한 루프 점프 (마지막 클론 -> 0번 인덱스)
  useEffect(() => {
    if (activeGamificationIndex === gamificationItems.length - 1 && gamificationItems.length > 1) {
      const timer = setTimeout(() => {
        setActiveGamificationIndex(0)
      }, 600) // Transition duration과 일치
      return () => clearTimeout(timer)
    }
  }, [activeGamificationIndex, gamificationItems.length])

  return {
    gamificationItems,
    activeGamificationIndex,
    dailyMission,
    todaysFortune
  }
}
