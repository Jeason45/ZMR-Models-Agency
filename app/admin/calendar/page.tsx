'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  location?: string;
  notes?: string;
  contact: {
    name: string;
    email: string;
  };
}

type ViewMode = 'month' | 'week';

export default function CalendarPage() {
  const { sidebarWidth } = useSidebar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    contactId: '',
    location: '',
    notes: ''
  });
  const [conflicts, setConflicts] = useState<Appointment[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchContacts();
  }, [currentDate, viewMode]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      let startDate, endDate;

      if (viewMode === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else {
        // Week view
        const dayOfWeek = currentDate.getDay();
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
      }

      const response = await fetch(
        `/api/appointments?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkConflicts = (date: string, startTime: string, endTime: string) => {
    const newStart = new Date(`${date}T${startTime}`);
    const newEnd = new Date(`${date}T${endTime}`);

    const conflictingAppointments = appointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      const aptDate = aptStart.toISOString().split('T')[0];

      // Check if same day
      if (aptDate !== date) return false;

      // Check for time overlap
      return (newStart < aptEnd && newEnd > aptStart);
    });

    setConflicts(conflictingAppointments);
    return conflictingAppointments.length > 0;
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    setConfirmingId(appointmentId);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/confirm`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        alert('Rendez-vous confirmé ! Un email de confirmation a été envoyé au contact.');
        fetchAppointments();
      } else {
        alert(`Erreur: ${data.error || 'Impossible de confirmer le rendez-vous'}`);
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Erreur lors de la confirmation du rendez-vous');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleEditAppointment = (apt: Appointment) => {
    setEditingAppointment(apt);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    setSavingEdit(true);

    try {
      const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingAppointment.title,
          description: editingAppointment.description,
          startTime: editingAppointment.startTime,
          endTime: editingAppointment.endTime,
          location: editingAppointment.location,
          notes: editingAppointment.notes,
          contactId: editingAppointment.contact ? (editingAppointment.contact as any).id : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Rendez-vous modifié avec succès');
        setShowEditModal(false);
        setEditingAppointment(null);
        fetchAppointments();
      } else {
        alert(`Erreur: ${data.error || 'Impossible de modifier le rendez-vous'}`);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Erreur lors de la modification du rendez-vous');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Un email d\'annulation sera envoyé au contact.')) {
      return;
    }

    setDeletingId(appointmentId);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert('Rendez-vous supprimé ! Un email d\'annulation a été envoyé au contact.');
        fetchAppointments();
      } else {
        alert(`Erreur: ${data.error || 'Impossible de supprimer le rendez-vous'}`);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Erreur lors de la suppression du rendez-vous');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate times
    if (newAppointment.startTime >= newAppointment.endTime) {
      alert('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    // Check for conflicts
    const hasConflicts = checkConflicts(
      newAppointment.date,
      newAppointment.startTime,
      newAppointment.endTime
    );

    if (hasConflicts && !confirm('Il y a des conflits d\'horaires. Voulez-vous quand même créer ce rendez-vous ?')) {
      return;
    }

    try {
      const startDateTime = new Date(`${newAppointment.date}T${newAppointment.startTime}`);
      const endDateTime = new Date(`${newAppointment.date}T${newAppointment.endTime}`);

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAppointment.title,
          description: newAppointment.description,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          contactId: newAppointment.contactId,
          location: newAppointment.location,
          notes: newAppointment.notes,
          status: 'scheduled'
        })
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewAppointment({
          title: '',
          description: '',
          date: '',
          startTime: '',
          endTime: '',
          contactId: '',
          location: '',
          notes: ''
        });
        setConflicts([]);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Erreur lors de la création du rendez-vous');
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

  const getWeekDays = () => {
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate.toDateString() === date.toDateString();
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dayNamesFull = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const previousPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const openCreateModal = (date?: Date) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      setNewAppointment(prev => ({ ...prev, date: dateStr }));
    }
    setShowCreateModal(true);
  };

  const today = new Date();
  const days = viewMode === 'month' ? getDaysInMonth() : getWeekDays();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f1f5f9'
    }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
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

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* View Toggle */}
            <div style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: 'white',
              padding: '4px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setViewMode('month')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === 'month' ? '#6366f1' : 'transparent',
                  color: viewMode === 'month' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Mois
              </button>
              <button
                onClick={() => setViewMode('week')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: viewMode === 'week' ? '#6366f1' : 'transparent',
                  color: viewMode === 'week' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Semaine
              </button>
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
                onClick={previousPeriod}
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
                minWidth: '200px',
                textAlign: 'center'
              }}>
                {viewMode === 'month'
                  ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `Semaine du ${getWeekDays()[0].getDate()} ${monthNames[getWeekDays()[0].getMonth()]}`
                }
              </span>

              <button
                onClick={nextPeriod}
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

            {/* Create Appointment Button */}
            <button
              onClick={() => openCreateModal()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nouveau RDV
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
              const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  onDoubleClick={() => date && openCreateModal(date)}
                  style={{
                    minHeight: viewMode === 'month' ? '100px' : '120px',
                    padding: '8px',
                    backgroundColor: date ? (isCurrentMonth || viewMode === 'week' ? 'white' : '#f8fafc') : '#f8fafc',
                    cursor: date ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    position: 'relative',
                    border: isSelected ? '2px solid #6366f1' : 'none',
                    opacity: (viewMode === 'month' && date && !isCurrentMonth) ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (date) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    if (date && (isCurrentMonth || viewMode === 'week')) e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {date && (
                    <>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: isToday ? 700 : 500,
                          color: isToday ? '#6366f1' : '#0f172a',
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
                        {viewMode === 'week' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openCreateModal(date);
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#6366f1',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            +
                          </button>
                        )}
                      </div>

                      {dayAppointments.slice(0, viewMode === 'month' ? 2 : 5).map(apt => (
                        <div
                          key={apt.id}
                          style={{
                            fontSize: '11px',
                            padding: '4px 6px',
                            backgroundColor: apt.status === 'confirmed' ? '#dcfce7' : apt.status === 'cancelled' ? '#fee2e2' : '#dbeafe',
                            color: apt.status === 'confirmed' ? '#15803d' : apt.status === 'cancelled' ? '#dc2626' : '#1e40af',
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

                      {dayAppointments.length > (viewMode === 'month' ? 2 : 5) && (
                        <div style={{
                          fontSize: '11px',
                          color: '#64748b',
                          marginTop: '4px',
                          fontWeight: 500
                        }}>
                          +{dayAppointments.length - (viewMode === 'month' ? 2 : 5)} autre{dayAppointments.length - (viewMode === 'month' ? 2 : 5) > 1 ? 's' : ''}
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
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                Rendez-vous du {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <button
                onClick={() => openCreateModal(selectedDate)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                + Ajouter un RDV
              </button>
            </div>

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
                        backgroundColor: apt.status === 'confirmed' ? '#dcfce7' : apt.status === 'cancelled' ? '#fee2e2' : '#dbeafe',
                        color: apt.status === 'confirmed' ? '#15803d' : apt.status === 'cancelled' ? '#dc2626' : '#1e40af'
                      }}>
                        {apt.status === 'confirmed' ? 'Confirmé' : apt.status === 'scheduled' ? 'Planifié' : apt.status === 'cancelled' ? 'Annulé' : apt.status}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      <strong>Contact:</strong> {apt.contact.name} ({apt.contact.email})
                    </div>
                    {apt.location && (
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginTop: '4px'
                      }}>
                        <strong>Lieu:</strong> {apt.location}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{
                      marginTop: '12px',
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {apt.status === 'scheduled' && (
                        <button
                          onClick={() => handleConfirmAppointment(apt.id)}
                          disabled={confirmingId === apt.id}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: confirmingId === apt.id ? '#94a3b8' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: confirmingId === apt.id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            if (confirmingId !== apt.id) {
                              e.currentTarget.style.backgroundColor = '#059669';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (confirmingId !== apt.id) {
                              e.currentTarget.style.backgroundColor = '#10b981';
                            }
                          }}
                        >
                          {confirmingId === apt.id ? (
                            <>
                              <svg
                                style={{
                                  animation: 'spin 1s linear infinite',
                                  width: '14px',
                                  height: '14px'
                                }}
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  opacity="0.25"
                                />
                                <path
                                  d="M12 2a10 10 0 0 1 10 10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Confirmation...
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Confirmer
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleEditAppointment(apt)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        disabled={deletingId === apt.id}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: deletingId === apt.id ? '#94a3b8' : '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: deletingId === apt.id ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          if (deletingId !== apt.id) {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (deletingId !== apt.id) {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                          }
                        }}
                      >
                        {deletingId === apt.id ? (
                          <>
                            <svg
                              style={{
                                animation: 'spin 1s linear infinite',
                                width: '14px',
                                height: '14px'
                              }}
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                opacity="0.25"
                              />
                              <path
                                d="M12 2a10 10 0 0 1 10 10"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                              />
                            </svg>
                            Suppression...
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Supprimer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Create Appointment Modal */}
        {showCreateModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => {
              setShowCreateModal(false);
              setConflicts([]);
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#0f172a'
                }}>
                  Nouveau Rendez-vous
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setConflicts([]);
                  }}
                  style={{
                    padding: '4px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '24px',
                    color: '#64748b',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateAppointment} style={{ padding: '24px' }}>
                {/* Conflicts Warning */}
                {conflicts.length > 0 && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '6px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#92400e',
                      marginBottom: '8px'
                    }}>
                      ⚠️ Conflit d'horaires détecté
                    </div>
                    <div style={{ fontSize: '13px', color: '#92400e' }}>
                      {conflicts.length} rendez-vous déjà planifié{conflicts.length > 1 ? 's' : ''} sur ce créneau :
                      {conflicts.map(c => (
                        <div key={c.id} style={{ marginTop: '4px' }}>
                          • {c.title} ({new Date(c.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(c.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Title */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAppointment.title}
                      onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                      placeholder="Ex: Casting pour publicité"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newAppointment.date}
                      onChange={(e) => {
                        setNewAppointment({...newAppointment, date: e.target.value});
                        if (newAppointment.startTime && newAppointment.endTime) {
                          checkConflicts(e.target.value, newAppointment.startTime, newAppointment.endTime);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Time Range */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#0f172a',
                        marginBottom: '6px'
                      }}>
                        Heure de début *
                      </label>
                      <input
                        type="time"
                        required
                        value={newAppointment.startTime}
                        onChange={(e) => {
                          setNewAppointment({...newAppointment, startTime: e.target.value});
                          if (newAppointment.date && newAppointment.endTime) {
                            checkConflicts(newAppointment.date, e.target.value, newAppointment.endTime);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#0f172a',
                        marginBottom: '6px'
                      }}>
                        Heure de fin *
                      </label>
                      <input
                        type="time"
                        required
                        value={newAppointment.endTime}
                        onChange={(e) => {
                          setNewAppointment({...newAppointment, endTime: e.target.value});
                          if (newAppointment.date && newAppointment.startTime) {
                            checkConflicts(newAppointment.date, newAppointment.startTime, e.target.value);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Contact *
                    </label>
                    <select
                      required
                      value={newAppointment.contactId}
                      onChange={(e) => setNewAppointment({...newAppointment, contactId: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Sélectionner un contact</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} ({contact.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Lieu
                    </label>
                    <input
                      type="text"
                      value={newAppointment.location}
                      onChange={(e) => setNewAppointment({...newAppointment, location: e.target.value})}
                      placeholder="Ex: Studio Paris 11ème"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Description
                    </label>
                    <textarea
                      value={newAppointment.description}
                      onChange={(e) => setNewAppointment({...newAppointment, description: e.target.value})}
                      rows={3}
                      placeholder="Détails du rendez-vous..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Notes internes
                    </label>
                    <textarea
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                      rows={2}
                      placeholder="Notes privées (non visibles par le client)"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setConflicts([]);
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Créer le rendez-vous
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Appointment Modal */}
        {showEditModal && editingAppointment && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => {
              setShowEditModal(false);
              setEditingAppointment(null);
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#0f172a'
                }}>
                  Modifier le rendez-vous
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAppointment(null);
                  }}
                  style={{
                    padding: '4px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '24px',
                    color: '#64748b',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingAppointment.title}
                      onChange={(e) => setEditingAppointment({...editingAppointment, title: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#0f172a',
                        marginBottom: '6px'
                      }}>
                        Heure de début *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={new Date(editingAppointment.startTime).toISOString().slice(0, 16)}
                        onChange={(e) => setEditingAppointment({...editingAppointment, startTime: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#0f172a',
                        marginBottom: '6px'
                      }}>
                        Heure de fin *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={new Date(editingAppointment.endTime).toISOString().slice(0, 16)}
                        onChange={(e) => setEditingAppointment({...editingAppointment, endTime: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Lieu
                    </label>
                    <input
                      type="text"
                      value={editingAppointment.location || ''}
                      onChange={(e) => setEditingAppointment({...editingAppointment, location: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Description
                    </label>
                    <textarea
                      value={editingAppointment.description || ''}
                      onChange={(e) => setEditingAppointment({...editingAppointment, description: e.target.value})}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      marginBottom: '6px'
                    }}>
                      Notes internes
                    </label>
                    <textarea
                      value={editingAppointment.notes || ''}
                      onChange={(e) => setEditingAppointment({...editingAppointment, notes: e.target.value})}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAppointment(null);
                    }}
                    disabled={savingEdit}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: savingEdit ? 'not-allowed' : 'pointer',
                      opacity: savingEdit ? 0.5 : 1
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: savingEdit ? '#94a3b8' : '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: savingEdit ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {savingEdit ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
