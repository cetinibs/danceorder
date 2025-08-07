'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const serviceMenuItems = [
  { 
    name: 'Pilates', 
    href: '/dashboard/services/pilates',
    packages: ['Bireysel 8-12-16 Saat', 'Düet 8-12-16 Saat', 'Grup 8-12-16 Saat']
  },
  { 
    name: 'Fizyoterapi', 
    href: '/dashboard/services/physiotherapy',
    packages: ['Skolyoz', 'Manuel Terapi', 'Pelvik Taban', 'FTR']
  },
  { 
    name: 'Klinik Pilates', 
    href: '/dashboard/services/clinical-pilates',
    packages: ['Bireysel 8-12-16 Saat', 'Düet 8-12-16 Saat', 'Grup 8-12-16 Saat']
  },
  { 
    name: 'Zumba', 
    href: '/dashboard/services/zumba',
    packages: ['Grup (4-6 Kişi)']
  },
  { 
    name: 'Yoga', 
    href: '/dashboard/services/yoga',
    packages: ['Bireysel', 'Grup (4-6 Kişi)']
  },
  { 
    name: 'Hamak Yoga', 
    href: '/dashboard/services/aerial-yoga',
    packages: ['Bireysel', 'Grup (4-6 Kişi)']
  }
]

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* Sol Menü */}
      <div className="w-64 bg-white border-r">
        <nav className="p-4">
          <div className="mb-4">
            <Link 
              href="/dashboard/services"
              className={`block px-4 py-2 rounded-md ${
                pathname === '/dashboard/services' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tüm Hizmetler
            </Link>
          </div>
          
          <div className="space-y-1">
            {serviceMenuItems.map((item) => (
              <div key={item.href} className="mb-4">
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded-md ${
                    pathname === item.href
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
                {/* Alt paketler */}
                <div className="ml-4 mt-1 space-y-1">
                  {item.packages.map((pkg, index) => (
                    <div 
                      key={index}
                      className="text-sm text-gray-600 px-4 py-1"
                    >
                      • {pkg}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
} 