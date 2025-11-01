'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/contacts', icon: '📧', label: 'Contacts' },
    { href: '/admin/models', icon: '👥', label: 'Modèles' },
    { href: '/admin/calendar', icon: '📅', label: 'Calendrier' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div style={{
      width: '280px',
      backgroundColor: '#1e293b',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0
    }}>
      <div style={{
        marginBottom: '40px',
        paddingBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'white',
          marginBottom: '4px'
        }}>
          ZMR Models
        </h1>
        <p style={{
          fontSize: '12px',
          color: '#94a3b8',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          CRM Admin
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: 'none',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: isActive(item.href) ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              borderRadius: '8px',
              color: isActive(item.href) ? '#818cf8' : '#cbd5e1',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <Link href="/admin/login" style={{ textDecoration: 'none' }}>
        <button style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          fontSize: '15px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        }}
        >
          <span style={{ fontSize: '20px' }}>🚪</span>
          Déconnexion
        </button>
      </Link>
    </div>
  );
}
