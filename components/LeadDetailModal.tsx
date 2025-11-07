'use client';

import { useState, useEffect } from 'react';
import SendDocumentModal from './SendDocumentModal';

type ContactStatus = 'new' | 'contacted' | 'qualified' | 'client' | 'lost';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  type: string | null;
  status: ContactStatus;
  source: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  appointments?: Appointment[];
  documents?: Document[];
  mailLogs?: MailLog[];
  timeline?: Activity[];
}

interface Appointment {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  status: string;
  location: string | null;
  createdAt: string;
}

interface Document {
  id: string;
  fileName: string;
  type: string;
  status: string;
  sentAt: string | null;
  signedAt: string | null;
  createdAt: string;
}

interface MailLog {
  id: string;
  subject: string;
  type: string;
  status: string;
  sentAt: string;
  openedAt: string | null;
}

interface Activity {
  id: string;
  type: 'appointment' | 'email' | 'document';
  title: string;
  description: string;
  date: string;
  status: string;
  metadata?: any;
}

interface LeadDetailModalProps {
  contactId: string | null;
  onClose: () => void;
  onUpdate?: () => void;
}

const STATUS_CONFIG = {
  new: { label: 'Nouveau', color: '#3b82f6', bgColor: '#dbeafe' },
  contacted: { label: 'Contacté', color: '#f59e0b', bgColor: '#fef3c7' },
  qualified: { label: 'Qualifié', color: '#8b5cf6', bgColor: '#ede9fe' },
  client: { label: 'Client', color: '#10b981', bgColor: '#d1fae5' },
  lost: { label: 'Perdu', color: '#ef4444', bgColor: '#fee2e2' }
};

