'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Logo from '@/components/Logo'
import { signOut } from 'next-auth/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🩰</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="text-sm text-secondary-600 mt-4 font-elegant">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Modern Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-primary-100/50 fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 lg:h-18">
            <div className="flex items-center">
              {/* Mobil Menü Butonu */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="mr-3 p-2 rounded-xl hover:bg-primary-50 transition-colors duration-200 lg:hidden"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6 text-secondary-600" />
                  ) : (
                    <Bars3Icon className="w-6 h-6 text-secondary-600" />
                  )}
                </button>
              )}

              <div className="flex-shrink-0 flex items-center space-x-3">
                <Logo width={40} height={40} />
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-display font-bold text-secondary-800">
                    Dance Order
                  </h1>
                  <p className="text-xs font-elegant text-primary-600">
                    Dans & Bale Akademisi
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Bildirimler */}
              <button className="p-2 rounded-xl hover:bg-primary-50 transition-colors duration-200">
                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M9 11h.01M9 8h.01" />
                </svg>
              </button>

              {/* Kullanıcı Bilgisi */}
              <div className="flex items-center space-x-2 lg:space-x-3 bg-primary-50/50 rounded-xl px-2 lg:px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-secondary-800">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-primary-600">
                    {session.user?.role === 'admin' ? '👑 Yönetici' : '🎭 Öğretmen'}
                  </p>
                </div>
              </div>

              {/* Çıkış */}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                aria-label="Sistemden çıkış yap"
                className="hidden sm:inline-flex px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 lg:pt-18">
        {/* Desktop Sidebar */}
        <div className={`w-64 fixed left-0 h-full bg-white/80 backdrop-blur-md shadow-soft border-r border-primary-100/50 z-30 transition-transform duration-300 ease-in-out ${
          isMobile ? 'hidden' : 'block'
        }`}>
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {isMobile && (
          <>
            <div
              className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className={`w-80 fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md shadow-large border-r border-primary-100/50 z-50 transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="pt-20">
                <Sidebar />
              </div>
            </div>
          </>
        )}

        {/* Ana İçerik Alanı */}
        <div className={`flex-1 ${isMobile ? 'ml-0' : 'ml-64'}`}>
          <main className="p-4 lg:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Dekoratif Arka Plan Elementleri */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary-200/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary-200/10 rounded-full blur-2xl animate-dance"></div>
      </div>
    </div>
  )
} 