import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { date, startTime } = await request.json()

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Çakışma kontrolü
    const existingAppointment = await db.collection("appointments").findOne({
      _id: { $ne: new ObjectId(id) },
      date: new Date(date),
      startTime,
      isActive: true
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Bu saat için başka bir randevu var' },
        { status: 400 }
      )
    }

    // Randevuyu güncelle
    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          date: new Date(date),
          startTime,
          endTime: addHourToTime(startTime, 1),
          updatedAt: new Date()
        }
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Randevu bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Randevu güncellenirken hata:', error)
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