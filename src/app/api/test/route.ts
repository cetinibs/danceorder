import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Koleksiyonu temizle
    await db.collection("users").deleteMany({})
    console.log('Koleksiyon temizlendi')

    // Test şifresi
    const plainPassword = 'test123'
    const hashedPassword = await bcrypt.hash(plainPassword, 12)
    console.log('Şifre hashlendi')

    // Test kullanıcısı
    const testUser = {
      email: "test@test.com",
      password: hashedPassword,
      name: "Test User",
      role: "admin",
      isActive: true,
      createdAt: new Date()
    }

    // Kullanıcıyı ekle
    await db.collection("users").insertOne(testUser)
    console.log('Kullanıcı oluşturuldu')

    return NextResponse.json({ 
      success: true,
      message: 'Test kullanıcısı oluşturuldu',
      loginCredentials: {
        email: "test@test.com",
        password: "test123"
      }
    })

  } catch (error: any) {
    console.error('Hata:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 