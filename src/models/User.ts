import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-posta gerekli'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Şifre gerekli'],
  },
  name: {
    type: String,
    required: [true, 'İsim gerekli'],
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User; 