import { NextResponse } from 'next/server'

const defaultServices = [
  {
    id: "1",
    name: "Pilates",
    packages: [
      {
        id: "p1",
        name: "Bireysel 8 Saat",
        type: "individual",
        sessionCount: 8,
        price: 2000,
        duration: 60
      },
      {
        id: "p2",
        name: "Bireysel 12 Saat",
        type: "individual",
        sessionCount: 12,
        price: 2800,
        duration: 60
      },
      {
        id: "p3",
        name: "Bireysel 16 Saat",
        type: "individual",
        sessionCount: 16,
        price: 3500,
        duration: 60
      },
      {
        id: "p4",
        name: "Düet 8 Saat",
        type: "duet",
        sessionCount: 8,
        price: 1500,
        duration: 60
      },
      {
        id: "p5",
        name: "Düet 12 Saat",
        type: "duet",
        sessionCount: 12,
        price: 2100,
        duration: 60
      },
      {
        id: "p6",
        name: "Düet 16 Saat",
        type: "duet",
        sessionCount: 16,
        price: 2600,
        duration: 60
      },
      {
        id: "p7",
        name: "Grup 8 Saat",
        type: "group",
        sessionCount: 8,
        price: 1200,
        duration: 60
      },
      {
        id: "p8",
        name: "Grup 12 Saat",
        type: "group",
        sessionCount: 12,
        price: 1700,
        duration: 60
      },
      {
        id: "p9",
        name: "Grup 16 Saat",
        type: "group",
        sessionCount: 16,
        price: 2100,
        duration: 60
      }
    ]
  },
  {
    id: "2",
    name: "Fizyoterapi",
    packages: [
      {
        id: "f1",
        name: "Bireysel Skolyoz",
        type: "individual",
        sessionCount: 1,
        price: 500,
        duration: 60
      },
      {
        id: "f2",
        name: "Manuel Terapi",
        type: "individual",
        sessionCount: 1,
        price: 500,
        duration: 60
      },
      {
        id: "f3",
        name: "Pelvik Taban",
        type: "individual",
        sessionCount: 1,
        price: 500,
        duration: 60
      },
      {
        id: "f4",
        name: "FTR",
        type: "individual",
        sessionCount: 1,
        price: 500,
        duration: 60
      }
    ]
  },
  {
    id: "3",
    name: "Klinik Pilates",
    packages: [
      {
        id: "kp1",
        name: "Bireysel 8 Saat",
        type: "individual",
        sessionCount: 8,
        price: 2200,
        duration: 60
      },
      {
        id: "kp2",
        name: "Bireysel 12 Saat",
        type: "individual",
        sessionCount: 12,
        price: 3000,
        duration: 60
      },
      {
        id: "kp3",
        name: "Bireysel 16 Saat",
        type: "individual",
        sessionCount: 16,
        price: 3700,
        duration: 60
      },
      {
        id: "kp4",
        name: "Düet 8 Saat",
        type: "duet",
        sessionCount: 8,
        price: 1700,
        duration: 60
      },
      {
        id: "kp5",
        name: "Düet 12 Saat",
        type: "duet",
        sessionCount: 12,
        price: 2300,
        duration: 60
      },
      {
        id: "kp6",
        name: "Düet 16 Saat",
        type: "duet",
        sessionCount: 16,
        price: 2800,
        duration: 60
      }
    ]
  },
  {
    id: "4",
    name: "Zumba",
    packages: [
      {
        id: "z1",
        name: "Grup Dersi",
        type: "group",
        sessionCount: 1,
        price: 200,
        minParticipants: 4,
        maxParticipants: 6,
        duration: 60
      }
    ]
  },
  {
    id: "5",
    name: "Yoga",
    packages: [
      {
        id: "y1",
        name: "Bireysel",
        type: "individual",
        sessionCount: 1,
        price: 300,
        duration: 60
      },
      {
        id: "y2",
        name: "Grup Dersi",
        type: "group",
        sessionCount: 1,
        price: 200,
        minParticipants: 4,
        maxParticipants: 6,
        duration: 60
      }
    ]
  },
  {
    id: "6",
    name: "Hamak Yoga",
    packages: [
      {
        id: "hy1",
        name: "Bireysel",
        type: "individual",
        sessionCount: 1,
        price: 300,
        duration: 60
      },
      {
        id: "hy2",
        name: "Grup Dersi",
        type: "group",
        sessionCount: 1,
        price: 200,
        minParticipants: 4,
        maxParticipants: 6,
        duration: 60
      }
    ]
  }
]

export async function GET() {
  try {
    // Debug için konsola yazdıralım
    console.log('Servisler yükleniyor:', defaultServices)
    
    return NextResponse.json({
      success: true,
      services: defaultServices
    })
  } catch (error: any) {
    console.error('Servisler yüklenirken hata:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 