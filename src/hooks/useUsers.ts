// Hook для роботи з користувачами
import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import type { UserDto, ICreateUser } from '@/lib/api-client'
import { toast } from 'react-toastify'

export function useUsers() {
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Завантажити список користувачів
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiClient.listAllUsers()
      setUsers(data)
      setError(null)
    } catch (err: any) {
      const errorMsg = err?.message || 'Помилка завантаження користувачів'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Завантажити при монтуванні
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Створити нового користувача
  const addUser = useCallback(async (data: ICreateUser) => {
    try {
      const response = await apiClient.createUser(data as any)
      const newUser = response?.user
      if (newUser) {
        setUsers((prev) => [...prev, newUser])
        toast.success(`Користувача ${newUser?.firstName} ${newUser?.lastName} створено`)
      }
      return newUser
    } catch (err: any) {
      const errorMsg = err?.message || 'Помилка створення користувача'
      toast.error(errorMsg)
      throw err
    }
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
  }
}
