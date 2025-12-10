'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MemberIcon from '@/components/MemberIcon';

// Styles responsive pour mobile
const mobileStyles = `
  @media (max-width: 768px) {
    .events-main {
      padding-top: 120px !important;
      padding-bottom: 40px !important;
    }
    .events-filters {
      gap: 8px !important;
      margin-bottom: 24px !important;
      padding: 0 12px !important;
    }
    .events-filters button {
      font-size: 11px !important;
      padding: 6px 10px !important;
      letter-spacing: 0.1em !important;
    }
    .events-grid {
      padding: 0 12px !important;
      gap: 20px !important;
      grid-template-columns: 1fr !important;
    }
    .event-card-content {
      padding: 16px !important;
    }
    .event-card-content h3 {
      font-size: 18px !important;
      margin-bottom: 8px !important;
    }
    .event-card-info {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 8px !important;
      font-size: 12px !important;
    }
    .event-card-footer {
      margin-top: 12px !important;
      padding-top: 12px !important;
    }
    .event-card-footer > div:first-child {
      font-size: 16px !important;
    }
    .event-card-footer > div:last-child {
      padding: 6px 12px !important;
      font-size: 10px !important;
    }
    .date-badge {
      padding: 8px 12px !important;
      min-width: 50px !important;
    }
    .date-badge > div:first-child {
      font-size: 18px !important;
    }
    .date-badge > div:last-child {
      font-size: 10px !important;
    }
    .type-badge {
      font-size: 9px !important;
      padding: 4px 8px !important;
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
      {/* Logo with scroll effect */}
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
              fontSize: 'clamp(32px, 6vw, 72px)',
              lineHeight: 1,
              margin: 0,
              transition: 'opacity 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              ZMR
            </h1>
            <p style={{
              color: 'white',
              fontWeight: 300,
              letterSpacing: '0.4em',
              fontSize: 'clamp(8px, 1vw, 11px)',
              textTransform: 'uppercase',
              marginTop: '10px'
            }}>
              Models Agency
            </p>
          </div>
        </Link>
      )}

      {/* Top Right Icons */}
      {!isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: scrollDirection === 'down' ? '-300px' : 'clamp(20px, 4vh, 32px)',
          right: 'clamp(16px, 4vw, 32px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 24px)',
          transition: 'top 0.5s ease-in-out'
        }}>
          {/* Member Icon */}
          <MemberIcon size={20} color="white" />

          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/zmrmodelsagency"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
            aria-label="Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: 'clamp(28px, 4vw, 32px)',
              height: 'clamp(28px, 4vw, 32px)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Menu"
          >
            <span style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'white',
              marginBottom: 'clamp(6px, 1vw, 8px)'
            }} />
            <span style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'white'
            }} />
          </button>
        </div>
      )}

      {/* Menu Overlay */}
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
                prefetch={true}
                onClick={(e) => handleMenuClick(e, item.href)}
                style={{
                  color: 'white',
                  fontSize: 'clamp(32px, 6vw, 100px)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
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
              top: 'clamp(20px, 4vh, 32px)',
              right: 'clamp(20px, 4vw, 32px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              zIndex: 50
            }}
            aria-label="Close Menu"
          >
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: 'white',
              transform: 'rotate(45deg)'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: 'white',
              transform: 'rotate(-45deg)'
            }} />
          </button>
        </div>
      )}
    </>
  );
}

type EventType = 'all' | 'club' | 'restaurant-bar' | 'private' | 'fashion' | 'casting';

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState<EventType>('all');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';

      if (direction !== scrollDirectionRef.current && Math.abs(scrollY - lastScrollY.current) > 10) {
        scrollDirectionRef.current = direction;
        setScrollDirection(direction);
      }

      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  // Demo events for preview
  const demoEvents = [
    {
      id: '1',
      title: 'ZMR Summer Gala 2025',
      slug: 'zmr-summer-gala-2025',
      description: 'Rejoignez-nous pour une soirée exceptionnelle célébrant les talents de ZMR Models Agency. Une nuit glamour avec défilé de mode, cocktails et networking.',
      date: '2025-02-14T20:00:00.000Z',
      endDate: '2025-02-15T03:00:00.000Z',
      location: 'Le Palais Royal, 75001 Paris',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      type: 'fashion',
      capacity: 200,
      isFree: false,
      ticketTypes: [
        { name: 'Standard', price: 75, quantity: 100 },
        { name: 'VIP', price: 150, quantity: 50 }
      ]
    },
    {
      id: '2',
      title: 'Exclusive Night Club Party',
      slug: 'exclusive-night-club-party',
      description: 'Une soirée exclusive avec les plus beaux mannequins de l\'agence. DJ set, open bar et ambiance garantie.',
      date: '2025-01-25T23:00:00.000Z',
      endDate: '2025-01-26T05:00:00.000Z',
      location: 'Club Étoile, 75008 Paris',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      type: 'club',
      capacity: 300,
      isFree: false,
      ticketTypes: [
        { name: 'Entrée', price: 25, quantity: 250 },
        { name: 'Table VIP', price: 200, quantity: 10 }
      ]
    },
    {
      id: '3',
      title: 'Fashion Week Afterparty',
      slug: 'fashion-week-afterparty',
      description: 'L\'afterparty officielle de la Fashion Week. Rencontrez les designers et mannequins dans une ambiance chic.',
      date: '2025-03-08T22:00:00.000Z',
      location: 'Maison Blanche, 75016 Paris',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      type: 'private',
      capacity: 150,
      isFree: false,
      ticketTypes: [
        { name: 'Invitation', price: 100, quantity: 150 }
      ]
    },
    {
      id: '4',
      title: 'Casting Nouvelle Collection',
      slug: 'casting-nouvelle-collection',
      description: 'Casting ouvert pour la nouvelle collection printemps-été 2025. Tous profils bienvenus.',
      date: '2025-01-20T10:00:00.000Z',
      endDate: '2025-01-20T18:00:00.000Z',
      location: 'Studio ZMR, 75003 Paris',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      type: 'casting',
      capacity: 50,
      isFree: true
    }
  ];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events?published=true&upcoming=true');
        if (response.ok) {
          const data = await response.json();
          // Use demo events if no events from database
          setEvents(data.length > 0 ? data : demoEvents);
        } else {
          // Fallback to demo events if API fails
          setEvents(demoEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Fallback to demo events if API fails
        setEvents(demoEvents);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = selectedType === 'all'
    ? events
    : events.filter(e => e.type === selectedType);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    };
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'club': 'Club',
      'restaurant-bar': 'Restaurant & Bar',
      'private': 'Private Event',
      'fashion': 'Fashion Show',
      'casting': 'Casting'
    };
    return labels[type] || type;
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      <Navbar scrollDirection={scrollDirection} />
      <main className="events-main" style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        paddingTop: '200px',
        paddingBottom: '80px'
      }}>
        {/* Filter Buttons */}
        <div className="events-filters" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          padding: '0 20px'
        }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'club', label: 'Club' },
            { value: 'restaurant-bar', label: 'Restaurants & Bars' },
            { value: 'private', label: 'Private' },
            { value: 'fashion', label: 'Fashion' }
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value as EventType)}
              style={{
                background: 'none',
                border: 'none',
                color: selectedType === type.value ? 'white' : 'rgba(255, 255, 255, 0.4)',
                fontSize: '14px',
                fontWeight: 300,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '8px 16px',
                transition: 'color 0.3s',
                borderBottom: selectedType === type.value ? '1px solid white' : '1px solid transparent'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '18px',
            padding: '100px 20px'
          }}>
            Aucun événement à venir pour le moment
          </div>
        ) : (
          <div className="events-grid" style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '40px'
          }}>
            {filteredEvents.map((event) => {
              const dateInfo = formatDate(event.date);
              const lowestPrice = event.isFree ? 0 :
                (event.ticketTypes && Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0
                  ? Math.min(...(event.ticketTypes as any[]).map(t => t.price))
                  : 0);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'white'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#111',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    {/* Image */}
                    <div style={{
                      position: 'relative',
                      aspectRatio: '16/9',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={event.coverImage || event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
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
                      {/* Date Badge */}
                      <div className="date-badge" style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '12px 16px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        minWidth: '60px'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>
                          {dateInfo.day}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em' }}>
                          {dateInfo.month}
                        </div>
                      </div>

                      {/* Type Badge */}
                      <div className="type-badge" style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}>
                        {getTypeLabel(event.type)}
                      </div>

                      {/* Sold Out Badge */}
                      {event.isSoldOut && (
                        <div style={{
                          position: 'absolute',
                          bottom: '16px',
                          right: '16px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase'
                        }}>
                          SOLD OUT
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="event-card-content" style={{ padding: '24px' }}>
                      <h3 style={{
                        fontSize: '22px',
                        fontWeight: 500,
                        marginBottom: '12px',
                        letterSpacing: '0.02em'
                      }}>
                        {event.title}
                      </h3>

                      <div className="event-card-info" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '12px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '14px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {event.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {dateInfo.time}
                        </span>
                      </div>

                      <div className="event-card-footer" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: event.isFree ? '#10b981' : 'white'
                        }}>
                          {event.isFree ? 'GRATUIT' : `À partir de ${lowestPrice}€`}
                        </div>
                        <div style={{
                          padding: '8px 16px',
                          border: '1px solid white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          transition: 'all 0.3s'
                        }}>
                          RÉSERVER
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
