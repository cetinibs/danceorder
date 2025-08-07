import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
} 