// Компонент підсумкової статистики по drill
"use client"

import { memo, useMemo } from 'react'
import type { UserDrillDto } from '@/types/api.types'
import {
  formatDurationHMS,
  formatCost,
  calculateDurationMinutes,
  calculateCost,
} from '@/utils/date.utils'

interface ReportsSummaryProps {
  userDrills: UserDrillDto[]
}

interface DrillSummary {
  drillId: number
  drillTitle: string
  totalSeconds: number
  totalCost: number
  sessionCount: number
}

function ReportsSummary({ userDrills }: ReportsSummaryProps) {
  // Групуємо записи по drill та рахуємо підсумки
  const drillSummaries = useMemo(() => {
    const summaryMap = new Map<number, DrillSummary>()

    userDrills.forEach((record) => {
      const existing = summaryMap.get(record.drillId) || {
        drillId: record.drillId,
        drillTitle: record.drill.title,
        totalSeconds: 0,
        totalCost: 0,
        sessionCount: 0,
      }

      const durationMinutes = calculateDurationMinutes(
        record.startedAt,
        record.stoppedAt ?? undefined
      )
      const cost = calculateCost(durationMinutes, record.drill.pricePerMinute)

      existing.totalSeconds += durationMinutes * 60
      existing.totalCost += cost
      existing.sessionCount += 1

      summaryMap.set(record.drillId, existing)
    })

    // Сортуємо за назвою drill
    return Array.from(summaryMap.values()).sort((a, b) =>
      a.drillTitle.localeCompare(b.drillTitle, 'uk-UA')
    )
  }, [userDrills])

  // Загальні підсумки
  const totals = useMemo(() => {
    return drillSummaries.reduce(
      (acc, summary) => ({
        totalSeconds: acc.totalSeconds + summary.totalSeconds,
        totalCost: acc.totalCost + summary.totalCost,
        sessionCount: acc.sessionCount + summary.sessionCount,
      }),
      { totalSeconds: 0, totalCost: 0, sessionCount: 0 }
    )
  }, [drillSummaries])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Drill
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Кількість сесій
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Загальний час
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Загальна вартість
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drillSummaries.map((summary) => (
              <tr key={summary.drillId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {summary.drillTitle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {summary.sessionCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 tabular-nums">
                  {formatDurationHMS(summary.totalSeconds)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCost(summary.totalCost)}
                </td>
              </tr>
            ))}

            {/* Загальний підсумок */}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Загалом</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {totals.sessionCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 tabular-nums">
                {formatDurationHMS(totals.totalSeconds)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCost(totals.totalCost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default memo(ReportsSummary)
