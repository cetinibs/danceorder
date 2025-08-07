'use client';

import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

// İkon tipini tanımlayalım
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// MenuItem tipini tanımlayalım
interface MenuItem {
  name: string;
  href: string;
  icon: IconType;
}

// Her bir menü öğesini kontrol ederek oluşturalım
const menuItems: MenuItem[] = [
  {
    name: 'Ana Sayfa',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Şubeler',
    href: '/dashboard/branches',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Öğretmenler',
    href: '/dashboard/teachers',
    icon: UserGroupIcon,
  },
  {
    name: 'Öğrenciler',
    href: '/dashboard/students',
    icon: AcademicCapIcon,
  },
  {
    name: 'Takvim',
    href: '/dashboard/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Ödemeler',
    href: '/dashboard/payments',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Raporlar',
    href: '/dashboard/reports',
    icon: ChartBarIcon,
  },
  {
    name: 'Ayarlar',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
  },
];

// Her bir menü öğesinin icon özelliğinin varlığını kontrol edelim
menuItems.forEach(item => {
  if (!item.icon) {
    console.error(`Menu item "${item.name}" is missing an icon`);
  }
});

export default menuItems; 