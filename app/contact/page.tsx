'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
          source: 'website'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          CONTACTEZ-NOUS
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
          Vous avez un projet ? Une question ? N'hésitez pas à nous contacter.
          Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>

      {/* Form Section */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '0 20px 80px'
      }}>
        {success && (
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            marginBottom: '30px',
            color: '#10b981',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500
          }}>
            Merci pour votre message ! Nous vous contacterons très bientôt.
          </div>
        )}

        {error && (
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            marginBottom: '30px',
            color: '#ef4444',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px'
        }}>
          {/* Name */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9ca3af'
            }}>
              Nom complet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 300,
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(168,85,247,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9ca3af'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 300,
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(168,85,247,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9ca3af'
            }}>
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 300,
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(168,85,247,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          {/* Message */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9ca3af'
            }}>
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 300,
                transition: 'all 0.3s',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(168,85,247,0.5)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '18px 40px',
              backgroundColor: loading ? 'rgba(168,85,247,0.5)' : 'rgba(168,85,247,0.9)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginTop: '10px'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#a855f7';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.9)';
            }}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
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
            }}>⏱️</div>
            <h3 style={{
              fontSize: '0.9rem',
              marginBottom: '12px',
              color: '#fff',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Réponse rapide
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Nous vous répondons sous 24h ouvrées
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
            }}>🔒</div>
            <h3 style={{
              fontSize: '0.9rem',
              marginBottom: '12px',
              color: '#fff',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Confidentialité
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Vos données sont protégées et sécurisées
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
            }}>💼</div>
            <h3 style={{
              fontSize: '0.9rem',
              marginBottom: '12px',
              color: '#fff',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Professionnel
            </h3>
            <p style={{
              color: '#9ca3af',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 300
            }}>
              Une équipe dédiée à votre projet
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
