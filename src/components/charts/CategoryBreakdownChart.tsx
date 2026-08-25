import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface CategoryBreakdownChartProps {
  data: { name: string; value: number }[]
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid stroke="var(--line)" horizontal={false} />
        <XAxis type="number" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fontFamily: 'IBM Plex Sans', fontSize: 12 }} width={110} />
        <Tooltip formatter={(value: number) => `RM ${value.toFixed(2)}`} />
        <Bar dataKey="value" fill="var(--brass)" radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
