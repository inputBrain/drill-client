// Компонент таблиці з історією drill сесій
"use client"

import { memo, useMemo } from 'react'
import type { UserDrillDto } from '@/types/api.types'
import {
  formatTimestampFull,
  formatDurationHMS,
  formatCost,
  calculateDurationMinutes,
  calculateCost,
} from '@/utils/date.utils'
import { useTimer } from '@/hooks/useTimer'
import StatusBadge from '../StatusBadge'

interface ReportsTableProps {
  userDrills: UserDrillDto[]
  groupedData: Record<string, UserDrillDto[]>
}

// Окремий компонент для активного рядка з таймером
const ActiveRow = memo(({ record }: { record: UserDrillDto }) => {
  const { formatted, durationSeconds } = useTimer(record.startedAt, record.stoppedAt)
  const durationMinutes = Math.floor(durationSeconds / 60)
  const cost = calculateCost(durationMinutes, record.drill.pricePerMinute)

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {record.user.firstName} {record.user.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {record.drill.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatTimestampFull(record.startedAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <StatusBadge active={true} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 tabular-nums">
        {formatted}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCost(record.drill.pricePerMinute)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formatCost(cost)}
      </td>
    </tr>
  )
})

ActiveRow.displayName = 'ActiveRow'

// Компонент для статичного рядка (завершеного)
const CompletedRow = memo(({ record }: { record: UserDrillDto }) => {
  const durationMinutes = useMemo(
    () => calculateDurationMinutes(record.startedAt, record.stoppedAt!),
    [record.startedAt, record.stoppedAt]
  )

  const cost = useMemo(
    () => calculateCost(durationMinutes, record.drill.pricePerMinute),
    [durationMinutes, record.drill.pricePerMinute]
  )

  const durationSeconds = durationMinutes * 60
  const formattedDuration = formatDurationHMS(durationSeconds)

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {record.user.firstName} {record.user.lastName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {record.drill.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatTimestampFull(record.startedAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatTimestampFull(record.stoppedAt!)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 tabular-nums">
        {formattedDuration}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCost(record.drill.pricePerMinute)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formatCost(cost)}
      </td>
    </tr>
  )
})

CompletedRow.displayName = 'CompletedRow'

function ReportsTable({ userDrills, groupedData }: ReportsTableProps) {
  // Сортуємо записи за часом (новіші зверху)
  const sortedRecords = useMemo(
    () => [...userDrills].sort((a, b) => b.startedAt - a.startedAt),
    [userDrills]
  )

  // Обчислюємо загальний підсумок
  const grandTotal = useMemo(() => {
    let totalSeconds = 0
    let totalCost = 0

    sortedRecords.forEach((record) => {
      const durationMinutes = calculateDurationMinutes(
        record.startedAt,
        record.stoppedAt ?? undefined
      )
      const cost = calculateCost(durationMinutes, record.drill.pricePerMinute)
      totalSeconds += durationMinutes * 60
      totalCost += cost
    })

    return {
      duration: formatDurationHMS(totalSeconds),
      cost: formatCost(totalCost),
    }
  }, [sortedRecords])

  // Обчислюємо підсумки по групах (користувач + drill)
  const groupSummaries = useMemo(() => {
    const summaries: Record<
      string,
      { userName: string; drillName: string; totalSeconds: number; totalCost: number }
    > = {}

    Object.entries(groupedData).forEach(([key, records]) => {
      const firstRecord = records[0]
      let totalSeconds = 0
      let totalCost = 0

      records.forEach((record) => {
        const durationMinutes = calculateDurationMinutes(
          record.startedAt,
          record.stoppedAt ?? undefined
        )
        const cost = calculateCost(durationMinutes, record.drill.pricePerMinute)
        totalSeconds += durationMinutes * 60
        totalCost += cost
      })

      summaries[key] = {
        userName: `${firstRecord.user.firstName} ${firstRecord.user.lastName}`,
        drillName: firstRecord.drill.title,
        totalSeconds,
        totalCost,
      }
    })

    return summaries
  }, [groupedData])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Користувач
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Drill
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Початок
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Зупинка
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тривалість
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ціна/хв
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Вартість
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRecords.map((record) =>
              record.stoppedAt === null ? (
                <ActiveRow key={record.id} record={record} />
              ) : (
                <CompletedRow key={record.id} record={record} />
              )
            )}

            {/* Загальний підсумок */}
            <tr className="bg-blue-50 font-semibold">
              <td colSpan={4} className="px-6 py-4 text-sm text-gray-900">
                ЗАГАЛЬНИЙ ПІДСУМОК
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 tabular-nums">
                {grandTotal.duration}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {grandTotal.cost}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default memo(ReportsTable)
