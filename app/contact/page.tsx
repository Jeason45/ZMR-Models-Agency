'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
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
    <main style={{
      minHeight: '100vh',
      background: '#000000',
      color: 'white',
      padding: 'clamp(16px, 3vh, 40px) clamp(16px, 2vw, 24px)'
    }}>
      {/* Back Arrow */}
      <Link
        href="/"
        style={{
          position: 'fixed',
          top: 'clamp(20px, 5vw, 40px)',
          left: 'clamp(20px, 5vw, 40px)',
          zIndex: 100,
          color: 'white',
          fontSize: 'clamp(24px, 5vw, 32px)',
          textDecoration: 'none',
          transition: 'opacity 0.3s',
          fontWeight: 200
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        ←
      </Link>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(16px, 4vw, 20px)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(16px, 2.5vh, 32px)'
        }}>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
            fontWeight: 200,
            marginBottom: 'clamp(8px, 1.5vh, 16px)',
            letterSpacing: 'clamp(0.05em, 3vw, 0.2em)',
            textTransform: 'uppercase'
          }}>
            Contactez-nous
          </h1>
          <div style={{
            width: 'clamp(30px, 6vw, 40px)',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: '0 auto'
          }} />
        </div>

        {/* Success Message */}
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
            fontWeight: 500,
            maxWidth: '700px',
            margin: '0 auto 30px'
          }}>
            Merci pour votre message ! Nous vous contacterons très bientôt.
          </div>
        )}

        {/* Error Message */}
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
            fontWeight: 500,
            maxWidth: '700px',
            margin: '0 auto 30px'
          }}>
            {error}
          </div>
        )}

        {/* Step 1: Choose Type */}
        <div style={{
          marginBottom: 'clamp(16px, 2.5vh, 36px)'
        }}>
          <h2 style={{
            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
            fontWeight: 400,
            marginBottom: 'clamp(14px, 2vh, 28px)',
            textAlign: 'center',
            letterSpacing: 'clamp(0.15em, 2vw, 0.3em)',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase'
          }}>
            Vous êtes
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '1px',
            maxWidth: '1000px',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.1)'
          }}>
            {/* Professional Card */}
            <div
              onClick={() => setSelectedType('professional')}
              onMouseOver={(e) => {
                const underline = e.currentTarget.querySelector('.underline') as HTMLElement;
                if (underline && selectedType !== 'professional') underline.style.opacity = '1';
              }}
              onMouseOut={(e) => {
                const underline = e.currentTarget.querySelector('.underline') as HTMLElement;
                if (underline && selectedType !== 'professional') underline.style.opacity = '0';
              }}
              style={{
                padding: 'clamp(18px, 2.5vh, 40px) clamp(20px, 3vw, 50px)',
                background: '#000000',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                position: 'relative'
              }}
            >
              <h3
                style={{
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 200,
                  marginBottom: 'clamp(12px, 2vw, 18px)',
                  textAlign: 'center',
                  letterSpacing: 'clamp(0.15em, 3vw, 0.3em)',
                  textTransform: 'uppercase',
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                Professionnel
                <span
                  className="underline"
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '1px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 80%, rgba(255,255,255,0) 100%)',
                    opacity: selectedType === 'professional' ? 1 : 0,
                    transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </h3>

              <p style={{
                fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 2.2,
                textAlign: 'center',
                fontWeight: 300,
                letterSpacing: '0.1em'
              }}>
                RECHERCHE DE TALENTS
              </p>
            </div>

            {/* Model Card */}
            <div
              onClick={() => setSelectedType('model')}
              onMouseOver={(e) => {
                const underline = e.currentTarget.querySelector('.underline') as HTMLElement;
                if (underline && selectedType !== 'model') underline.style.opacity = '1';
              }}
              onMouseOut={(e) => {
                const underline = e.currentTarget.querySelector('.underline') as HTMLElement;
                if (underline && selectedType !== 'model') underline.style.opacity = '0';
              }}
              style={{
                padding: 'clamp(18px, 2.5vh, 40px) clamp(20px, 3vw, 50px)',
                background: '#000000',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                position: 'relative'
              }}
            >
              <h3
                style={{
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 200,
                  marginBottom: 'clamp(12px, 2vw, 18px)',
                  textAlign: 'center',
                  letterSpacing: 'clamp(0.15em, 3vw, 0.3em)',
                  textTransform: 'uppercase',
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                Devenir Mannequin
                <span
                  className="underline"
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '1px',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 80%, rgba(255,255,255,0) 100%)',
                    opacity: selectedType === 'model' ? 1 : 0,
                    transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </h3>

              <p style={{
                fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                color: 'rgba(255,255,255,0.35)',
                lineHeight: 2.2,
                textAlign: 'center',
                fontWeight: 300,
                letterSpacing: '0.1em'
              }}>
                REJOINDRE L'AGENCE
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Form */}
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '0 clamp(10px, 2vw, 20px)'
        }}>
          <h2 style={{
            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
            fontWeight: 400,
            marginBottom: 'clamp(14px, 2vh, 28px)',
            textAlign: 'center',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase'
          }}>
            Vos informations
          </h2>

          <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={{ marginBottom: 'clamp(14px, 2vh, 24px)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                  letterSpacing: 'clamp(0.15em, 2vw, 0.3em)',
                  textTransform: 'uppercase',
                  marginBottom: 'clamp(8px, 1.2vh, 14px)',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 400
                }}>
                  Nom Complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 1.5vh, 14px) 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: 300,
                    letterSpacing: '0.05em',
                    outline: 'none',
                    transition: 'border-color 0.4s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 'clamp(14px, 2vh, 24px)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                  letterSpacing: 'clamp(0.15em, 2vw, 0.3em)',
                  textTransform: 'uppercase',
                  marginBottom: 'clamp(8px, 1.2vh, 14px)',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 400
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 1.5vh, 14px) 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: 300,
                    letterSpacing: '0.05em',
                    outline: 'none',
                    transition: 'border-color 0.4s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                  }}
                />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 'clamp(14px, 2vh, 24px)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                  letterSpacing: 'clamp(0.15em, 2vw, 0.3em)',
                  textTransform: 'uppercase',
                  marginBottom: 'clamp(8px, 1.2vh, 14px)',
                  color: 'rgba(255,255,255,0.5)',
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
                    padding: 'clamp(10px, 1.5vh, 14px) 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: 300,
                    letterSpacing: '0.05em',
                    outline: 'none',
                    transition: 'border-color 0.4s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                  }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: 'clamp(14px, 2vh, 28px)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                  letterSpacing: 'clamp(0.15em, 2vw, 0.3em)',
                  textTransform: 'uppercase',
                  marginBottom: 'clamp(8px, 1.2vh, 14px)',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 400
                }}>
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 1.5vh, 14px) 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: 300,
                    letterSpacing: '0.05em',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.4s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)';
                  }}
                />
              </div>

              {/* Callback Option */}
              <div style={{ marginBottom: 'clamp(14px, 2vh, 24px)', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setWantCallback(!wantCallback)}
                  style={{
                    padding: 'clamp(10px, 1.5vh, 14px) clamp(30px, 6vw, 50px)',
                    background: wantCallback ? 'rgba(255,255,255,0.05)' : 'transparent',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: wantCallback ? 'white' : 'rgba(255,255,255,0.6)',
                    fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                    letterSpacing: 'clamp(0.1em, 2vw, 0.25em)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                    fontWeight: 400
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                    if (!wantCallback) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    }
                  }}
                >
                  {wantCallback ? 'Rappel souhaité' : 'Je souhaite être rappelé'}
                </button>
              </div>

              {/* Day and Time Selection (only if callback wanted) */}
              {wantCallback && (
                <>
                  {/* Day Selection */}
                  <div style={{ marginBottom: 'clamp(14px, 2vh, 28px)' }}>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      marginBottom: 'clamp(10px, 1.5vh, 18px)',
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.5)',
                      fontWeight: 400
                    }}>
                      Choisissez un jour
                    </label>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100px, 100%), 1fr))',
                      gap: 'clamp(8px, 1.5vw, 10px)'
                    }}>
                      {getNextDays().map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => {
                            setSelectedDay(day.value);
                            setSelectedSlot(null); // Reset time when day changes
                          }}
                          style={{
                            padding: 'clamp(8px, 1.2vh, 10px) clamp(12px, 2.5vw, 16px)',
                            background: selectedDay === day.value ? 'rgba(255,255,255,0.05)' : 'transparent',
                            border: selectedDay === day.value ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                            color: selectedDay === day.value ? 'white' : 'rgba(255,255,255,0.5)',
                            fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: 400,
                            textAlign: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                            e.currentTarget.style.color = 'white';
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

                  {/* Time Slots (only if day is selected) */}
                  {selectedDay && (
                    <div style={{ marginBottom: 'clamp(14px, 2vh, 28px)' }}>
                      <label style={{
                        display: 'block',
                        fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        marginBottom: 'clamp(10px, 1.5vh, 18px)',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: 400
                      }}>
                        Choisissez l'heure
                      </label>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(120px, 100%), 1fr))',
                        gap: 'clamp(8px, 1.5vw, 10px)'
                      }}>
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            style={{
                              padding: 'clamp(8px, 1.2vh, 10px) clamp(12px, 2.5vw, 16px)',
                              background: selectedSlot === slot ? 'rgba(255,255,255,0.05)' : 'transparent',
                              border: selectedSlot === slot ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                              color: selectedSlot === slot ? 'white' : 'rgba(255,255,255,0.5)',
                              fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
                              letterSpacing: '0.05em',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontWeight: 400
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                              e.currentTarget.style.color = 'white';
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
                </>
              )}

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: 'clamp(12px, 2vh, 16px) clamp(40px, 8vw, 60px)',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
                    letterSpacing: 'clamp(0.15em, 2vw, 0.3em)',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.4s ease',
                    fontWeight: 400,
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                    }
                  }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
      </div>
    </main>
  );
}
