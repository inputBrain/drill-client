// UserDrill API endpoints (історія активності)
import { apiClient } from './client'
import type { UserDrillDto } from '@/types/api.types'

/**
 * Отримати всі записи UserDrill
 * GET /api/UserDrill/ListAll/list
 */
export async function getUserDrillList(): Promise<UserDrillDto[]> {
  const response = await apiClient.get<UserDrillDto[]>('/api/UserDrill/ListAll/list')
  return response.data
}

/**
 * Отримати активні drill (StoppedAt == null)
 * GET /api/UserDrill/GetActive/active
 */
export async function getActiveUserDrills(): Promise<UserDrillDto[]> {
  const response = await apiClient.get<UserDrillDto[]>('/api/UserDrill/GetActive/active')
  return response.data
}

/**
 * Отримати завершені drill (StoppedAt != null)
 * GET /api/UserDrill/GetCompleted/completed
 */
export async function getCompletedUserDrills(): Promise<UserDrillDto[]> {
  const response = await apiClient.get<UserDrillDto[]>('/api/UserDrill/GetCompleted/completed')
  return response.data
}
