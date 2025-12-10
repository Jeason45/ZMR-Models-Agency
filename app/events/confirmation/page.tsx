'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setError('Réservation non trouvée');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        } else {
          setError('Réservation non trouvée');
        }
      } catch (err) {
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white' }}>Chargement...</div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>{error || 'Réservation non trouvée'}</h1>
          <Link href="/events" style={{ color: 'white', textDecoration: 'underline' }}>
            Retour aux événements
          </Link>
        </div>
      </main>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: '#111',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 style={{
          color: 'white',
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          Réservation confirmée !
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '16px',
          marginBottom: '32px'
        }}>
          Un email de confirmation a été envoyé à {booking.email}
        </p>

        {/* Booking Details */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>
              NUMÉRO DE RÉSERVATION
            </div>
            <div style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
              {booking.bookingNumber}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>
              ÉVÉNEMENT
            </div>
            <div style={{ color: 'white', fontSize: '16px' }}>
              {booking.event?.title}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>
              DATE
            </div>
            <div style={{ color: 'white', fontSize: '16px' }}>
              {booking.event?.date && formatDate(booking.event.date)}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>
              LIEU
            </div>
            <div style={{ color: 'white', fontSize: '16px' }}>
              {booking.event?.location}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>
                BILLETS
              </div>
              <div style={{ color: 'white', fontSize: '16px' }}>
                {booking.quantity}x {booking.ticketType}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>
                TOTAL
              </div>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
                {booking.totalAmount === 0 ? 'Gratuit' : `${booking.totalAmount}€`}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        {booking.qrCodeUrl && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <img
              src={booking.qrCodeUrl}
              alt="QR Code"
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto',
                display: 'block'
              }}
            />
            <p style={{
              color: '#333',
              fontSize: '14px',
              marginTop: '16px'
            }}>
              Présentez ce QR code à l'entrée
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link
            href="/events"
            style={{
              padding: '14px 28px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.3s'
            }}
          >
            Voir d'autres événements
          </Link>
        </div>

        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '12px',
          marginTop: '24px'
        }}>
          Conservez ce QR code précieusement. Il vous sera demandé à l'entrée.
        </p>
      </div>
    </main>
  );
}
