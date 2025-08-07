'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import StudentModal from './modals/StudentModal'

interface StudentCardProps {
  student: {
    id: string
    email: string
    name: string
    phone: string
    emergencyContact: {
      name: string
      phone: string
    }
    healthInfo: string
    startDate: string
    isActive: boolean
    packages: any[]
    remainingHours: number
    totalPayment: number
    remainingPayment: number
  }
  onUpdate: () => void
}

export default function StudentCard({ student, onUpdate }: StudentCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (data: any) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/students?id=${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      
      if (result.success) {
        toast.success('Öğrenci güncellendi')
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
    if (!window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/students?id=${student.id}`, {
        method: 'DELETE'
      })

      const result = await res.json()
      
      if (result.success) {
        toast.success('Öğrenci silindi')
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
      <div className="card-dance p-6 group hover:shadow-large transition-all duration-500 animate-slide-up">
        {/* Üst Kısım - Avatar ve Durum */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl font-bold text-white">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-secondary-800">
                {student.name}
              </h3>
              <p className="text-sm font-elegant text-primary-600">
                🩰 Dansçı
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-medium shadow-soft ${
            student.isActive
              ? 'bg-gradient-to-r from-success-100 to-accent-100 text-success-700'
              : 'bg-gradient-to-r from-error-100 to-warning-100 text-error-700'
          }`}>
            {student.isActive ? '✨ Aktif' : '⏸️ Pasif'}
          </div>
        </div>

        {/* Bilgi Kartları */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100/50">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm">📧</span>
              <span className="text-xs font-medium text-secondary-600">E-posta</span>
            </div>
            <p className="text-sm text-secondary-800 truncate">{student.email}</p>
          </div>

          <div className="bg-secondary-50/50 rounded-xl p-3 border border-secondary-100/50">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm">📱</span>
              <span className="text-xs font-medium text-secondary-600">Telefon</span>
            </div>
            <p className="text-sm text-secondary-800">{student.phone}</p>
          </div>

          <div className="bg-accent-50/50 rounded-xl p-3 border border-accent-100/50">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm">⏰</span>
              <span className="text-xs font-medium text-secondary-600">Kalan Saat</span>
            </div>
            <p className="text-lg font-bold text-accent-700">{student.remainingHours}</p>
          </div>

          <div className="bg-elegant-50/50 rounded-xl p-3 border border-elegant-100/50">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm">💰</span>
              <span className="text-xs font-medium text-secondary-600">Kalan Ödeme</span>
            </div>
            <p className="text-lg font-bold text-elegant-700">{student.remainingPayment} ₺</p>
          </div>
        </div>

        {/* Acil Durum Bilgisi */}
        <div className="bg-warning-50/50 rounded-xl p-3 border border-warning-100/50 mb-6">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm">🚨</span>
            <span className="text-xs font-medium text-warning-700">Acil Durum İletişim</span>
          </div>
          <p className="text-sm text-warning-800">
            {student.emergencyContact.name} - {student.emergencyContact.phone}
          </p>
        </div>

        {/* Eylem Butonları */}
        <div className="flex space-x-3">
          <button
            onClick={() => setShowEditModal(true)}
            disabled={isLoading}
            className="flex-1 btn-secondary text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">✏️</span>
            Düzenle
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white font-medium rounded-xl shadow-soft hover:shadow-medium transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm">🗑️</span>
          </button>
        </div>
      </div>

      <StudentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        isLoading={isLoading}
        initialData={student}
      />
    </>
  )
} 