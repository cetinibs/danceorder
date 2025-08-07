import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import clientPromise from '@/lib/mongodb'

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Mevcut admin koleksiyonunu temizle
    await db.collection("admins").deleteMany({})

    // Yeni admin bilgileri
    const defaultAdmin = {
      username: 'admin',
      password: await hash('admin123', 12),
      name: 'Admin',
      role: 'admin',
      isActive: true,
      createdAt: new Date()
    }

    // Admin kullanıcısını ekle
    const result = await db.collection("admins").insertOne(defaultAdmin)

    if (!result.insertedId) {
      throw new Error('Admin kullanıcısı eklenemedi')
    }

    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcısı başarıyla oluşturuldu',
      admin: {
        id: result.insertedId,
        username: defaultAdmin.username,
        name: defaultAdmin.name,
        role: defaultAdmin.role
      }
    })

  } catch (error) {
    console.error('Admin oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Admin oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
} 