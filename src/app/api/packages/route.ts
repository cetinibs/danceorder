import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const DEFAULT_PACKAGES = {
  pilates: [
    // Bireysel Paketler
    { type: 'individual', hours: 8, maxStudents: 1, name: 'Bireysel 8 Saat' },
    { type: 'individual', hours: 12, maxStudents: 1, name: 'Bireysel 12 Saat' },
    { type: 'individual', hours: 16, maxStudents: 1, name: 'Bireysel 16 Saat' },
    // Düet Paketler
    { type: 'duet', hours: 8, maxStudents: 2, name: 'Düet 8 Saat' },
    { type: 'duet', hours: 12, maxStudents: 2, name: 'Düet 12 Saat' },
    { type: 'duet', hours: 16, maxStudents: 2, name: 'Düet 16 Saat' },
    // Grup Paketler
    { type: 'group', hours: 8, maxStudents: 3, name: 'Grup 8 Saat' },
    { type: 'group', hours: 12, maxStudents: 3, name: 'Grup 12 Saat' },
    { type: 'group', hours: 16, maxStudents: 3, name: 'Grup 16 Saat' }
  ],
  physiotherapy: [
    { 
      type: 'individual', 
      maxStudents: 1, 
      name: 'Skolyoz Tedavisi',
      details: 'Skolyoz değerlendirme ve tedavi programı'
    },
    { 
      type: 'individual', 
      maxStudents: 1, 
      name: 'Manuel Terapi',
      details: 'Manuel terapi teknikleri ile tedavi'
    },
    { 
      type: 'individual', 
      maxStudents: 1, 
      name: 'Pelvik Taban',
      details: 'Pelvik taban rehabilitasyonu'
    },
    { 
      type: 'individual', 
      maxStudents: 1, 
      name: 'FTR',
      details: 'Fizik tedavi ve rehabilitasyon programı'
    }
  ],
  clinicalPilates: [
    // Bireysel Paketler
    { type: 'individual', hours: 8, maxStudents: 1, name: 'Klinik Pilates Bireysel 8 Saat' },
    { type: 'individual', hours: 12, maxStudents: 1, name: 'Klinik Pilates Bireysel 12 Saat' },
    { type: 'individual', hours: 16, maxStudents: 1, name: 'Klinik Pilates Bireysel 16 Saat' },
    // Düet Paketler
    { type: 'duet', hours: 8, maxStudents: 2, name: 'Klinik Pilates Düet 8 Saat' },
    { type: 'duet', hours: 12, maxStudents: 2, name: 'Klinik Pilates Düet 12 Saat' },
    { type: 'duet', hours: 16, maxStudents: 2, name: 'Klinik Pilates Düet 16 Saat' },
    // Grup Paketler
    { type: 'group', hours: 8, maxStudents: 3, name: 'Klinik Pilates Grup 8 Saat' },
    { type: 'group', hours: 12, maxStudents: 3, name: 'Klinik Pilates Grup 12 Saat' },
    { type: 'group', hours: 16, maxStudents: 3, name: 'Klinik Pilates Grup 16 Saat' }
  ],
  zumba: [
    { 
      type: 'group', 
      maxStudents: 6, 
      minStudents: 4, 
      name: 'Zumba Grup Dersi',
      singleClass: true 
    }
  ],
  yoga: [
    { 
      type: 'individual', 
      maxStudents: 1, 
      name: 'Yoga Özel Ders' 
    },
    { 
      type: 'group', 
      maxStudents: 6, 
      minStudents: 4, 
      name: 'Yoga Grup Dersi',
      singleClass: true 
    }
  ],
  aerialYoga: [
    { 
      type: 'individual', 
      maxStudents: 1, 
      name: 'Hamak Yoga Özel Ders' 
    },
    { 
      type: 'group', 
      maxStudents: 6, 
      minStudents: 4, 
      name: 'Hamak Yoga Grup Dersi',
      singleClass: true 
    }
  ]
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const data = await request.json()
    console.log('Gelen paket verisi:', data)

    // Gerekli alan kontrolü
    if (!data.type || !data.name || !data.price) {
      return NextResponse.json(
        { error: 'Paket tipi, adı ve fiyatı gereklidir' },
        { status: 400 }
      )
    }

    if (!data.serviceType && !data.serviceId) {
      return NextResponse.json(
        { error: 'Hizmet tipi veya hizmet ID\'si gereklidir' },
        { status: 400 }
      )
    }

    // serviceId kontrolü ve oluşturma
    let serviceObjectId = null

    if (data.serviceId && data.serviceId !== 'default') {
      try {
        // Geçerli ObjectId kontrolü
        if (ObjectId.isValid(data.serviceId)) {
          serviceObjectId = new ObjectId(data.serviceId)
        }
      } catch (error) {
        console.log('Geçersiz serviceId:', data.serviceId)
      }
    }

    // serviceId yoksa hizmet tipine göre bul veya oluştur
    if (!serviceObjectId && data.serviceType) {
      try {
        const service = await db.collection("services").findOne({ type: data.serviceType })
        if (service) {
          serviceObjectId = service._id
        } else {
          // Hizmet bulunamazsa yeni bir ObjectId oluştur
          serviceObjectId = new ObjectId()
        }
      } catch (error) {
        console.log('Hizmet bulunamadı, yeni ObjectId oluşturuluyor')
        serviceObjectId = new ObjectId()
      }
    }

    const newPackage = {
      serviceId: serviceObjectId,
      serviceType: data.serviceType || 'pilates',
      type: data.type,
      name: data.name.trim(),
      hours: Number(data.hours) || 0,
      maxStudents: Number(data.maxStudents) || 1,
      minStudents: data.minStudents ? Number(data.minStudents) : undefined,
      price: Number(data.price),
      details: data.details?.trim() || '',
      isActive: Boolean(data.isActive),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Kaydedilecek paket:', newPackage)

    const result = await db.collection("packages").insertOne(newPackage)

    return NextResponse.json({
      success: true,
      message: 'Paket başarıyla eklendi',
      packageData: {
        id: result.insertedId.toString(),
        ...newPackage,
        serviceId: newPackage.serviceId?.toString(),
        _id: undefined // MongoDB _id'sini kaldır
      }
    })

  } catch (error: any) {
    console.error('Paket ekleme hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Paket eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    const client = await clientPromise
    const db = client.db("pilatesstudio")
    
    const query = serviceId ? { serviceId: new ObjectId(serviceId) } : {}
    const packages = await db.collection("packages").find(query).toArray()

    return NextResponse.json({
      success: true,
      packages: packages.map(pkg => ({
        id: pkg._id,
        serviceId: pkg.serviceId,
        type: pkg.type,
        name: pkg.name,
        hours: pkg.hours,
        maxStudents: pkg.maxStudents,
        minStudents: pkg.minStudents,
        price: pkg.price,
        details: pkg.details,
        isActive: pkg.isActive
      }))
    })

  } catch (error: any) {
    console.error('Paket listesi hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT metodu için
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

    // ObjectId geçerliliği kontrolü
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz ID formatı' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db("pilatesstudio")

    // Güncelleme verisi hazırlama
    const updateData: any = {
      type: data.type,
      name: data.name?.trim(),
      hours: Number(data.hours) || 0,
      maxStudents: Number(data.maxStudents) || 1,
      price: Number(data.price),
      details: data.details?.trim() || '',
      isActive: Boolean(data.isActive),
      updatedAt: new Date()
    }

    // serviceId güncelleme
    if (data.serviceId && data.serviceId !== 'default' && ObjectId.isValid(data.serviceId)) {
      updateData.serviceId = new ObjectId(data.serviceId)
    }

    if (data.serviceType) {
      updateData.serviceType = data.serviceType
    }

    if (data.minStudents !== undefined) {
      updateData.minStudents = Number(data.minStudents)
    }

    const result = await db.collection("packages").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Paket bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Paket başarıyla güncellendi'
    })

  } catch (error: any) {
    console.error('Paket güncelleme hatası:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE metodu için
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

    // ObjectId geçerliliği kontrolü
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz ID formatı' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pilatesstudio")

    const result = await db.collection("packages").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Paket bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Paket başarıyla silindi'
    })

  } catch (error: any) {
    console.error('Paket silme hatası:', error)
    return NextResponse.json(
      { error: error.message || 'Paket silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}