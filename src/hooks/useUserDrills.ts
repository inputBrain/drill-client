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
  const fetchUserDrills = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
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
      if (showLoading) {
        toast.error(errorMsg)
      }
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [filter])

  // Завантажити при монтуванні та зміні фільтру (з loading)
  useEffect(() => {
    fetchUserDrills(true)
  }, [fetchUserDrills])

  // Автоматична синхронізація кожні 30 хвилин (БЕЗ loading, тихе оновлення)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserDrills(false) // false = не показувати loading
    }, 1800000) // 30 хвилин

    return () => clearInterval(interval)
  }, [fetchUserDrills])

  return {
    userDrills,
    loading,
    error,
    fetchUserDrills,
  }
}
