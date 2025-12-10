'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
}

export default function AdminLayout({ children, title, subtitle, headerAction }: AdminLayoutProps) {
  const { sidebarWidth, isMobile } = useSidebar();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #0f1b2e 100%)'
    }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: isMobile ? '0' : `${sidebarWidth}px`,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        padding: isMobile ? '80px 16px 24px 16px' : '40px'
      }}>
        {/* Header with decorative line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)'
          }} />
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.3) 0%, transparent 100%)'
          }} />
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}>
            {title}
          </span>
        </div>

        {/* Page Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '8px'
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)'
              }}>
                {subtitle}
              </p>
            )}
          </div>

          {headerAction}
        </div>

        {children}
      </div>
    </div>
  );
}

// Composants de style reutilisables
export const adminStyles = {
  // Cartes de statistiques
  statCard: (color: string) => ({
    background: `linear-gradient(135deg, ${color}26 0%, ${color}10 100%)`,
    padding: '24px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${color}40`,
    transition: 'all 0.3s',
    cursor: 'pointer'
  }),

  // Cartes glassmorphism
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    overflow: 'hidden'
  },

  // Bouton primaire
  buttonPrimary: {
    padding: '12px 24px',
    backgroundColor: '#D4AF37',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s'
  },

  // Bouton secondaire
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s'
  },

  // Input
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.2s'
  },

  // Select
  select: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'white',
    cursor: 'pointer',
    outline: 'none'
  },

  // Table header
  tableHeader: {
    padding: '16px',
    textAlign: 'left' as const,
    fontSize: '11px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    backgroundColor: 'rgba(255,255,255,0.03)'
  },

  // Table cell
  tableCell: {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    color: 'white'
  },

  // Badge
  badge: (bgColor: string, textColor: string) => ({
    padding: '4px 12px',
    backgroundColor: bgColor,
    color: textColor,
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  }),

  // Modal overlay
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px'
  },

  // Modal content
  modalContent: {
    background: 'linear-gradient(135deg, #0f1b2e 0%, #0a0e1a 100%)',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
  },

  // Label
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },

  // Text muted
  textMuted: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px'
  },

  // Filter button group
  filterButtonGroup: {
    display: 'flex',
    gap: '4px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '4px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)'
  },

  filterButton: (isActive: boolean, activeColor: string = '#D4AF37') => ({
    padding: '8px 16px',
    backgroundColor: isActive ? activeColor : 'transparent',
    color: isActive ? '#000' : 'rgba(255,255,255,0.6)',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const
  })
};
