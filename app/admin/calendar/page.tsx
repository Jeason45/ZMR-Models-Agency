'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  contact: {
    name: string;
    email: string;
  };
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const response = await fetch(
        `/api/appointments?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`
      );
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const days = getDaysInMonth();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f1f5f9'
    }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: '260px',
        padding: '32px 40px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}>
              Calendrier
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 400
            }}>
              Gérez vos rendez-vous et disponibilités
            </p>
          </div>

          {/* Month Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={previousMonth}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#0f172a',
              minWidth: '180px',
              textAlign: 'center'
            }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>

            <button
              onClick={nextMonth}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Day Names */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            marginBottom: '8px'
          }}>
            {dayNames.map(day => (
              <div key={day} style={{
                padding: '12px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#e2e8f0',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            {days.map((date, index) => {
              const dayAppointments = date ? getAppointmentsForDate(date) : [];
              const isToday = date && date.toDateString() === today.toDateString();
              const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  style={{
                    minHeight: '100px',
                    padding: '8px',
                    backgroundColor: date ? 'white' : '#f8fafc',
                    cursor: date ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    position: 'relative',
                    border: isSelected ? '2px solid #6366f1' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (date) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    if (date) e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {date && (
                    <>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? '#6366f1' : '#0f172a',
                        marginBottom: '4px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: isToday ? '#eef2ff' : 'transparent'
                      }}>
                        {date.getDate()}
                      </div>

                      {dayAppointments.slice(0, 2).map(apt => (
                        <div
                          key={apt.id}
                          style={{
                            fontSize: '11px',
                            padding: '3px 6px',
                            backgroundColor: apt.status === 'confirmed' ? '#dcfce7' : '#dbeafe',
                            color: apt.status === 'confirmed' ? '#15803d' : '#1e40af',
                            borderRadius: '3px',
                            marginTop: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: 500
                          }}
                        >
                          {new Date(apt.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {apt.title}
                        </div>
                      ))}

                      {dayAppointments.length > 2 && (
                        <div style={{
                          fontSize: '11px',
                          color: '#64748b',
                          marginTop: '4px',
                          fontWeight: 500
                        }}>
                          +{dayAppointments.length - 2} autre{dayAppointments.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div style={{
            marginTop: '24px',
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '16px'
            }}>
              Rendez-vous du {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>

            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Aucun rendez-vous pour cette date
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {getAppointmentsForDate(selectedDate).map(apt => (
                  <div
                    key={apt.id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#0f172a',
                          marginBottom: '4px'
                        }}>
                          {apt.title}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          {new Date(apt.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor: apt.status === 'confirmed' ? '#dcfce7' : '#dbeafe',
                        color: apt.status === 'confirmed' ? '#15803d' : '#1e40af'
                      }}>
                        {apt.status === 'confirmed' ? 'Confirmé' : apt.status === 'scheduled' ? 'Planifié' : apt.status}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      <strong>Contact:</strong> {apt.contact.name} ({apt.contact.email})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
