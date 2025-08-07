'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading?: boolean
  initialData?: any
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData
}: AppointmentModalProps) {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState({
    studentId: '',
    teacherId: '',
    roomId: '',
    serviceType: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    notes: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId,
        teacherId: initialData.teacherId,
        roomId: initialData.roomId,
        serviceType: initialData.serviceType,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        startTime: initialData.startTime,
        notes: initialData.notes || ''
      })
    }
    fetchData()
  }, [initialData])

  const fetchData = async () => {
    try {
      const [studentsRes, teachersRes, roomsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/teachers'),
        fetch('/api/rooms')
      ])

      const studentsData = await studentsRes.json()
      const teachersData = await teachersRes.json()
      const roomsData = await roomsRes.json()

      setStudents(studentsData.students)
      setTeachers(teachersData.teachers)
      setRooms(roomsData.rooms)
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Randevu Düzenle' : 'Yeni Randevu'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Öğrenci</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seçiniz</option>
              {students.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Öğretmen</label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seçiniz</option>
              {teachers.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Oda</label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({...formData, roomId: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seçiniz</option>
              {rooms.map((room: any) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.deviceCount} Cihaz)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hizmet Tipi</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seçiniz</option>
              <option value="pilates">Pilates</option>
              <option value="physiotherapy">Fizyoterapi</option>
              <option value="clinical-pilates">Klinik Pilates</option>
              <option value="zumba">Zumba</option>
              <option value="yoga">Yoga</option>
              <option value="aerial-yoga">Hamak Yoga</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tarih</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Saat</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
              min="09:00"
              max="21:00"
              step="3600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notlar</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 