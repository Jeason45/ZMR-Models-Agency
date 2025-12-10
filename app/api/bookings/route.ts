import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stripe, formatAmountForStripe, isStripeConfigured } from '@/lib/stripe';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

// Générer un numéro de booking unique
async function generateBookingNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const lastBooking = await prisma.booking.findFirst({
    where: {
      bookingNumber: {
        startsWith: `ZMR-EVT-${year}-`
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  let nextNumber = 1;
  if (lastBooking) {
    const lastNumber = parseInt(lastBooking.bookingNumber.split('-').pop() || '0');
    nextNumber = lastNumber + 1;
  }

  return `ZMR-EVT-${year}-${nextNumber.toString().padStart(4, '0')}`;
}

// Générer un QR code unique
async function generateQRCode(bookingId: string, bookingNumber: string): Promise<{ qrCode: string; qrCodeUrl: string }> {
  const qrCode = `${bookingId}-${Date.now()}`;
  const qrCodeData = JSON.stringify({
    bookingId,
    bookingNumber,
    code: qrCode
  });

  // Générer l'image QR en base64
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

// GET - Récupérer les bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (email) where.email = email;
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            coverImage: true
          }
        }
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST - Créer une réservation et initier le paiement Stripe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Vérifier que l'event existe et est disponible
    const event = await prisma.event.findUnique({
      where: { id: body.eventId }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.status === 'cancelled') {
      return NextResponse.json({ error: 'Event is cancelled' }, { status: 400 });
    }

    // Vérifier la disponibilité du type de ticket
    let ticketInfo: any = null;
    let unitPrice = 0;

    if (!event.isFree && event.ticketTypes && Array.isArray(event.ticketTypes)) {
      ticketInfo = (event.ticketTypes as any[]).find(t => t.name === body.ticketType);

      if (!ticketInfo) {
        return NextResponse.json({ error: 'Ticket type not found' }, { status: 400 });
      }

      // Compter les tickets déjà vendus
      const soldCount = await prisma.booking.aggregate({
        where: {
          eventId: body.eventId,
          ticketType: body.ticketType,
          paymentStatus: 'paid',
          status: { not: 'cancelled' }
        },
        _sum: { quantity: true }
      });

      const sold = soldCount._sum.quantity || 0;
      const available = ticketInfo.quantity - sold;

      if (body.quantity > available) {
        return NextResponse.json({
          error: `Only ${available} tickets available for ${body.ticketType}`
        }, { status: 400 });
      }

      unitPrice = ticketInfo.price;
    }

    // Calculer le montant total
    let totalAmount = unitPrice * body.quantity;
    let discount = 0;

    // Appliquer le code promo si fourni
    if (body.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: body.promoCode.toUpperCase() }
      });

      if (promo && promo.isActive) {
        const now = new Date();

        // Vérifier la validité
        if (promo.validFrom <= now && (!promo.validUntil || promo.validUntil >= now)) {
          // Vérifier les limites d'utilisation
          if (!promo.maxUses || promo.usedCount < promo.maxUses) {
            // Vérifier le montant minimum
            if (!promo.minAmount || totalAmount >= promo.minAmount) {
              // Vérifier si le code est valide pour cet event
              const eventIds = promo.eventIds as string[] | null;
              if (!eventIds || eventIds.includes(body.eventId)) {
                // Calculer la réduction
                if (promo.discountType === 'percentage') {
                  discount = totalAmount * (promo.discountValue / 100);
                } else {
                  discount = Math.min(promo.discountValue, totalAmount);
                }

                totalAmount -= discount;
              }
            }
          }
        }
      }
    }

    // Générer le numéro de booking
    const bookingNumber = await generateBookingNumber();

    // Créer la réservation en status pending
    const booking = await prisma.booking.create({
      data: {
        eventId: body.eventId,
        bookingNumber,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        ticketType: body.ticketType || 'Free',
        quantity: body.quantity,
        unitPrice,
        totalAmount,
        promoCode: body.promoCode?.toUpperCase(),
        discount: discount > 0 ? discount : null,
        specialRequests: body.specialRequests,
        status: 'pending',
        paymentStatus: event.isFree ? 'paid' : 'pending'
      }
    });

    // Si c'est gratuit, générer le QR code directement
    if (event.isFree) {
      const { qrCode, qrCodeUrl } = await generateQRCode(booking.id, bookingNumber);

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          qrCode,
          qrCodeUrl,
          status: 'confirmed',
          paidAt: new Date()
        }
      });

      // Incrémenter le compteur du promo code si utilisé
      if (body.promoCode && discount > 0) {
        await prisma.promoCode.update({
          where: { code: body.promoCode.toUpperCase() },
          data: { usedCount: { increment: 1 } }
        });
      }

      return NextResponse.json({
        booking: { ...booking, qrCode, qrCodeUrl, status: 'confirmed' },
        isFree: true
      }, { status: 201 });
    }

    // Vérifier que Stripe est configuré pour les événements payants
    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json({
        error: 'Le paiement en ligne n\'est pas encore configuré. Veuillez contacter l\'organisateur.'
      }, { status: 503 });
    }

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${event.title} - ${body.ticketType}`,
              description: `${body.quantity} ticket(s) pour ${event.title}`,
              images: event.coverImage ? [event.coverImage] : undefined,
            },
            unit_amount: formatAmountForStripe(unitPrice),
          },
          quantity: body.quantity,
        },
        // Ajouter la ligne de réduction si applicable
        ...(discount > 0 ? [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réduction (${body.promoCode})`,
            },
            unit_amount: -formatAmountForStripe(discount),
          },
          quantity: 1,
        }] : [])
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events/confirmation?booking=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events/${event.slug}?cancelled=true`,
      customer_email: body.email,
      metadata: {
        bookingId: booking.id,
        eventId: event.id,
        bookingNumber
      }
    });

    // Mettre à jour le booking avec l'ID de session Stripe
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id }
    });

    return NextResponse.json({
      booking,
      stripeSessionUrl: session.url,
      sessionId: session.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
