'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  location: string;
  city?: string;
  type: string;
  status: string;
  isFree: boolean;
  ticketTypes?: any[];
  maxCapacity?: number;
  published: boolean;
  coverImage?: string;
  _count?: {
    bookings: number;
  };
}

interface Booking {
  id: string;
  bookingNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  event: {
    title: string;
  };
}

export default function AdminEventsPage() {
  const { sidebarWidth, isMobile } = useSidebar();
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'bookings'>('events');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/bookings')
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      alert('Événement supprimé avec succès !');
      fetchData();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleTogglePublish = async (eventId: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      fetchData();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'club': 'Club',
      'restaurant-bar': 'Restaurant & Bar',
      'private': 'Privé',
      'fashion': 'Fashion',
      'casting': 'Casting'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      'club': { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' },
      'restaurant-bar': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
      'private': { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' },
      'fashion': { bg: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' },
      'casting': { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }
    };
    return colors[type] || { bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; bg: string; color: string }> = {
      'upcoming': { label: 'À venir', bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' },
      'ongoing': { label: 'En cours', bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' },
      'completed': { label: 'Terminé', bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' },
      'cancelled': { label: 'Annulé', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }
    };
    return badges[status] || { label: status, bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; bg: string; color: string }> = {
      'paid': { label: 'Payé', bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' },
      'pending': { label: 'En attente', bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
      'failed': { label: 'Échoué', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
      'refunded': { label: 'Remboursé', bg: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }
    };
    return badges[status] || { label: status, bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };
  };

  const getBookingStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; bg: string; color: string }> = {
      'confirmed': { label: 'Confirmé', bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' },
      'pending': { label: 'En attente', bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
      'cancelled': { label: 'Annulé', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
      'checked_in': { label: 'Enregistré', bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' }
    };
    return badges[status] || { label: status, bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const filteredEvents = events
    .filter(e => statusFilter === 'all' || e.status === statusFilter)
    .filter(e => typeFilter === 'all' || e.type === typeFilter);

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    published: events.filter(e => e.published).length,
    totalBookings: bookings.length,
    totalRevenue: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length
  };

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
        padding: isMobile ? '20px' : '40px',
        paddingTop: isMobile ? '80px' : '40px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Decorative line with title */}
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
            Événements
          </span>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Gérez vos événements et suivez les réservations
          </p>

          <Link
            href="/admin/events/create"
            style={{
              padding: '12px 24px',
              backgroundColor: '#fb923c',
              color: 'black',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.2s'
            }}
          >
            + Créer un événement
          </Link>
        </div>

          {/* Statistics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Events
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>
                {loading ? '...' : stats.total}
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                À Venir
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#60a5fa' }}>
                {loading ? '...' : stats.upcoming}
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Publiés
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#34d399' }}>
                {loading ? '...' : stats.published}
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Réservations
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#c084fc' }}>
                {loading ? '...' : stats.totalBookings}
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Confirmées
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#fb923c' }}>
                {loading ? '...' : stats.confirmedBookings}
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Revenus
              </p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#34d399' }}>
                {loading ? '...' : formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: 'fit-content',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => setActiveTab('events')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'events' ? '#fb923c' : 'transparent',
                color: activeTab === 'events' ? 'black' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Événements ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'bookings' ? '#fb923c' : 'transparent',
                color: activeTab === 'bookings' ? 'black' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Réservations ({bookings.length})
            </button>
          </div>

          {/* Filters for Events */}
          {activeTab === 'events' && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{ background: '#0f1b2e', color: 'white' }}>Tous les statuts</option>
                <option value="upcoming" style={{ background: '#0f1b2e', color: 'white' }}>À venir</option>
                <option value="ongoing" style={{ background: '#0f1b2e', color: 'white' }}>En cours</option>
                <option value="completed" style={{ background: '#0f1b2e', color: 'white' }}>Terminés</option>
                <option value="cancelled" style={{ background: '#0f1b2e', color: 'white' }}>Annulés</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{ background: '#0f1b2e', color: 'white' }}>Tous les types</option>
                <option value="club" style={{ background: '#0f1b2e', color: 'white' }}>Club</option>
                <option value="restaurant-bar" style={{ background: '#0f1b2e', color: 'white' }}>Restaurant & Bar</option>
                <option value="private" style={{ background: '#0f1b2e', color: 'white' }}>Privé</option>
                <option value="fashion" style={{ background: '#0f1b2e', color: 'white' }}>Fashion</option>
                <option value="casting" style={{ background: '#0f1b2e', color: 'white' }}>Casting</option>
              </select>
            </div>
          )}

        {/* Content */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Chargement...
          </div>
        ) : activeTab === 'events' ? (
          /* Events Table */
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: isMobile ? 'auto' : 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '800px' : 'auto' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Événement
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Type
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Statut
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Réservations
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Publié
                  </th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                      <p style={{ fontSize: '48px', marginBottom: '16px' }}>📅</p>
                      <p>Aucun événement trouvé</p>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => {
                    const typeBadge = getTypeBadgeColor(event.type);
                    const statusBadge = getStatusBadge(event.status);

                    return (
                      <tr
                        key={event.id}
                        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: 'rgba(255, 255, 255, 0.05)',
                              flexShrink: 0
                            }}>
                              {event.coverImage ? (
                                <img
                                  src={event.coverImage}
                                  alt={event.title}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '20px'
                                }}>
                                  📅
                                </div>
                              )}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, color: 'white', marginBottom: '2px' }}>
                                {event.title}
                              </p>
                              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                {event.location}{event.city && `, ${event.city}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <p style={{ fontSize: '14px', color: 'white' }}>
                            {formatDate(event.date)}
                          </p>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: typeBadge.bg,
                            color: typeBadge.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}>
                            {getTypeLabel(event.type)}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'white'
                          }}>
                            {event._count?.bookings || 0}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleTogglePublish(event.id, event.published)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: event.published ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              color: event.published ? '#34d399' : 'rgba(255, 255, 255, 0.6)',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {event.published ? 'Publié' : 'Brouillon'}
                          </button>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <Link
                              href={`/events/${event.slug}`}
                              target="_blank"
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.2s'
                              }}
                            >
                              Voir
                            </Link>
                            <Link
                              href={`/admin/events/${event.id}`}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#fb923c',
                                color: 'black',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'all 0.2s'
                              }}
                            >
                              Modifier
                            </Link>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Bookings Table */
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: isMobile ? 'auto' : 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '1000px' : 'auto' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    N° Réservation
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Client
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Événement
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Billet
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Qté
                  </th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Montant
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Paiement
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Statut
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '60px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
                      <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</p>
                      <p>Aucune réservation</p>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => {
                    const paymentBadge = getPaymentStatusBadge(booking.paymentStatus);
                    const statusBadge = getBookingStatusBadge(booking.status);

                    return (
                      <tr
                        key={booking.id}
                        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'white' }}>
                            {booking.bookingNumber}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <p style={{ fontWeight: 500, color: 'white', marginBottom: '2px' }}>
                            {booking.firstName} {booking.lastName}
                          </p>
                          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {booking.email}
                          </p>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ color: 'white' }}>
                            {booking.event?.title || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {booking.ticketType}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'white' }}>
                            {booking.quantity}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ fontWeight: 600, color: 'white' }}>
                            {formatPrice(booking.totalAmount)}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: paymentBadge.bg,
                            color: paymentBadge.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}>
                            {paymentBadge.label}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '6px'
                          }}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {formatDate(booking.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
