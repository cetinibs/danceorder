import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  return NextResponse.json({ message: 'Setup API is working' });
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("pilatesstudio");

    // Mevcut admin kontrolü
    const existingAdmin = await db.collection("users").findOne({ 
      email: "admin@pilatesstudio.com" 
    });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin kullanıcısı zaten mevcut',
        user: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role
        }
      });
    }

    // Yeni admin oluştur
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = {
      email: "admin@pilatesstudio.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("users").insertOne(adminUser);

    if (!result.insertedId) {
      throw new Error('Admin kullanıcısı oluşturulamadı');
    }

    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcısı başarıyla oluşturuldu',
      user: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 