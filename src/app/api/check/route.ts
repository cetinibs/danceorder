import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("pilatesstudio")
    
    const users = await db.collection("users").find({}).toArray()
    
    // Hassas bilgileri çıkar
    const safeUsers = users.map(user => ({
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive
    }))

    return NextResponse.json({ 
      success: true,
      userCount: users.length,
      users: safeUsers
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { 
      status: 500 
    })
  }
} 