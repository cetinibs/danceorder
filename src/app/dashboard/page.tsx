'use client'

import { useSession } from 'next-auth/react'
import WeeklyCalendar from '@/components/WeeklyCalendar'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8 animate-graceful">
      {/* Hoş Geldin Kartı */}
      <div className="card-dance p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 rounded-2xl flex items-center justify-center shadow-large">
            <span className="text-2xl lg:text-3xl">
              {session?.user?.role === 'admin' ? '👑' : '🎭'}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl lg:text-3xl font-display font-bold text-secondary-800 mb-2">
              Hoş Geldiniz, {session?.user?.name}! 🌟
            </h1>
            <p className="text-sm lg:text-lg text-primary-600 font-elegant">
              {session?.user?.role === 'admin'
                ? 'Stüdyo yönetim panelinize hoş geldiniz'
                : 'Dans eğitmenliği panelinize hoş geldiniz'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-secondary-600">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
                <span>Aktif</span>
              </div>
              <div className="text-sm text-secondary-500">
                Son giriş: Bugün
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin için özet bilgiler */}
      {session?.user?.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="card-elegant p-4 lg:p-6 group hover:shadow-large transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg lg:text-xl">🩰</span>
              </div>
              <div className="text-right">
                <p className="text-xl lg:text-2xl font-bold text-secondary-800">156</p>
                <p className="text-xs text-primary-600">+12 bu ay</p>
              </div>
            </div>
            <h3 className="font-display font-semibold text-secondary-700 mb-2 text-sm lg:text-base">Aktif Dansçılar</h3>
            <p className="text-xs lg:text-sm text-secondary-500">Kayıtlı öğrenci sayısı</p>
            <div className="mt-4 bg-primary-50 rounded-lg p-2">
              <div className="flex justify-between text-xs text-primary-700">
                <span>Bale: 45</span>
                <span>Tango: 32</span>
                <span>Modern: 79</span>
              </div>
            </div>
          </div>

          <div className="card-elegant p-6 group hover:shadow-large transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">🎭</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary-800">12</p>
                <p className="text-xs text-secondary-600">Uzman eğitmen</p>
              </div>
            </div>
            <h3 className="font-display font-semibold text-secondary-700 mb-2">Dans Eğitmenleri</h3>
            <p className="text-sm text-secondary-500">Aktif öğretmen kadrosu</p>
            <div className="mt-4 bg-secondary-50 rounded-lg p-2">
              <div className="flex justify-between text-xs text-secondary-700">
                <span>Bale: 4</span>
                <span>Tango: 3</span>
                <span>Modern: 5</span>
              </div>
            </div>
          </div>

          <div className="card-elegant p-6 group hover:shadow-large transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-elegant-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">🎵</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary-800">24</p>
                <p className="text-xs text-accent-600">Bugün</p>
              </div>
            </div>
            <h3 className="font-display font-semibold text-secondary-700 mb-2">Günlük Dersler</h3>
            <p className="text-sm text-secondary-500">Bugünkü ders programı</p>
            <div className="mt-4 bg-accent-50 rounded-lg p-2">
              <div className="flex justify-between text-xs text-accent-700">
                <span>Sabah: 8</span>
                <span>Öğlen: 10</span>
                <span>Akşam: 6</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Takvim */}
      <div className="card-dance p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-secondary-800">
              Haftalık Program 📅
            </h2>
            <p className="text-secondary-600 font-elegant">
              Dans derslerinizi takip edin
            </p>
          </div>
          <button className="btn-primary">
            Yeni Ders Ekle
          </button>
        </div>
        <WeeklyCalendar />
      </div>

      {/* Hızlı Eylemler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="card-elegant p-4 text-center group hover:shadow-medium transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl">➕</span>
          </div>
          <p className="text-sm font-medium text-secondary-700">Yeni Öğrenci</p>
        </button>

        <button className="card-elegant p-4 text-center group hover:shadow-medium transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl">📋</span>
          </div>
          <p className="text-sm font-medium text-secondary-700">Ders Planı</p>
        </button>

        <button className="card-elegant p-4 text-center group hover:shadow-medium transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl">💰</span>
          </div>
          <p className="text-sm font-medium text-secondary-700">Ödemeler</p>
        </button>

        <button className="card-elegant p-4 text-center group hover:shadow-medium transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-elegant-400 to-elegant-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="text-xl">📊</span>
          </div>
          <p className="text-sm font-medium text-secondary-700">Raporlar</p>
        </button>
      </div>
    </div>
  )
} 