'use client';

import { useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function CalendarPage() {
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
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Calendrier
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Gérez vos disponibilités et consultez vos rendez-vous
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <a
            href="https://calendly.com/app/scheduled_events/user/me"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(99, 102, 241, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>📅</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Événements planifiés
              </div>
            </div>
          </a>

          <a
            href="https://calendly.com/app/admin/event_types"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(99, 102, 241, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚙️</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Types d'événements
              </div>
            </div>
          </a>

          <a
            href="https://calendly.com/app/availability/schedules"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              padding: '20px',
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(99, 102, 241, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🕐</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Disponibilités
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
              backgroundColor: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(99, 102, 241, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>📊</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Statistiques
              </div>
            </div>
          </a>
        </div>

        {/* Embedded Calendly Dashboard */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '20px'
          }}>
            Aperçu du calendrier
          </h3>

          <div style={{
            minHeight: '600px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0'
          }}>
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/jlwebdesign33?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=f8fafc&text_color=0f172a&primary_color=6366f1"
              style={{
                minWidth: '320px',
                height: '600px'
              }}
            />
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>💡</span>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0c4a6e',
                  marginBottom: '4px'
                }}>
                  Astuce Pro
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#075985',
                  lineHeight: 1.5
                }}>
                  Pour gérer tous vos événements et accéder à toutes les fonctionnalités,
                  ouvrez votre <a
                    href="https://calendly.com/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0284c7', textDecoration: 'underline' }}
                  >
                    dashboard Calendly complet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
