// API Types для ASP.NET Core сервера
// Всі timestamp у форматі Unix timestamp (мілісекунди)

// ==================== USER API ====================

export interface UserDto {
  id: number
  email: string | null
  firstName: string
  lastName: string
  createdAt: number // Unix timestamp в мілісекундах
}

export interface CreateUserRequest {
  email: string | null
  firstName: string
  lastName: string
}

// ==================== DRILL API ====================

export interface DrillDto {
  id: number
  title: string
  pricePerMinute: number
  createdAt: number // Unix timestamp
  users: UserDto[] // Тільки активні користувачі (StoppedAt == null)
}

export interface CreateDrillRequest {
  title: string
  pricePerMinute: number
}

export interface StartDrillRequest {
  userIds: number[] // Список ID користувачів
  drillId: number
}

export interface StartDrillResponse {
  drill: DrillDto // Drill з оновленим списком активних користувачів
}

export interface StopDrillRequest {
  userIds: number[] // Список ID користувачів
  drillId: number
}

export interface StopDrillResponse {
  drill: DrillDto // Drill з оновленим списком активних користувачів
}

// ==================== USERDRILL API ====================

export interface UserDrillDto {
  id: number
  userId: number
  user: UserDto
  drillId: number
  drill: DrillDto
  startedAt: number // Unix timestamp
  stoppedAt: number | null // null якщо активний
}

// ==================== HELPER TYPES ====================

export interface ApiError {
  message: string
  statusCode?: number
}
