export interface Package {
  _id?: string;
  name: string;
  serviceId: string;
  type: 'individual' | 'duet' | 'group';
  hours: number;
  price: number;
  maxCapacity: number;
  minCapacity: number;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PackageFormData {
  name: string;
  serviceId: string;
  type: 'individual' | 'duet' | 'group';
  hours: number;
  price: number;
  maxCapacity: number;
  minCapacity: number;
  description?: string;
} 