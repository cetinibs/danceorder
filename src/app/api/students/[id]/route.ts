import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Student from '@/models/Student'
import { isValidObjectId } from 'mongoose'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      )
    }

    // ID kontrolü
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Geçersiz öğrenci ID' },
        { status: 400 }
      )
    }

    await dbConnect()

    const body = await request.json()

    // Öğrenci var mı kontrolü
    const existingStudent = await Student.findById(params.id)
    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Öğrenci bulunamadı' },
        { status: 404 }
      )
    }

    // Güncelleme işlemi
    const updatedStudent = await Student.findByIdAndUpdate(
      params.id,
      { 
        $set: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          email: body.email,
          emergencyContact: {
            firstName: body.emergencyContact?.firstName || '',
            lastName: body.emergencyContact?.lastName || '',
            phone: body.emergencyContact?.phone || '',
            email: body.emergencyContact?.email || ''
          },
          healthInfo: {
            status: typeof body.healthInfo === 'string' ? body.healthInfo : body.healthInfo?.status || 'Sağlıklı',
            conditions: Array.isArray(body.healthInfo?.conditions) ? body.healthInfo.conditions : [],
            notes: body.healthInfo?.notes || '',
            bodyFatMeasurements: Array.isArray(body.healthInfo?.bodyFatMeasurements) 
              ? body.healthInfo.bodyFatMeasurements 
              : []
          },
          packages: Array.isArray(body.packages) ? body.packages : [],
          isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      student: updatedStudent
    })

  } catch (error: any) {
    console.error('Öğrenci güncelleme hatası:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Öğrenci güncellenirken bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
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
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      )
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: 'Geçersiz öğrenci ID' },
        { status: 400 }
      )
    }

    await dbConnect()

    const student = await Student.findById(params.id)
    if (!student) {
      return NextResponse.json(
        { error: 'Öğrenci bulunamadı' },
        { status: 404 }
      )
    }

    await Student.findByIdAndUpdate(params.id, {
      isActive: false,
      deactivatedAt: new Date()
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Öğrenci silme hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Öğrenci silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 