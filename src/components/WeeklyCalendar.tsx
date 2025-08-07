'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { format, startOfWeek, addDays } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import AppointmentModal from './AppointmentModal'

interface Appointment {
  id: string
  studentName: string
  teacherName: string
  teacherColor: string
  roomName: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  notes?: string
}

export default function WeeklyCalendar() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()))
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')

  // Saat aralıkları (09:00 - 22:00)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9
    return `${hour.toString().padStart(2, '0')}:00`
  })

  // Haftanın günleri (Pazartesi - Cumartesi)
  const weekDays = Array.from({ length: 6 }, (_, i) =>
    addDays(currentWeek, i + 1)
  )

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments')
        const data = await res.json()
        if (data.success) {
          setAppointments(data.appointments)
        }
      } catch (error) {
        console.error('Randevular alınırken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [currentWeek])

  const handleCellClick = (day: Date, time: string) => {
    setSelectedDate(day)
    setSelectedTime(time)
    setIsModalOpen(true)
  }

  const handleAppointmentSave = (appointment: Appointment) => {
    setAppointments([...appointments, appointment])
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Takvim başlığı */}
          <div className="grid grid-cols-7 gap-2">
            <div className="w-20"></div>
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className="p-2 text-center font-semibold bg-gray-50"
              >
                {format(day, 'EEEE', { locale: tr })}
                <br />
                {format(day, 'd MMMM', { locale: tr })}
              </div>
            ))}
          </div>

          {/* Saat dilimleri */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-7 gap-2">
              <div className="w-20 p-2 text-right text-sm text-gray-600">
                {time}
              </div>
              {weekDays.map((day) => {
                const dayAppointments = appointments.filter(
                  (apt) =>
                    apt.date === format(day, 'yyyy-MM-dd') &&
                    apt.startTime === time
                )

                return (
                  <div
                    key={day.toString()}
                    onClick={() => handleCellClick(day, time)}
                    className={`p-2 border border-gray-200 min-h-[60px] relative group cursor-pointer
                      ${dayAppointments.length === 0 ? 'hover:bg-gray-50' : ''}
                    `}
                  >
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="text-xs p-1 rounded mb-1"
                        style={{ backgroundColor: apt.teacherColor }}
                      >
                        <div className="font-semibold text-white">
                          {apt.studentName}
                        </div>
                        <div className="text-white/90">{apt.teacherName}</div>
                        <div className="text-white/80 text-[10px]">{apt.roomName}</div>
                      </div>
                    ))}

                    {/* Boş hücrelerde artı işareti */}
                    {dayAppointments.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          time={selectedTime}
          onSave={handleAppointmentSave}
        />
      )}
    </>
  )
} 