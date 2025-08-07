'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GeneralSettings from '@/components/settings/GeneralSettings'
import BranchSettings from '@/components/settings/BranchSettings'
import UserSettings from '@/components/settings/UserSettings'
import NotificationSettings from '@/components/settings/NotificationSettings'
import BackupSettings from '@/components/settings/BackupSettings'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Ayarlar</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="branch">Şube</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="backup">Yedekleme</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="branch">
          <BranchSettings />
        </TabsContent>

        <TabsContent value="users">
          <UserSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="backup">
          <BackupSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
} 