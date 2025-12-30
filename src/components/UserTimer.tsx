// Компонент таймера для активного користувача
import React, { memo } from 'react'
import { useTimer } from '@/hooks/useTimer'
import StatusBadge from './StatusBadge'
import type { UserDto } from '@/lib/api-client'

interface UserTimerProps {
  user: UserDto
  startTimestamp: number
  stoppedAt?: number | null
  showBadge?: boolean
  compact?: boolean
}

function UserTimer({
  user,
  startTimestamp,
  stoppedAt = null,
  showBadge = true,
  compact = false,
}: UserTimerProps) {
  const { formatted } = useTimer(startTimestamp, stoppedAt)
  const isActive = stoppedAt === null

  return (
    <div className={`flex items-center ${compact ? 'gap-1.5' : 'gap-2'}`}>
      <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
        {user.firstName} {user.lastName}
      </span>
      <span className={`${compact ? 'text-xs' : 'text-sm'} font-mono text-gray-700 tabular-nums`}>
        {formatted}
      </span>
      {showBadge && <StatusBadge active={isActive} compact={compact} />}
    </div>
  )
}

export default memo(UserTimer)
