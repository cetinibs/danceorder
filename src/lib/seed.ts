import dbConnect from './dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Veritabanına bağlanılıyor...');
    await dbConnect();

    // Mevcut yöneticiyi kontrol et
    const existingAdmin = await User.findOne({ email: 'cetinkaya.pc@gmail.com' });
    if (existingAdmin) {
      console.log('Yönetici zaten mevcut, şifre güncelleniyor...');
      
      // Şifreyi güncelle
      const hashedPassword = await bcrypt.hash('Annyeon1903', 12);
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      
      console.log('Şifre güncellendi');
      return;
    }

    console.log('Yeni yönetici oluşturuluyor...');
    
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash('Annyeon1903', 12);

    // Yönetici kullanıcısını oluştur
    const admin = await User.create({
      email: 'cetinkaya.pc@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      isActive: true,
    });

    console.log('Yönetici başarıyla oluşturuldu:', admin);
  } catch (error) {
    console.error('Seed hatası:', error);
  } finally {
    process.exit();
  }
}

seed(); 