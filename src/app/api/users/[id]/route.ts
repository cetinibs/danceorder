import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 })
    }

    const body = await request.json()
    const { isActive } = body
    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Geçersiz isActive' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('pilatesstudio')
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Users PATCH error:', error)
    return NextResponse.json({ error: error.message || 'Kullanıcı güncellenemedi' }, { status: 500 })
  }
}


