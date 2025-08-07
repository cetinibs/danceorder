import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const notification = await Notification.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Bildirim bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(notification);

  } catch (error: any) {
    return NextResponse.json(
      { error: `Bildirim güncellenirken hata: ${error.message}` },
      { status: 500 }
    );
  }
} 