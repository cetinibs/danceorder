'use client'

import { useState, useEffect } from 'react'
import TeacherList from '@/components/TeacherList'
import TeacherForm from '@/components/TeacherForm'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  colorCode: string
  isActive: boolean
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const fetchTeachers = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/teachers')

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Öğretmenler yüklenemedi')
      }

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'API başarısız yanıt döndü')
      }

      setTeachers(data.teachers || [])
      console.log('Öğretmenler başarıyla yüklendi:', data.teachers?.length || 0)

    } catch (error: any) {
      console.error('Öğretmen yükleme hatası:', error)
      toast.error(error.message || 'Öğretmenler yüklenirken bir hata oluştu')
      setTeachers([]) // Hata durumunda boş array
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleSuccess = () => {
    setShowForm(false)
    setSelectedTeacher(null)
    fetchTeachers()
  }

  const handleDelete = (id: string) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🎭</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-secondary-200 border-t-secondary-600 mx-auto"></div>
          <p className="text-sm text-secondary-600 mt-4 font-elegant">Eğitmenler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-graceful">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary-800">
            🎭 Dans Eğitmenlerimiz
          </h1>
          <p className="text-secondary-600 font-elegant mt-1">
            Uzman eğitmen kadromuz
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Eğitmen Ekle
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedTeacher ? 'Öğretmen Düzenle' : 'Yeni Öğretmen'}
            </h2>
            <TeacherForm
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false)
                setSelectedTeacher(null)
              }}
              initialData={selectedTeacher || undefined}
            />
          </div>
        </div>
      )}

      <TeacherList
        teachers={teachers}
        onEdit={(teacher) => {
          setSelectedTeacher(teacher)
          setShowForm(true)
        }}
        onDelete={handleDelete}
      />
    </div>
  )
} 