'use client'

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, PushPinIcon } from '@heroicons/react/24/outline';
import menuItems from '@/config/menuItems';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsPinned(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobil menü butonu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Yan menü */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'w-64' : 'w-64'}
          ${!isMobile && !isPinned ? 'lg:hover:translate-x-0 lg:-translate-x-56' : ''}
        `}
      >
        {/* Logo ve Sabitleme Butonu */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/dashboard" className="text-xl font-bold text-purple-600">
            Pilates Studio
          </Link>
          {!isMobile && (
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors
                ${isPinned ? 'text-purple-600' : 'text-gray-400'}
              `}
              title={isPinned ? 'Menüyü Çöz' : 'Menüyü Sabitle'}
            >
              <PushPinIcon className={`h-5 w-5 transform ${isPinned ? 'rotate-45' : ''}`} />
            </button>
          )}
        </div>

        {/* Menü öğeleri */}
        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const IconComponent = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors
                  ${pathname === item.href
                    ? 'bg-purple-100 text-purple-900'
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <IconComponent className="h-5 w-5 mr-3" aria-hidden="true" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Ana içerik */}
      <main
        className={`transition-all duration-300 ease-in-out
          ${isSidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-8'}
          ${isMobile ? 'ml-0' : ''}
        `}
      >
        <div className="p-8">{children}</div>
      </main>

      {/* Mobil karartma overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 