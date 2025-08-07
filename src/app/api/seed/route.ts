import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Bu endpoint sadece geliştirme ortamında kullanılabilir' },
      { status: 403 }
    );
  }

  try {
    await dbConnect();

    // Mevcut yöneticiyi kontrol et
    const existingAdmin = await User.findOne({ email: 'cetinkaya.pc@gmail.com' });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Yönetici zaten mevcut' },
        { status: 200 }
      );
    }

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

    return NextResponse.json(
      { message: 'Yönetici başarıyla oluşturuldu', admin },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 