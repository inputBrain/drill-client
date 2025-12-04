// Базовий HTTP клієнт для API запитів
import axios, { AxiosInstance, AxiosError } from 'axios'
import type { ApiError } from '@/types/api.types'

// Base URL для API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Створюємо axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд
})

// Response interceptor для обробки помилок
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let errorMessage = 'Network error'

    if (error.response?.data) {
      // Якщо сервер повернув помилку
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data
      } else if (typeof error.response.data === 'object') {
        // Якщо це об'єкт помилки з .NET (може бути ValidationProblemDetails або інше)
        const data = error.response.data as any
        errorMessage = data.title || data.message || JSON.stringify(data)
      }
    } else if (error.message) {
      errorMessage = error.message
    }

    const apiError: ApiError = {
      message: errorMessage,
      statusCode: error.response?.status,
    }

    // Логування тільки для development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
      })
    }

    return Promise.reject(apiError)
  }
)

/**
 * Функція для обробки помилок API
 */
export function handleApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return error as ApiError
  }

  return {
    message: 'Unknown error occurred',
  }
}
