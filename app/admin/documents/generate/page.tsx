'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import SmartDocumentForm from '@/components/SmartDocumentForm';
import { generateDocumentNumber } from '@/lib/documentGenerator';

interface Template {
  id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  description: string;
  variables: string[];
  fieldMapping: any;
  requiresSignature: boolean;
}

interface Talent {
  id: string;
  name: string;
  type: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
}

export default function SmartGenerateDocumentPage() {
  const router = useRouter();
  const { isCollapsed, isMobile } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;

  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedTalent, setSelectedTalent] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    fetchTemplates();
    fetchTalents();
    fetchContacts();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/document-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }

  async function fetchTalents() {
    try {
      const response = await fetch('/api/talents');
      if (response.ok) {
        const data = await response.json();
        setTalents(data);
      }
    } catch (error) {
      console.error('Error fetching talents:', error);
    }
  }

  async function fetchContacts() {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep(2);
  };

  const handleContinueToForm = () => {
    setStep(3);
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;

    try {
      setGenerating(true);

      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          data: formData,
          talentId: selectedTalent || null,
          contactId: selectedContact || null,
          category: selectedTemplate.category,
          type: selectedTemplate.type,
          generatedBy: 'Admin'
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Document généré avec succès !');
        router.push(`/admin/documents/${result.document.id}`);
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Erreur lors de la génération du document');
    } finally {
      setGenerating(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONTRAT': return '#8b5cf6';
      case 'FACTURE': return '#10b981';
      case 'DEVIS': return '#f59e0b';
      case 'ADMINISTRATIF': return '#6b7280';
      default: return '#D4AF37';
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'white',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.7)'
  };

  const sectionStyle = {
    padding: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
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
        transition: 'margin-left 0.3s ease',
        padding: isMobile ? '20px' : '40px',
        paddingTop: isMobile ? '80px' : '40px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'white',
                margin: 0,
                marginBottom: '8px'
              }}>
                Générer un document
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                margin: 0
              }}>
                {step === 1 && 'Étape 1/3 : Sélectionnez un modèle de document'}
                {step === 2 && 'Étape 2/3 : Sélectionnez le client ou le talent'}
                {step === 3 && 'Étape 3/3 : Complétez les informations'}
              </p>
            </div>

            <Link
              href="/admin/documents"
              style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Annuler
            </Link>
          </div>

          {/* Progress bar */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px'
          }}>
            {[1, 2, 3].map(num => (
              <div
                key={num}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: num <= step ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

          {/* Step 1: Select Template */}
          {step === 1 && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px'
              }}>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    style={{
                      padding: '24px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = getTypeColor(template.type);
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 20px ${getTypeColor(template.type)}30`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${getTypeColor(template.type)}20`,
                        borderRadius: '8px',
                        fontSize: '20px'
                      }}>
                        {template.type === 'CONTRAT' && '📜'}
                        {template.type === 'DEVIS' && '📄'}
                        {template.type === 'FACTURE' && '💰'}
                        {template.type === 'ADMINISTRATIF' && '📋'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: 'white',
                          margin: 0,
                          marginBottom: '4px'
                        }}>
                          {template.name}
                        </h3>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: `${getTypeColor(template.type)}25`,
                          color: getTypeColor(template.type),
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {template.type}
                        </span>
                      </div>
                    </div>

                    <p style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '16px',
                      lineHeight: '1.5'
                    }}>
                      {template.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      {template.requiresSignature && (
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          Signature requise
                        </span>
                      )}
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {template.variables?.length || 0} champs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Contact/Talent */}
          {step === 2 && selectedTemplate && (
            <div>
              <div style={sectionStyle}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'white',
                  marginBottom: '16px'
                }}>
                  Template sélectionné : {selectedTemplate.name}
                </h3>

                {selectedTemplate.category === 'talent' && (
                  <div>
                    <label style={labelStyle}>
                      Sélectionnez un talent
                    </label>
                    <select
                      value={selectedTalent}
                      onChange={(e) => setSelectedTalent(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">-- Choisir un talent --</option>
                      {talents.map(talent => (
                        <option key={talent.id} value={talent.id}>
                          {talent.name} ({talent.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedTemplate.category === 'client' || selectedTemplate.category === 'commercial') && (
                  <div>
                    <label style={labelStyle}>
                      Sélectionnez un client
                    </label>
                    <select
                      value={selectedContact}
                      onChange={(e) => setSelectedContact(e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">-- Choisir un client --</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} ({contact.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '24px'
                }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleContinueToForm}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                      color: 'black',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Smart Form */}
          {step === 3 && selectedTemplate && (
            <div>
              <SmartDocumentForm
                templateId={selectedTemplate.id}
                contactId={selectedContact || undefined}
                talentId={selectedTalent || undefined}
                onDataChange={setFormData}
                onMetadataChange={setMetadata}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px',
                ...sectionStyle
              }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ← Retour
                </button>

                <button
                  onClick={handleGenerateDocument}
                  disabled={generating}
                  style={{
                    padding: '14px 40px',
                    background: generating ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                    color: generating ? 'rgba(255, 255, 255, 0.5)' : 'black',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: generating ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: generating ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  {generating ? (
                    <>
                      <span>⏳</span>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Générer le document
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
