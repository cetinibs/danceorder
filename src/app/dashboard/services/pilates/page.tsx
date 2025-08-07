'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Package {
  id: string
  name: string
  type: 'individual' | 'duet' | 'group'
  hours: number
  maxStudents: number
  price: number
  isActive: boolean
}

export default function PilatesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages?serviceType=pilates')
      const data = await res.json()
      if (data.success) {
        setPackages(data.packages)
      }
    } catch (error) {
      toast.error('Paketler yüklenirken hata oluştu')
    }
  }

  const updatePackagePrice = async (packageId: string, price: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/packages/${packageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Fiyat güncellendi')
        fetchPackages()
      } else {
        toast.error(data.error || 'Güncelleme başarısız')
      }
    } catch (error) {
      toast.error('Güncelleme sırasında hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pilates Paketleri</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {pkg.name}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div>Tür: {pkg.type}</div>
              <div>Saat: {pkg.hours}</div>
              <div>Maksimum Öğrenci: {pkg.maxStudents}</div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={pkg.price}
                onChange={(e) => updatePackagePrice(pkg.id, Number(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <span className="text-gray-600">TL</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 