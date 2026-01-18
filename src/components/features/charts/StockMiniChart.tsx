import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface StockMiniChartProps {
  data: any[]
  color: string
}

export default function StockMiniChart({ data, color }: StockMiniChartProps) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="miniChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.1} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#miniChartGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
