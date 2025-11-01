'use client';

import AdminSidebar from '@/components/AdminSidebar';

export default function ContactsPage() {
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
            Contacts
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            fontWeight: 400
          }}>
            Gérez vos contacts et rendez-vous via Calendly
          </p>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Scheduled Events */}
          <a
            href="https://calendly.com/app/scheduled_events/user/me"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              backgroundColor: 'white',
              padding: '28px',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              height: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Événements planifiés
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '16px'
              }}>
                Consultez tous vos rendez-vous confirmés et à venir
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#3b82f6',
                fontSize: '13px',
                fontWeight: 500
              }}>
                <span>Accéder</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </a>

          {/* Invitees */}
          <a
            href="https://calendly.com/app/admin/invitees"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              backgroundColor: 'white',
              padding: '28px',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              height: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Liste des invités
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '16px'
              }}>
                Gérez tous vos contacts et leur historique
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#10b981',
                fontSize: '13px',
                fontWeight: 500
              }}>
                <span>Accéder</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </a>

          {/* Reporting */}
          <a
            href="https://calendly.com/app/reporting"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              backgroundColor: 'white',
              padding: '28px',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              height: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: '#fae8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Statistiques
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '16px'
              }}>
                Analysez vos performances et métriques
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a855f7',
                fontSize: '13px',
                fontWeight: 500
              }}>
                <span>Accéder</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Features Section */}
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
            Fonctionnalités Calendly
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                ),
                title: 'Notifications automatiques',
                desc: 'Confirmations et rappels par email'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                title: 'Fuseaux horaires',
                desc: 'Gestion automatique internationale'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                  </svg>
                ),
                title: 'Synchronisation calendrier',
                desc: 'Google, Outlook, Apple Calendar'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                ),
                title: 'Questions personnalisées',
                desc: 'Collectez des informations'
              },
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '4px'
                  }}>
                    {feature.title}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: 1.5
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
