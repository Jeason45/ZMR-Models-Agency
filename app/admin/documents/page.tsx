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
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;
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
      case 'signed': return '#10b981';
      case 'archived': return '#8b5cf6';
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        backgroundColor: '#fafbfc',
        padding: '40px',
        color: '#000'
      }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 40px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              marginBottom: '8px'
            }}>
              Documents
            </h1>
            <p style={{
              color: '#64748b',
              fontSize: '14px',
              margin: 0
            }}>
              Gérez vos contrats, factures et documents signés
            </p>
          </div>

          <Link
            href="/admin/documents/create"
            style={{
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
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
            Créer un Document
          </Link>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px'
        }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            style={{
              padding: '12px 16px',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyé</option>
            <option value="signed">Signé</option>
            <option value="archived">Archivé</option>
            <option value="cancelled">Annulé</option>
          </select>

          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            style={{
              padding: '12px 16px',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">Tous les types</option>
            <option value="CONTRAT">Contrats</option>
            <option value="FACTURE">Factures</option>
            <option value="DEVIS">Devis</option>
            <option value="ADMINISTRATIF">Administratif</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            style={{
              padding: '12px 16px',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">Toutes les catégories</option>
            <option value="talent">Talents</option>
            <option value="client">Clients</option>
            <option value="commercial">Commercial</option>
            <option value="admin">Administration</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        border: '1px solid #f1f5f9',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            color: '#64748b',
            backgroundColor: '#fff'
          }}>
            Chargement...
          </div>
        ) : documents.length === 0 ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
            backgroundColor: '#fff'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '20px', color: '#64748b' }}>Aucun document trouvé</p>
            <Link
              href="/admin/documents/create"
              style={{
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
            >
              Générer votre premier document
            </Link>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>NUMÉRO</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DOCUMENT</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TYPE</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DESTINATAIRE</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MONTANT</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DATE</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STATUT</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: '#fff',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>
                    {doc.documentNumber || '-'}
                  </td>
                  <td style={{ padding: '20px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      {doc.template?.name || 'Document'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {doc.fileName}
                    </div>
                  </td>
                  <td style={{ padding: '20px 16px', fontSize: '13px' }}>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.05em'
                    }}>
                      {doc.type}
                    </span>
                  </td>
                  <td style={{ padding: '20px 16px', fontSize: '13px' }}>
                    {doc.talent ? doc.talent.name : doc.contact ? doc.contact.name : '-'}
                  </td>
                  <td style={{ padding: '20px 16px', fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>
                    {formatAmount(doc.amountTTC)}
                  </td>
                  <td style={{ padding: '20px 16px', fontSize: '13px', color: '#64748b' }}>
                    {formatDate(doc.createdAt)}
                  </td>
                  <td style={{ padding: '20px 16px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: getStatusColor(doc.status) + '20',
                      border: `1px solid ${getStatusColor(doc.status)}`,
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
                  <td style={{ padding: '20px 16px' }}>
                    <Link
                      href={`/admin/documents/${doc.id}`}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6366f1',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#fff',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </div>
  );
}
