'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

// Styles responsive pour mobile
const mobileStyles = `
  @media (max-width: 768px) {
    .event-detail-main {
      padding-bottom: 100px !important;
    }
    .event-hero {
      height: 40vh !important;
      min-height: 280px !important;
    }
    .event-hero-title {
      font-size: 26px !important;
      padding: 0 16px !important;
      line-height: 1.2 !important;
    }
    .event-hero-date {
      font-size: 14px !important;
    }
    .event-content {
      padding: 20px 16px !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 20px !important;
    }
    .event-left-column {
      grid-column: span 12 !important;
      order: 1 !important;
    }
    .event-right-column {
      grid-column: span 12 !important;
      order: 2 !important;
    }
    .event-info-cards {
      display: flex !important;
      flex-direction: row !important;
      gap: 8px !important;
      margin-bottom: 16px !important;
    }
    .event-info-card {
      padding: 12px 10px !important;
      flex: 1 !important;
      border-radius: 8px !important;
    }
    .event-info-card svg {
      width: 18px !important;
      height: 18px !important;
      margin-bottom: 8px !important;
    }
    .event-info-card-label {
      font-size: 9px !important;
      margin-bottom: 3px !important;
    }
    .event-info-card-title {
      font-size: 12px !important;
    }
    .event-additional-info {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
    }
    .event-additional-info > div {
      flex: 1 1 45% !important;
      padding: 12px 14px !important;
      border-radius: 8px !important;
    }
    .event-additional-info > div > div:first-child {
      font-size: 10px !important;
      margin-bottom: 4px !important;
    }
    .event-additional-info > div > div:last-child {
      font-size: 14px !important;
    }
    .event-additional-info-full {
      flex: 1 1 100% !important;
    }
    .event-booking-card {
      position: relative !important;
      top: 0 !important;
      padding: 20px !important;
      border-radius: 12px !important;
    }
    .event-section-title {
      font-size: 18px !important;
      margin-bottom: 12px !important;
    }
    .event-description {
      font-size: 14px !important;
      line-height: 1.6 !important;
    }
    .event-about-section {
      margin-bottom: 16px !important;
    }
    .event-back-arrow {
      top: 20px !important;
      left: 16px !important;
      font-size: 20px !important;
    }
    .booking-modal-content {
      padding: 24px 16px !important;
      max-height: 85vh !important;
      border-radius: 12px !important;
    }
    .booking-modal-grid {
      grid-template-columns: 1fr !important;
    }
    .event-lineup-section {
      margin-top: 16px !important;
    }
    .event-lineup-item {
      padding: 12px 14px !important;
      border-radius: 8px !important;
    }
    .ticket-button {
      padding: 14px !important;
      border-radius: 8px !important;
    }
    .ticket-price {
      font-size: 16px !important;
    }
  }

  /* Fixed booking button on mobile */
  .mobile-booking-bar {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(17,17,17,1) 0%, rgba(17,17,17,0.95) 100%);
    padding: 16px;
    z-index: 100;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  @media (max-width: 768px) {
    .mobile-booking-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
  }
`;

function Navbar({ scrollDirection }: { scrollDirection: 'up' | 'down' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: 'All Models', href: '/explore' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <>
      {!isMenuOpen && (
        <Link
          href="/"
          style={{
            position: 'fixed',
            top: scrollDirection === 'down' ? '-300px' : '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'top 0.5s ease-in-out'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              color: 'white',
              fontWeight: 300,
              letterSpacing: '0.2em',
              fontSize: 'clamp(35px, 8vw, 80px)',
              lineHeight: 1,
              margin: 0
            }}>
              ZMR
            </h1>
          </div>
        </Link>
      )}

      {!isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: scrollDirection === 'down' ? '-300px' : '32px',
          right: '32px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          transition: 'top 0.5s ease-in-out'
        }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Menu"
          >
            <span style={{ width: '100%', height: '2px', backgroundColor: 'white', marginBottom: '8px' }} />
            <span style={{ width: '100%', height: '2px', backgroundColor: 'white' }} />
          </button>
        </div>
      )}

      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(16px, 3vh, 32px)'
          }}>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleMenuClick(e, item.href)}
                style={{
                  color: 'white',
                  fontSize: 'clamp(32px, 6vw, 80px)',
                  fontWeight: 300,
                  textDecoration: 'none',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'fixed',
              top: '32px',
              right: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 50
            }}
          >
            <span style={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: 'white', transform: 'rotate(45deg)' }} />
            <span style={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: 'white', transform: 'rotate(-45deg)' }} />
          </button>
        </div>
      )}
    </>
  );
}

