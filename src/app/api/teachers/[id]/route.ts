import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { id } = params
    const data = await request.json()

    // Veri validasyonu
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Gerekli alanları doldurun' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const result = await db.collection("teachers").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          phone: data.phone,
          specialties: data.specialties || [],
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Öğretmen bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Öğretmen başarıyla güncellendi'
    })

  } catch (error: any) {
    console.error('Öğretmen güncelleme hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { id } = params
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const result = await db.collection("teachers").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Öğretmen bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Öğretmen başarıyla silindi'
    })

  } catch (error: any) {
    console.error('Öğretmen silme hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 