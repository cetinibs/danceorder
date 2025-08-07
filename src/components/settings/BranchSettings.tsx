'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function BranchSettings() {
  const [settings, setSettings] = useState({
    defaultWorkingHours: {
      start: '09:00',
      end: '22:00'
    },
    maxRoomCapacity: 5,
    allowMultipleBookings: false,
    autoConfirmBookings: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/settings/branch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (!res.ok) throw new Error()
      
      toast.success('Şube ayarları güncellendi')
    } catch (error) {
      toast.error('Şube ayarları güncellenirken hata oluştu')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Çalışma Saati Başlangıcı
          </label>
          <input
            type="time"
            value={settings.defaultWorkingHours.start}
            onChange={(e) => setSettings({
              ...settings,
              defaultWorkingHours: {
                ...settings.defaultWorkingHours,
                start: e.target.value
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Çalışma Saati Bitişi
          </label>
          <input
            type="time"
            value={settings.defaultWorkingHours.end}
            onChange={(e) => setSettings({
              ...settings,
              defaultWorkingHours: {
                ...settings.defaultWorkingHours,
                end: e.target.value
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Kaydet
        </button>
      </div>
    </form>
  )
} 