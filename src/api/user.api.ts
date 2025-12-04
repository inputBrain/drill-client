// User API endpoints
import { apiClient } from './client'
import type { UserDto, CreateUserRequest } from '@/types/api.types'

/**
 * Створити нового користувача
 * POST /api/User/CreateUser
 */
export async function createUser(data: CreateUserRequest): Promise<UserDto> {
  const response = await apiClient.post<UserDto>('/api/User/CreateUser', data)
  return response.data
}

/**
 * Отримати список всіх користувачів
 * GET /api/User/ListAllUsers/list
 */
export async function getUserList(): Promise<UserDto[]> {
  const response = await apiClient.get<UserDto[]>('/api/User/ListAllUsers/list')
  return response.data
}
