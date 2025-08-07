'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { X } from 'lucide-react'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  time: string
  onSave: (data: any) => void
}

interface Teacher {
  id: string
  name: string
  color: string
}

interface Student {
  id: string
  name: string
}

interface Room {
  id: string
  name: string
  capacity: number
}

export default function AppointmentModal({ isOpen, onClose, date, time, onSave }: AppointmentModalProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Öğretmenleri getir
        const teachersRes = await fetch('/api/teachers')
        const teachersData = await teachersRes.json()
        if (teachersData.success) {
          setTeachers(teachersData.teachers)
        }

        // Öğrencileri getir
        const studentsRes = await fetch('/api/students')
        const studentsData = await studentsRes.json()
        if (studentsData.success) {
          setStudents(studentsData.students)
        }

        // Odaları getir
        const roomsRes = await fetch('/api/rooms')
        const roomsData = await roomsRes.json()
        if (roomsData.success) {
          setRooms(roomsData.rooms)
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const appointmentData = {
        teacherId: selectedTeacher,
        studentId: selectedStudent,
        roomId: selectedRoom,
        date: format(date, 'yyyy-MM-dd'),
        startTime: time,
        notes
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      })

      const data = await res.json()

      if (data.success) {
        onSave(data.appointment)
        onClose()
      }
    } catch (error) {
      console.error('Randevu ekleme hatası:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Yeni Randevu</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {format(date, 'd MMMM yyyy', { locale: tr })} - {time}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Öğretmen
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seçiniz</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Öğrenci
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seçiniz</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oda
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seçiniz</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notlar
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>
    </div>
  )
} 