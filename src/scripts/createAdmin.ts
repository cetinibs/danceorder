import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pilatesstudio';

async function createAdmin() {
  try {
    console.log('MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut admin kullanıcısını kontrol et
    const existingAdmin = await User.findOne({ email: 'admin@pilatesstudio.com' });
    
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut. E-posta:', existingAdmin.email);
      return;
    }

    // Şifreyi hashle
    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Admin kullanıcısını oluştur
    const admin = await User.create({
      email: 'admin@pilatesstudio.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      isActive: true
    });

    console.log('Admin kullanıcısı başarıyla oluşturuldu:');
    console.log('E-posta:', admin.email);
    console.log('Şifre:', password); // Sadece ilk oluşturulduğunda göster
    console.log('Rol:', admin.role);

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
}

createAdmin(); 