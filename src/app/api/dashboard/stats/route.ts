import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Aktif öğrenci sayısı
    const activeStudents = await db.collection("students")
      .countDocuments({ isActive: true })

    // Aktif öğretmen sayısı
    const activeTeachers = await db.collection("teachers")
      .countDocuments({ isActive: true })

    // Toplam oda sayısı
    const totalRooms = await db.collection("rooms")
      .countDocuments()

    // Bu ayki gelir
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyRevenue = await db.collection("payments")
      .aggregate([
        {
          $match: {
            date: { $gte: startOfMonth },
            status: "completed"
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]).toArray()

    // Bekleyen ödemeler
    const pendingPayments = await db.collection("payments")
      .aggregate([
        {
          $match: {
            status: "pending"
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]).toArray()

    // Bu ayki toplam ders sayısı
    const totalLessonsThisMonth = await db.collection("appointments")
      .countDocuments({
        date: { $gte: startOfMonth },
        isActive: true
      })

    // Yaklaşan ödemeler
    const upcomingPayments = await db.collection("payments")
      .aggregate([
        {
          $match: {
            status: "pending",
            dueDate: {
              $gte: new Date(),
              $lte: new Date(new Date().setDate(new Date().getDate() + 7)) // Gelecek 7 gün
            }
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
            from: "packages",
            localField: "packageId",
            foreignField: "_id",
            as: "package"
          }
        },
        {
          $unwind: "$student"
        },
        {
          $unwind: "$package"
        },
        {
          $project: {
            studentName: "$student.name",
            packageName: "$package.name",
            dueDate: 1,
            amount: 1,
            status: 1
          }
        }
      ]).toArray()

    // Oda doluluk oranları
    const roomOccupancy = await db.collection("rooms")
      .aggregate([
        {
          $lookup: {
            from: "appointments",
            localField: "_id",
            foreignField: "roomId",
            as: "appointments"
          }
        },
        {
          $project: {
            name: 1,
            totalSlots: { $size: "$appointments" },
            maxCapacity: "$capacity",
            occupancyRate: {
              $multiply: [
                { $divide: [{ $size: "$appointments" }, "$capacity"] },
                100
              ]
            }
          }
        }
      ]).toArray()

    return NextResponse.json({
      success: true,
      stats: {
        activeStudents,
        activeTeachers,
        totalRooms,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingPayments: pendingPayments[0]?.total || 0,
        totalLessonsThisMonth,
        upcomingPayments,
        roomOccupancy
      }
    })

  } catch (error) {
    console.error('İstatistikler alınırken hata:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
} 