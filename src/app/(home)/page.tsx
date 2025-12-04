// Головна сторінка зі списком Drill
"use client"

import { useState, useCallback, useMemo } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { useDrills } from '@/hooks/useDrills'
import { useUserDrills } from '@/hooks/useUserDrills'
import Header from '@/components/layout/Header'
import DrillCard from '@/components/DrillCard'
import CreateUserModal from '@/components/modals/CreateWorkerModal' // Перейменовано в CreateUserModal
import CreateDrillModal from '@/components/modals/CreateDrillModal'
import type { CreateUserRequest, CreateDrillRequest } from '@/types/api.types'

export default function Home() {
  const { users, loading: usersLoading, addUser } = useUsers()
  const { drills, loading: drillsLoading, start, stop, addDrill } = useDrills()
  const { userDrills: activeUserDrills, fetchUserDrills } = useUserDrills('active')

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false)

  const loading = usersLoading || drillsLoading

  // Створюємо мапу: drillId -> userId -> startedAt
  const userStartTimesMap = useMemo(() => {
    const map = new Map<number, Map<number, number>>()
    activeUserDrills.forEach((userDrill) => {
      if (!map.has(userDrill.drillId)) {
        map.set(userDrill.drillId, new Map())
      }
      map.get(userDrill.drillId)!.set(userDrill.userId, userDrill.startedAt)
    })
    return map
  }, [activeUserDrills])

  const handleCreateUser = useCallback(
    async (data: CreateUserRequest) => {
      await addUser(data)
    },
    [addUser]
  )

  const handleCreateDrill = useCallback(
    async (data: CreateDrillRequest) => {
      await addDrill(data)
    },
    [addDrill]
  )

  const handleStart = useCallback(
    async (drillId: number, userIds: number[]) => {
      await start({ drillId, userIds })
      // Одразу оновлюємо activeUserDrills щоб отримати правильні startedAt часи
      await fetchUserDrills(false)
    },
    [start, fetchUserDrills]
  )

  const handleStop = useCallback(
    async (drillId: number, userIds: number[]) => {
      await stop({ drillId, userIds })
      // Оновлюємо activeUserDrills після зупинки
      await fetchUserDrills(false)
    },
    [stop, fetchUserDrills]
  )

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
          <h2 className="text-2xl font-bold text-gray-900">Drill</h2>
          <p className="text-gray-600 mt-1">Керування drill та користувачами</p>
        </div>

        {drills.length === 0 ? (
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Немає Drill</h3>
            <p className="text-gray-500 mb-4">Додайте перший Drill для початку роботи</p>
            <button
              onClick={() => setIsDrillModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Додати Drill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drills.map((drill) => (
              <DrillCard
                key={drill.id}
                drill={drill}
                allUsers={users}
                userStartTimes={userStartTimesMap.get(drill.id)}
                onStart={handleStart}
                onStop={handleStop}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setIsUserModalOpen(true)}
          className="group relative px-6 py-3 bg-green-600 text-white rounded-full font-medium shadow-lg hover:bg-green-700 hover:shadow-xl transition-all"
          title="Додати користувача"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Користувач
          </span>
        </button>

        <button
          onClick={() => setIsDrillModalOpen(true)}
          className="group relative px-6 py-3 bg-blue-600 text-white rounded-full font-medium shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
          title="Додати Drill"
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Drill
          </span>
        </button>
      </div>

      {/* Модалки */}
      <CreateUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={handleCreateUser}
      />

      <CreateDrillModal
        isOpen={isDrillModalOpen}
        onClose={() => setIsDrillModalOpen(false)}
        onSuccess={handleCreateDrill}
      />
    </div>
  )
}
