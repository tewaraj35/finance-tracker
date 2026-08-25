import { useAuth } from '../auth/useAuth'
import { AppShell } from '../components/layout/AppShell'
import { CategoryBreakdownChart } from '../components/charts/CategoryBreakdownChart'
import { MonthTrendChart } from '../components/charts/MonthTrendChart'
import { useCategories } from '../data/categories'
import { useMonthsHistory } from '../data/months'
import { buildCategoryBreakdownData, buildMonthTrendData } from '../lib/chartData'

export default function HistoryPage() {
  const { user } = useAuth()
  const uid = user!.uid
  const { categories } = useCategories(uid)
  const { months } = useMonthsHistory(uid)

  const trendData = buildMonthTrendData(months)
  const latestMonth = [...months].sort((a, b) => b.id.localeCompare(a.id))[0]
  const breakdownData = latestMonth ? buildCategoryBreakdownData(latestMonth.items, categories) : []

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <section>
          <h2 className="font-display text-lg mb-3">Month over month</h2>
          <MonthTrendChart data={trendData} />
        </section>
        <section>
          <h2 className="font-display text-lg mb-3">Latest month by category</h2>
          <CategoryBreakdownChart data={breakdownData} />
        </section>
        <section>
          <h2 className="font-display text-lg mb-3">Past months</h2>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-left text-ink-soft border-b border-line">
                <th className="py-1">Month</th>
                <th className="py-1">Salary</th>
                <th className="py-1">Committed</th>
                <th className="py-1">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((row) => (
                <tr key={row.month} className="border-b border-line">
                  <td className="py-1">{row.month}</td>
                  <td className="py-1">RM {row.salary.toFixed(2)}</td>
                  <td className="py-1">RM {row.committed.toFixed(2)}</td>
                  <td className="py-1">RM {row.remaining.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  )
}
