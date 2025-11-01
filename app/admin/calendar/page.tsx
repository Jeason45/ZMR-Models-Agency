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
  const [activeTab, setActiveTab] = useState<'schedule' | 'appointments'>('schedule');
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [formData, setFormData] = useState({ startTime: '09:00', endTime: '18:00' });

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
    return appointments
      .filter(apt => new Date(apt.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

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

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '2px solid #e2e8f0'
        }}>
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
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
