import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Settings from '@/models/Settings'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      )
    }

    await dbConnect()

    const settings = await Settings.findOne({ type: 'general' })
    
    return NextResponse.json({
      success: true,
      settings: settings || {}
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Ayarlar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      )
    }

    await dbConnect()

    const body = await request.json()

    const settings = await Settings.findOneAndUpdate(
      { type: 'general' },
      {
        $set: {
          companyName: body.companyName,
          address: body.address,
          phone: body.phone,
          email: body.email,
          taxNumber: body.taxNumber,
          currency: body.currency || 'TRY',
          timezone: body.timezone || 'Europe/Istanbul',
          language: body.language || 'tr',
          updatedAt: new Date()
        }
      },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
      }
    )

    return NextResponse.json({
      success: true,
      settings
    })

  } catch (error: any) {
    console.error('Genel ayarlar güncelleme hatası:', error)
    return NextResponse.json(
      { error: 'Ayarlar güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
} 