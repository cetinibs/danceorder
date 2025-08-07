'use client';

import { useState, useEffect } from 'react'

interface StudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading?: boolean
  initialData?: {
    email: string
    name: string
    phone: string
    emergencyContact: {
      name: string
      phone: string
    }
    healthInfo: string
    isActive: boolean
  }
}

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData
}: StudentModalProps) {
  const [email, setEmail] = useState(initialData?.email || '')
  const [name, setName] = useState(initialData?.name || '')
  const [phone, setPhone] = useState(initialData?.phone || '')
  const [emergencyContactName, setEmergencyContactName] = useState(initialData?.emergencyContact?.name || '')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialData?.emergencyContact?.phone || '')
  const [healthInfo, setHealthInfo] = useState(initialData?.healthInfo || '')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email)
      setName(initialData.name)
      setPhone(initialData.phone)
      setEmergencyContactName(initialData.emergencyContact?.name || '')
      setEmergencyContactPhone(initialData.emergencyContact?.phone || '')
      setHealthInfo(initialData.healthInfo || '')
      setIsActive(initialData.isActive)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      email,
      name,
      phone,
      emergencyContactName,
      emergencyContactPhone,
      healthInfo,
      isActive
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isLoading || !!initialData}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acil Durum Kişisi
              </label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acil Durum Telefonu
              </label>
              <input
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sağlık Bilgileri
              </label>
              <textarea
                value={healthInfo}
                onChange={(e) => setHealthInfo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label className="ml-2 block text-sm text-gray-900">
                Aktif
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
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
              {isLoading ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 