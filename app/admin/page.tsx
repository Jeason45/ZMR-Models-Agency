'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { getAllModels } from '@/lib/sanity';

export default function AdminPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, appointmentsRes, modelsData] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/appointments'),
        getAllModels()
      ]);

      const contactsData = await contactsRes.json();
      const appointmentsData = await appointmentsRes.json();

      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setModels(modelsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    newContacts: contacts.filter(c => c.status === 'new').length,
    upcomingAppointments: appointments.filter(a =>
      new Date(a.date) > new Date() && a.status !== 'cancelled'
    ).length,
    totalModels: models.length,
    totalContacts: contacts.length
  };

  const recentContacts = contacts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingAppointments = appointments
    .filter(a => new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginBottom: '12px' }}>
              NOUVEAUX CONTACTS
            </p>
            <p style={{ fontSize: '36px', fontWeight: 700, color: '#1e40af' }}>
              {loading ? '...' : stats.newContacts}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
              Non traités
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginBottom: '12px' }}>
              RENDEZ-VOUS À VENIR
            </p>
            <p style={{ fontSize: '36px', fontWeight: 700, color: '#8b5cf6' }}>
              {loading ? '...' : stats.upcomingAppointments}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
              Prochaines réunions
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginBottom: '12px' }}>
              MODÈLES ACTIFS
            </p>
            <p style={{ fontSize: '36px', fontWeight: 700, color: '#10b981' }}>
              {loading ? '...' : stats.totalModels}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
              Dans le portfolio
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginBottom: '12px' }}>
              TOTAL CONTACTS
            </p>
            <p style={{ fontSize: '36px', fontWeight: 700, color: '#f59e0b' }}>
              {loading ? '...' : stats.totalContacts}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
              Toutes demandes
            </p>
          </div>
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
            <a
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
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
                ➕ Ajouter un modèle
              </div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginTop: '32px'
        }}>
          {/* Recent Contacts */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Contacts récents
              </h3>
              <Link href="/admin/contacts" style={{
                fontSize: '14px',
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 500
              }}>
                Voir tout →
              </Link>
            </div>

            {loading ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>Chargement...</p>
            ) : recentContacts.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                Aucun contact récent
              </p>
            ) : (
              recentContacts.map(contact => (
                <div
                  key={contact.id}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '4px'
                    }}>
                      {contact.name}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      {contact.email}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: contact.status === 'new' ? '#dbeafe' : '#fef3c7',
                    color: contact.status === 'new' ? '#1e40af' : '#92400e',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px'
                  }}>
                    {contact.status === 'new' ? 'Nouveau' : 'Lu'}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Upcoming Appointments */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Prochains rendez-vous
              </h3>
              <Link href="/admin/calendar" style={{
                fontSize: '14px',
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 500
              }}>
                Voir calendrier →
              </Link>
            </div>

            {loading ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>Chargement...</p>
            ) : upcomingAppointments.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                Aucun rendez-vous à venir
              </p>
            ) : (
              upcomingAppointments.map(apt => {
                const date = new Date(apt.date);
                return (
                  <div
                    key={apt.id}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '4px'
                      }}>
                        {apt.contact?.name || 'Contact inconnu'}
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {date.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: apt.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                      color: apt.status === 'confirmed' ? '#065f46' : '#92400e',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '6px'
                    }}>
                      {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
