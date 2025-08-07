'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function BackupSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '00:00',
    retentionDays: 30
  })

  const handleBackupNow = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/backup/create', { method: 'POST' })
      if (!res.ok) throw new Error()
      toast.success('Yedekleme başlatıldı')
    } catch (error) {
      toast.error('Yedekleme başlatılırken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/settings/backup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (!res.ok) throw new Error()
      
      toast.success('Yedekleme ayarları güncellendi')
    } catch (error) {
      toast.error('Yedekleme ayarları güncellenirken hata oluştu')
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Otomatik Yedekleme
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="daily">Günlük</option>
              <option value="weekly">Haftalık</option>
              <option value="monthly">Aylık</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Yedekleme Saati
            </label>
            <input
              type="time"
              value={settings.backupTime}
              onChange={(e) => setSettings({ ...settings, backupTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleBackupNow}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Yedekleniyor...' : 'Şimdi Yedekle'}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  )
} 