export type PackageType = 'individual' | 'duet' | 'group'

export interface Package {
  id: string
  serviceId: string
  type: PackageType
  name: string
  hours?: number
  maxStudents: number
  minStudents?: number
  price: number
  isActive: boolean
  details?: string
  createdAt: Date
  updatedAt?: Date
}

export interface Service {
  id: string
  name: string
  type: string
  packages: Package[]
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
} 