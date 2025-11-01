'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

type ContactStatus = 'new' | 'contacted' | 'qualified' | 'client' | 'lost';

interface Appointment {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  status: string;
  location: string | null;
  notes: string | null;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: ContactStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  appointments: Appointment[];
}

const STATUS_CONFIG = {
  new: { label: 'Nouveau', color: '#3b82f6', bgColor: '#dbeafe' },
  contacted: { label: 'Contacté', color: '#f59e0b', bgColor: '#fef3c7' },
  qualified: { label: 'Qualifié', color: '#8b5cf6', bgColor: '#ede9fe' },
  client: { label: 'Client', color: '#10b981', bgColor: '#d1fae5' },
  lost: { label: 'Perdu', color: '#ef4444', bgColor: '#fee2e2' }
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
    setCurrentPage(1); // Reset to first page when filters change
  }, [contacts, statusFilter, searchQuery]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.phone && c.phone.toLowerCase().includes(query))
      );
    }

    setFilteredContacts(filtered);
  };

  const updateContactStatus = async (contactId: string, newStatus: ContactStatus) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contactId, status: newStatus })
      });

      if (response.ok) {
        const updatedContact = await response.json();
        setContacts(contacts.map(c => c.id === contactId ? updatedContact : c));
        if (selectedContact?.id === contactId) {
          setSelectedContact(updatedContact);
        }
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;

    try {
      const response = await fetch(`/api/contacts?id=${contactId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setContacts(contacts.filter(c => c.id !== contactId));
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const saveContactEdit = async () => {
    if (!editingContact) return;

    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingContact.id,
          name: editingContact.name,
          email: editingContact.email,
          phone: editingContact.phone,
          message: editingContact.message
        })
      });

      if (response.ok) {
        const updatedContact = await response.json();
        setContacts(contacts.map(c => c.id === editingContact.id ? updatedContact : c));
        setSelectedContact(updatedContact);
        setEditingContact(null);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: ContactStatus) => {
    const config = STATUS_CONFIG[status];
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 500,
        color: config.color,
        backgroundColor: config.bgColor
      }}>
        {config.label}
      </span>
    );
  };


  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

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
        padding: '32px 40px'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}>
              Contacts
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 400
            }}>
              {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''}
              {statusFilter !== 'all' && ` • ${STATUS_CONFIG[statusFilter].label}`}
              {searchQuery && ` • "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: statusFilter === 'all' ? '2px solid #6366f1' : '1px solid #e2e8f0',
                backgroundColor: statusFilter === 'all' ? '#eef2ff' : 'white',
                color: statusFilter === 'all' ? '#6366f1' : '#64748b',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Tous
            </button>
            {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: statusFilter === status ? `2px solid ${STATUS_CONFIG[status].color}` : '1px solid #e2e8f0',
                  backgroundColor: statusFilter === status ? STATUS_CONFIG[status].bgColor : 'white',
                  color: statusFilter === status ? STATUS_CONFIG[status].color : '#64748b',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {STATUS_CONFIG[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedContact ? '1fr 400px' : '1fr',
          gap: '24px'
        }}>
          {/* Contacts List */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                Chargement...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: '8px' }}>Aucun contact trouvé</p>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                  {searchQuery || statusFilter !== 'all' ? 'Essayez de modifier vos filtres' : 'Les contacts apparaîtront ici'}
                </p>
              </div>
            ) : (
              <div>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr 120px',
                  padding: '16px 24px',
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <div>Nom</div>
                  <div>Email</div>
                  <div>Téléphone</div>
                  <div>Statut</div>
                  <div>Date</div>
                </div>

                {/* Table Rows */}
                {paginatedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 2fr 1.5fr 1fr 120px',
                      padding: '16px 24px',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      backgroundColor: selectedContact?.id === contact.id ? '#f8fafc' : 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedContact?.id !== contact.id) {
                        e.currentTarget.style.backgroundColor = '#fafbfc';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedContact?.id !== contact.id) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {contact.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {contact.email}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      {contact.phone || '-'}
                    </div>
                    <div>
                      {getStatusBadge(contact.status)}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#94a3b8'
                    }}>
                      {formatShortDate(contact.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#64748b'
                }}>
                  Page {currentPage} sur {totalPages} • {filteredContacts.length} résultat{filteredContacts.length > 1 ? 's' : ''}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: currentPage === 1 ? '#f8fafc' : 'white',
                      color: currentPage === 1 ? '#cbd5e1' : '#0f172a',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ←
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: pageNum === currentPage ? '1px solid #6366f1' : '1px solid #e2e8f0',
                            backgroundColor: pageNum === currentPage ? '#eef2ff' : 'white',
                            color: pageNum === currentPage ? '#6366f1' : '#0f172a',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 2 && currentPage > 3) ||
                      (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNum} style={{ padding: '6px', color: '#cbd5e1' }}>...</span>;
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: currentPage === totalPages ? '#f8fafc' : 'white',
                      color: currentPage === totalPages ? '#cbd5e1' : '#0f172a',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contact Detail Panel */}
          {selectedContact && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              height: 'fit-content',
              position: 'sticky',
              top: '32px'
            }}>
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a'
                }}>
                  Détails du contact
                </h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  style={{
                    padding: '4px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '20px',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                {editingContact ? (
                  // Edit Mode
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Nom
                      </label>
                      <input
                        type="text"
                        value={editingContact.name}
                        onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editingContact.email}
                        onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={editingContact.phone || ''}
                        onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Message
                      </label>
                      <textarea
                        value={editingContact.message || ''}
                        onChange={(e) => setEditingContact({...editingContact, message: e.target.value})}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={saveContactEdit}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => setEditingContact(null)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'white',
                          color: '#64748b',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    {/* Name */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '8px'
                      }}>
                        {selectedContact.name}
                      </div>
                      {getStatusBadge(selectedContact.status)}
                    </div>

                    {/* Contact Info */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Informations
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          marginBottom: '4px'
                        }}>
                          Email
                        </div>
                        <a href={`mailto:${selectedContact.email}`} style={{
                          fontSize: '14px',
                          color: '#3b82f6',
                          textDecoration: 'none'
                        }}>
                          {selectedContact.email}
                        </a>
                      </div>

                      {selectedContact.phone && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{
                            fontSize: '11px',
                            color: '#94a3b8',
                            marginBottom: '4px'
                          }}>
                            Téléphone
                          </div>
                          <a href={`tel:${selectedContact.phone}`} style={{
                            fontSize: '14px',
                            color: '#3b82f6',
                            textDecoration: 'none'
                          }}>
                            {selectedContact.phone}
                          </a>
                        </div>
                      )}

                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          marginBottom: '4px'
                        }}>
                          Source
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#0f172a'
                        }}>
                          {selectedContact.source}
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          marginBottom: '4px'
                        }}>
                          Créé le
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#0f172a'
                        }}>
                          {formatDate(selectedContact.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    {selectedContact.message && (
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#64748b',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Message
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          backgroundColor: '#f8fafc',
                          padding: '12px',
                          borderRadius: '6px'
                        }}>
                          {selectedContact.message}
                        </div>
                      </div>
                    )}

                    {/* Appointments */}
                    {selectedContact.appointments.length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#64748b',
                          marginBottom: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Rendez-vous ({selectedContact.appointments.length})
                        </div>
                        {selectedContact.appointments.map((apt) => (
                          <div key={apt.id} style={{
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            border: '1px solid #f1f5f9'
                          }}>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#0f172a',
                              marginBottom: '4px'
                            }}>
                              {apt.title}
                            </div>
                            <div style={{
                              fontSize: '13px',
                              color: '#64748b',
                              marginBottom: '4px'
                            }}>
                              {formatDate(apt.startTime)}
                            </div>
                            {apt.description && (
                              <div style={{
                                fontSize: '12px',
                                color: '#64748b'
                              }}>
                                {apt.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Change Status */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Changer le statut
                      </div>
                      <select
                        value={selectedContact.status}
                        onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as ContactStatus)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map((status) => (
                          <option key={status} value={status}>
                            {STATUS_CONFIG[status].label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <button
                        onClick={() => setEditingContact(selectedContact)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'white',
                          color: '#0f172a',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Éditer
                      </button>
                      <button
                        onClick={() => deleteContact(selectedContact.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #fee2e2',
                          backgroundColor: '#fef2f2',
                          color: '#ef4444',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
