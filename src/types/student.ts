export interface Student {
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
  isActive: boolean
  packages: Array<{
    name: string
    remainingHours: number
    totalHours: number
    startDate: Date
    endDate?: Date
  }>
  remainingPayment: number
  totalPayment: number
  createdAt: Date
  updatedAt?: Date
} 