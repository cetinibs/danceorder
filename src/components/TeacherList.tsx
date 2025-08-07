'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  colorCode: string
  specialties: string[]
  isActive: boolean
}

interface TeacherListProps {
  teachers: Teacher[]
  onEdit: (teacher: Teacher) => void
  onDelete: (id: string) => void
}

export default function TeacherList({ teachers, onEdit, onDelete }: TeacherListProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Bu öğretmeni silmek istediğinizden emin misiniz?')) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Silme işlemi başarısız oldu')
      }

      toast.success('Öğretmen başarıyla silindi')
      onDelete(id)
    } catch (error) {
      console.error('Öğretmen silinirken hata:', error)
      toast.error('Öğretmen silinirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ad Soyad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              E-posta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telefon
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Renk
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">İşlemler</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.firstName} {teacher.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {teacher.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: teacher.colorCode }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(teacher)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  disabled={isLoading}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="text-red-600 hover:text-red-900"
                  disabled={isLoading}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 