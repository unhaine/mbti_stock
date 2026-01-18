
import axios from 'axios'

export interface StockRecommendation {
    ticker: string
    name: string
    price: number
    score: number
    reason: string
    metrics?: Record<string, any>
}
  
export interface ThemeRecommendation {
    id: string
    title: string
    description: string
    emoji: string
    category: string
    stocks: StockRecommendation[]
}

const API_URL = 'http://localhost:8000'

export const recommendationService = {
  async getRecommendations(mbti: string): Promise<StockRecommendation[]> {
    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mbti }),
      })
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      return await response.json()
    } catch (error) {
      console.error('AI Service Error:', error)
      return []
    }
  },

  async getThemeRecommendations(mbti: string): Promise<ThemeRecommendation[]> {
      try {
        const response = await fetch(`${API_URL}/recommend/themes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mbti }),
        })
        if (!response.ok) throw new Error('Failed to fetch themes')
        return await response.json()
      } catch (error) {
          console.error('AI Theme Service Error:', error)
          return []
      }
  },

  async checkServerStatus(): Promise<boolean> {
    try {
      const response = await fetch(API_URL)
      return response.ok
    } catch {
      return false
    }
  }
}
