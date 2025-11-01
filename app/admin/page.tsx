'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { getAllModels } from '@/lib/sanity';

export default function AdminPage() {
  const [models, setModels] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modelsData, appointmentsData, contactsData] = await Promise.all([
        getAllModels(),
        fetch('/api/appointments').then(res => res.json()),
        fetch('/api/contacts').then(res => res.json())
      ]);

      setModels(modelsData || []);
      setAppointments(appointmentsData || []);
      setContacts(contactsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f1f5f9'
    }}>
      <AdminSidebar />

      {/* Main Content */}
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
            Dashboard
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            fontWeight: 400
          }}>
            Bienvenue sur votre plateforme CRM
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Models Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Modèles actifs
              </p>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <polyline points="17 11 19 13 23 9"/>
                </svg>
              </div>
            </div>
            <p style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}>
              {loading ? '...' : models.length}
            </p>
            <p style={{
              fontSize: '13px',
              color: '#10b981',
              fontWeight: 500
            }}>
              Dans le portfolio
            </p>
          </div>

          {/* Appointments Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Rendez-vous
              </p>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#faf5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>
            <p style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}>
              {loading ? '...' : appointments.filter(apt => apt.status !== 'cancelled').length}
            </p>
            <Link
              href="/admin/calendar"
              style={{
                fontSize: '13px',
                color: '#a855f7',
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              Voir le calendrier →
            </Link>
          </div>

          {/* Contacts Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Contacts
              </p>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>
            <p style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}>
              {loading ? '...' : contacts.length}
            </p>
            <Link
              href="/admin/contacts"
              style={{
                fontSize: '13px',
                color: '#3b82f6',
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              Gérer les contacts →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
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
            Actions rapides
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <Link href="/admin/models" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#f5f3ff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <polyline points="17 11 19 13 23 9"/>
                </svg>
                Gérer les modèles
              </div>
            </Link>
            <a
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#f5f3ff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                Ajouter un modèle
              </div>
            </a>
            <Link href="/admin/calendar" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#f5f3ff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Voir le calendrier
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
