import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stripe } from '@/lib/stripe';

const prisma = new PrismaClient();

// GET - Récupérer un booking par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        event: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PUT - Mettre à jour un booking (check-in, annulation, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Actions spéciales
    if (body.action === 'checkin') {
      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: 'used',
          checkedInAt: new Date(),
          checkedInBy: body.checkedInBy || 'admin'
        }
      });
      return NextResponse.json(updated);
    }

    if (body.action === 'cancel') {
      // Si le booking est payé, on peut proposer un remboursement
      if (booking.paymentStatus === 'paid' && booking.stripePaymentIntentId) {
        // Optionnel: Créer un remboursement Stripe
        if (body.refund) {
          if (!stripe) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
          }
          try {
            await stripe.refunds.create({
              payment_intent: booking.stripePaymentIntentId,
              reason: 'requested_by_customer'
            });

            const updated = await prisma.booking.update({
              where: { id },
              data: {
                status: 'cancelled',
                paymentStatus: 'refunded',
                refundedAt: new Date(),
                refundAmount: booking.totalAmount,
                refundReason: body.reason || 'Customer request'
              }
            });
            return NextResponse.json(updated);
          } catch (refundError) {
            console.error('Refund error:', refundError);
            return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 });
          }
        }
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: 'cancelled',
          internalNotes: body.reason ? `Cancelled: ${body.reason}` : undefined
        }
      });
      return NextResponse.json(updated);
    }

    // Mise à jour standard
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: body.status,
        internalNotes: body.internalNotes,
        specialRequests: body.specialRequests
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
