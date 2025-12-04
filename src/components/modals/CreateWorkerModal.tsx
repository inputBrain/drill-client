"use client"

import { useState, FormEvent } from 'react'
import type { CreateUserRequest } from '@/types/api.types'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: CreateUserRequest) => Promise<void>
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Валідація
    if (firstName.trim().length < 2) {
      alert("Ім'я повинно містити мінімум 2 символи")
      return
    }

    if (firstName.trim().length > 50) {
      alert("Ім'я не може бути довшим за 50 символів")
      return
    }

    if (lastName.trim().length < 2) {
      alert('Прізвище повинно містити мінімум 2 символи')
      return
    }

    if (lastName.trim().length > 50) {
      alert('Прізвище не може бути довшим за 50 символів')
      return
    }

    if (!validateEmail(email.trim())) {
      alert('Невірний формат email')
      return
    }

    setIsLoading(true)

    try {
      await onSuccess({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      })

      // Очистити форму
      setFirstName('')
      setLastName('')
      setEmail('')
      onClose()
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFirstName('')
      setLastName('')
      setEmail('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Додати користувача
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="user-firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Ім'я <span className="text-red-500">*</span>
            </label>
            <input
              id="user-firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Іван"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="user-lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Прізвище <span className="text-red-500">*</span>
            </label>
            <input
              id="user-lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Іваненко"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="ivan@example.com"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Скасувати
            </button>

            <button
              type="submit"
              disabled={isLoading || firstName.trim().length < 2 || lastName.trim().length < 2}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Створення...
                </span>
              ) : (
                'Створити'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
