// Компонент для вибору користувачів (мультиселект з чекбоксами)
"use client"

import { memo, useState, useRef, useEffect } from 'react'
import type { UserDto } from '@/lib/api-client'

interface UserSelectorProps {
  users: UserDto[]
  selectedUserIds: number[]
  onChange: (userIds: number[]) => void
  disabled?: boolean
  label?: string
}

function UserSelector({
  users,
  selectedUserIds,
  onChange,
  disabled = false,
  label = 'Оберіть користувачів',
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId))
    } else {
      onChange([...selectedUserIds, userId])
    }
  }

  const selectedUsers = users.filter((u) => u.id && selectedUserIds.includes(u.id))
  const displayText =
    selectedUsers.length === 0
      ? label
      : selectedUsers.map((u) => `${u.firstName} ${u.lastName}`).join(', ')

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
        }`}
      >
        <span className={selectedUsers.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
          {displayText}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {users.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">Немає доступних користувачів</div>
          ) : (
            <div className="py-1">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!user.id && selectedUserIds.includes(user.id)}
                    onChange={() => user.id && toggleUser(user.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(UserSelector)
