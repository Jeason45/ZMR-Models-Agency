'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

interface Document {
  id: string;
  fileName: string;
  type: string;
  category: string;
  status: string;
  documentNumber: string | null;
  createdAt: string;
  sentAt: string | null;
  signedAt: string | null;
  amountTTC: number | null;
  template: {
    name: string;
  } | null;
  talent: {
    id: string;
    name: string;
  } | null;
  contact: {
    id: string;
    name: string;
    email: string;
  } | null;
  signatures: Array<{
    id: string;
    signerName: string;
    signedAt: string;
  }>;
  mailLogs: Array<{
    id: string;
    sentAt: string;
    status: string;
  }>;
}

export default function DocumentsManagementPage() {
  const router = useRouter();
  const { sidebarWidth, isMobile } = useSidebar();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    category: ''
  });

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  async function fetchDocuments() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.type) params.append('type', filter.type);
      if (filter.category) params.append('category', filter.category);

      const response = await fetch(`/api/documents?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'sent': return '#3b82f6';
      case 'signed': return '#34d399';
      case 'archived': return '#a855f7';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyé';
      case 'signed': return 'Signé';
      case 'archived': return 'Archivé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const typeColors: Record<string, { bg: string; color: string }> = {
    CONTRAT: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' },
    FACTURE: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' },
    DEVIS: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
    ADMINISTRATIF: { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const stats = {
    total: documents.length,
    draft: documents.filter(d => d.status === 'draft').length,
    sent: documents.filter(d => d.status === 'sent').length,
    signed: documents.filter(d => d.status === 'signed').length
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
            Documents
          </span>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Gérez vos contrats, factures et documents signés
            </p>
          </div>

          <Link
            href="/admin/documents/create"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#fb923c',
              color: 'black',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Créer un Document
          </Link>
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
              Total
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
              Brouillons
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#6b7280' }}>
              {loading ? '...' : stats.draft}
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
              Envoyés
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6' }}>
              {loading ? '...' : stats.sent}
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
              Signés
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#34d399' }}>
              {loading ? '...' : stats.signed}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '15px',
          marginBottom: '24px'
        }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="" style={{ background: '#0f1b2e' }}>Tous les statuts</option>
            <option value="draft" style={{ background: '#0f1b2e' }}>Brouillon</option>
            <option value="sent" style={{ background: '#0f1b2e' }}>Envoyé</option>
            <option value="signed" style={{ background: '#0f1b2e' }}>Signé</option>
            <option value="archived" style={{ background: '#0f1b2e' }}>Archivé</option>
            <option value="cancelled" style={{ background: '#0f1b2e' }}>Annulé</option>
          </select>

          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="" style={{ background: '#0f1b2e' }}>Tous les types</option>
            <option value="CONTRAT" style={{ background: '#0f1b2e' }}>Contrats</option>
            <option value="FACTURE" style={{ background: '#0f1b2e' }}>Factures</option>
            <option value="DEVIS" style={{ background: '#0f1b2e' }}>Devis</option>
            <option value="ADMINISTRATIF" style={{ background: '#0f1b2e' }}>Administratif</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="" style={{ background: '#0f1b2e' }}>Toutes les catégories</option>
            <option value="talent" style={{ background: '#0f1b2e' }}>Talents</option>
            <option value="client" style={{ background: '#0f1b2e' }}>Clients</option>
            <option value="commercial" style={{ background: '#0f1b2e' }}>Commercial</option>
            <option value="admin" style={{ background: '#0f1b2e' }}>Administration</option>
          </select>
        </div>

        {/* Documents Table */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              padding: '80px 20px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Chargement...
            </div>
          ) : documents.length === 0 ? (
            <div style={{
              padding: '80px 20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📄</p>
              <p style={{ fontSize: '16px', marginBottom: '20px', color: 'rgba(255, 255, 255, 0.6)' }}>Aucun document trouvé</p>
              <Link
                href="/admin/documents/create"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fb923c',
                  color: 'black',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s'
                }}
              >
                Générer votre premier document
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '900px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>NUMÉRO</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DOCUMENT</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TYPE</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DESTINATAIRE</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MONTANT</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DATE</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STATUT</th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const typeStyle = typeColors[doc.type] || { bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };
                    return (
                      <tr
                        key={doc.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace', color: 'white' }}>
                          {doc.documentNumber || '-'}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'white' }}>
                            {doc.template?.name || 'Document'}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            {doc.fileName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            backgroundColor: typeStyle.bg,
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: typeStyle.color,
                            letterSpacing: '0.05em'
                          }}>
                            {doc.type}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
                          {doc.talent ? doc.talent.name : doc.contact ? doc.contact.name : '-'}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, fontFamily: 'monospace', color: 'white' }}>
                          {formatAmount(doc.amountTTC)}
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {formatDate(doc.createdAt)}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            backgroundColor: getStatusColor(doc.status) + '20',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: getStatusColor(doc.status)
                          }}>
                            <span style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: getStatusColor(doc.status)
                            }} />
                            {getStatusLabel(doc.status)}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <Link
                            href={`/admin/documents/${doc.id}`}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#fb923c',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: 'black',
                              textDecoration: 'none',
                              display: 'inline-block',
                              transition: 'all 0.2s'
                            }}
                          >
                            Voir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
