'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type GeneralSettingsState = {
  companyName: string
  address: string
  phone: string
  email: string
  taxNumber: string
  currency: string
  timezone: string
  language: string
}

const defaultSettings: GeneralSettingsState = {
  companyName: '',
  address: '',
  phone: '',
  email: '',
  taxNumber: '',
  currency: 'TRY',
  timezone: 'Europe/Istanbul',
  language: 'tr',
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsState>(defaultSettings)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings/general', { cache: 'no-store' })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Ayarlar alınamadı' }))
          throw new Error(err.error || 'Ayarlar alınamadı')
        }
        const data = await res.json()
        if (data?.success && data?.settings) {
          const s = data.settings
          setSettings({
            companyName: s.companyName ?? '',
            address: s.address ?? '',
            phone: s.phone ?? '',
            email: s.email ?? '',
            taxNumber: s.taxNumber ?? '',
            currency: s.currency ?? 'TRY',
            timezone: s.timezone ?? 'Europe/Istanbul',
            language: s.language ?? 'tr',
          })
        }
      } catch (error) {
        // İlk yüklemede boş bırak, sadece logla
        console.warn('Genel ayarlar yüklenemedi')
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Ayarlar güncellenemedi' }))
        throw new Error(err.error || 'Ayarlar güncellenemedi')
      }

      const data = await res.json()
      if (data?.success && data?.settings) {
        const s = data.settings
        setSettings({
          companyName: s.companyName ?? '',
          address: s.address ?? '',
          phone: s.phone ?? '',
          email: s.email ?? '',
          taxNumber: s.taxNumber ?? '',
          currency: s.currency ?? 'TRY',
          timezone: s.timezone ?? 'Europe/Istanbul',
          language: s.language ?? 'tr',
        })
      }

      toast.success('Ayarlar güncellendi')
    } catch (error) {
      toast.error('Ayarlar güncellenirken hata oluştu')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Şirket Adı
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vergi Numarası
          </label>
          <input
            type="text"
            value={settings.taxNumber}
            onChange={(e) => setSettings({ ...settings, taxNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Diğer alanlar örnek */}
        <div>
          <label className="block text-sm font-medium text-gray-700">E-posta</label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefon</label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
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