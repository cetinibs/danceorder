import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const body = await request.json()
    const { name, type, hours, price, description, status } = body
    const serviceId = params.serviceId

    const client = await clientPromise
    const db = client.db("pilatesStudio")

    const packageData = {
      _id: new ObjectId(),
      serviceId: new ObjectId(serviceId),
      name,
      type,
      hours,
      price,
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection("services").updateOne(
      { _id: new ObjectId(serviceId) },
      { 
        $push: { packages: packageData },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      package: {
        ...packageData,
        id: packageData._id.toString(),
        _id: undefined,
        serviceId: serviceId
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Paket ekleme hatası:', error)
    return NextResponse.json(
      { error: 'Paket eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
} 