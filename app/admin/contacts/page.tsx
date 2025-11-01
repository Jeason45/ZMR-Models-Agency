'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pour l'instant, on affiche un message explicatif
    // Les contacts Calendly seront synchronisés via leur API
    setLoading(false);
  }, []);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: '280px',
        padding: '40px'
      }}>
        <div style={{
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Contacts
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Gérez vos contacts et rendez-vous
          </p>
        </div>

        {/* Info Card */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '32px' }}>📅</span>
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '4px'
              }}>
                Synchronisation Calendly
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b'
              }}>
                Tous vos rendez-vous Calendly sont gérés via votre dashboard Calendly
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '24px'
          }}>
            <a
              href="https://calendly.com/app/scheduled_events/user/me"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                padding: '20px',
                backgroundColor: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dcfce7';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
              }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#166534',
                  marginBottom: '4px'
                }}>
                  Mes événements planifiés
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#16a34a'
                }}>
                  Voir tous les RDV confirmés
                </div>
              </div>
            </a>

            <a
              href="https://calendly.com/app/admin/invitees"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                padding: '20px',
                backgroundColor: '#eff6ff',
                border: '2px solid #93c5fd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dbeafe';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1e40af',
                  marginBottom: '4px'
                }}>
                  Liste des invités
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#2563eb'
                }}>
                  Gérer tous vos contacts
                </div>
              </div>
            </a>

            <a
              href="https://calendly.com/app/reporting"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                padding: '20px',
                backgroundColor: '#faf5ff',
                border: '2px solid #d8b4fe',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f3e8ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#faf5ff';
              }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#6b21a8',
                  marginBottom: '4px'
                }}>
                  Statistiques
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#9333ea'
                }}>
                  Analyser vos performances
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Features List */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '20px'
          }}>
            Fonctionnalités disponibles sur Calendly
          </h3>

          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {[
              { icon: '✉️', title: 'Notifications email automatiques', desc: 'Confirmations et rappels automatiques' },
              { icon: '🔄', title: 'Synchronisation calendrier', desc: 'Google Calendar, Outlook, iCal' },
              { icon: '💬', title: 'Questions personnalisées', desc: 'Collectez des infos avant le RDV' },
              { icon: '🌐', title: 'Fuseaux horaires', desc: 'Gestion automatique des décalages horaires' },
              { icon: '🎨', title: 'Personnalisation', desc: 'Couleurs et branding de votre agence' },
              { icon: '📱', title: 'Rappels SMS', desc: 'Option disponible avec Calendly Premium' }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '2px'
                  }}>
                    {feature.title}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#64748b'
                  }}>
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
