// Hook для роботи з drill
import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import type {
  DrillDto,
  ICreateDrill,
  IStartDrill,
  IStopDrill,
} from '@/lib/api-client'
import { toast } from 'react-toastify'

export function useDrills() {
  const [drills, setDrills] = useState<DrillDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Завантажити список drill
  const fetchDrills = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true)
      }
      const data = await apiClient.listAllDrills()
      setDrills(data)
      setError(null)
    } catch (err: any) {
      const errorMsg = err?.message || 'Помилка завантаження drill'
      setError(errorMsg)
      if (showLoading) {
        toast.error(errorMsg)
      }
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [])

  // Завантажити при монтуванні (з loading)
  useEffect(() => {
    fetchDrills(true)
  }, [fetchDrills])

  // Автоматична синхронізація кожні 30 хвилин (БЕЗ loading, тихе оновлення)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDrills(false) // false = не показувати loading
    }, 1800000) // 30 хвилин

    return () => clearInterval(interval)
  }, [fetchDrills])

  // Створити новий drill
  const addDrill = useCallback(async (data: ICreateDrill) => {
    try {
      const response = await apiClient.createDrill(data as any)
      const newDrill = response?.drill
      if (newDrill) {
        setDrills((prev) => [...prev, newDrill])
        toast.success(`Drill "${newDrill?.title}" створено`)
      }
      return newDrill
    } catch (err: any) {
      const errorMsg = err?.message || 'Помилка створення drill'
      toast.error(errorMsg)
      throw err
    }
  }, [])

  // Запустити drill для користувачів
  const start = useCallback(async (data: IStartDrill) => {
    try {
      const response = await apiClient.startDrill(data as any)
      // Оновити конкретний drill в списку
      const updatedDrill = response?.drill
      if (updatedDrill) {
        setDrills((prev) =>
          prev.map((d) => (d.id === updatedDrill.id ? updatedDrill : d))
        )
      }
      toast.success('Drill запущено')
      return response
    } catch (err: any) {
      const errorMsg = err?.message || 'Помилка запуску drill'
      toast.error(errorMsg)
      throw err
    }
  }, [])

  // Зупинити drill для користувачів
  const stop = useCallback(async (data: IStopDrill) => {
    try {
      const response = await apiClient.stopDrill(data as any)
      // Оновити конкретний drill в списку
      const updatedDrill = response?.drill
      if (updatedDrill) {
        setDrills((prev) =>
          prev.map((d) => (d.id === updatedDrill.id ? updatedDrill : d))
        )
      }
      toast.success('Drill зупинено')
      return response
    } catch (err: any) {
      const errorMsg = err?.message || 'Помилка зупинки drill'
      toast.error(errorMsg)
      throw err
    }
  }, [])

  return {
    drills,
    loading,
    error,
    fetchDrills,
    addDrill,
    start,
    stop,
  }
}
