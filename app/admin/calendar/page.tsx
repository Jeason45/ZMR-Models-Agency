'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Appointment {
  id: string;
  date: string;
  duration: number;
  status: string;
  notes?: string;
  contact: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    type: string;
  };
}

export default function CalendarPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedule' | 'appointments'>('calendar');
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [formData, setFormData] = useState({ startTime: '09:00', endTime: '18:00' });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
    { value: 0, label: 'Dimanche' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [availRes, apptRes] = await Promise.all([
        fetch('/api/availability'),
        fetch('/api/appointments')
      ]);
      const availData = await availRes.json();
      const apptData = await apptRes.json();

      setAvailabilities(Array.isArray(availData) ? availData : []);
      setAppointments(Array.isArray(apptData) ? apptData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAvailabilities([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availabilities.find(a => a.dayOfWeek === dayOfWeek);
  };

  const handleSaveAvailability = async (dayOfWeek: number) => {
    try {
      const existing = getAvailabilityForDay(dayOfWeek);

      if (existing) {
        // Update
        await fetch('/api/availability', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existing.id,
            ...formData
          })
        });
      } else {
        // Create
        await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dayOfWeek,
            ...formData
          })
        });
      }

      setEditingDay(null);
      fetchData();
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    try {
      await fetch(`/api/availability?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  };

  const getUpcomingAppointments = () => {
    const filtered = statusFilter === 'all'
      ? appointments
      : appointments.filter(apt => apt.status === statusFilter);

    return filtered
      .filter(apt => new Date(apt.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchData();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getStats = () => {
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const upcoming = getUpcomingAppointments().length;
    return { pending, confirmed, upcoming, total: appointments.length };
  };

  const stats = getStats();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return { bg: '#fef3c7', text: '#92400e', label: 'En attente' };
      case 'confirmed': return { bg: '#d1fae5', text: '#065f46', label: 'Confirmé' };
      case 'cancelled': return { bg: '#fee2e2', text: '#991b1b', label: 'Annulé' };
      case 'completed': return { bg: '#e0e7ff', text: '#3730a3', label: 'Terminé' };
      default: return { bg: '#f3f4f6', text: '#374151', label: status };
    }
  };

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
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            Calendrier & Disponibilités
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Gérez vos horaires et vos rendez-vous
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              TOTAL RENDEZ-VOUS
            </p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>
              {stats.total}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              À VENIR
            </p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: '#6366f1' }}>
              {stats.upcoming}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              EN ATTENTE
            </p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>
              {stats.pending}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
              CONFIRMÉS
            </p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}>
              {stats.confirmed}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'calendar' ? '#6366f1' : 'transparent'}`,
              color: activeTab === 'calendar' ? '#6366f1' : '#64748b',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Vue Calendrier
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'schedule' ? '#6366f1' : 'transparent'}`,
              color: activeTab === 'schedule' ? '#6366f1' : '#64748b',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Horaires de disponibilité
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'appointments' ? '#6366f1' : 'transparent'}`,
              color: activeTab === 'appointments' ? '#6366f1' : '#64748b',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            Rendez-vous ({getUpcomingAppointments().length})
          </button>
        </div>

        {/* Calendar View Tab */}
        {activeTab === 'calendar' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            padding: '32px'
          }}>
            {/* Month Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748b'
                }}
              >
                ← Mois précédent
              </button>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#64748b'
                }}
              >
                Mois suivant →
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px'
            }}>
              {/* Day headers */}
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b'
                }}>
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {getDaysInMonth(currentMonth).map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} />;
                }

                const dayAppointments = getAppointmentsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={date.toISOString()}
                    style={{
                      minHeight: '100px',
                      padding: '8px',
                      backgroundColor: isToday ? '#f0f9ff' : '#f8fafc',
                      border: `2px solid ${isToday ? '#3b82f6' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (!isToday) e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseOut={(e) => {
                      if (!isToday) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <div style={{
                      fontSize: '14px',
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? '#3b82f6' : '#0f172a',
                      marginBottom: '4px'
                    }}>
                      {date.getDate()}
                    </div>
                    {dayAppointments.slice(0, 2).map(apt => {
                      const statusInfo = getStatusColor(apt.status);
                      return (
                        <div
                          key={apt.id}
                          style={{
                            padding: '4px 6px',
                            backgroundColor: statusInfo.bg,
                            borderLeft: `3px solid ${statusInfo.text}`,
                            borderRadius: '4px',
                            marginBottom: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: statusInfo.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {new Date(apt.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      );
                    })}
                    {dayAppointments.length > 2 && (
                      <div style={{
                        fontSize: '10px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginTop: '2px'
                      }}>
                        +{dayAppointments.length - 2} autre{dayAppointments.length - 2 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            padding: '32px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '24px'
            }}>
              Configurez vos horaires par jour
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {daysOfWeek.map((day) => {
                const availability = getAvailabilityForDay(day.value);
                const isEditing = editingDay === day.value;

                return (
                  <div
                    key={day.value}
                    style={{
                      padding: '20px',
                      backgroundColor: availability ? '#f8fafc' : 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#0f172a',
                          marginBottom: '4px'
                        }}>
                          {day.label}
                        </h4>
                        {availability && !isEditing ? (
                          <p style={{
                            fontSize: '14px',
                            color: '#64748b'
                          }}>
                            {availability.startTime} - {availability.endTime}
                          </p>
                        ) : !isEditing ? (
                          <p style={{
                            fontSize: '14px',
                            color: '#94a3b8'
                          }}>
                            Non disponible
                          </p>
                        ) : null}
                      </div>

                      {isEditing ? (
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center'
                        }}>
                          <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                          <span style={{ color: '#64748b' }}>à</span>
                          <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                          <button
                            onClick={() => handleSaveAvailability(day.value)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingDay(null)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#f1f5f9',
                              color: '#64748b',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              if (availability) {
                                setFormData({
                                  startTime: availability.startTime,
                                  endTime: availability.endTime
                                });
                              }
                              setEditingDay(day.value);
                            }}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#6366f1',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            {availability ? 'Modifier' : 'Ajouter'}
                          </button>
                          {availability && (
                            <button
                              onClick={() => handleDeleteAvailability(availability.id)}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer'
                              }}
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            {/* Status Filters */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '20px',
              backgroundColor: 'white',
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              width: 'fit-content'
            }}>
              {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: statusFilter === status ? '#6366f1' : 'transparent',
                    color: statusFilter === status ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {status === 'all' ? 'Tous' :
                   status === 'pending' ? 'En attente' :
                   status === 'confirmed' ? 'Confirmés' :
                   status === 'cancelled' ? 'Annulés' : 'Terminés'}
                </button>
              ))}
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              {getUpcomingAppointments().length === 0 ? (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📅</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Aucun rendez-vous à venir</p>
              </div>
            ) : (
              getUpcomingAppointments().map((appointment) => {
                const statusInfo = getStatusColor(appointment.status);
                const date = new Date(appointment.date);

                return (
                  <div
                    key={appointment.id}
                    style={{
                      padding: '24px',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#0f172a',
                          marginBottom: '4px'
                        }}>
                          {appointment.contact.name}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#64748b',
                          marginBottom: '4px'
                        }}>
                          {appointment.contact.email}
                        </p>
                        {appointment.contact.phone && (
                          <p style={{
                            fontSize: '14px',
                            color: '#64748b'
                          }}>
                            {appointment.contact.phone}
                          </p>
                        )}
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '6px'
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '24px',
                      marginTop: '12px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px'
                    }}>
                      <div>
                        <p style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          marginBottom: '4px',
                          fontWeight: 500
                        }}>
                          DATE
                        </p>
                        <p style={{
                          fontSize: '15px',
                          color: '#0f172a',
                          fontWeight: 500
                        }}>
                          {date.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          marginBottom: '4px',
                          fontWeight: 500
                        }}>
                          HEURE
                        </p>
                        <p style={{
                          fontSize: '15px',
                          color: '#0f172a',
                          fontWeight: 500
                        }}>
                          {date.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <p style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          marginBottom: '4px',
                          fontWeight: 500
                        }}>
                          DURÉE
                        </p>
                        <p style={{
                          fontSize: '15px',
                          color: '#0f172a',
                          fontWeight: 500
                        }}>
                          {appointment.duration} min
                        </p>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div style={{ marginTop: '12px' }}>
                        <p style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          marginBottom: '4px',
                          fontWeight: 500
                        }}>
                          NOTES
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#475569'
                        }}>
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                          >
                            ✓ Confirmer
                          </button>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                          >
                            ✕ Annuler
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'completed')}
                            style={{
                              flex: 1,
                              padding: '10px 16px',
                              backgroundColor: '#6366f1',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                          >
                            ✓ Marquer comme terminé
                          </button>
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                            style={{
                              padding: '10px 16px',
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            Annuler
                          </button>
                        </>
                      )}
                      {appointment.status === 'cancelled' && (
                        <button
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'pending')}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          Réactiver
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
