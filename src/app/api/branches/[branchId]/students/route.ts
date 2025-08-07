import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { branchId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    const data = await request.json()
    const { branchId } = params

    // Veri validasyonu
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Gerekli alanları doldurun' },
        { status: 400 }
      )
    }

    // Öğrenci ID'si oluştur
    const studentId = `ST${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase()

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // E-posta kontrolü
    const existingStudent = await db.collection("students").findOne({
      email: data.email,
      branchId: new ObjectId(branchId)
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi ile kayıtlı öğrenci bulunmaktadır' },
        { status: 400 }
      )
    }

    // Yeni öğrenci objesi
    const newStudent = {
      _id: new ObjectId(),
      studentId,
      branchId: new ObjectId(branchId),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      emergencyContact: {
        firstName: data.emergencyContactFirstName?.trim(),
        lastName: data.emergencyContactLastName?.trim(),
        phone: data.emergencyContactPhone?.trim(),
        email: data.emergencyContactEmail?.toLowerCase().trim()
      },
      healthInfo: {
        notes: data.healthInfo?.trim() || '',
        measurements: []
      },
      packages: [],
      payments: [],
      startDate: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Öğrenciyi ekle
    const result = await db.collection("students").insertOne(newStudent)

    if (!result.insertedId) {
      throw new Error('Öğrenci eklenemedi')
    }

    // Şubeye öğrenci referansı ekle
    await db.collection("branches").updateOne(
      { _id: new ObjectId(branchId) },
      { $push: { studentIds: result.insertedId } }
    )

    return NextResponse.json({
      success: true,
      student: {
        id: result.insertedId,
        ...newStudent
      }
    })

  } catch (error: any) {
    console.error('Öğrenci ekleme hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Öğrenci eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Şubenin öğrencilerini getir
export async function GET(
  request: Request,
  { params }: { params: { branchId: string } }
) {
  try {
    const { branchId } = params
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const students = await db.collection("students")
      .find({ branchId: new ObjectId(branchId) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      students: students.map(student => ({
        id: student._id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        isActive: student.isActive
      }))
    })

  } catch (error: any) {
    console.error('Öğrenci listesi hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Öğrenciler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 