'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import PackageCard from '@/components/PackageCard'
import PackageModal from '@/components/modals/PackageModal'
import toast from 'react-hot-toast'

interface Package {
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

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages')
      const data = await res.json()
      if (data.success) {
        setPackages(data.packages)
      }
    } catch (error) {
      toast.error('Paketler yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Paketler</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Paket
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onEdit={() => {
                setSelectedPackage(pkg)
                setShowModal(true)
              }}
              onUpdate={fetchPackages}
            />
          ))}
        </div>
      )}

      <PackageModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedPackage(null)
        }}
        onSubmit={fetchPackages}
        serviceId="default" // Varsayılan serviceId
        initialData={selectedPackage}
      />
    </div>
  )
} 