import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const admin = await db.collection("admins").findOne({})

    return NextResponse.json({
      exists: !!admin,
      admin: admin ? {
        username: admin.username,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt
      } : null
    })

  } catch (error) {
    console.error('Admin kontrol hatası:', error)
    return NextResponse.json(
      { error: 'Admin kontrolü sırasında hata oluştu' },
      { status: 500 }
    )
  }
} 