'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Professional',
    message: '',
    requestCallback: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Charger les créneaux disponibles depuis l'API
  useEffect(() => {
    if (showCalendar && availableSlots.length === 0) {
      fetchAvailableSlots();
    }
  }, [showCalendar]);

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await fetch('/api/available-slots?days=7');
      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Grouper les créneaux par date
  const getSlotsByDate = () => {
    const grouped: { [key: string]: any[] } = {};
    availableSlots.forEach(slot => {
      const date = new Date(slot.date);
      const dateKey = date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push({ ...slot, dateObj: date });
    });
    return grouped;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Créer le contact
      const contactResponse = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contactMethod: formData.requestCallback ? 'callback' : 'email'
        }),
      });

      if (!contactResponse.ok) {
        throw new Error('Failed to submit form');
      }

      const contact = await contactResponse.json();

      // Si un créneau a été sélectionné, créer un appointment
      if (selectedSlot && formData.requestCallback) {
        const appointmentDate = new Date(selectedSlot.date);
        const [hours, minutes] = selectedSlot.time.split(':');
        appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contactId: contact.id,
            date: appointmentDate.toISOString(),
            duration: 30,
          }),
        });
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', type: 'Professional', message: '', requestCallback: false });
      setSelectedSlot(null);
      setTimeout(() => setSuccess(false), 5000);
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
      backgroundColor: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background gradient */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        animation: 'pulse 8s ease-in-out infinite'
      }} />

      {/* Back button */}
      <Link href="/" style={{
        position: 'fixed',
        top: '40px',
        left: '40px',
        color: 'white',
        fontSize: '28px',
        textDecoration: 'none',
        zIndex: 100,
        transition: 'opacity 0.3s',
        opacity: 0.7,
        fontWeight: 200
      }}
      onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
      onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}>
        ← Retour
      </Link>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px 20px 60px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 200,
            letterSpacing: '0.15em',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>
            Get in Touch
          </h1>
          <div style={{
            width: '60px',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            margin: '0 auto'
          }} />
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            maxWidth: '800px',
            width: '100%',
            padding: '40px',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '4px',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>✓</div>
            <p style={{
              color: '#10b981',
              fontSize: '18px',
              fontWeight: 300,
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Message envoyé avec succès
            </p>
            <p style={{
              color: 'rgba(16, 185, 129, 0.7)',
              fontSize: '14px',
              fontWeight: 300
            }}>
              Nous vous recontacterons très prochainement
            </p>
          </div>
        )}

        {!success && (
          <div style={{
            maxWidth: '800px',
            width: '100%'
          }}>
            <form onSubmit={handleSubmit}>
              {/* Type Selection - Tabs Style */}
              <div style={{ marginBottom: '60px' }}>
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {[
                    { value: 'Professional', label: 'Demande Professionnelle' },
                    { value: 'Model Application', label: 'Devenir Mannequin' }
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: tab.value })}
                      style={{
                        flex: 1,
                        padding: '18px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: `2px solid ${formData.type === tab.value ? 'white' : 'transparent'}`,
                        color: formData.type === tab.value ? 'white' : 'rgba(255,255,255,0.4)',
                        fontSize: '13px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontWeight: 400
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                display: 'grid',
                gap: '32px'
              }}>
                {/* Name */}
                <div>
                  <label style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    fontWeight: 400
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
                      padding: '18px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.15)',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 300,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      boxSizing: 'border-box',
                      letterSpacing: '0.03em'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                    onBlur={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    fontWeight: 400
                  }}>
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '18px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.15)',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 300,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      boxSizing: 'border-box',
                      letterSpacing: '0.03em'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                    onBlur={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    fontWeight: 400
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
                      padding: '18px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.15)',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 300,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      boxSizing: 'border-box',
                      letterSpacing: '0.03em'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                    onBlur={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    fontWeight: 400
                  }}>
                    Votre message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '18px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.15)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 300,
                      outline: 'none',
                      transition: 'border-color 0.3s',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      letterSpacing: '0.03em',
                      lineHeight: 1.6
                    }}
                    onFocus={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.5)'}
                    onBlur={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.15)'}
                  />
                </div>

                {/* Appointment Selection */}
                <div style={{
                  padding: '24px 0',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '2px',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '14px',
                      fontWeight: 300,
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>
                      {selectedSlot
                        ? `Créneau sélectionné : ${selectedSlot.date.toLocaleDateString('fr-FR')} à ${selectedSlot.time}`
                        : 'Je souhaite être rappelé(e) - Choisir un créneau'
                      }
                    </span>
                    <span style={{ fontSize: '18px' }}>{showCalendar ? '×' : '+'}</span>
                  </button>

                  {/* Calendar Modal */}
                  {showCalendar && (
                    <div style={{
                      marginTop: '24px',
                      padding: '32px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px'
                    }}>
                      <h3 style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 300,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '24px',
                        textAlign: 'center'
                      }}>
                        Sélectionnez un créneau
                      </h3>

                      {loadingSlots ? (
                        <div style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '14px',
                          letterSpacing: '0.05em'
                        }}>
                          Chargement des disponibilités...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '14px',
                          letterSpacing: '0.05em'
                        }}>
                          Aucun créneau disponible pour le moment. Veuillez nous contacter par email.
                        </div>
                      ) : (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px'
                        }}>
                          {Object.entries(getSlotsByDate()).map(([dateKey, slots]) => {
                            const firstSlot = slots[0];
                            const date = firstSlot.dateObj;

                            return (
                              <div key={dateKey} style={{
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                paddingBottom: '16px'
                              }}>
                                <p style={{
                                  color: 'rgba(255,255,255,0.6)',
                                  fontSize: '12px',
                                  fontWeight: 400,
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                  marginBottom: '12px'
                                }}>
                                  {date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {slots.map((slot, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setSelectedSlot({ date: slot.dateObj, time: slot.time });
                                        setFormData({ ...formData, requestCallback: true });
                                        setShowCalendar(false);
                                      }}
                                      style={{
                                        padding: '10px 12px',
                                        backgroundColor: selectedSlot?.date.toDateString() === date.toDateString() && selectedSlot?.time === slot.time
                                          ? 'rgba(255,255,255,0.15)'
                                          : 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '2px',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '13px',
                                        fontWeight: 300,
                                        letterSpacing: '0.03em',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'center'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                      }}
                                      onMouseOut={(e) => {
                                        const isSelected = selectedSlot?.date.toDateString() === date.toDateString() && selectedSlot?.time === slot.time;
                                        e.currentTarget.style.backgroundColor = isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                      }}
                                    >
                                      {slot.time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '2px',
                    color: '#ef4444',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '18px 32px',
                    backgroundColor: 'white',
                    color: '#000',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: loading ? 0.6 : 1,
                    borderRadius: '2px',
                    marginTop: '16px'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contact Info */}
        {!success && (
          <div style={{
            marginTop: '100px',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              Ou contactez-nous directement
            </p>
            <a
              href="mailto:info@zmrmodels.com"
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '16px',
                fontWeight: 300,
                textDecoration: 'none',
                display: 'block',
                marginBottom: '12px',
                letterSpacing: '0.03em',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'white'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              info@zmrmodels.com
            </a>
            <a
              href="https://www.instagram.com/zmrmodels/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                fontWeight: 300,
                textDecoration: 'none',
                letterSpacing: '0.03em',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              @zmrmodels
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
