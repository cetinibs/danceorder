import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

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

    // Rastgele bir renk kodu oluştur
    const colorCode = '#' + Math.floor(Math.random()*16777215).toString(16)

    const teacher = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      colorCode,
      specialties: data.specialties || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("teachers").insertOne(teacher)

    return NextResponse.json({
      success: true,
      teacher: {
        id: result.insertedId,
        ...teacher
      }
    })

  } catch (error: any) {
    console.error('Öğretmen ekleme hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    console.log('Teachers API: Veritabanı bağlantısı başarılı')

    const teachers = await db.collection("teachers")
      .find({ isActive: { $ne: false } }) // isActive false olmayanları getir
      .sort({ createdAt: -1 })
      .toArray()

    console.log(`Teachers API: ${teachers.length} öğretmen bulundu`)

    return NextResponse.json({
      success: true,
      teachers: teachers.map(teacher => ({
        id: teacher._id?.toString() || '',
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        name: `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim(),
        email: teacher.email || '',
        phone: teacher.phone || '',
        colorCode: teacher.colorCode || '#' + Math.floor(Math.random()*16777215).toString(16),
        color: teacher.color || teacher.colorCode, // Eski alan desteği
        specialties: teacher.specialties || [],
        isActive: teacher.isActive !== false, // Varsayılan true
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
      }))
    })

  } catch (error: any) {
    console.error('Teachers API hatası:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Öğretmenler yüklenirken hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}