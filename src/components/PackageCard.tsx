'use client'

import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import toast from 'react-hot-toast'

interface PackageCardProps {
  package: {
    id: string
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
  onEdit: () => void
  onUpdate: () => void
}

export default function PackageCard({ package: pkg, onEdit, onUpdate }: PackageCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Bu paketi silmek istediğinizden emin misiniz?')) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Paket silinirken hata oluştu')

      toast.success('Paket başarıyla silindi')
      onUpdate()
    } catch (error) {
      toast.error('Paket silinirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{pkg.name}</h3>
          <p className="text-sm text-gray-500">{pkg.serviceType}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="text-gray-600 hover:text-indigo-600"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-gray-600 hover:text-red-600"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Tür</span>
          <span className="text-sm font-medium">{pkg.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Süre</span>
          <span className="text-sm font-medium">{pkg.hours} saat</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Fiyat</span>
          <span className="text-sm font-medium">{pkg.price} TL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Kapasite</span>
          <span className="text-sm font-medium">
            {pkg.minStudents ? `${pkg.minStudents}-` : ''}{pkg.maxStudents} kişi
          </span>
        </div>
      </div>

      {pkg.details && (
        <p className="text-sm text-gray-600 mt-2">{pkg.details}</p>
      )}

      <div className="pt-4 border-t">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          pkg.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {pkg.isActive ? 'Aktif' : 'Pasif'}
        </span>
      </div>
    </div>
  )
} 