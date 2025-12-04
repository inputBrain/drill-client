// Компонент бейджа статусу для користувачів
import React from 'react'

interface StatusBadgeProps {
  active: boolean
  compact?: boolean
}

export default function StatusBadge({ active, compact = false }: StatusBadgeProps) {
  if (active) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        {compact ? (
          <>
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            active
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Активний
          </>
        )}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      {compact ? 'stopped' : 'Зупинено'}
    </span>
  )
}
