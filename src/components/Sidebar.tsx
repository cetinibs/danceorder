'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  Users,
  BookOpen,
  LogOut,
  Settings,
  Home,
  Briefcase,
  DoorOpen,
  Package,
  Sparkles,
  Music,
  Heart
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Logo from './Logo'

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Admin menü öğeleri - Dans/Bale temalı
  const adminMenuItems = [
    {
      href: '/dashboard',
      label: 'Ana Sayfa',
      icon: Home,
      emoji: '🏠',
      description: 'Genel bakış'
    },
    {
      href: '/dashboard/teachers',
      label: 'Öğretmenler',
      icon: Users,
      emoji: '🎭',
      description: 'Dans eğitmenleri'
    },
    {
      href: '/dashboard/students',
      label: 'Öğrenciler',
      icon: Users,
      emoji: '🩰',
      description: 'Dansçılar'
    },
    {
      href: '/dashboard/services',
      label: 'Kurslar',
      icon: Music,
      emoji: '🎵',
      description: 'Dans türleri'
    },
    {
      href: '/dashboard/rooms',
      label: 'Stüdyolar',
      icon: DoorOpen,
      emoji: '🏛️',
      description: 'Dans salonları'
    },
    {
      href: '/dashboard/packages',
      label: 'Paketler',
      icon: Package,
      emoji: '💎',
      description: 'Kurs paketleri'
    },
    {
      href: '/dashboard/settings',
      label: 'Ayarlar',
      icon: Settings,
      emoji: '⚙️',
      description: 'Sistem ayarları'
    }
  ]

  // Öğretmen menü öğeleri - Dans/Bale temalı
  const teacherMenuItems = [
    {
      href: '/dashboard',
      label: 'Programım',
      icon: Calendar,
      emoji: '📅',
      description: 'Ders takvimi'
    },
    {
      href: '/dashboard/students',
      label: 'Öğrencilerim',
      icon: Users,
      emoji: '🩰',
      description: 'Dansçılarım'
    },
    {
      href: '/dashboard/notes',
      label: 'Notlarım',
      icon: BookOpen,
      emoji: '📝',
      description: 'Ders notları'
    }
  ]

  const menuItems = session?.user?.role === 'teacher' ? teacherMenuItems : adminMenuItems

  return (
    <div className="h-full py-6 scrollbar-elegant overflow-y-auto">
      {/* Hoş Geldin Mesajı */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4 border border-primary-100/50">
          <div className="flex items-center space-x-3">
            <Logo width={40} height={40} />
            <div>
              <p className="text-sm font-medium text-secondary-800">
                Hoş geldin!
              </p>
              <p className="text-xs font-elegant text-primary-600">
                {session?.user?.role === 'admin' ? 'Stüdyo Yöneticisi' : 'Dans Eğitmeni'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasyon Menüsü */}
      <nav className="px-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item group relative ${
                isActive ? 'nav-item-active' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-soft'
                    : 'bg-secondary-100 text-secondary-600 group-hover:bg-primary-100 group-hover:text-primary-600'
                }`}>
                  <span className="text-lg">{item.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-primary-800' : 'text-secondary-700 group-hover:text-primary-700'
                  }`}>
                    {item.label}
                  </p>
                  <p className={`text-xs transition-colors duration-300 ${
                    isActive ? 'text-primary-600' : 'text-secondary-500 group-hover:text-primary-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Aktif gösterge */}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Alt Kısım - Çıkış */}
      <div className="px-4 mt-8 pt-6 border-t border-primary-100/50">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-secondary-600 hover:text-error-600 hover:bg-error-50 rounded-xl transition-all duration-300 group"
        >
          <div className="w-10 h-10 bg-secondary-100 group-hover:bg-error-100 rounded-xl flex items-center justify-center transition-all duration-300">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Çıkış Yap</p>
            <p className="text-xs text-secondary-400">Güvenli çıkış</p>
          </div>
        </button>
      </div>

      {/* Dekoratif Element */}
      <div className="px-6 mt-6">
        <div className="text-center">
          <div className="inline-flex items-center space-x-1 text-primary-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-elegant">Dans ile yaşa</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
} 