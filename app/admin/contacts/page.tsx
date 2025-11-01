'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      const url = filter === 'all' ? '/api/contacts' : `/api/contacts?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();

      // Check if data is an array, otherwise set empty array
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        console.error('API returned error:', data);
        setContacts([]);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return { bg: '#dbeafe', text: '#1e40af', label: 'Nouveau' };
      case 'read': return { bg: '#fef3c7', text: '#92400e', label: 'Lu' };
      case 'replied': return { bg: '#d1fae5', text: '#065f46', label: 'Répondu' };
      default: return { bg: '#f3f4f6', text: '#374151', label: status };
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'Professional' ? '💼' : '👤';
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '8px'
            }}>
              Gestion des contacts
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#64748b'
            }}>
              {filteredContacts.length} contact{filteredContacts.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: 'white',
            padding: '6px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            {['all', 'new', 'read', 'replied'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: filter === status ? '#6366f1' : 'transparent',
                  color: filter === status ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {status === 'all' ? 'Tous' : status === 'new' ? 'Nouveaux' : status === 'read' ? 'Lus' : 'Répondus'}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedContact ? '1fr 1fr' : '1fr',
          gap: '24px'
        }}>
          {/* List */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            {filteredContacts.length === 0 ? (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Aucun contact</p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const statusInfo = getStatusColor(contact.status);
                return (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    style={{
                      padding: '20px',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      backgroundColor: selectedContact?.id === contact.id ? '#f8fafc' : 'white',
                      transition: 'all 0.2s'
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
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{getTypeIcon(contact.type)}</span>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '4px'
                          }}>
                            {contact.name}
                          </h4>
                          <p style={{
                            fontSize: '13px',
                            color: '#64748b'
                          }}>
                            {contact.email}
                          </p>
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px'
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#475569',
                      marginTop: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {contact.message}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      marginTop: '8px'
                    }}>
                      {new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Contact Detail */}
          {selectedContact && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              padding: '32px',
              position: 'sticky',
              top: '40px',
              height: 'fit-content'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}>
                    {selectedContact.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '16px' }}>{getTypeIcon(selectedContact.type)}</span>
                    {selectedContact.type}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>
                  EMAIL
                </p>
                <p style={{
                  fontSize: '15px',
                  color: '#334155',
                  fontWeight: 500
                }}>
                  {selectedContact.email}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>
                  TÉLÉPHONE
                </p>
                <p style={{
                  fontSize: '15px',
                  color: '#334155',
                  fontWeight: 500
                }}>
                  {selectedContact.phone}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  fontWeight: 500,
                  marginBottom: '8px'
                }}>
                  MESSAGE
                </p>
                <p style={{
                  fontSize: '15px',
                  color: '#334155',
                  lineHeight: 1.6
                }}>
                  {selectedContact.message}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Répondre
                </button>
                <button style={{
                  padding: '12px 20px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Archiver
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
