export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  managerName: string
  isActive: boolean
  rooms: Array<{
    id: string
    name: string
    capacity: number
    deviceCount: number
    isActive: boolean
  }>
  teachers: Array<{
    id: string
    name: string
    email: string
    phone: string
    color: string
    specialties: string[]
    isActive: boolean
  }>
  students: Array<{
    id: string
    name: string
    email: string
    phone: string
    emergencyContact: {
      name: string
      phone: string
    }
    healthInfo: string
    startDate: Date
    endDate?: Date
    isActive: boolean
    packages: Array<{
      name: string
      remainingHours: number
      totalHours: number
      startDate: Date
      endDate?: Date
      price: number
      teacherId: string
    }>
  }>
  schedule: Array<{
    id: string
    studentId: string
    teacherId: string
    roomId: string
    packageId: string
    date: Date
    startTime: string
    endTime: string
    status: 'scheduled' | 'completed' | 'cancelled'
    notes?: string
  }>
  finances: {
    income: Array<{
      id: string
      date: Date
      amount: number
      type: 'package_payment' | 'other'
      description: string
      studentId?: string
      packageId?: string
    }>
    expenses: Array<{
      id: string
      date: Date
      amount: number
      type: 'salary' | 'rent' | 'utility' | 'equipment' | 'other'
      description: string
      teacherId?: string
    }>
  }
  createdAt: Date
  updatedAt?: Date
} 