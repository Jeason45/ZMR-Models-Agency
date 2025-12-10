import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stripe } from '@/lib/stripe';
import QRCode from 'qrcode';
import Stripe from 'stripe';

const prisma = new PrismaClient();

// Générer un QR code unique
async function generateQRCode(bookingId: string, bookingNumber: string): Promise<{ qrCode: string; qrCodeUrl: string }> {
  const qrCode = `${bookingId}-${Date.now()}`;
  const qrCodeData = JSON.stringify({
    bookingId,
    bookingNumber,
    code: qrCode
  });

  const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  return { qrCode, qrCodeUrl };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Gérer les différents types d'événements
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const bookingId = session.metadata?.bookingId;
      if (!bookingId) {
        console.error('No bookingId in session metadata');
        break;
      }

      // Récupérer le booking
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        console.error('Booking not found:', bookingId);
        break;
      }

      // Générer le QR code
      const { qrCode, qrCodeUrl } = await generateQRCode(booking.id, booking.bookingNumber);

      // Mettre à jour le booking
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'paid',
          status: 'confirmed',
          stripePaymentIntentId: session.payment_intent as string,
          paidAt: new Date(),
          qrCode,
          qrCodeUrl
        }
      });

      // Mettre à jour le compteur de tickets vendus dans l'event
      const eventRecord = await prisma.event.findUnique({
        where: { id: booking.eventId }
      });

      if (eventRecord && eventRecord.ticketTypes) {
        const updatedTicketTypes = (eventRecord.ticketTypes as any[]).map(ticket => {
          if (ticket.name === booking.ticketType) {
            return { ...ticket, sold: (ticket.sold || 0) + booking.quantity };
          }
          return ticket;
        });

        await prisma.event.update({
          where: { id: booking.eventId },
          data: { ticketTypes: updatedTicketTypes }
        });
      }

      // Incrémenter le compteur du promo code si utilisé
      if (booking.promoCode && booking.discount) {
        await prisma.promoCode.update({
          where: { code: booking.promoCode },
          data: { usedCount: { increment: 1 } }
        });
      }

      console.log('Payment successful for booking:', booking.bookingNumber);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: 'failed',
            status: 'cancelled'
          }
        });
        console.log('Payment session expired for booking:', bookingId);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: 'failed'
          }
        });
        console.log('Payment failed for booking:', bookingId);
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent as string;

      const booking = await prisma.booking.findFirst({
        where: { stripePaymentIntentId: paymentIntentId }
      });

      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            paymentStatus: 'refunded',
            refundedAt: new Date(),
            refundAmount: charge.amount_refunded / 100
          }
        });
        console.log('Refund processed for booking:', booking.bookingNumber);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
