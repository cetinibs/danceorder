'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import TeacherModal from './modals/TeacherModal'

interface TeacherCardProps {
  teacher: {
    id: string
    email: string
    name: string
    phone: string
    colorCode: string
    isActive: boolean
  }
  onUpdate: () => void
}

export default function TeacherCard({ teacher, onUpdate }: TeacherCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (data: any) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/teachers?id=${teacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      
      if (result.success) {
        toast.success('Öğretmen güncellendi')
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
    if (!window.confirm('Bu öğretmeni silmek istediğinizden emin misiniz?')) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/teachers?id=${teacher.id}`, {
        method: 'DELETE'
      })

      const result = await res.json()
      
      if (result.success) {
        toast.success('Öğretmen silindi')
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {teacher.name}
          </h3>
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: teacher.colorCode }}
          />
        </div>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div>E-posta: {teacher.email}</div>
          <div>Telefon: {teacher.phone}</div>
          <div>Durum: {teacher.isActive ? 'Aktif' : 'Pasif'}</div>
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

      <TeacherModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        isLoading={isLoading}
        initialData={teacher}
      />
    </>
  )
} 