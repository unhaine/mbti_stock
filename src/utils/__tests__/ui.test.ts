import { describe, it, expect } from 'vitest'
import { getChangeColor, getChangeArrow, getChangeBgColor, swipePower, SWIPE_THRESHOLD } from '../ui'

describe('UI Utils', () => {
  describe('getChangeBgColor', () => {
    it('returns emerald bg for positive', () => {
      expect(getChangeBgColor(1)).toContain('emerald')
    })
    it('returns red bg for negative', () => {
      expect(getChangeBgColor(-1)).toContain('red')
    })
  })

  describe('getChangeColor', () => {
    it('returns emerald for positive change', () => {
      expect(getChangeColor(1.5)).toContain('emerald')
    })
    it('returns red for negative change', () => {
      expect(getChangeColor(-1.5)).toContain('red')
    })
    it('returns gray for zero change', () => {
      expect(getChangeColor(0)).toContain('gray')
    })
  })

  describe('getChangeArrow', () => {
    it('returns up arrow for positive', () => {
      expect(getChangeArrow(1)).toBe('▲')
    })
    it('returns down arrow for negative', () => {
      expect(getChangeArrow(-1)).toBe('▼')
    })
    it('returns dash for zero', () => {
      expect(getChangeArrow(0)).toBe('−')
    })
  })

  describe('swipePower', () => {
    it('calculates power correctly', () => {
      expect(swipePower(100, 2)).toBe(200)
    })
  })

  describe('SWIPE_THRESHOLD', () => {
    it('is defined', () => {
      expect(SWIPE_THRESHOLD).toBeGreaterThan(0)
    })
  })
})
