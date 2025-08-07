'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface StudentFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialData?: any
}

export default function StudentForm({ onSuccess, onCancel, initialData }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    emergencyContact: {
      firstName: initialData?.emergencyContact?.firstName || '',
      lastName: initialData?.emergencyContact?.lastName || '',
      phone: initialData?.emergencyContact?.phone || '',
      email: initialData?.emergencyContact?.email || ''
    },
    healthInfo: typeof initialData?.healthInfo === 'string' 
      ? {
          status: initialData.healthInfo,
          conditions: [],
          notes: '',
          bodyFatMeasurements: []
        }
      : {
          status: initialData?.healthInfo?.status || 'Sağlıklı',
          conditions: initialData?.healthInfo?.conditions || [],
          notes: initialData?.healthInfo?.notes || '',
          bodyFatMeasurements: initialData?.healthInfo?.bodyFatMeasurements || []
        }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = initialData?.id 
        ? `/api/students/${initialData.id}`
        : '/api/students'
      
      const method = initialData?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Bir hata oluştu')
      }

      const data = await res.json()
      
      if (data.success) {
        toast.success(
          initialData?.id 
            ? 'Öğrenci başarıyla güncellendi'
            : 'Öğrenci başarıyla eklendi'
        )
        onSuccess()
      } else {
        throw new Error('İşlem başarısız')
      }
    } catch (error: any) {
      console.error('Form gönderme hatası:', error)
      toast.error(error.message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Öğrenci Bilgileri</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ad</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Soyad</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acil Durum İletişim Bilgileri</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ad</label>
              <input
                type="text"
                value={formData.emergencyContact.firstName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, firstName: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Soyad</label>
              <input
                type="text"
                value={formData.emergencyContact.lastName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, lastName: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta (İsteğe bağlı)</label>
              <input
                type="email"
                value={formData.emergencyContact.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  emergencyContact: { ...prev.emergencyContact, email: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Sağlık Bilgileri</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sağlık Durumu
          </label>
          <select
            value={formData.healthInfo.status}
            onChange={(e) => setFormData({
              ...formData,
              healthInfo: {
                ...formData.healthInfo,
                status: e.target.value
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Sağlıklı">Sağlıklı</option>
            <option value="Dikkat">Dikkat Edilmeli</option>
            <option value="Riskli">Riskli</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notlar
          </label>
          <textarea
            value={formData.healthInfo.notes}
            onChange={(e) => setFormData({
              ...formData,
              healthInfo: {
                ...formData.healthInfo,
                notes: e.target.value
              }
            })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isLoading}
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Kaydediliyor...' : initialData?.id ? 'Güncelle' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
} 