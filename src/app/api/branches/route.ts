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
    if (!data.name || !data.address || !data.phone) {
      return NextResponse.json(
        { error: 'Gerekli alanları doldurun' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Aynı isimde şube var mı kontrol et
    const existingBranch = await db.collection("branches").findOne({
      name: data.name
    })

    if (existingBranch) {
      return NextResponse.json(
        { error: 'Bu isimde bir şube zaten mevcut' },
        { status: 400 }
      )
    }

    // Yeni şube objesi
    const newBranch = {
      _id: new ObjectId(),
      name: data.name.trim(),
      address: data.address.trim(),
      phone: data.phone.trim(),
      email: data.email?.toLowerCase().trim(),
      managerName: data.managerName?.trim(),
      rooms: [],
      teacherIds: [],
      studentIds: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("branches").insertOne(newBranch)

    if (!result.insertedId) {
      throw new Error('Şube eklenemedi')
    }

    return NextResponse.json({
      success: true,
      branch: {
        id: result.insertedId,
        ...newBranch
      }
    })

  } catch (error: any) {
    console.error('Şube ekleme hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Şube eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Şubeleri listele
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const branches = await db.collection("branches")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      branches: branches.map(branch => ({
        id: branch._id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        managerName: branch.managerName,
        isActive: branch.isActive
      }))
    })

  } catch (error: any) {
    console.error('Şube listesi hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Şubeler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        { error: 'Şube ID gerekli' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const result = await db.collection("branches").updateOne(
      { _id: new ObjectId(data.id) },
      {
        $set: {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email.toLowerCase(),
          managerName: data.managerName,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Şube bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Şube güncelleme hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Şube ID gerekli' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const result = await db.collection("branches").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          deletedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Şube bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Şube silme hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 