import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db('pilatesstudio')

    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      users: users.map(u => ({
        id: u._id?.toString() || '',
        name: u.name || '',
        email: u.email || '',
        role: u.role || 'teacher',
        isActive: u.isActive !== false,
      }))
    })
  } catch (error: any) {
    console.error('Users GET error:', error)
    return NextResponse.json({ error: error.message || 'Kullanıcılar alınamadı' }, { status: 500 })
  }
}


