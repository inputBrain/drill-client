// Drill API endpoints
import { apiClient } from './client'
import type {
  DrillDto,
  CreateDrillRequest,
  StartDrillRequest,
  StartDrillResponse,
  StopDrillRequest,
  StopDrillResponse,
} from '@/types/api.types'

/**
 * Створити новий drill
 * POST /api/Drill/CreateDrill
 */
export async function createDrill(data: CreateDrillRequest): Promise<DrillDto> {
  const response = await apiClient.post<DrillDto>('/api/Drill/CreateDrill', data)
  return response.data
}

/**
 * Запустити drill для списку користувачів
 * POST /api/Drill/StartDrill/start
 */
export async function startDrill(data: StartDrillRequest): Promise<StartDrillResponse> {
  const response = await apiClient.post<StartDrillResponse>('/api/Drill/StartDrill/start', data)
  return response.data
}

/**
 * Зупинити drill для списку користувачів
 * POST /api/Drill/StopDrill/stop
 */
export async function stopDrill(data: StopDrillRequest): Promise<StopDrillResponse> {
  const response = await apiClient.post<StopDrillResponse>('/api/Drill/StopDrill/stop', data)
  return response.data
}

/**
 * Отримати список всіх drill з активними користувачами
 * GET /api/Drill/ListAllDrills/list
 */
export async function getDrillList(): Promise<DrillDto[]> {
  const response = await apiClient.get<DrillDto[]>('/api/Drill/ListAllDrills/list')
  return response.data
}
