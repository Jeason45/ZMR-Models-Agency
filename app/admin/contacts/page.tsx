'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import LeadDetailModal from '@/components/LeadDetailModal';

type ContactStatus = 'new' | 'contacted' | 'qualified' | 'client' | 'lost';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  type: string | null;
  status: ContactStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG = {
  new: { label: 'Nouveau', color: '#60a5fa', bgColor: 'rgba(96, 165, 250, 0.15)' },
  contacted: { label: 'Contacté', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.15)' },
  qualified: { label: 'Qualifié', color: '#c084fc', bgColor: 'rgba(192, 132, 252, 0.15)' },
  client: { label: 'Client', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.15)' },
  lost: { label: 'Perdu', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' }
};

export default function LeadsPage() {
  const { sidebarWidth, isMobile } = useSidebar();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'professional' | 'model' | 'all'>('all');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.ok ? res.json() : [])
      .catch(() => [])
      .then(data => {
        setContacts(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...contacts];
    if (activeSection !== 'all') filtered = filtered.filter(c => c.type === activeSection);
    if (statusFilter !== 'all') filtered = filtered.filter(c => c.status === statusFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.phone && c.phone.toLowerCase().includes(query))
      );
    }
    setFilteredContacts(filtered);
  }, [contacts, statusFilter, searchQuery, activeSection]);

  const handleRefresh = () => {
    fetch('/api/contacts')
      .then(res => res.ok ? res.json() : [])
      .catch(() => [])
      .then(data => setContacts(Array.isArray(data) ? data : []));
  };

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    professional: contacts.filter(c => c.type === 'professional').length,
    model: contacts.filter(c => c.type === 'model').length
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
            Leads
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
            Gérez vos leads et suivez vos prospects
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
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
              Total Leads
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
              Nouveaux
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#60a5fa' }}>
              {loading ? '...' : stats.new}
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
              Professionnels
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#ec4899' }}>
              {loading ? '...' : stats.professional}
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
              Mannequins
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#22d3ee' }}>
              {loading ? '...' : stats.model}
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
            onClick={() => setActiveSection('all')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeSection === 'all' ? '#fb923c' : 'transparent',
              color: activeSection === 'all' ? 'black' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Tous ({contacts.length})
          </button>
          <button
            onClick={() => setActiveSection('professional')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeSection === 'professional' ? '#fb923c' : 'transparent',
              color: activeSection === 'professional' ? 'black' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Professionnels ({stats.professional})
          </button>
          <button
            onClick={() => setActiveSection('model')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeSection === 'model' ? '#fb923c' : 'transparent',
              color: activeSection === 'model' ? 'black' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Mannequins ({stats.model})
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: isMobile ? '1 1 100%' : '1 1 300px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              outline: 'none'
            }}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContactStatus | 'all')}
            style={{
              padding: '12px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all" style={{ background: '#0f1b2e', color: 'white' }}>Tous les statuts</option>
            <option value="new" style={{ background: '#0f1b2e', color: 'white' }}>Nouveau</option>
            <option value="contacted" style={{ background: '#0f1b2e', color: 'white' }}>Contacté</option>
            <option value="qualified" style={{ background: '#0f1b2e', color: 'white' }}>Qualifié</option>
            <option value="client" style={{ background: '#0f1b2e', color: 'white' }}>Client</option>
            <option value="lost" style={{ background: '#0f1b2e', color: 'white' }}>Perdu</option>
          </select>
        </div>

        {/* Results count */}
        <div style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '16px'
        }}>
          {filteredContacts.length} résultat{filteredContacts.length > 1 ? 's' : ''}
        </div>

        {/* Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: isMobile ? 'auto' : 'hidden'
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Chargement...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📋</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Aucun lead trouvé</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '800px' : 'auto' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nom
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Contact
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Type
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Statut
                  </th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontWeight: 600, color: 'white' }}>{contact.name}</p>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2px' }}>{contact.email}</p>
                      {contact.phone && (
                        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>{contact.phone}</p>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {contact.type && (
                        <span style={{
                          padding: '4px 10px',
                          backgroundColor: contact.type === 'professional' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(34, 211, 238, 0.15)',
                          color: contact.type === 'professional' ? '#ec4899' : '#22d3ee',
                          fontSize: '12px',
                          fontWeight: 600,
                          borderRadius: '6px'
                        }}>
                          {contact.type === 'professional' ? 'Pro' : 'Mannequin'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        backgroundColor: STATUS_CONFIG[contact.status].bgColor,
                        color: STATUS_CONFIG[contact.status].color,
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px'
                      }}>
                        {STATUS_CONFIG[contact.status].label}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal détail du lead */}
      {selectedContactId && (
        <LeadDetailModal
          contactId={selectedContactId}
          onClose={() => setSelectedContactId(null)}
          onUpdate={handleRefresh}
        />
      )}
    </div>
  );
}
