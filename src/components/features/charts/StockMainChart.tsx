import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '../../../utils/formatters'

interface StockMainChartProps {
  data: any[]
  color: string
}

export default function StockMainChart({ data, color }: StockMainChartProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-1 h-[400px] border border-gray-100 dark:border-gray-800">
      <ResponsiveContainer width="99%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="mainChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value: any) => [formatCurrency(Number(value) || 0), '가격']}
          />
          <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#mainChartGradient)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-2 mt-4">
        {['1D', '1W', '1M', '3M', '1Y'].map(p => (
          <button key={p} className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
