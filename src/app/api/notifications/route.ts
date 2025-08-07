import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import Payment from '@/models/Payment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    // Gecikmiş ödemeleri kontrol et
    const overduePayments = await Payment.find({
      status: { $in: ['pending', 'partial'] },
      dueDate: { $lt: new Date() }
    }).populate('studentId');

    // Her gecikmiş ödeme için bildirim oluştur
    for (const payment of overduePayments) {
      const existingNotification = await Notification.findOne({
        relatedId: payment._id,
        type: 'payment',
        status: 'unread'
      });

      if (!existingNotification) {
        await Notification.create({
          title: 'Gecikmiş Ödeme',
          message: `${payment.studentId.name} adlı öğrencinin ${payment.amount - payment.paidAmount}₺ tutarında ödemesi gecikmiştir.`,
          type: 'payment',
          priority: 'high',
          branchId: payment.branchId,
          userId: session.user.id,
          relatedId: payment._id,
          onModel: 'Payment'
        });
      }
    }

    // Bildirimleri getir
    const notifications = await Notification.find({
      userId: session.user.id
    })
    .sort({ createdAt: -1 })
    .limit(50);

    return NextResponse.json(notifications);

  } catch (error: any) {
    return NextResponse.json(
      { error: `Bildirimler yüklenirken hata: ${error.message}` },
      { status: 500 }
    );
  }
} 