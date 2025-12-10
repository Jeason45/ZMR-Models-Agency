'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { Settings, LogOut, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed, isMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const handleSettings = () => {
    router.push('/admin/settings/agency');
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isMobileMenuOpen]);

  const navItems = [
    {
      href: '/admin',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      label: 'Dashboard',
      color: '#818cf8'
    },
    {
      href: '/admin/contacts',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      label: 'Leads',
      color: '#34d399'
    },
    {
      href: '/admin/members',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      label: 'Membres',
      color: '#a78bfa'
    },
    {
      href: '/admin/models',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <polyline points="17 11 19 13 23 9"/>
        </svg>
      ),
      label: 'Talents',
      color: '#D4AF37'
    },
    {
      href: '/admin/calendar',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      label: 'Calendrier',
      color: '#fbbf24'
    },
    {
      href: '/admin/documents',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
          <path d="M9 18.5c.83.83 2.17.83 3 0"/>
        </svg>
      ),
      label: 'Documents',
      color: '#60a5fa'
    },
    {
      href: '/admin/events',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
          <polyline points="7.5 19.79 7.5 14.6 3 12"/>
          <polyline points="21 12 16.5 14.6 16.5 19.79"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
      label: 'Events',
      color: '#fb923c'
    },
    {
      href: '/admin/media',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
      label: 'Medias',
      color: '#ec4899'
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  // Bouton hamburger sur mobile
  if (isMobile) {
    return (
      <>
        {/* Bouton hamburger fixe en haut a gauche */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 2000,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(180deg, #000000 0%, #0a1628 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#D4AF37',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.2s'
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Overlay sombre */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1500,
              animation: 'fadeIn 0.2s ease-out'
            }}
          />
        )}

        {/* Menu sidebar mobile */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: isMobileMenuOpen ? 0 : '-100%',
          width: '280px',
          height: '100vh',
          background: 'linear-gradient(180deg, #000000 0%, #0a1628 100%)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'left 0.3s ease',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          zIndex: 1600,
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginTop: '64px'
          }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#D4AF37',
              marginBottom: '4px',
              letterSpacing: '-0.01em'
            }}>
              ZMR Models
            </h1>
            <p style={{
              fontSize: '11px',
              color: '#94a3b8',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>
              CRM Platform
            </p>
          </div>

          {/* Navigation */}
          <nav style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '4px'
                }}
              >
                <div style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  backgroundColor: isActive(item.href) ? `${item.color}26` : 'transparent',
                  borderLeft: isActive(item.href) ? `3px solid ${item.color}` : '3px solid transparent',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: isActive(item.href) ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <div style={{
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{ opacity: isActive(item.href) ? 1 : 0.7 }}>
                      {item.icon}
                    </div>
                  </div>
                  <span style={{
                    color: item.color,
                    opacity: isActive(item.href) ? 1 : 0.7
                  }}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Settings & Logout Buttons */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            gap: '12px'
          }}>
            {/* Settings Button */}
            <button
              onClick={handleSettings}
              style={{
                flex: 1,
                height: '48px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <Settings size={20} />
              <span>Parametres</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: '#ef4444',
                flexShrink: 0
              }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </>
    );
  }

  // Version desktop
  return (
    <div style={{
      width: isCollapsed ? '80px' : '260px',
      background: 'linear-gradient(180deg, #000000 0%, #0a1628 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
      transition: 'width 0.3s ease',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      zIndex: 1000
    }}>
      {/* Header */}
      <div style={{
        padding: isCollapsed ? '24px 16px' : '24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          opacity: isCollapsed ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: isCollapsed ? 'none' : 'auto',
          width: isCollapsed ? 0 : 'auto',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#D4AF37',
            marginBottom: '2px',
            letterSpacing: '-0.01em'
          }}>
            ZMR Models
          </h1>
          <p style={{
            fontSize: '11px',
            color: '#94a3b8',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: 500
          }}>
            CRM Platform
          </p>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            padding: '8px',
            cursor: 'pointer',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            marginLeft: isCollapsed ? '0' : 'auto'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#e2e8f0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <polyline points="11 17 6 12 11 7"/>
            <polyline points="18 17 13 12 18 7"/>
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: isCollapsed ? '16px 12px' : '16px',
        overflowY: 'auto'
      }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: 'none',
              display: 'block',
              marginBottom: '4px'
            }}
          >
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isCollapsed ? '12px' : '12px 16px',
              backgroundColor: isActive(item.href) ? `${item.color}26` : 'transparent',
              borderLeft: isActive(item.href) ? `3px solid ${item.color}` : '3px solid transparent',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: isActive(item.href) ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
            onMouseOver={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = `${item.color}14`;
              }
              const iconWrapper = e.currentTarget.querySelector('div[data-icon-wrapper]') as HTMLElement;
              const icon = e.currentTarget.querySelector('svg') as unknown as HTMLElement;
              const text = e.currentTarget.querySelector('span') as HTMLElement;
              if (iconWrapper && !isActive(item.href)) iconWrapper.style.transform = 'scale(1.02)';
              if (icon && !isActive(item.href)) icon.style.opacity = '1';
              if (text && !isActive(item.href)) {
                text.style.opacity = '1';
                text.style.transform = 'translateX(4px)';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                const iconWrapper = e.currentTarget.querySelector('div[data-icon-wrapper]') as HTMLElement;
                const icon = e.currentTarget.querySelector('svg') as unknown as HTMLElement;
                const text = e.currentTarget.querySelector('span') as HTMLElement;
                if (iconWrapper) iconWrapper.style.transform = 'scale(1)';
                if (icon) icon.style.opacity = '0.7';
                if (text) {
                  text.style.opacity = '0.7';
                  text.style.transform = 'translateX(0)';
                }
              }
            }}
            title={isCollapsed ? item.label : undefined}
            >
              <div
                data-icon-wrapper
                style={{
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div style={{ opacity: isActive(item.href) ? 1 : 0.7, transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {item.icon}
                </div>
              </div>
              {!isCollapsed && (
                <span style={{
                  color: item.color,
                  opacity: isActive(item.href) ? 1 : 0.7,
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateX(0)'
                }}>
                  {item.label}
                </span>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Settings & Logout Buttons */}
      <div style={{
        padding: isCollapsed ? '16px 12px' : '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        gap: '12px',
        justifyContent: isCollapsed ? 'center' : 'flex-start'
      }}>
        {/* Settings Button */}
        <button
          onClick={handleSettings}
          style={{
            width: isCollapsed ? '100%' : '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: 'rgba(255,255,255,0.7)',
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(212,175,55,0.1)';
            e.currentTarget.style.borderColor = '#D4AF37';
            e.currentTarget.style.color = '#D4AF37';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
          }}
          title="Parametres"
        >
          <Settings size={20} />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: isCollapsed ? '100%' : '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.1)',
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: '#ef4444',
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
          }}
          title="Deconnexion"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
