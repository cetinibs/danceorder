'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import toast from 'react-hot-toast'

interface Student {
  id: string
  name: string
}

interface Teacher {
  id: string
  name: string
  color: string
}

interface Room {
  id: string
  name: string
  capacity: number
  deviceCount: number
}

interface ServicePackage {
  id: string
  name: string
  duration: number
  price: number
  type: string // individual, duet, group
  sessionCount: number
}

interface Service {
  id: string
  name: string
  packages: ServicePackage[]
}

interface AddAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  selectedTime?: string
  onAppointmentAdded: () => void
}

export default function AddAppointmentModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onAppointmentAdded
}: AddAppointmentModalProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    studentId: '',
    teacherId: '',
    roomId: '',
    serviceId: '',
    packageId: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    startTime: selectedTime || '',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd')
      }))
    }
    if (selectedTime) {
      setFormData(prev => ({
        ...prev,
        startTime: selectedTime
      }))
    }
  }, [selectedDate, selectedTime])

  const fetchData = async () => {
    try {
      const servicesRes = await fetch('/api/services')
      const servicesData = await servicesRes.json()
      console.log('Yüklenen servisler:', servicesData)

      if (servicesData.success) {
        setServices(servicesData.services)
      }

      const [studentsRes, teachersRes, roomsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/teachers'),
        fetch('/api/rooms')
      ])

      const studentsData = await studentsRes.json()
      const teachersData = await teachersRes.json()
      const roomsData = await roomsRes.json()

      setStudents(studentsData.students || [])
      setTeachers(teachersData.teachers || [])
      setRooms(roomsData.rooms || [])
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
      toast.error('Veriler yüklenirken hata oluştu')
    }
  }

  const handleServiceChange = (serviceId: string) => {
    console.log('Seçilen servis ID:', serviceId)
    const selectedService = services.find(s => s.id === serviceId)
    console.log('Bulunan servis:', selectedService)

    setFormData({
      ...formData,
      serviceId,
      packageId: ''
    })

    if (selectedService && selectedService.packages) {
      console.log('Yüklenen paketler:', selectedService.packages)
      setPackages(selectedService.packages)
    } else {
      setPackages([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form verileri:', formData)
    
    const errors = []
    
    if (!formData.studentId) errors.push('Öğrenci')
    if (!formData.teacherId) errors.push('Öğretmen')
    if (!formData.roomId) errors.push('Oda')
    if (!formData.serviceId) errors.push('Hizmet')
    if (!formData.packageId) errors.push('Paket')
    if (!formData.date) errors.push('Tarih')
    if (!formData.startTime) errors.push('Saat')

    console.log('Eksik alanlar:', errors)

    if (errors.length > 0) {
      toast.error(`Lütfen şu alanları doldurunuz: ${errors.join(', ')}`)
      return
    }

    setIsLoading(true)

    try {
      const requestData = {
        studentId: formData.studentId,
        teacherId: formData.teacherId,
        roomId: formData.roomId,
        serviceId: formData.serviceId,
        packageId: formData.packageId,
        date: formData.date,
        startTime: formData.startTime,
        notes: formData.notes || ''
      }

      console.log('API\'ye gönderilecek veri:', requestData)

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = await res.json()
      console.log('API yanıtı:', data)

      if (data.success) {
        toast.success('Program başarıyla eklendi')
        onAppointmentAdded()
        onClose()
      } else {
        toast.error(data.error || 'Program eklenirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Program eklenirken hata:', error)
      toast.error('Program eklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Öğrenci
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
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
            <label className="block text-sm font-medium text-gray-700">
              Öğretmen
            </label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
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
            <label className="block text-sm font-medium text-gray-700">
              Oda
            </label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({...formData, roomId: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seçiniz</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.deviceCount} Cihaz)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hizmet
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => {
                console.log('Seçilen hizmet:', e.target.value)
                handleServiceChange(e.target.value)
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seçiniz</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {packages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Paket
              </label>
              <select
                value={formData.packageId}
                onChange={(e) => {
                  console.log('Seçilen paket:', e.target.value)
                  setFormData({...formData, packageId: e.target.value})
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Seçiniz</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.sessionCount} Seans - {pkg.price}₺
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tarih
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Saat
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Notlar
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
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
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 