export default function LeadDetailModal({ contactId, onClose, onUpdate }: LeadDetailModalProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedStatus, setEditedStatus] = useState<ContactStatus>('new');
  const [showSendDocumentModal, setShowSendDocumentModal] = useState(false);

  // Charger les détails du contact
  useEffect(() => {
    if (!contactId) return;

    setLoading(true);
    fetch(`/api/contacts/${contactId}`)
      .then(res => res.json())
      .then(data => {
        setContact(data);
        setEditedNotes(data.notes || '');
        // Normalize status to ensure it's valid
        const validStatuses: ContactStatus[] = ['new', 'contacted', 'qualified', 'client', 'lost'];
        const normalizedStatus = validStatuses.includes(data.status as ContactStatus)
          ? data.status as ContactStatus
          : 'new';
        setEditedStatus(normalizedStatus);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading contact:', err);
        setLoading(false);
      });
  }, [contactId]);


  if (!contactId) return null;

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editedStatus,
          notes: editedNotes
        })
      });

      if (res.ok) {
        // Rafraîchir complètement les données du contact
        const refreshed = await fetch(`/api/contacts/${contactId}`).then(r => r.json());
        setContact(refreshed);
        // Normaliser le statut à nouveau
        const validStatuses: ContactStatus[] = ['new', 'contacted', 'qualified', 'client', 'lost'];
        const normalizedStatus = validStatuses.includes(refreshed.status as ContactStatus)
          ? refreshed.status as ContactStatus
          : 'new';
        setEditedStatus(normalizedStatus);
        setEditedNotes(refreshed.notes || '');
        onUpdate?.();
        alert('✓ Modifications enregistrées avec succès');
      } else {
        alert('❌ Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('❌ Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };


  const handleDeleteLead = async () => {
    const confirmation = window.confirm(`Êtes-vous sûr de vouloir supprimer le lead "${contact?.name}" ?\n\nCette action est irréversible.`);
    if (!confirmation) return;

    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('✓ Lead supprimé avec succès');
        onUpdate?.();
        onClose();
      } else {
        alert('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const handleRefresh = async () => {
    // Recharger les données du contact
    const refreshed = await fetch(`/api/contacts/${contactId}`).then(r => r.json());
    setContact(refreshed);
    onUpdate?.();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'email': return '📧';
      case 'document': return '📄';
      default: return '•';
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '600px',
        backgroundColor: 'white',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999
        }}
      />

      {/* Sidebar Modal */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '700px',
        backgroundColor: 'white',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 600,
              color: '#0f172a'
            }}>
              {contact.name}
            </h2>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: '#64748b'
            }}>
              Créé le {formatDate(contact.createdAt)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleDeleteLead}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #fee2e2',
                background: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#ef4444',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#fee2e2';
              }}
            >
              🗑️ Supprimer
            </button>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#64748b',
                padding: '8px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px'
        }}>
          {/* Section: Informations */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📋 Informations
            </h3>
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              display: 'grid',
              gap: '12px'
            }}>
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Email</label>
                <div style={{ fontSize: '14px', color: '#0f172a', marginTop: '4px' }}>{contact.email}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Téléphone</label>
                <div style={{ fontSize: '14px', color: '#0f172a', marginTop: '4px' }}>{contact.phone || 'Non renseigné'}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Type</label>
                <div style={{ marginTop: '4px' }}>
                  {contact.type && (
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'white',
                      background: contact.type === 'professional' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                    }}>
                      {contact.type === 'professional' ? 'Professionnel' : 'Mannequin'}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Source</label>
                <div style={{ fontSize: '14px', color: '#0f172a', marginTop: '4px' }}>{contact.source || 'Non renseignée'}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Statut</label>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as ContactStatus)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: STATUS_CONFIG[editedStatus].color,
                    backgroundColor: STATUS_CONFIG[editedStatus].bgColor,
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map(status => (
                    <option key={status} value={status}>
                      {STATUS_CONFIG[status].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Message du lead */}
          {contact.message && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💬 Message du lead
              </h3>
              <div style={{
                backgroundColor: '#fffbeb',
                borderLeft: '4px solid #f59e0b',
                borderRadius: '8px',
                padding: '20px',
                fontSize: '14px',
                color: '#0f172a',
                lineHeight: '1.6'
              }}>
                {contact.message}
              </div>
            </div>
          )}

          {/* Section: Notes internes */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📝 Notes internes
            </h3>
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Ajoutez des notes sur ce lead..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '14px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Section: Actions rapides */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚡ Actions rapides
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = `mailto:${contact.email}`}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.backgroundColor = '#eef2ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                📧 Envoyer Email
              </button>
              <button
                onClick={() => setShowSendDocumentModal(true)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.backgroundColor = '#d1fae5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                📄 Envoyer Document
              </button>
              <button
                onClick={() => window.location.href = '/admin/calendar'}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#f59e0b';
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                📅 Créer RDV
              </button>
            </div>
          </div>

          {/* Section: Timeline */}
          {contact.timeline && contact.timeline.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🕐 Timeline des activités
              </h3>
              <div style={{
                borderLeft: '2px solid #e2e8f0',
                paddingLeft: '20px'
              }}>
                {contact.timeline.slice(0, 10).map((activity, index) => (
                  <div key={activity.id} style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-27px',
                      top: '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: '#6366f1',
                      border: '3px solid white'
                    }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                        {getActivityIcon(activity.type)} {activity.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {formatDate(activity.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Rendez-vous */}
          {contact.appointments && contact.appointments.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📅 Rendez-vous ({contact.appointments.length})
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {contact.appointments.slice(0, 5).map(apt => (
                  <div key={apt.id} style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{apt.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {formatDate(apt.startTime)}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: apt.status === 'confirmed' ? '#d1fae5' : '#dbeafe',
                        color: apt.status === 'confirmed' ? '#10b981' : '#3b82f6'
                      }}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Documents envoyés */}
          {contact.documents && contact.documents.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📄 Documents envoyés ({contact.documents.length})
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {contact.documents.slice(0, 5).map(doc => (
                  <div key={doc.id} style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{doc.fileName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {doc.sentAt ? `Envoyé le ${formatDate(doc.sentAt)}` : `Créé le ${formatDate(doc.createdAt)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Emails */}
          {contact.mailLogs && contact.mailLogs.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📧 Emails envoyés ({contact.mailLogs.length})
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {contact.mailLogs.slice(0, 5).map(mail => (
                  <div key={mail.id} style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{mail.subject}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {formatDate(mail.sentAt)}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: mail.status === 'sent' ? '#dbeafe' : mail.status === 'opened' ? '#d1fae5' : '#fee2e2',
                        color: mail.status === 'sent' ? '#3b82f6' : mail.status === 'opened' ? '#10b981' : '#ef4444'
                      }}>
                        {mail.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '14px 24px',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              background: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Modal: Envoyer un document */}
      {showSendDocumentModal && contact && (
        <SendDocumentModal
          contactId={contactId}
          contactName={contact.name}
          contactEmail={contact.email}
          onClose={() => setShowSendDocumentModal(false)}
          onSuccess={handleRefresh}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
