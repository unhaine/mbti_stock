import { Suspense } from 'react'
import Skeleton from '../../../../components/common/Skeleton'
import StockMainChart from '../../charts/StockMainChart'

interface StockChartTabProps {
  chartData: any[]
  accentColor: string
}

export default function StockChartTab({ chartData, accentColor }: StockChartTabProps) {
  return (
    <Suspense fallback={<Skeleton height={400} width="100%" rounded="2xl" />}>
       <StockMainChart data={chartData} color={accentColor} />
    </Suspense>
  )
}