// Demo events for preview (matching events/page.tsx)
const demoEvents: Record<string, any> = {
  'zmr-summer-gala-2025': {
    id: '1',
    title: 'ZMR Summer Gala 2025',
    slug: 'zmr-summer-gala-2025',
    description: 'Rejoignez-nous pour une soirée exceptionnelle célébrant les talents de ZMR Models Agency. Une nuit glamour avec défilé de mode, cocktails et networking.\n\nAu programme :\n• Cocktail de bienvenue dès 20h\n• Défilé exclusif présentant nos mannequins\n• DJ set toute la nuit\n• Open bar premium\n• Photobooth avec nos mannequins',
    date: '2025-02-14T20:00:00.000Z',
    endDate: '2025-02-15T03:00:00.000Z',
    location: 'Le Palais Royal',
    address: '8 Rue de Montpensier, 75001 Paris',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
    type: 'fashion',
    capacity: 200,
    isFree: false,
    dresscode: 'Tenue de soirée exigée',
    ageRestriction: '18+',
    ticketTypes: [
      { name: 'Standard', price: 75, quantity: 100 },
      { name: 'VIP', price: 150, quantity: 50 },
      { name: 'Table Premium', price: 500, quantity: 10 }
    ],
    ticketAvailability: {
      'Standard': { price: 75, available: 45, isSoldOut: false },
      'VIP': { price: 150, available: 12, isSoldOut: false },
      'Table Premium': { price: 500, available: 3, isSoldOut: false }
    },
    lineup: [
      { name: 'DJ Laurent', role: 'DJ Set', time: '22:00 - 00:00' },
      { name: 'DJ Sophie', role: 'DJ Set', time: '00:00 - 03:00' }
    ]
  },
  'exclusive-night-club-party': {
    id: '2',
    title: 'Exclusive Night Club Party',
    slug: 'exclusive-night-club-party',
    description: 'Une soirée exclusive avec les plus beaux mannequins de l\'agence. DJ set, open bar et ambiance garantie.\n\nUne nuit inoubliable vous attend dans l\'un des clubs les plus prestigieux de Paris.',
    date: '2025-01-25T23:00:00.000Z',
    endDate: '2025-01-26T05:00:00.000Z',
    location: 'Club Étoile',
    address: '12 Avenue des Champs-Élysées, 75008 Paris',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200',
    type: 'club',
    capacity: 300,
    isFree: false,
    dresscode: 'Chic & Élégant',
    ageRestriction: '21+',
    ticketTypes: [
      { name: 'Entrée', price: 25, quantity: 250 },
      { name: 'Table VIP', price: 200, quantity: 10 }
    ],
    ticketAvailability: {
      'Entrée': { price: 25, available: 120, isSoldOut: false },
      'Table VIP': { price: 200, available: 5, isSoldOut: false }
    },
    lineup: [
      { name: 'DJ Martin', role: 'Opening Set', time: '23:00 - 01:00' },
      { name: 'DJ Alex', role: 'Main Set', time: '01:00 - 05:00' }
    ]
  },
  'fashion-week-afterparty': {
    id: '3',
    title: 'Fashion Week Afterparty',
    slug: 'fashion-week-afterparty',
    description: 'L\'afterparty officielle de la Fashion Week. Rencontrez les designers et mannequins dans une ambiance chic et intimiste.\n\nUne soirée unique pour célébrer la mode et le style.',
    date: '2025-03-08T22:00:00.000Z',
    location: 'Maison Blanche',
    address: '15 Avenue Montaigne, 75016 Paris',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    type: 'private',
    capacity: 150,
    isFree: false,
    dresscode: 'Black Tie',
    ageRestriction: '18+',
    ticketTypes: [
      { name: 'Invitation', price: 100, quantity: 150 }
    ],
    ticketAvailability: {
      'Invitation': { price: 100, available: 35, isSoldOut: false }
    }
  },
  'casting-nouvelle-collection': {
    id: '4',
    title: 'Casting Nouvelle Collection',
    slug: 'casting-nouvelle-collection',
    description: 'Casting ouvert pour la nouvelle collection printemps-été 2025. Tous profils bienvenus.\n\nVenez avec votre book et votre bonne humeur ! Nos équipes seront présentes pour vous accompagner.\n\n• Photos professionnelles offertes\n• Conseils personnalisés\n• Possibilité de contrat direct',
    date: '2025-01-20T10:00:00.000Z',
    endDate: '2025-01-20T18:00:00.000Z',
    location: 'Studio ZMR',
    address: '25 Rue du Temple, 75003 Paris',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    type: 'casting',
    capacity: 50,
    isFree: true,
    ticketTypes: [],
    ticketAvailability: {}
  }
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    promoCode: '',
    specialRequests: ''
  });
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Check for cancelled payment
  useEffect(() => {
    if (searchParams.get('cancelled') === 'true') {
      setBookingError('Le paiement a été annulé. Vous pouvez réessayer.');
    }
  }, [searchParams]);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';
      if (Math.abs(scrollY - lastScrollY.current) > 10) {
        setScrollDirection(direction);
      }
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
          // Select first ticket type by default
          if (data.ticketTypes && data.ticketTypes.length > 0) {
            setSelectedTicket(data.ticketTypes[0].name);
          }
        } else {
          // Fallback to demo event
          const demoEvent = demoEvents[slug];
          if (demoEvent) {
            setEvent(demoEvent);
            if (demoEvent.ticketTypes && demoEvent.ticketTypes.length > 0) {
              setSelectedTicket(demoEvent.ticketTypes[0].name);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        // Fallback to demo event
        const demoEvent = demoEvents[slug];
        if (demoEvent) {
          setEvent(demoEvent);
          if (demoEvent.ticketTypes && demoEvent.ticketTypes.length > 0) {
            setSelectedTicket(demoEvent.ticketTypes[0].name);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getSelectedTicketInfo = () => {
    if (!event?.ticketAvailability || !selectedTicket) return null;
    return event.ticketAvailability[selectedTicket];
  };

  const calculateTotal = () => {
    const ticketInfo = getSelectedTicketInfo();
    if (!ticketInfo) return 0;
    let total = ticketInfo.price * quantity;
    if (promoApplied) {
      if (promoApplied.discountType === 'percentage') {
        total -= total * (promoApplied.discountValue / 100);
      } else {
        total -= promoApplied.discountValue;
      }
    }
    return Math.max(0, total);
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode) return;

    try {
      const response = await fetch(`/api/promo-codes/validate?code=${formData.promoCode}&eventId=${event.id}`);
      if (response.ok) {
        const promo = await response.json();
        setPromoApplied(promo);
        setBookingError('');
      } else {
        setPromoApplied(null);
        setBookingError('Code promo invalide ou expiré');
      }
    } catch (error) {
      setBookingError('Erreur lors de la vérification du code');
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          ...formData,
          ticketType: selectedTicket,
          quantity,
          promoCode: promoApplied?.code
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      if (data.isFree) {
        // Redirection directe vers la confirmation
        router.push(`/events/confirmation?booking=${data.booking.id}`);
      } else if (data.stripeSessionUrl) {
        // Redirection vers Stripe
        window.location.href = data.stripeSessionUrl;
      }
    } catch (error: any) {
      setBookingError(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white' }}>Chargement...</div>
      </main>
    );
  }

  if (!event) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h1>Événement non trouvé</h1>
          <Link href="/events" style={{ color: 'white', marginTop: '20px', display: 'inline-block' }}>
            ← Retour aux événements
          </Link>
        </div>
      </main>
    );
  }

  const dateInfo = formatDate(event.date);
  const ticketInfo = getSelectedTicketInfo();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      <Navbar scrollDirection={scrollDirection} />

      {/* Back Arrow */}
      <Link
        href="/events"
        className="event-back-arrow"
        style={{
          position: 'fixed',
          top: '40px',
          left: '40px',
          zIndex: 100,
          color: 'white',
          fontSize: '24px',
          textDecoration: 'none',
          transition: 'opacity 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        ←
      </Link>

      <main className="event-detail-main" style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
        {/* Hero Section */}
        <div className="event-hero" style={{
          position: 'relative',
          width: '100%',
          height: '60vh',
          overflow: 'hidden'
        }}>
          <img
            src={event.coverImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
            alt={event.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800';
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.2) 100%)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '100%',
            padding: '0 20px'
          }}>
            <h1 className="event-hero-title" style={{
              color: 'white',
              fontSize: 'clamp(28px, 6vw, 72px)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
              lineHeight: 1.1
            }}>
              {event.title}
            </h1>
            <p className="event-hero-date" style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '16px',
              fontWeight: 300
            }}>
              {dateInfo.full} • {dateInfo.time}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="event-content" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '40px'
        }}>
          {/* Left Column - Details */}
          <div className="event-left-column" style={{ gridColumn: 'span 7' }}>
            {/* Info Cards */}
            <div className="event-info-cards" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div className="event-info-card" style={{
                backgroundColor: '#111',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ margin: '0 auto 10px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div className="event-info-card-label" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.05em' }}>LIEU</div>
                <div className="event-info-card-title" style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{event.location}</div>
              </div>

              <div className="event-info-card" style={{
                backgroundColor: '#111',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ margin: '0 auto 10px' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <div className="event-info-card-label" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.05em' }}>DATE</div>
                <div className="event-info-card-title" style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{dateInfo.full}</div>
              </div>

              <div className="event-info-card" style={{
                backgroundColor: '#111',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ margin: '0 auto 10px' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div className="event-info-card-label" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.05em' }}>HEURE</div>
                <div className="event-info-card-title" style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{dateInfo.time}</div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="event-about-section" style={{ marginBottom: '24px' }}>
                <h2 className="event-section-title" style={{ color: 'white', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
                  À propos
                </h2>
                <p className="event-description" style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {event.description}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="event-additional-info" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {event.dresscode && (
                <div style={{ backgroundColor: '#111', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '6px', letterSpacing: '0.05em' }}>DRESS CODE</div>
                  <div style={{ color: 'white', fontSize: '15px' }}>{event.dresscode}</div>
                </div>
              )}
              {event.ageRestriction && (
                <div style={{ backgroundColor: '#111', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '6px', letterSpacing: '0.05em' }}>ÂGE MINIMUM</div>
                  <div style={{ color: 'white', fontSize: '15px' }}>{event.ageRestriction}</div>
                </div>
              )}
              {event.address && (
                <div className="event-additional-info-full" style={{ backgroundColor: '#111', padding: '16px', borderRadius: '8px', gridColumn: 'span 2' }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '6px', letterSpacing: '0.05em' }}>ADRESSE</div>
                  <div style={{ color: 'white', fontSize: '15px' }}>{event.address}</div>
                </div>
              )}
            </div>

            {/* Lineup */}
            {event.lineup && event.lineup.length > 0 && (
              <div className="event-lineup-section" style={{ marginTop: '20px' }}>
                <h2 className="event-section-title" style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                  Line-up
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(event.lineup as any[]).map((artist, index) => (
                    <div key={index} className="event-lineup-item" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#111',
                      padding: '12px 14px',
                      borderRadius: '6px'
                    }}>
                      <div>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{artist.name}</div>
                        {artist.role && (
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{artist.role}</div>
                        )}
                      </div>
                      {artist.time && (
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{artist.time}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="event-right-column" style={{ gridColumn: 'span 5' }}>
            <div className="event-booking-card" style={{
              position: 'sticky',
              top: '100px',
              backgroundColor: '#111',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h2 className="event-section-title" style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 600,
                marginBottom: '20px'
              }}>
                Réservation
              </h2>

              {event.isFree ? (
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '24px'
                }}>
                  ÉVÉNEMENT GRATUIT
                </div>
              ) : event.ticketTypes && event.ticketTypes.length > 0 ? (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Type de billet
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(event.ticketTypes as any[]).map((ticket) => {
                      const availability = event.ticketAvailability?.[ticket.name];
                      const isSoldOut = availability?.isSoldOut;

                      return (
                        <button
                          key={ticket.name}
                          className="ticket-button"
                          onClick={() => !isSoldOut && setSelectedTicket(ticket.name)}
                          disabled={isSoldOut}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '14px',
                            backgroundColor: selectedTicket === ticket.name ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: selectedTicket === ticket.name ? '2px solid white' : '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            cursor: isSoldOut ? 'not-allowed' : 'pointer',
                            opacity: isSoldOut ? 0.5 : 1,
                            width: '100%'
                          }}
                        >
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ color: 'white', fontSize: '15px', fontWeight: 500 }}>{ticket.name}</div>
                            {availability && (
                              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                                {isSoldOut ? 'Épuisé' : `${availability.available} places restantes`}
                              </div>
                            )}
                          </div>
                          <div className="ticket-price" style={{ color: 'white', fontSize: '17px', fontWeight: 600 }}>
                            {ticket.price}€
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Quantity */}
              <div className="quantity-section" style={{ marginBottom: '20px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                  Nombre de places
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span className="quantity-value" style={{ color: 'white', fontSize: '18px', fontWeight: 600, minWidth: '36px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="total-section" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '20px'
              }}>
                <span className="total-label" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Total</span>
                <span className="total-value" style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>
                  {event.isFree ? 'Gratuit' : `${calculateTotal()}€`}
                </span>
              </div>

              {/* Book Button */}
              <button
                className="book-button"
                onClick={() => setShowBookingForm(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                RÉSERVER MAINTENANT
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Booking Bar */}
      <div className="mobile-booking-bar">
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '2px' }}>
            {event.isFree ? 'Événement gratuit' : `À partir de`}
          </div>
          <div style={{ color: 'white', fontSize: '22px', fontWeight: 700 }}>
            {event.isFree ? 'GRATUIT' : `${
              event.ticketTypes && event.ticketTypes.length > 0
                ? Math.min(...(event.ticketTypes as any[]).map(t => t.price))
                : 0
            }€`}
          </div>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          style={{
            padding: '14px 28px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          RÉSERVER
        </button>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="booking-modal-content" style={{
            backgroundColor: '#111',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 600 }}>
                Finaliser la réservation
              </h2>
              <button
                onClick={() => setShowBookingForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            {/* Summary */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>{event.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                {quantity}x {selectedTicket || 'Entrée gratuite'} • {calculateTotal()}€
              </div>
            </div>

            {bookingError && (
              <div style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {bookingError}
              </div>
            )}

            <form onSubmit={handleSubmitBooking}>
              <div className="booking-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px'
                  }}
                />
              </div>

              {/* Promo Code */}
              {!event.isFree && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                    Code promo
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={formData.promoCode}
                      onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                      placeholder="CODEPROMO"
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '16px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Appliquer
                    </button>
                  </div>
                  {promoApplied && (
                    <div style={{ color: '#10b981', fontSize: '14px', marginTop: '8px' }}>
                      Code appliqué: -{promoApplied.discountType === 'percentage' ? `${promoApplied.discountValue}%` : `${promoApplied.discountValue}€`}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Demandes spéciales
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '24px'
              }}>
                <span style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>Total à payer</span>
                <span style={{ color: 'white', fontSize: '28px', fontWeight: 700 }}>
                  {event.isFree ? 'Gratuit' : `${calculateTotal()}€`}
                </span>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: bookingLoading ? '#666' : 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: bookingLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {bookingLoading ? 'Traitement...' : event.isFree ? 'CONFIRMER LA RÉSERVATION' : 'PAYER MAINTENANT'}
              </button>

              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '16px'
              }}>
                {event.isFree
                  ? 'Vous recevrez un email de confirmation avec votre QR code.'
                  : 'Paiement sécurisé par Stripe. Vous recevrez un email de confirmation avec votre QR code.'}
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
