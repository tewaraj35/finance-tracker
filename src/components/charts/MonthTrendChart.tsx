import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface MonthTrendChartProps {
  data: { month: string; salary: number; committed: number; remaining: number }[]
}

export function MonthTrendChart({ data }: MonthTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="var(--line)" />
        <XAxis dataKey="month" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
        <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }} />
        <Tooltip formatter={(value: number) => `RM ${value.toFixed(2)}`} />
        <Line type="monotone" dataKey="salary" stroke="var(--ink-soft)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="committed" stroke="var(--stamp-red)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="remaining" stroke="var(--paid)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
