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
  new: { label: 'Nouveau', color: '#3b82f6', bgColor: '#dbeafe' },
  contacted: { label: 'Contacté', color: '#f59e0b', bgColor: '#fef3c7' },
  qualified: { label: 'Qualifié', color: '#8b5cf6', bgColor: '#ede9fe' },
  client: { label: 'Client', color: '#10b981', bgColor: '#d1fae5' },
  lost: { label: 'Perdu', color: '#ef4444', bgColor: '#fee2e2' }
};

// VARIANTE 4: Tabs Horizontaux Élégants Modernes
export default function LeadsV4() {
  const { sidebarWidth } = useSidebar();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'professional' | 'model' | 'all'>('all');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => { setContacts(data); setLoading(false); });
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

  const tabs = [
    { value: 'all', label: 'Tous les leads', count: contacts.length, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { value: 'professional', label: 'Professionnels', count: contacts.filter(c => c.type === 'professional').length, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { value: 'model', label: 'Mannequins', count: contacts.filter(c => c.type === 'model').length, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
  ];

  const handleRefresh = () => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        padding: '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header avec Tabs */}
        <div style={{
          background: 'linear-gradient(to right, #0f172a, #1e293b)',
          padding: '40px 40px 0 40px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 600,
            marginBottom: '32px',
            letterSpacing: '-0.01em'
          }}>
            Leads
          </h1>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '-2px'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveSection(tab.value as any)}
                style={{
                  padding: '16px 28px',
                  border: 'none',
                  borderRadius: '12px 12px 0 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  background: activeSection === tab.value ? 'white' : 'rgba(255,255,255,0.1)',
                  color: activeSection === tab.value ? '#0f172a' : 'rgba(255,255,255,0.7)',
                  boxShadow: activeSection === tab.value ? '0 -4px 12px rgba(0,0,0,0.08)' : 'none',
                  transform: activeSection === tab.value ? 'translateY(0)' : 'translateY(0)',
                }}
                onMouseOver={(e) => {
                  if (activeSection !== tab.value) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSection !== tab.value) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
              >
                {activeSection === tab.value && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: tab.gradient
                  }} />
                )}
                <span>{tab.label}</span>
                <span style={{
                  marginLeft: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: activeSection === tab.value ? tab.gradient : 'rgba(255,255,255,0.1)',
                  color: activeSection === tab.value ? 'white' : 'rgba(255,255,255,0.7)'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          backgroundColor: 'white',
          minHeight: 'calc(100vh - 180px)',
          padding: '32px 40px'
        }}>
          {/* Filters Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: '1 1 300px',
                padding: '14px 20px',
                borderRadius: '12px',
                border: '2px solid #f1f5f9',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#f1f5f9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Statut :
              </span>
              <button
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '2px solid',
                  borderColor: statusFilter === 'all' ? '#6366f1' : '#e2e8f0',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: statusFilter === 'all' ? '#eef2ff' : 'white',
                  color: statusFilter === 'all' ? '#6366f1' : '#64748b'
                }}
              >
                Tous
              </button>
              {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: statusFilter === status ? STATUS_CONFIG[status].color : '#e2e8f0',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: statusFilter === status ? STATUS_CONFIG[status].bgColor : 'white',
                    color: statusFilter === status ? STATUS_CONFIG[status].color : '#64748b'
                  }}
                >
                  {STATUS_CONFIG[status].label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div style={{
            fontSize: '13px',
            color: '#94a3b8',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            {filteredContacts.length} résultat{filteredContacts.length > 1 ? 's' : ''}
          </div>

          {/* Table */}
          <div style={{
            border: '1px solid #f1f5f9',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                Chargement...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <p style={{ color: '#64748b' }}>Aucun lead trouvé</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nom</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Statut</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact, index) => (
                    <tr
                      key={contact.id}
                      onClick={() => setSelectedContactId(contact.id)}
                      style={{
                        borderTop: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#fafbfc';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{contact.name}</td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>{contact.email}</div>
                        {contact.phone && <div style={{ fontSize: '12px', color: '#94a3b8' }}>{contact.phone}</div>}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        {contact.type && (
                          <span style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'white',
                            background: contact.type === 'professional' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                          }}>
                            {contact.type === 'professional' ? 'Pro' : 'Mannequin'}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: STATUS_CONFIG[contact.status].color,
                          backgroundColor: STATUS_CONFIG[contact.status].bgColor
                        }}>
                          {STATUS_CONFIG[contact.status].label}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '13px', color: '#94a3b8', textAlign: 'right' }}>
                        {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
