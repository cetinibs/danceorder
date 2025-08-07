'use client'

import { useState, useEffect } from 'react'

interface Room {
  id: string
  name: string
  capacity: number
  deviceCount: number
  isActive: boolean
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/rooms')
        const data = await res.json()
        if (data.success) {
          setRooms(data.rooms)
        }
      } catch (error) {
        console.error('Odalar alınırken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Odalar</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Oda Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
            <div className="space-y-2 text-gray-600">
              <p>Kapasite: {room.capacity} kişi</p>
              <p>Cihaz Sayısı: {room.deviceCount}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="text-indigo-600 hover:text-indigo-800">
                Düzenle
              </button>
              <button className="text-red-600 hover:text-red-800">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 