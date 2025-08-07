'use client';

import {
  HomeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'Ana Sayfa',
    href: '/dashboard',
    Icon: HomeIcon,
  },
  {
    name: 'Şubeler',
    href: '/dashboard/branches',
    Icon: BuildingOffice2Icon,
  },
  {
    name: 'Öğretmenler',
    href: '/dashboard/teachers',
    Icon: UserGroupIcon,
  },
  {
    name: 'Öğrenciler',
    href: '/dashboard/students',
    Icon: AcademicCapIcon,
  },
  {
    name: 'Takvim',
    href: '/dashboard/calendar',
    Icon: CalendarIcon,
  },
  {
    name: 'Ödemeler',
    href: '/dashboard/payments',
    Icon: BanknotesIcon,
  },
  {
    name: 'Raporlar',
    href: '/dashboard/reports',
    Icon: ChartBarIcon,
  },
  {
    name: 'Ayarlar',
    href: '/dashboard/settings',
    Icon: Cog6ToothIcon,
  },
] as const;

export default menuItems; 