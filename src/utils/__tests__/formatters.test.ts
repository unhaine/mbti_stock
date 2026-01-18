import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, formatMarketCap, formatNumber } from '../formatters'

describe('Formatters Utils', () => {
  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
    })
  })

  describe('formatCurrency', () => {
    it('formats number to KRW', () => {
      expect(formatCurrency(10000)).toBe('10,000원')
      expect(formatCurrency(0)).toBe('0원')
      expect(formatCurrency(-5000)).toBe('-5,000원')
    })
    
    it('handles floating point numbers', () => {
      // KR locale default number formatting includes decimals if present
      expect(formatCurrency(1234.56)).toBe('1,234.56원')
    })
  })

  describe('formatPercent', () => {
    it('formats number to percentage string with sign', () => {
      expect(formatPercent(5.2)).toBe('+5.20%')
      expect(formatPercent(-3.14159)).toBe('-3.14%')
      expect(formatPercent(0)).toBe('+0.00%')
    })
  })

  describe('formatMarketCap', () => {
    it('formats large numbers to readable Korean units', () => {
      expect(formatMarketCap(100000000)).toBe('1억')
      expect(formatMarketCap(2500000000000)).toBe('2.50조')
    })
  })
})
