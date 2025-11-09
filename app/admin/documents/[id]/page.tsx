'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  filePath: string;
  originalDocx: string | null;
  signedPdfPath: string | null;
  createdAt: string;
  sentAt: string | null;
  signedAt: string | null;
  amountHT: number | null;
  amountTTC: number | null;
  currency: string;
  notes: string | null;
  data: any;
  template: {
    id: string;
    name: string;
    type: string;
  } | null;
  talent: {
    id: string;
    name: string;
    type: string;
  } | null;
  contact: {
    id: string;
    name: string;
    email: string;
  } | null;
  signatures: Array<{
    id: string;
    signerName: string;
    signerEmail: string;
    signedAt: string;
  }>;
  mailLogs: Array<{
    id: string;
    type: string;
    to: string;
    sentAt: string;
    status: string;
  }>;
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  async function fetchDocument() {
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
        // Pre-fill email if talent or contact exists
        if (data.contact?.email) {
          setSendEmail(data.contact.email);
        }
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendDocument = async () => {
    if (!sendEmail) {
      alert('Veuillez entrer une adresse email');
      return;
    }

    try {
      setSending(true);
      const response = await fetch('/api/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          to: sendEmail,
          message: sendMessage,
          requiresSignature: true, // Signature activée pour tous les types de documents
          sentBy: 'Admin'
        })
      });

      if (response.ok) {
        alert('Document envoyé avec succès !');
        setSendModalOpen(false);
        fetchDocument(); // Refresh document
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error || error.details}`);
      }
    } catch (error) {
      console.error('Error sending document:', error);
      alert('Erreur lors de l\'envoi du document');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Document supprimé');
        router.push('/admin/documents');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

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

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
        <AdminSidebar />
        <div style={{
          flex: 1,
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b'
        }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
        <AdminSidebar />
        <div style={{
          flex: 1,
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Document non trouvé</p>
          <Link
            href="/admin/documents"
            style={{
              padding: '10px 20px',
              backgroundColor: '#6366f1',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            ← Retour aux documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        backgroundColor: '#fafbfc',
        padding: '40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: getStatusColor(document.status) + '20',
                border: `1px solid ${getStatusColor(document.status)}`,
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: getStatusColor(document.status),
                marginBottom: '12px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(document.status)
                }} />
                {getStatusLabel(document.status)}
              </div>

              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                marginBottom: '8px'
              }}>
                {document.template?.name || 'Document'}
              </h1>

              {document.documentNumber && (
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  margin: 0
                }}>
                  {document.documentNumber}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSendModalOpen(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Envoyer par email
              </button>

              <Link
                href="/admin/documents"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fff',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
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
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Retour
              </Link>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px'
          }}>
            {/* Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Document Info */}
              <div style={{
                padding: '24px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '20px'
                }}>
                  Informations du document
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Type</p>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      {document.type}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Catégorie</p>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#3b82f6'
                    }}>
                      {document.category}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Créé le</p>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', margin: 0 }}>{formatDate(document.createdAt)}</p>
                  </div>

                  {document.sentAt && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Envoyé le</p>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', margin: 0 }}>{formatDate(document.sentAt)}</p>
                    </div>
                  )}

                  {document.signedAt && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Signé le</p>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#10b981', margin: 0 }}>{formatDate(document.signedAt)}</p>
                    </div>
                  )}

                  {document.amountTTC && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Montant TTC</p>
                      <p style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', margin: 0 }}>
                        {formatAmount(document.amountTTC)}
                      </p>
                    </div>
                  )}
                </div>

                {document.notes && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Notes</p>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569', margin: 0 }}>{document.notes}</p>
                  </div>
                )}
              </div>

              {/* Linked Entities */}
              {(document.talent || document.contact) && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '20px'
                  }}>
                    Liens associés
                  </h2>

                  {document.talent && (
                    <div style={{ marginBottom: document.contact ? '16px' : '0' }}>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Talent</p>
                      <Link
                        href={`/admin/models/edit/${document.talent.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#2563eb',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#dbeafe';
                          e.currentTarget.style.borderColor = '#93c5fd';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#eff6ff';
                          e.currentTarget.style.borderColor = '#bfdbfe';
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        {document.talent.name}
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: '#dbeafe',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {document.talent.type}
                        </span>
                      </Link>
                    </div>
                  )}

                  {document.contact && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Client / Contact</p>
                      <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: '#0f172a' }}>
                          {document.contact.name}
                        </p>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                          {document.contact.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Actions */}
              <div style={{
                padding: '24px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '16px'
                }}>
                  Fichiers
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {document.signedPdfPath && (
                    <a
                      href={document.signedPdfPath}
                      download
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: '#15803d',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#4ade80';
                        e.currentTarget.style.backgroundColor = '#dcfce7';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#86efac';
                        e.currentTarget.style.backgroundColor = '#f0fdf4';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      PDF Signé
                    </a>
                  )}

                  <a
                    href={document.filePath}
                    download
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textAlign: 'center',
                      textDecoration: 'none',
                      color: '#0f172a',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#fff';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                    {document.fileName.endsWith('.pdf') ? 'PDF' : document.fileName.endsWith('.docx') ? 'DOCX' : 'Document'} Original
                  </a>

                  {document.originalDocx && (
                    <a
                      href={document.originalDocx}
                      download
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: '#0f172a',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = '#fff';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      DOCX Original
                    </a>
                  )}
                </div>

                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <button
                    onClick={handleDeleteDocument}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#dc2626',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.borderColor = '#fca5a5';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Signatures */}
              {document.signatures.length > 0 && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#15803d',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Signatures ({document.signatures.length})
                  </h3>

                  {document.signatures.map((sig) => (
                    <div
                      key={sig.id}
                      style={{
                        padding: '14px',
                        backgroundColor: '#fff',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        marginBottom: '10px'
                      }}
                    >
                      <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: '#0f172a' }}>
                        {sig.signerName}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                        {sig.signerEmail}
                      </p>
                      <p style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                        Signé le {formatDate(sig.signedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Mail Logs */}
              {document.mailLogs.length > 0 && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Historique emails ({document.mailLogs.length})
                  </h3>

                  {document.mailLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '14px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '10px'
                      }}
                    >
                      <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#0f172a' }}>
                        À: {log.to}
                      </p>
                      <p style={{ fontSize: '11px', color: '#64748b' }}>
                        {formatDate(log.sentAt)} • {log.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Send Modal */}
      {sendModalOpen && (
        <div
          onClick={() => setSendModalOpen(false)}
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
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <h2 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '24px',
              margin: 0
            }}>
              Envoyer le document
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#475569'
              }}>
                Destinataire
              </label>
              <input
                type="email"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                placeholder="email@exemple.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#475569'
              }}>
                Message (optionnel)
              </label>
              <textarea
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                placeholder="Ajouter un message personnalisé..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSendModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                Annuler
              </button>
              <button
                onClick={handleSendDocument}
                disabled={sending || !sendEmail}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: sending || !sendEmail ? '#9ca3af' : '#6366f1',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: sending || !sendEmail ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!sending && sendEmail) e.currentTarget.style.backgroundColor = '#4f46e5';
                }}
                onMouseOut={(e) => {
                  if (!sending && sendEmail) e.currentTarget.style.backgroundColor = '#6366f1';
                }}
              >
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
