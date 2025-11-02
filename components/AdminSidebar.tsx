'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();

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
      href: '/admin/models',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <polyline points="17 11 19 13 23 9"/>
        </svg>
      ),
      label: 'Modèles',
      color: '#f472b6'
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
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div style={{
      width: isCollapsed ? '80px' : '260px',
      backgroundColor: '#0f172a',
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
            color: 'white',
            marginBottom: '2px',
            letterSpacing: '-0.01em'
          }}>
            ZMR Models
          </h1>
          <p style={{
            fontSize: '11px',
            color: '#64748b',
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
              backgroundColor: isActive(item.href) ? `${item.color}15` : 'transparent',
              borderLeft: isActive(item.href) ? `3px solid ${item.color}` : '3px solid transparent',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
            onMouseOver={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
              }
              const icon = e.currentTarget.querySelector('svg');
              const text = e.currentTarget.querySelector('span');
              if (icon) icon.style.color = item.color;
              if (text) text.style.color = item.color;
            }}
            onMouseOut={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                const icon = e.currentTarget.querySelector('svg');
                const text = e.currentTarget.querySelector('span');
                if (icon) icon.style.color = '#94a3b8';
                if (text) text.style.color = '#94a3b8';
              }
            }}
            title={isCollapsed ? item.label : undefined}
            >
              <div style={{ color: item.color, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </div>
              {!isCollapsed && <span style={{ color: item.color }}>{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={{
        padding: isCollapsed ? '16px 12px' : '16px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <Link href="/admin/login" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: isCollapsed ? '12px' : '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
            title={isCollapsed ? 'Déconnexion' : undefined}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </Link>
      </div>
    </div>
  );
}
