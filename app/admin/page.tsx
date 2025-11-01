'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'contacts', label: 'Contacts', icon: '📧' },
    { id: 'models', label: 'Modèles', icon: '👥' },
    { id: 'calendar', label: 'Calendrier', icon: '📅' },
    { id: 'stats', label: 'Statistiques', icon: '📈' },
  ];

  const stats = [
    { label: 'Nouveaux contacts', value: '0', color: '#3b82f6', bgColor: '#dbeafe' },
    { label: 'Rendez-vous à venir', value: '0', color: '#8b5cf6', bgColor: '#ede9fe' },
    { label: 'Modèles actifs', value: '12', color: '#10b981', bgColor: '#d1fae5' },
    { label: 'Vues ce mois', value: '0', color: '#f59e0b', bgColor: '#fef3c7' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <AdminSidebar />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '280px',
        padding: '40px'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Tableau de bord
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Bienvenue sur votre CRM ZMR Models Agency
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  fontWeight: 500
                }}>
                  {stat.label}
                </p>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  <span style={{ color: stat.color }}>●</span>
                </div>
              </div>
              <p style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#0f172a'
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '24px'
          }}>
            Actions rapides
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <Link href="/admin/contacts" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#f5f3ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                📧 Voir les contacts
              </div>
            </Link>
            <Link href="/admin/models" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#f5f3ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                👥 Gérer les modèles
              </div>
            </Link>
            <Link href="/admin/calendar" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#f5f3ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                📅 Calendrier
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
