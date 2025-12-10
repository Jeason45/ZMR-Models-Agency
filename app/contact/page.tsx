'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MemberIcon from '@/components/MemberIcon';

// Styles responsive
const mobileStyles = `
  /* 1024px - Tablette */
  @media (max-width: 1024px) {
    .contact-container {
      padding: 120px 40px 70px !important;
    }
    .contact-header h1 {
      font-size: 2.8rem !important;
    }
    .contact-cards {
      max-width: 580px !important;
    }
    .contact-card {
      padding: 22px 18px !important;
    }
    .contact-card svg {
      width: 22px !important;
      height: 22px !important;
    }
    .type-cards-grid {
      max-width: 460px !important;
      gap: 14px !important;
    }
    .type-card {
      padding: 24px 20px !important;
    }
  }

  /* 768px - Mobile */
  @media (max-width: 768px) {
    .navbar-logo h1 {
      font-size: 28px !important;
    }
    .navbar-logo p {
      font-size: 7px !important;
      margin-top: 4px !important;
    }
    .contact-container {
      padding: 100px 24px 60px !important;
    }
    .contact-header {
      margin-bottom: 28px !important;
    }
    .contact-header h1 {
      font-size: 2rem !important;
      margin-bottom: 10px !important;
    }
    .contact-header p {
      display: none !important;
    }
    .contact-cards {
      display: flex !important;
      justify-content: center !important;
      gap: 0 !important;
      margin-bottom: 28px !important;
      background: transparent !important;
      max-width: 100% !important;
    }
    .contact-card {
      padding: 12px 14px !important;
      flex: 0 0 auto !important;
      background: transparent !important;
    }
    .contact-card .card-label {
      display: none !important;
    }
    .contact-card svg {
      width: 20px !important;
      height: 20px !important;
      margin-bottom: 6px !important;
    }
    .contact-card .card-value {
      font-size: 11px !important;
    }
    .type-selection {
      margin-bottom: 24px !important;
    }
    .type-cards-grid {
      grid-template-columns: 1fr 1fr !important;
      gap: 10px !important;
      max-width: 100% !important;
    }
    .type-card {
      padding: 18px 14px !important;
    }
    .type-card svg {
      width: 22px !important;
      height: 22px !important;
      margin-bottom: 8px !important;
    }
    .type-card h3 {
      font-size: 12px !important;
      margin-bottom: 0 !important;
    }
    .type-card p {
      display: none !important;
    }
    .divider {
      margin-bottom: 24px !important;
    }
    .form-grid {
      grid-template-columns: 1fr !important;
      gap: 18px !important;
      margin-bottom: 18px !important;
    }
    .form-field {
      margin-bottom: 18px !important;
    }
    .callback-box {
      margin-bottom: 18px !important;
      padding: 16px !important;
    }
    .day-time-box {
      padding: 18px !important;
      margin-bottom: 22px !important;
    }
    .form-field label {
      font-size: 9px !important;
      margin-bottom: 10px !important;
    }
    .form-field input,
    .form-field textarea {
      font-size: 15px !important;
      padding: 12px 0 !important;
    }
    .form-field textarea {
      min-height: 80px !important;
    }
    .callback-box label span {
      font-size: 12px !important;
    }
    .days-grid button,
    .times-grid button {
      padding: 9px 14px !important;
      font-size: 11px !important;
    }
    .submit-btn {
      padding: 16px 48px !important;
      font-size: 11px !important;
    }
  }
  @media (max-width: 480px) {
    .contact-container {
      padding: 90px 20px 50px !important;
    }
    .contact-header h1 {
      font-size: 1.7rem !important;
    }
    .contact-card {
      padding: 10px 12px !important;
    }
    .contact-card svg {
      width: 18px !important;
      height: 18px !important;
    }
    .contact-card .card-value {
      font-size: 10px !important;
    }
    .type-card {
      padding: 14px 10px !important;
    }
    .type-card svg {
      width: 20px !important;
      height: 20px !important;
    }
    .type-card h3 {
      font-size: 11px !important;
    }
    .form-field label {
      font-size: 9px !important;
      margin-bottom: 8px !important;
    }
    .form-field input,
    .form-field textarea {
      font-size: 14px !important;
      padding: 10px 0 !important;
    }
    .form-field textarea {
      min-height: 70px !important;
    }
    .callback-box label span {
      font-size: 11px !important;
    }
    .days-grid button,
    .times-grid button {
      padding: 7px 12px !important;
      font-size: 10px !important;
    }
    .submit-btn {
      padding: 14px 40px !important;
      font-size: 10px !important;
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
          className="navbar-logo"
          style={{
            position: 'fixed',
            top: scrollDirection === 'down' ? '-300px' : 'clamp(16px, 3vh, 24px)',
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
              width: '32px',
              height: '32px',
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
              marginBottom: '8px'
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
              zIndex: 50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
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

export default function ContactPage() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');

  const [selectedType, setSelectedType] = useState<'professional' | 'model' | null>(null);
  const [wantCallback, setWantCallback] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Scroll detection effect
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

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        label: i === 0 ? 'Aujourd\'hui' : i === 1 ? 'Demain' : date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
        value: date.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          selectedType,
          wantCallback,
          selectedDay,
          selectedSlot,
          source: 'website'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSelectedType(null);
      setWantCallback(false);
      setSelectedDay(null);
      setSelectedSlot(null);

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-main" style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      position: 'relative'
    }}>
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      <Navbar scrollDirection={scrollDirection} />

      {/* Subtle gradient background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div className="contact-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '140px 48px 80px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Hero Header */}
        <div className="contact-header" style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 200,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            lineHeight: 1.1
          }}>
            Contactez-nous
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '420px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: 300
          }}>
            Une question, un projet ou une candidature ?
            Notre équipe est à votre écoute.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-cards" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(255,255,255,0.08)',
          maxWidth: '680px',
          margin: '0 auto 48px'
        }}>
          {/* Email */}
          <a
            href="mailto:contact@zmrmodels.com"
            className="contact-card"
            style={{
              padding: '28px 24px',
              background: '#0a0a0a',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.4s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#0a0a0a';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={{ marginBottom: '10px' }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="card-label" style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '6px',
              fontWeight: 400,
              textTransform: 'uppercase'
            }}>
              Email
            </p>
            <p className="card-value" style={{
              fontSize: '14px',
              fontWeight: 300,
              letterSpacing: '0.02em'
            }}>
              contact@zmrmodels.com
            </p>
          </a>

          {/* Phone */}
          <a
            href="tel:+33123456789"
            className="contact-card"
            style={{
              padding: '28px 24px',
              background: '#0a0a0a',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.4s ease',
              textAlign: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#0a0a0a';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={{ marginBottom: '10px' }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="card-label" style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '6px',
              fontWeight: 400,
              textTransform: 'uppercase'
            }}>
              Téléphone
            </p>
            <p className="card-value" style={{
              fontSize: '14px',
              fontWeight: 300,
              letterSpacing: '0.02em'
            }}>
              +33 1 23 45 67 89
            </p>
          </a>

          {/* Address */}
          <div
            className="contact-card"
            style={{
              padding: '28px 24px',
              background: '#0a0a0a',
              textAlign: 'center'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" style={{ marginBottom: '10px' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="card-label" style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '6px',
              fontWeight: 400,
              textTransform: 'uppercase'
            }}>
              Adresse
            </p>
            <p className="card-value" style={{
              fontSize: '14px',
              fontWeight: 300,
              letterSpacing: '0.02em'
            }}>
              Paris, France
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '24px 32px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginBottom: '40px',
            color: '#10b981',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 400,
            maxWidth: '700px',
            margin: '0 auto 40px',
            letterSpacing: '0.02em'
          }}>
            Merci pour votre message ! Nous vous contacterons très bientôt.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '24px 32px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            marginBottom: '40px',
            color: '#ef4444',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 400,
            maxWidth: '700px',
            margin: '0 auto 40px',
            letterSpacing: '0.02em'
          }}>
            {error}
          </div>
        )}

        {/* Main Form Section */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* Type Selection */}
          <div className="type-selection" style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '16px',
              fontWeight: 400,
              textTransform: 'uppercase',
              textAlign: 'center'
            }}>
              Vous êtes
            </p>

            <div className="type-cards-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              maxWidth: '520px',
              margin: '0 auto'
            }}>
              {/* Professional Card */}
              <button
                type="button"
                onClick={() => setSelectedType('professional')}
                className="type-card"
                style={{
                  padding: '28px 24px',
                  background: selectedType === 'professional' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: selectedType === 'professional' ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  textAlign: 'center',
                  color: 'white'
                }}
                onMouseOver={(e) => {
                  if (selectedType !== 'professional') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedType !== 'professional') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedType === 'professional' ? 'white' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" style={{ marginBottom: '12px', transition: 'stroke 0.3s' }}>
                  <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}>
                  Professionnel
                </h3>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.08em'
                }}>
                  Recherche de talents
                </p>
              </button>

              {/* Model Card */}
              <button
                type="button"
                onClick={() => setSelectedType('model')}
                className="type-card"
                style={{
                  padding: '28px 24px',
                  background: selectedType === 'model' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: selectedType === 'model' ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  textAlign: 'center',
                  color: 'white'
                }}
                onMouseOver={(e) => {
                  if (selectedType !== 'model') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedType !== 'model') {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedType === 'model' ? 'white' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" style={{ marginBottom: '12px', transition: 'stroke 0.3s' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 300,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}>
                  Devenir Mannequin
                </h3>
                <p style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.08em'
                }}>
                  Candidature agence
                </p>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="divider" style={{
            width: '50px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            margin: '0 auto 32px'
          }} />

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px 32px',
              marginBottom: '24px'
            }}>
              {/* Name */}
              <div className="form-field">
                <label style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 400
                }}>
                  Nom Complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                    outline: 'none',
                    transition: 'border-color 0.4s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                  }}
                  placeholder="Votre nom"
                />
              </div>

              {/* Email */}
              <div className="form-field">
                <label style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 400
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                    outline: 'none',
                    transition: 'border-color 0.4s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                  }}
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-field" style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '12px',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 400
              }}>
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                  outline: 'none',
                  transition: 'border-color 0.4s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                }}
                placeholder="+33 6 00 00 00 00"
              />
            </div>

            {/* Message */}
            <div className="form-field" style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '10px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '12px',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 400
              }}>
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.4s ease',
                  lineHeight: 1.6
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = 'rgba(255,255,255,0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                }}
                placeholder="Décrivez votre projet ou votre demande..."
              />
            </div>

            {/* Callback Option */}
            <div className="callback-box" style={{
              marginBottom: '24px',
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                color: wantCallback ? 'white' : 'rgba(255,255,255,0.6)',
                transition: 'color 0.3s'
              }}>
                <div
                  onClick={() => setWantCallback(!wantCallback)}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: wantCallback ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    background: wantCallback ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                >
                  {wantCallback && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                  fontWeight: 300
                }}>
                  Je souhaite être rappelé
                </span>
              </label>
            </div>

            {/* Day and Time Selection (only if callback wanted) */}
            {wantCallback && (
              <div className="day-time-box" style={{
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '28px'
              }}>
                {/* Day Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '10px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    marginBottom: '14px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 400
                  }}>
                    Choisissez un jour
                  </label>

                  <div className="days-grid" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center'
                  }}>
                    {getNextDays().map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => {
                          setSelectedDay(day.value);
                          setSelectedSlot(null);
                        }}
                        style={{
                          padding: '10px 16px',
                          background: selectedDay === day.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                          border: selectedDay === day.value ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                          color: selectedDay === day.value ? 'white' : 'rgba(255,255,255,0.5)',
                          fontSize: '12px',
                          letterSpacing: '0.05em',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontWeight: 400
                        }}
                        onMouseOver={(e) => {
                          if (selectedDay !== day.value) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (selectedDay !== day.value) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                          }
                        }}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDay && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '10px',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      marginBottom: '14px',
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.4)',
                      fontWeight: 400
                    }}>
                      Choisissez l'heure
                    </label>

                    <div className="times-grid" style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      justifyContent: 'center'
                    }}>
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '10px 16px',
                            background: selectedSlot === slot ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: selectedSlot === slot ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                            color: selectedSlot === slot ? 'white' : 'rgba(255,255,255,0.5)',
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: 400
                          }}
                          onMouseOver={(e) => {
                            if (selectedSlot !== slot) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (selectedSlot !== slot) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                            }
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
                style={{
                  padding: '18px 72px',
                  background: 'white',
                  border: 'none',
                  color: '#0a0a0a',
                  fontSize: '12px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.4s ease',
                  fontWeight: 500,
                  opacity: loading ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
