import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")
    
    const rooms = await db.collection("rooms")
      .find({})
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      rooms: rooms.map(room => ({
        id: room._id,
        name: room.name,
        capacity: room.capacity,
        deviceCount: room.deviceCount,
        isActive: room.isActive
      }))
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    if (!data.name || !data.capacity) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const room = {
      name: data.name,
      capacity: data.capacity,
      deviceCount: data.deviceCount || 0,
      isActive: true,
      createdAt: new Date()
    }

    const result = await db.collection("rooms").insertOne(room)

    return NextResponse.json({
      success: true,
      room: {
        id: result.insertedId,
        ...room
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
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

    const result = await db.collection("rooms").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          name: data.name,
          capacity: parseInt(data.capacity),
          deviceCount: parseInt(data.deviceCount),
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Oda bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Oda güncellendi'
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

    const result = await db.collection("rooms").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Oda bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Oda silindi'
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 