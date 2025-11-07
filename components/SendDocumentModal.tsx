'use client';

import { useState, useEffect } from 'react';

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string | null;
  variables: string[];
  requiresSignature: boolean;
}

interface SendDocumentModalProps {
  contactId: string;
  contactName: string;
  contactEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SendDocumentModal({
  contactId,
  contactName,
  contactEmail,
  onClose,
  onSuccess
}: SendDocumentModalProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Charger les templates actifs
    fetch('/api/document-templates?isActive=true')
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading templates:', err);
        setLoading(false);
      });
  }, []);

  const handleSelectTemplate = async (template: DocumentTemplate) => {
    setSending(true);

    try {
      // 1. Générer le document vierge (sans données pré-remplies)
      const generateRes = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          data: {}, // Document vierge - le client remplira les champs
          contactId
        })
      });

      if (!generateRes.ok) {
        const error = await generateRes.json();
        alert(`❌ Erreur lors de la génération: ${error.error}`);
        setSending(false);
        return;
      }

      const { document } = await generateRes.json();

      // 2. Envoyer le document au contact pour qu'il le remplisse et signe
      const sendRes = await fetch(`/api/contacts/${contactId}/send-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          message: `Bonjour ${contactName},\n\nVeuillez consulter et compléter le document "${template.name}" ci-joint.\n\n${template.requiresSignature ? 'Une signature électronique sera requise.' : ''}\n\nCordialement,\nZMR Models Agency`,
          requiresSignature: template.requiresSignature,
          sentBy: 'admin'
        })
      });

      if (!sendRes.ok) {
        alert('❌ Document généré mais erreur lors de l\'envoi par email');
        setSending(false);
        return;
      }

      alert('✓ Document envoyé avec succès! Le client pourra le remplir et le signer.');
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error:', error);
      alert('❌ Erreur lors du traitement');
      setSending(false);
    }
  };

  // Grouper les templates par type
  const groupedTemplates = templates.reduce((acc, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t);
    return acc;
  }, {} as Record<string, DocumentTemplate[]>);

  const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
    CONTRAT: { label: 'Contrats', icon: '📝', color: '#6366f1' },
    FACTURE: { label: 'Factures', icon: '💰', color: '#10b981' },
    DEVIS: { label: 'Devis', icon: '📊', color: '#f59e0b' },
    ADMINISTRATIF: { label: 'Administratif', icon: '📋', color: '#8b5cf6' }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1001,
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '0',
        maxWidth: '900px',
        width: '95%',
        maxHeight: '85vh',
        overflowY: 'auto',
        zIndex: 1002,
        boxShadow: '0 25px 80px rgba(0,0,0,0.4)'
      }}>

        {/* Header */}
        <div style={{
          padding: '32px',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          borderRadius: '20px 20px 0 0',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#0f172a' }}>
                {sending ? '📤 Envoi en cours...' : '📄 Envoyer un document'}
              </h2>
              <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                Destinataire: {contactName} ({contactEmail})
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #e2e8f0',
                background: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>

          {/* Sélection du template */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              Chargement des templates...
            </div>
          ) : templates.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>
                Aucun template disponible
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                Veuillez créer des templates de documents dans la section Administration.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '32px' }}>
              {Object.keys(groupedTemplates).map(type => (
                <div key={type}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: `3px solid ${typeLabels[type]?.color || '#e2e8f0'}`
                  }}>
                    <span style={{ fontSize: '28px' }}>{typeLabels[type]?.icon || '📄'}</span>
                    <h3 style={{
                      margin: 0,
                      fontSize: '18px',
                      fontWeight: 600,
                      color: typeLabels[type]?.color || '#0f172a'
                    }}>
                      {typeLabels[type]?.label || type}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: `${typeLabels[type]?.color}22`,
                      color: typeLabels[type]?.color
                    }}>
                      {groupedTemplates[type].length}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {groupedTemplates[type].map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        disabled={sending}
                        style={{
                          padding: '20px',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          background: 'white',
                          textAlign: 'left',
                          cursor: sending ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative',
                          opacity: sending ? 0.6 : 1
                        }}
                        onMouseOver={(e) => {
                          if (!sending) {
                            e.currentTarget.style.borderColor = typeLabels[type]?.color || '#6366f1';
                            e.currentTarget.style.backgroundColor = `${typeLabels[type]?.color || '#6366f1'}08`;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!sending) {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {template.requiresSignature && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: '#fef3c7',
                            color: '#f59e0b'
                          }}>
                            ✍️ Signature
                          </div>
                        )}
                        <div style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a', marginBottom: '8px', paddingRight: '80px' }}>
                          {template.name}
                        </div>
                        {template.description && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                            {template.description}
                          </div>
                        )}
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                          Le client remplira les champs requis
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
