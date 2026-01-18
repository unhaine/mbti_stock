import { useState, useMemo } from 'react'
import { useStockContext, Stock } from '../contexts/StockContext'

export function useSearchStocks() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { stocks: masterStocks } = useStockContext()

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return masterStocks
      .filter(s => s.name.toLowerCase().includes(query) || s.ticker.includes(query))
      .slice(0, 10)
  }, [masterStocks, searchQuery])

  const openSearch = () => setIsSearchOpen(true)
  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  return {
    isSearchOpen,
    searchQuery,
    setSearchQuery,
    filteredStocks,
    openSearch,
    closeSearch
  }
}
