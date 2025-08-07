'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface PackageModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  serviceId?: string
  initialData?: {
    id?: string
    name: string
    type: 'individual' | 'duet' | 'group'
    serviceType: string
    hours: number
    price: number
    maxStudents: number
    minStudents?: number
    isActive: boolean
    details?: string
  }
}

export default function PackageModal({ isOpen, onClose, onSubmit, serviceId, initialData }: PackageModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'individual' as const,
    serviceType: '',
    hours: 0,
    price: 0,
    maxStudents: 1,
    minStudents: undefined as number | undefined,
    isActive: true,
    details: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Form validasyonu
      if (!formData.name.trim()) {
        toast.error('Paket adı gereklidir')
        return
      }

      if (!formData.serviceType) {
        toast.error('Hizmet tipi seçiniz')
        return
      }

      if (formData.hours <= 0) {
        toast.error('Saat sayısı 0\'dan büyük olmalıdır')
        return
      }

      if (formData.price <= 0) {
        toast.error('Fiyat 0\'dan büyük olmalıdır')
        return
      }

      if (formData.maxStudents <= 0) {
        toast.error('Maksimum öğrenci sayısı 0\'dan büyük olmalıdır')
        return
      }

      // API'ye gönderilecek veri
      const submitData = {
        ...formData,
        serviceId: serviceId || formData.serviceType // serviceId yoksa serviceType kullan
      }

      const url = initialData?.id
        ? `/api/packages?id=${initialData.id}`
        : '/api/packages'

      const res = await fetch(url, {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Paket kaydedilirken hata oluştu')
      }

      toast.success(initialData?.id ? 'Paket güncellendi' : 'Paket oluşturuldu')
      onSubmit()
      onClose()

      // Formu temizle
      if (!initialData?.id) {
        setFormData({
          name: '',
          type: 'individual' as const,
          serviceType: '',
          hours: 0,
          price: 0,
          maxStudents: 1,
          minStudents: undefined,
          isActive: true,
          details: ''
        })
      }
    } catch (error: any) {
      console.error('Paket kaydetme hatası:', error)
      toast.error(error.message || 'Paket kaydedilirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative card-dance w-full max-w-lg p-8 animate-scale-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-secondary-800">
                  {initialData?.id ? 'Paket Düzenle' : 'Yeni Dans Paketi'}
                </h2>
                <p className="text-sm font-elegant text-primary-600">
                  Dans kursları için paket oluşturun
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary-100 transition-colors duration-200 text-secondary-500 hover:text-secondary-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Paket Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hizmet Tipi
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">🎭 Dans türünü seçiniz</option>
                <option value="ballet">🩰 Klasik Bale</option>
                <option value="modern">💃 Modern Dans</option>
                <option value="tango">🌹 Arjantin Tangosu</option>
                <option value="jazz">🎷 Jazz Dans</option>
                <option value="contemporary">🌊 Çağdaş Dans</option>
                <option value="latin">🔥 Latin Dansları</option>
                <option value="pilates">🧘‍♀️ Pilates</option>
                <option value="yoga">🕉️ Yoga</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Paket Tipi
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="individual">👤 Bireysel (1 kişi)</option>
                  <option value="duet">👥 Düet (2 kişi)</option>
                  <option value="group">👨‍👩‍👧‍👦 Grup (3+ kişi)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Saat
                </label>
                <input
                  type="number"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fiyat (TL)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maksimum Öğrenci
                </label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Detaylar
              </label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Aktif
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
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
        </div>
      </div>
    </div>
  )
} 