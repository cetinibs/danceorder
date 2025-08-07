import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Tüm kullanıcıları sil
    await db.collection("users").deleteMany({})

    // Yeni admin şifresi
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Yeni admin kullanıcısı oluştur
    const adminUser = {
      email: "admin@pilatesstudio.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("users").insertOne(adminUser)

    if (!result.insertedId) {
      throw new Error('Admin kullanıcısı oluşturulamadı')
    }

    // Oluşturulan kullanıcıyı kontrol et
    const createdUser = await db.collection("users").findOne({ 
      _id: result.insertedId 
    })

    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcısı başarıyla sıfırlandı',
      user: {
        id: createdUser._id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        hasPassword: !!createdUser.password
      }
    })

  } catch (error: any) {
    console.error('Reset hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 