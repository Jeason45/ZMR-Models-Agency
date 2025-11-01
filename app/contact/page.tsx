'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  useEffect(() => {
    // Charger le script Calendly
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
      color: 'white'
    }}>
      {/* Back Arrow */}
      <Link
        href="/"
        style={{
          position: 'fixed',
          top: '40px',
          left: '40px',
          zIndex: 100,
          color: 'white',
          fontSize: '32px',
          textDecoration: 'none',
          transition: 'opacity 0.3s',
          fontWeight: 200
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        ←
      </Link>

      {/* Hero Section */}
      <div style={{
        paddingTop: '120px',
        paddingBottom: '60px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '120px 20px 60px'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 200,
          marginBottom: '20px',
          letterSpacing: '0.05em'
        }}>
          PRENEZ RENDEZ-VOUS
        </h1>
        <div style={{
          width: '60px',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          margin: '0 auto 30px'
        }} />
        <p style={{
          fontSize: '1.1rem',
          color: '#9ca3af',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6,
          fontWeight: 300,
          letterSpacing: '0.02em'
        }}>
          Réservez un créneau pour discuter de votre projet avec notre agence.
          Choisissez l'horaire qui vous convient le mieux.
        </p>
      </div>

      {/* Calendly Widget */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 20px 60px',
        minHeight: '700px'
      }}>
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/jlwebdesign33?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=1a1a1a&text_color=ffffff&primary_color=a855f7"
          style={{
            minWidth: '320px',
            height: '700px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        />
      </div>

      {/* Info Section */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '60px 20px 80px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
        }}>
          <div style={{
            padding: '40px 30px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '20px'
            }}>📞</div>
            <h3 style={{
              fontSize: '0.9rem',
              marginBottom: '12px',
              color: '#fff',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Consultation personnalisée
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Échangez directement avec notre équipe pour vos projets
            </p>
          </div>

          <div style={{
            padding: '40px 30px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '20px'
            }}>⏰</div>
            <h3 style={{
              fontSize: '0.9rem',
              marginBottom: '12px',
              color: '#fff',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Flexible et rapide
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Choisissez le créneau qui vous convient le mieux
            </p>
          </div>

          <div style={{
            padding: '40px 30px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '20px'
            }}>✉️</div>
            <h3 style={{
              fontSize: '0.9rem',
              marginBottom: '12px',
              color: '#fff',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Confirmation automatique
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Recevez une confirmation par email instantanément
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
