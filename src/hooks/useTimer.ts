// Hook для real-time таймера
import { useEffect, useState } from 'react'
import { calculateDurationSeconds, formatDurationHMS } from '@/utils/date.utils'

/**
 * Hook для відображення real-time таймера
 * Повертає тривалість у секундах та відформатовану строку ГГ:ХХ:СС
 */
export function useTimer(startTimestamp: number, stoppedAt: number | null = null) {
  const [durationSeconds, setDurationSeconds] = useState(0)

  useEffect(() => {
    // Якщо drill зупинено, рахуємо статичну тривалість
    if (stoppedAt !== null) {
      setDurationSeconds(calculateDurationSeconds(startTimestamp, stoppedAt))
      return
    }

    // Інакше оновлюємо кожну секунду
    const updateDuration = () => {
      setDurationSeconds(calculateDurationSeconds(startTimestamp))
    }

    // Одразу оновимо
    updateDuration()

    // Потім кожну секунду
    const interval = setInterval(updateDuration, 1000)

    return () => clearInterval(interval)
  }, [startTimestamp, stoppedAt])

  return {
    durationSeconds,
    formatted: formatDurationHMS(durationSeconds),
  }
}
