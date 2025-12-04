// Утиліти для роботи з датами та часом
// Всі timestamp конвертуються в UTC+2 (Europe/Kiev)

import { format, formatDistanceStrict } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { uk } from 'date-fns/locale'

const KYIV_TIMEZONE = 'Europe/Kiev'

/**
 * Конвертує Unix timestamp (мілісекунди) в Date об'єкт у timezone UTC+2
 */
export function timestampToKyivDate(timestamp: number): Date {
  const date = new Date(timestamp)
  return toZonedTime(date, KYIV_TIMEZONE)
}

/**
 * Форматує Unix timestamp в строку формату: ДД.ММ.РРРР ГГ:ХХ:СС (UTC+2)
 * Приклад: 04.12.2025 10:00:00
 */
export function formatTimestampFull(timestamp: number): string {
  const date = timestampToKyivDate(timestamp)
  return format(date, 'dd.MM.yyyy HH:mm:ss', { locale: uk })
}

/**
 * Форматує Unix timestamp в строку формату: ГГ:ХХ (UTC+2)
 * Приклад: 10:00
 */
export function formatTimestampTime(timestamp: number): string {
  const date = timestampToKyivDate(timestamp)
  return format(date, 'HH:mm', { locale: uk })
}

/**
 * Форматує Unix timestamp в строку формату: ДД.ММ.РРРР (UTC+2)
 * Приклад: 04.12.2025
 */
export function formatTimestampDate(timestamp: number): string {
  const date = timestampToKyivDate(timestamp)
  return format(date, 'dd.MM.yyyy', { locale: uk })
}

/**
 * Обчислює тривалість між двома timestamp (в секундах)
 */
export function calculateDurationSeconds(startTimestamp: number, endTimestamp?: number): number {
  const end = endTimestamp || Date.now()
  const durationMs = end - startTimestamp
  return Math.floor(durationMs / 1000)
}

/**
 * Обчислює тривалість між двома timestamp (в хвилинах)
 */
export function calculateDurationMinutes(startTimestamp: number, endTimestamp?: number): number {
  const durationSeconds = calculateDurationSeconds(startTimestamp, endTimestamp)
  return Math.floor(durationSeconds / 60)
}

/**
 * Форматує тривалість у форматі ГГ:ХХ:СС
 * Приклад: 02:15:30 (2 години 15 хвилин 30 секунд)
 */
export function formatDurationHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':')
}

/**
 * Форматує тривалість у форматі ГГ:ХХ:СС від startTimestamp до поточного часу (для таймерів)
 */
export function formatDurationFromNow(startTimestamp: number): string {
  const durationSeconds = calculateDurationSeconds(startTimestamp)
  return formatDurationHMS(durationSeconds)
}

/**
 * Форматує тривалість у людському форматі (наприклад: "2 години 15 хвилин")
 */
export function formatDurationHuman(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts: string[] = []

  if (hours > 0) {
    parts.push(`${hours} год`)
  }

  if (minutes > 0) {
    parts.push(`${minutes} хв`)
  }

  return parts.join(' ') || '0 хв'
}

/**
 * Обчислює вартість на основі тривалості (в хвилинах) та ціни за хвилину
 */
export function calculateCost(durationMinutes: number, pricePerMinute: number): number {
  return durationMinutes * pricePerMinute
}

/**
 * Форматує вартість у форматі "XXX грн"
 */
export function formatCost(cost: number): string {
  return `${cost.toFixed(2)} грн`
}

/**
 * Перевіряє чи timestamp є активним (stoppedAt === null)
 */
export function isActive(stoppedAt: number | null): boolean {
  return stoppedAt === null
}

/**
 * Отримує поточний час у форматі Unix timestamp (мілісекунди)
 */
export function getCurrentTimestamp(): number {
  return Date.now()
}
