'use client';

import { useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function CalendarPage() {
  useEffect(() => {
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
      backgroundColor: '#f1f5f9'
    }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: '260px',
        padding: '32px 40px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '4px',
            letterSpacing: '-0.02em'
          }}>
            Calendrier
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            fontWeight: 400
          }}>
            Gérez vos disponibilités et rendez-vous
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
              </svg>
              <div style={{
                fontSize: '14px',
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
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-2-2l-4.2-4.2m13.2 5.2l-6 0m-6 0l-6 0m13.2 5.2l-4.2-4.2m-2 2l-4.2 4.2"/>
              </svg>
              <div style={{
                fontSize: '14px',
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
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div style={{
                fontSize: '14px',
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
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Statistiques
              </div>
            </div>
          </a>
        </div>

        {/* Embedded Calendar */}
        <div style={{
          backgroundColor: 'white',
          padding: '28px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '20px',
            letterSpacing: '-0.01em'
          }}>
            Aperçu du calendrier
          </h3>

          <div style={{
            minHeight: '600px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #f1f5f9'
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
            padding: '16px 20px',
            backgroundColor: '#eff6ff',
            borderRadius: '6px',
            border: '1px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e40af',
                marginBottom: '2px'
              }}>
                Conseil
              </div>
              <div style={{
                fontSize: '13px',
                color: '#1e40af',
                lineHeight: 1.5
              }}>
                Pour gérer tous vos événements, ouvrez votre{' '}
                <a
                  href="https://calendly.com/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  dashboard Calendly complet
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
