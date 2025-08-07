'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import StudentForm from '@/components/StudentForm'

interface Student {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  emergencyContact: {
    firstName: string
    lastName: string
    phone: string
    email?: string
  }
  isActive: boolean
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/students')

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Öğrenciler yüklenemedi')
      }

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || 'API başarısız yanıt döndü')
      }

      setStudents(data.students || [])
      console.log('Öğrenciler başarıyla yüklendi:', data.students?.length || 0)

    } catch (error: any) {
      console.error('Öğrenci yükleme hatası:', error)
      toast.error(error.message || 'Öğrenciler yüklenirken bir hata oluştu')
      setStudents([]) // Hata durumunda boş array
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSuccess = () => {
    setShowForm(false)
    setSelectedStudent(null)
    fetchStudents()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🩰</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="text-sm text-secondary-600 mt-4 font-elegant">Dansçılar yükleniyor...</p>
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
            🩰 Dansçılarımız
          </h1>
          <p className="text-secondary-600 font-elegant mt-1">
            Stüdyomuzun yetenekli dansçıları
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Dansçı Ekle
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card-dance max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🩰</span>
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-secondary-800">
                    {selectedStudent ? 'Dansçı Bilgilerini Düzenle' : 'Yeni Dansçı Kaydı'}
                  </h2>
                  <p className="text-sm font-elegant text-primary-600">
                    Dans ailemize katılım formu
                  </p>
                </div>
              </div>
            </div>
            <StudentForm
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false)
                setSelectedStudent(null)
              }}
              initialData={selectedStudent || undefined}
            />
          </div>
        </div>
      )}

      {/* Öğrenci Listesi */}
      {students.length === 0 ? (
        <div className="card-elegant p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🩰</span>
          </div>
          <h3 className="text-lg font-display font-semibold text-secondary-700 mb-2">
            Henüz dansçı kaydı yok
          </h3>
          <p className="text-secondary-500 font-elegant">
            İlk dansçınızı ekleyerek başlayın
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4"
          >
            İlk Dansçıyı Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student, index) => (
            <div
              key={student.id}
              className="card-dance p-6 group hover:shadow-large transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Avatar ve Temel Bilgiler */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl font-bold text-white">
                    {student.firstName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold text-secondary-800">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm font-elegant text-primary-600">
                    ID: {student.studentId || 'Atanmamış'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-xl text-xs font-medium ${
                  student.isActive
                    ? 'bg-gradient-to-r from-success-100 to-accent-100 text-success-700'
                    : 'bg-gradient-to-r from-error-100 to-warning-100 text-error-700'
                }`}>
                  {student.isActive ? '✨ Aktif' : '⏸️ Pasif'}
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-primary-500">📧</span>
                  <span className="text-secondary-700 truncate">{student.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-secondary-500">📱</span>
                  <span className="text-secondary-700">{student.phone}</span>
                </div>
                {student.emergencyContact?.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-warning-500">🚨</span>
                    <span className="text-secondary-600 text-xs">
                      Acil: {student.emergencyContact.firstName} {student.emergencyContact.lastName}
                    </span>
                  </div>
                )}
              </div>

              {/* Eylem Butonu */}
              <button
                onClick={() => {
                  setSelectedStudent(student)
                  setShowForm(true)
                }}
                className="w-full btn-secondary text-sm py-2.5"
              >
                <span className="mr-2">✏️</span>
                Bilgileri Düzenle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 