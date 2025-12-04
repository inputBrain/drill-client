// Hook для роботи з UserDrill (історія)
import { useState, useEffect, useCallback } from 'react'
import { getUserDrillList, getActiveUserDrills, getCompletedUserDrills } from '@/api'
import type { UserDrillDto } from '@/types/api.types'
import { toast } from 'react-toastify'

type FilterType = 'all' | 'active' | 'completed'

export function useUserDrills(filter: FilterType = 'all') {
  const [userDrills, setUserDrills] = useState<UserDrillDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Завантажити записи згідно з фільтром
  const fetchUserDrills = useCallback(async () => {
    try {
      setLoading(true)
      let data: UserDrillDto[]

      if (filter === 'active') {
        data = await getActiveUserDrills()
      } else if (filter === 'completed') {
        data = await getCompletedUserDrills()
      } else {
        data = await getUserDrillList()
      }

      setUserDrills(data)
      setError(null)
    } catch (err: any) {
      const errorMsg = err?.message || 'Помилка завантаження історії'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [filter])

  // Завантажити при монтуванні та зміні фільтру
  useEffect(() => {
    fetchUserDrills()
  }, [fetchUserDrills])

  // Автоматична синхронізація кожні 10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserDrills()
    }, 10000)

    return () => clearInterval(interval)
  }, [fetchUserDrills])

  return {
    userDrills,
    loading,
    error,
    fetchUserDrills,
  }
}
