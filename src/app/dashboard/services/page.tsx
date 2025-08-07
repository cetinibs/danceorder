'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  name: string
  description: string
  isActive: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        if (data.success) {
          setServices(data.services)
        }
      } catch (error) {
        console.error('Hizmetler alınırken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Hizmetler</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Hizmet Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex justify-end gap-2">
              <button className="text-indigo-600 hover:text-indigo-800">
                Düzenle
              </button>
              <button className="text-red-600 hover:text-red-800">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 