'use client'

import { useState, useEffect } from 'react'

const SERVICE_TYPES = [
  { id: 'pilates', label: 'Pilates' },
  { id: 'physiotherapy', label: 'Fizyoterapi' },
  { id: 'clinicalPilates', label: 'Klinik Pilates' },
  { id: 'zumba', label: 'Zumba' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'aerialYoga', label: 'Hamak Yoga' }
]

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading?: boolean
  initialData?: {
    name: string
    type: string
  }
}

export default function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData
}: ServiceModalProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [serviceType, setServiceType] = useState(initialData?.type || SERVICE_TYPES[0].id)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setServiceType(initialData.type)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, serviceType })
    setName('')
    setServiceType(SERVICE_TYPES[0].id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Yeni Hizmet Ekle</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hizmet Tipi
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            >
              {SERVICE_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hizmet Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 