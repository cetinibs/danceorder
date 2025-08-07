import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Şube adı gerekli'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Adres gerekli'],
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası gerekli'],
  },
  email: {
    type: String,
    required: [true, 'E-posta adresi gerekli'],
    unique: true,
    lowercase: true,
  },
  managerName: {
    type: String,
    required: [true, 'Yönetici adı gerekli'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Güncelleme tarihini otomatik güncelle
branchSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Branch = mongoose.models.Branch || mongoose.model('Branch', branchSchema);
export default Branch; 