'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    paymentReminders: true,
    lessonReminders: true,
    studentBirthdays: true,
    lowPackageHours: true,
    systemUpdates: true
  })

  const handleChange = async (key: string, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)

      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })

      if (!res.ok) {
        throw new Error('Ayarlar güncellenirken hata oluştu')
      }

      toast.success('Bildirim ayarları güncellendi')
    } catch (error) {
      toast.error('Bildirim ayarları güncellenirken hata oluştu')
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">E-posta Bildirimleri</h3>
            <p className="text-sm text-gray-500">Sistem bildirimleri için e-posta gönder</p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Ödeme Hatırlatıcıları</h3>
            <p className="text-sm text-gray-500">Yaklaşan ödemeler için hatırlatma gönder</p>
          </div>
          <Switch
            checked={settings.paymentReminders}
            onCheckedChange={(checked) => handleChange('paymentReminders', checked)}
          />
        </div>

        {/* Diğer bildirim ayarları... */}
      </div>
    </div>
  )
} 