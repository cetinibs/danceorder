'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Giriş başarılı')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Giriş hatası:', error)
      toast.error('Giriş yapılırken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Arka Plan Dekoratif Elementler */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/20 rounded-full blur-3xl animate-dance"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo ve Başlık */}
        <div className="text-center animate-graceful">
          <div className="mx-auto w-28 h-28 rounded-full overflow-hidden flex items-center justify-center mb-6 shadow-large">
            <Image src="/dance-order-logo.jpeg" alt="Dance Order" width={112} height={112} priority />
          </div>
          <h2 className="text-4xl font-display font-bold text-secondary-800 mb-2">
            Dance Order
          </h2>
          <p className="text-lg font-elegant text-primary-600">
            Dans ve Bale Dünyasına Hoş Geldiniz
          </p>
        </div>

        {/* Login Form */}
        <div className="card-dance p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  E-posta Adresiniz
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-elegant"
                  placeholder="ornek@email.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                  Şifreniz
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-elegant"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş yapılıyor...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🩰</span>
                      Stüdyoya Giriş Yap
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Ek Bilgiler */}
            <div className="text-center pt-6">
              <p className="text-sm text-secondary-500">
                Hesabınız yok mu?
                <span className="font-medium text-primary-600 hover:text-primary-700 cursor-pointer ml-1">
                  Kayıt olun
                </span>
              </p>
            </div>
          </form>
        </div>

        {/* Alt Bilgi */}
        <div className="text-center animate-fade-in">
          <p className="text-xs text-secondary-400 font-elegant">
            "Dans, ruhun ayaklar aracılığıyla konuşmasıdır"
          </p>
        </div>
      </div>
    </div>
  )
} 