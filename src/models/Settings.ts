import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['general', 'branch', 'notification', 'backup']
  },
  companyName: String,
  address: String,
  phone: String,
  email: String,
  taxNumber: String,
  currency: {
    type: String,
    default: 'TRY'
  },
  timezone: {
    type: String,
    default: 'Europe/Istanbul'
  },
  language: {
    type: String,
    default: 'tr'
  },
  // Branch ayarları
  defaultWorkingHours: {
    start: String,
    end: String
  },
  maxRoomCapacity: Number,
  // Bildirim ayarları
  emailNotifications: Boolean,
  paymentReminders: Boolean,
  lessonReminders: Boolean,
  // Yedekleme ayarları
  autoBackup: Boolean,
  backupFrequency: String,
  backupTime: String,
  retentionDays: Number,
  // Genel alanlar
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: Date
})

// Benzersiz type alanı için index
settingsSchema.index({ type: 1 }, { unique: true })

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema) 