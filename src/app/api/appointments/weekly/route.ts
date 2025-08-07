import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { startOfWeek, endOfWeek } from 'date-fns'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    const weekStart = startOfWeek(date, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const appointments = await db.collection("appointments")
      .aggregate([
        {
          $match: {
            date: {
              $gte: weekStart,
              $lte: weekEnd
            }
          }
        },
        {
          $lookup: {
            from: "users",
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
          $lookup: {
            from: "rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "room"
          }
        },
        {
          $project: {
            id: "$_id",
            date: 1,
            startTime: 1,
            endTime: 1,
            serviceType: 1,
            studentName: { $arrayElemAt: ["$student.name", 0] },
            teacherName: { $arrayElemAt: ["$teacher.name", 0] },
            teacherColor: { $arrayElemAt: ["$teacher.colorCode", 0] },
            roomName: { $arrayElemAt: ["$room.name", 0] }
          }
        }
      ])
      .toArray()

    return NextResponse.json({
      success: true,
      appointments
    })

  } catch (error: any) {
    console.error('Randevu listesi hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 