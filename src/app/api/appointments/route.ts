import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    // Sadece öğretmen ve admin program ekleyebilir
    if (!['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const data = await request.json()
    console.log('Gelen veri:', data) // Debug için

    // Zorunlu alanları kontrol et
    const requiredFields = [
      'studentId',
      'teacherId',
      'roomId',
      'serviceId',
      'packageId',
      'date',
      'startTime'
    ]

    const missingFields = requiredFields.filter(field => !data[field])

    if (missingFields.length > 0) {
      console.log('Eksik alanlar:', missingFields) // Debug için
      return NextResponse.json(
        { error: `Şu alanlar eksik: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // ObjectId dönüşümlerini yap
    const appointment = {
      studentId: new ObjectId(data.studentId),
      teacherId: new ObjectId(data.teacherId),
      roomId: new ObjectId(data.roomId),
      serviceId: data.serviceId,
      packageId: data.packageId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime || addHourToTime(data.startTime, 1),
      notes: data.notes || '',
      isActive: true,
      createdAt: new Date()
    }

    // Çakışma kontrolü
    const existingAppointment = await db.collection("appointments").findOne({
      roomId: appointment.roomId,
      date: appointment.date,
      startTime: appointment.startTime,
      isActive: true
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Bu saat için seçili odada başka bir randevu var' },
        { status: 400 }
      )
    }

    // Randevuyu kaydet
    const result = await db.collection("appointments").insertOne(appointment)

    return NextResponse.json({
      success: true,
      appointment: {
        id: result.insertedId,
        ...appointment
      }
    })

  } catch (error: any) {
    console.error('Randevu eklenirken hata:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    // Sadece öğretmen ve admin program güncelleyebilir
    if (!['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const updateData = {
      ...data,
      updatedAt: new Date()
    }

    if (data.studentId) updateData.studentId = new ObjectId(data.studentId)
    if (data.teacherId) updateData.teacherId = new ObjectId(data.teacherId)
    if (data.roomId) updateData.roomId = new ObjectId(data.roomId)
    if (data.date) updateData.date = new Date(data.date)

    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Randevu bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Randevu güncellendi'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Randevu bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Randevu silindi'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

function addHourToTime(time: string, hours: number): string {
  const [hour, minute] = time.split(':').map(Number)
  const newHour = (hour + hours) % 24
  return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Tüm aktif randevuları getir (hem öğretmen hem admin için)
    const appointments = await db.collection("appointments")
      .aggregate([
        {
          $match: { isActive: true }
        },
        {
          $lookup: {
            from: "teachers",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher"
          }
        },
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "_id",
            as: "student"
          }
        },
        {
          $unwind: "$teacher"
        },
        {
          $unwind: "$student"
        },
        {
          $project: {
            id: { $toString: "$_id" },
            studentName: "$student.name",
            teacherName: "$teacher.name",
            teacherColor: "$teacher.color",
            roomName: 1,
            serviceName: 1,
            date: 1,
            startTime: 1,
            endTime: 1,
            notes: 1
          }
        }
      ]).toArray()

    return NextResponse.json({
      success: true,
      appointments
    })

  } catch (error) {
    console.error('Randevular alınırken hata:', error)
    return NextResponse.json(
      { error: 'Randevular alınamadı' },
      { status: 500 }
    )
  }
} 