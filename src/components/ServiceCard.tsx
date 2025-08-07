'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import ServiceModal from './modals/ServiceModal'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    type: string
    packages: any[]
  }
  onUpdate: () => void
}

export default function ServiceCard({ service, onUpdate }: ServiceCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (data: any) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, id: service.id })
      })

      const result = await res.json()
      
      if (result.success) {
        toast.success('Hizmet güncellendi')
        setShowEditModal(false)
        onUpdate()
      } else {
        toast.error(result.error || 'Güncelleme başarısız')
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/services?id=${service.id}`, {
        method: 'DELETE'
      })

      const result = await res.json()
      
      if (result.success) {
        toast.success('Hizmet silindi')
        onUpdate()
      } else {
        toast.error(result.error || 'Silme başarısız')
      }
    } catch (error) {
      toast.error('Silme sırasında hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {service.name}
        </h3>
        <div className="text-sm text-gray-600 mb-4">
          Tip: {service.type}
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Paket Sayısı: {service.packages.length}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            disabled={isLoading}
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50"
          >
            Düzenle
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50"
          >
            Sil
          </button>
        </div>
      </div>

      <ServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        isLoading={isLoading}
        initialData={service}
      />
    </>
  )
} 