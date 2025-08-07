import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'teacher'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Veri validasyonu
    if (!data.firstName || !data.lastName || !data.email || !data.phone || 
        !data.emergencyContact.firstName || !data.emergencyContact.lastName || !data.emergencyContact.phone) {
      return NextResponse.json(
        { error: 'Gerekli alanları doldurun' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Öğrenci ID'si oluştur
    const lastStudent = await db.collection("students")
      .findOne({}, { sort: { studentId: -1 } })
    
    const nextId = lastStudent ? parseInt(lastStudent.studentId.slice(3)) + 1 : 1
    const studentId = `STD${nextId.toString().padStart(4, '0')}`

    const student = {
      studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      emergencyContact: {
        firstName: data.emergencyContact.firstName,
        lastName: data.emergencyContact.lastName,
        phone: data.emergencyContact.phone,
        email: data.emergencyContact.email
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("students").insertOne(student)

    return NextResponse.json({
      success: true,
      student: {
        id: result.insertedId,
        ...student
      }
    })

  } catch (error: any) {
    console.error('Öğrenci ekleme hatası:', error)
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

    console.log('Students API: Veritabanı bağlantısı başarılı')

    const students = await db.collection("students")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    console.log(`Students API: ${students.length} öğrenci bulundu`)

    return NextResponse.json({
      success: true,
      students: students.map(student => ({
        id: student._id?.toString() || '',
        studentId: student.studentId || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
        email: student.email || '',
        phone: student.phone || '',
        emergencyContact: student.emergencyContact || {
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        },
        isActive: student.isActive !== false, // Varsayılan true
        createdAt: student.createdAt,
        // Ek alanlar
        packages: student.packages || [],
        remainingHours: student.remainingHours || 0,
        totalPayment: student.totalPayment || 0,
        remainingPayment: student.remainingPayment || 0,
        healthInfo: student.healthInfo || '',
        startDate: student.startDate || student.createdAt
      }))
    })

  } catch (error: any) {
    console.error('Students API hatası:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Öğrenciler yüklenirken hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}