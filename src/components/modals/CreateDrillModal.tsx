"use client"

import { useState, FormEvent } from 'react'
import type { ICreateDrill } from '@/lib/api-client'

interface ICreateDrillModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: ICreateDrill) => Promise<void>
}

export default function ICreateDrillModal({ isOpen, onClose, onSuccess }: ICreateDrillModalProps) {
  const [title, setTitle] = useState('')
  const [pricePerMinute, setPricePerMinute] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Валідація
    if (title.trim().length < 2) {
      alert('Назва повинна містити мінімум 2 символи')
      return
    }

    const price = parseFloat(pricePerMinute)
    if (isNaN(price) || price <= 0) {
      alert('Ціна повинна бути позитивним числом')
      return
    }

    setIsLoading(true)

    try {
      await onSuccess({
        title: title.trim(),
        pricePerMinute: price,
      })

      // Очистити форму
      setTitle('')
      setPricePerMinute('')
      onClose()
    } catch (error) {
      console.error('Error creating drill:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setTitle('')
      setPricePerMinute('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Додати Drill
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="drill-title" className="block text-sm font-medium text-gray-700 mb-1">
              Назва <span className="text-red-500">*</span>
            </label>
            <input
              id="drill-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Spiral Drill"
              required
              minLength={2}
            />
          </div>

          <div>
            <label htmlFor="drill-price" className="block text-sm font-medium text-gray-700 mb-1">
              Ціна за хвилину (грн) <span className="text-red-500">*</span>
            </label>
            <input
              id="drill-price"
              type="number"
              step="0.01"
              min="0.01"
              value={pricePerMinute}
              onChange={(e) => setPricePerMinute(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="2.5"
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
              disabled={isLoading || title.trim().length < 2 || !pricePerMinute}
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
