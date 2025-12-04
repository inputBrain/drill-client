// Сторінка Reports з історією UserDrill
"use client"

import { useState, useMemo } from 'react'
import { useUserDrills } from '@/hooks/useUserDrills'
import Header from '@/components/layout/Header'
import ReportsTable from '@/components/reports/ReportsTable'
import ReportsSummary from '@/components/reports/ReportsSummary'

type FilterType = 'all' | 'active'

export default function ReportsPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const { userDrills, loading } = useUserDrills(filter)

  // Групування записів за користувачем та drill
  const groupedData = useMemo(() => {
    const groups: Record<string, typeof userDrills> = {}

    userDrills.forEach((record) => {
      const key = `${record.userId}-${record.drillId}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(record)
    })

    return groups
  }, [userDrills])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Завантаження...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Звіти</h2>
          <p className="text-gray-600 mt-1">
            Детальна інформація про всі drill сесії користувачів
          </p>
        </div>

        {/* Фільтр */}
        <div className="mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                filter === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Всі записи
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                filter === 'active'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Тільки активні
            </button>
          </div>
        </div>

        {userDrills.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Немає записів</h3>
            <p className="text-gray-500">
              {filter === 'active'
                ? 'Немає активних drill сесій'
                : 'Розпочніть drill на головній сторінці'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Підсумкова статистика */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Підсумкова статистика</h3>
              <ReportsSummary userDrills={userDrills} />
            </div>

            {/* Детальна таблиця */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Всі сесії</h3>
              <ReportsTable userDrills={userDrills} groupedData={groupedData} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
