// Компонент картки Drill з функціоналом Start/Stop
"use client"

import { memo, useState, useCallback, useRef, useEffect } from 'react'
import type { DrillDto, UserDto } from '@/types/api.types'
import UserSelector from './UserSelector'
import UserTimer from './UserTimer'
import { formatCost } from '@/utils/date.utils'

interface DrillCardProps {
  drill: DrillDto
  allUsers: UserDto[]
  userStartTimes?: Map<number, number> // userId -> startedAt
  onStart: (drillId: number, userIds: number[]) => Promise<void>
  onStop: (drillId: number, userIds: number[]) => Promise<void>
}

function DrillCard({ drill, allUsers, userStartTimes, onStart, onStop }: DrillCardProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)

  // Локальний кеш часів старту для стабільності (щоб не втрачати під час оновлень)
  const startTimesCache = useRef<Map<number, number>>(new Map())

  const activeUsers = drill.users || []
  const hasActiveUsers = activeUsers.length > 0

  // Оновлюємо кеш з userStartTimes коли вони приходять
  useEffect(() => {
    if (userStartTimes) {
      userStartTimes.forEach((timestamp, userId) => {
        // Зберігаємо час старту тільки якщо його ще немає в кеші
        if (!startTimesCache.current.has(userId)) {
          startTimesCache.current.set(userId, timestamp)
        }
      })
    }

    // Очищаємо кеш для користувачів які більше не активні
    const activeUserIds = new Set(activeUsers.map(u => u.id))
    startTimesCache.current.forEach((_, userId) => {
      if (!activeUserIds.has(userId)) {
        startTimesCache.current.delete(userId)
      }
    })
  }, [userStartTimes, activeUsers])

  const handleStart = useCallback(async () => {
    if (selectedUserIds.length === 0) {
      alert('Оберіть хоча б одного користувача')
      return
    }

    // Фільтруємо тільки неактивних користувачів
    const activeUserIds = new Set(activeUsers.map(u => u.id))
    const usersToStart = selectedUserIds.filter(id => !activeUserIds.has(id))

    if (usersToStart.length === 0) {
      alert('Всі обрані користувачі вже активні на цьому drill')
      return
    }

    // Попередження якщо деякі користувачі вже активні
    if (usersToStart.length < selectedUserIds.length) {
      const skippedCount = selectedUserIds.length - usersToStart.length
      const confirmStart = window.confirm(
        `${skippedCount} користувач${skippedCount === 1 ? '' : 'ів'} вже активн${skippedCount === 1 ? 'ий' : 'і'} і буд${skippedCount === 1 ? 'е' : 'уть'} пропущен${skippedCount === 1 ? 'ий' : 'і'}. Продовжити?`
      )
      if (!confirmStart) return
    }

    setIsStarting(true)
    try {
      await onStart(drill.id, usersToStart)
      setSelectedUserIds([]) // Очистити вибір після старту
    } catch (error) {
      console.error('Error starting drill:', error)
    } finally {
      setIsStarting(false)
    }
  }, [drill.id, selectedUserIds, activeUsers, onStart])

  const handleStop = useCallback(async () => {
    if (activeUsers.length === 0) return

    // Якщо активних користувачів більше 1, запитуємо підтвердження
    if (activeUsers.length > 1) {
      const confirmStop = window.confirm(
        `Зупинити drill для ${activeUsers.length} користувачів?`
      )
      if (!confirmStop) return
    }

    setIsStopping(true)
    try {
      const activeUserIds = activeUsers.map((u) => u.id)
      await onStop(drill.id, activeUserIds)
    } catch (error) {
      console.error('Error stopping drill:', error)
    } finally {
      setIsStopping(false)
    }
  }, [drill.id, activeUsers, onStop])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{drill.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatCost(drill.pricePerMinute)}/хв
          </p>
        </div>

        {hasActiveUsers && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="relative flex h-2 w-2 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {activeUsers.length} {activeUsers.length === 1 ? 'активний' : 'активних'}
          </span>
        )}
      </div>

      {/* Активні користувачі з таймерами */}
      {hasActiveUsers && (
        <div className="space-y-2 bg-gray-50 p-3 rounded-md">
          <p className="text-xs font-medium text-gray-500 uppercase">Активні користувачі:</p>
          {activeUsers.map((user) => {
            // Отримуємо час старту з кешу (стабільний) або з userStartTimes або fallback на поточний час
            let startTimestamp = startTimesCache.current.get(user.id)
            if (!startTimestamp) {
              startTimestamp = userStartTimes?.get(user.id) ?? Date.now()
              // Зберігаємо в кеш для наступних рендерів
              startTimesCache.current.set(user.id, startTimestamp)
            }
            return (
              <UserTimer
                key={user.id}
                user={user}
                startTimestamp={startTimestamp}
                showBadge={true}
                compact={true}
              />
            )
          })}
        </div>
      )}

      {/* Селектор користувачів для старту */}
      <div className="space-y-3">
        <UserSelector
          users={allUsers}
          selectedUserIds={selectedUserIds}
          onChange={setSelectedUserIds}
          disabled={isStarting || isStopping}
          label="Оберіть користувачів для старту"
        />

        {/* Кнопки Start / Stop */}
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            disabled={selectedUserIds.length === 0 || isStarting || isStopping}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isStarting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Запуск...
              </span>
            ) : (
              'СТАРТ'
            )}
          </button>

          <button
            onClick={handleStop}
            disabled={!hasActiveUsers || isStopping || isStarting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isStopping ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Зупинка...
              </span>
            ) : (
              'СТОП'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(DrillCard)
