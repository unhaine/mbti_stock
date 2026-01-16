import { usePortfolioContext } from '../contexts/PortfolioContext'

/**
 * 포트폴리오를 관리하는 훅 (Context Wrapper)
 * @returns [포트폴리오 객체와 설정 함수]
 */
export default function usePortfolio() {
  const { portfolioStore, setPortfolioStore } = usePortfolioContext()
  return [portfolioStore, setPortfolioStore] as const
}
