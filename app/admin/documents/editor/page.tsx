'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

// Import dynamique du PDFEditorSimple pour éviter les erreurs SSR
const PDFEditor = dynamic(() => import('@/components/PDFEditorSimple'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <div>⏳ Chargement de l'éditeur PDF...</div>
    </div>
  )
});

interface Template {
  id: string;
  name: string;
  type: string;
  category: string;
  editableFields?: any[];
}

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface Talent {
  id: string;
  name: string;
  type: string;
}

export default function PDFEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;

  // Paramètres depuis URL
  const documentId = searchParams.get('documentId');
  const templateId = searchParams.get('templateId');
  const mode = searchParams.get('mode') || 'create'; // create | edit

  // États
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [editableFields, setEditableFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Pour le mode création
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [talents, setTalents] = useState<Talent[]>([]);
  const [selectedTalent, setSelectedTalent] = useState<string>('');
  const [step, setStep] = useState<number>(mode === 'edit' ? 3 : 1);

  // Charger les ressources au montage
  useEffect(() => {
    if (mode === 'create') {
      fetchTemplates();
      fetchContacts();
      fetchTalents();
    } else if (mode === 'edit' && documentId) {
      loadExistingDocument();
    }
  }, [mode, documentId]);

  // Charger les templates
  async function fetchTemplates() {
    try {
      const response = await fetch('/api/document-templates');
      if (response.ok) {
        const data = await response.json();
        // Filtrer uniquement les templates adaptés aux PDF éditables (devis, factures, contrats simples)
        const editableTemplates = data.filter((t: Template) =>
          ['DEVIS', 'FACTURE', 'CONTRAT'].includes(t.type)
        );
        setTemplates(editableTemplates);
      }
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    }
  }

  // Charger les contacts
  async function fetchContacts() {
    try {
      const response = await fetch('/api/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Erreur chargement contacts:', error);
    }
  }

  // Charger les talents
  async function fetchTalents() {
    try {
      const response = await fetch('/api/talents');
      if (response.ok) {
        const data = await response.json();
        setTalents(data);
      }
    } catch (error) {
      console.error('Erreur chargement talents:', error);
    }
  }

  // Charger un document existant (mode édition)
  async function loadExistingDocument() {
    try {
      setLoading(true);

      // Récupérer le document
      const docResponse = await fetch(`/api/documents/${documentId}`);
      if (!docResponse.ok) throw new Error('Document non trouvé');

      const docData = await docResponse.json();
      setDocument(docData);
      setPdfUrl(docData.filePath);
      setFormData(docData.data || {});
      setEditableFields(docData.template?.editableFields || []);

    } catch (error) {
      console.error('Erreur chargement document:', error);
      alert('Erreur lors du chargement du document');
      router.push('/admin/documents');
    } finally {
      setLoading(false);
    }
  }

  // Générer le PDF éditable
  async function generateEditablePDF() {
    if (!selectedTemplate) return;

    try {
      setLoading(true);

      const response = await fetch('/api/documents/generate-editable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          contactId: selectedContact || null,
          talentId: selectedTalent || null,
          data: {}
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur de génération');
      }

      const result = await response.json();

      setDocument(result.document);
      setPdfUrl(result.pdfUrl);
      setEditableFields(result.editableFields || []);
      setFormData(result.document.data || {});
      setStep(3); // Passer à l'éditeur

    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }

  // Sauvegarder les modifications
  const handleSave = async (data: Record<string, any>) => {
    if (!document) return;

    try {
      const response = await fetch('/api/documents/generate-editable', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          data
        })
      });

      if (!response.ok) throw new Error('Erreur de sauvegarde');

      const result = await response.json();
      setPdfUrl(result.pdfUrl); // Mettre à jour avec le nouveau PDF

      alert('✅ Document sauvegardé !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  // Obtenir la couleur selon le type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONTRAT': return '#8b5cf6';
      case 'FACTURE': return '#10b981';
      case 'DEVIS': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 40px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              marginBottom: '4px'
            }}>
              📝 Éditeur PDF Interactif
            </h1>
            <p style={{
              color: '#64748b',
              fontSize: '14px',
              margin: 0
            }}>
              {mode === 'edit' ? 'Modifier le document' : 'Créer un document éditable'}
            </p>
          </div>

          <Link
            href="/admin/documents"
            style={{
              padding: '10px 20px',
              backgroundColor: '#fff',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            ← Retour aux documents
          </Link>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
            <div>Chargement en cours...</div>
          </div>
        ) : (
          <>
            {/* Étape 1 : Sélection du template */}
            {step === 1 && mode === 'create' && (
              <div style={{ padding: '40px' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '24px'
                }}>
                  Étape 1 : Sélectionnez un modèle
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {templates.map(template => (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setStep(2);
                      }}
                      style={{
                        padding: '24px',
                        backgroundColor: '#fff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = getTypeColor(template.type);
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#0f172a',
                            margin: 0
                          }}>
                            {template.name}
                          </h3>
                          <span style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            padding: '2px 8px',
                            backgroundColor: `${getTypeColor(template.type)}20`,
                            color: getTypeColor(template.type),
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            {template.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Étape 2 : Sélection contact/talent */}
            {step === 2 && mode === 'create' && selectedTemplate && (
              <div style={{ padding: '40px' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '24px'
                }}>
                  Étape 2 : Informations du document
                </h2>

                <div style={{
                  padding: '32px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  maxWidth: '600px'
                }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#475569'
                    }}>
                      Client / Contact
                    </label>
                    <select
                      value={selectedContact}
                      onChange={(e) => setSelectedContact(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">-- Sélectionner un contact (optionnel) --</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} ({contact.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTemplate.category === 'talent' && (
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: '#475569'
                      }}>
                        Talent / Modèle
                      </label>
                      <select
                        value={selectedTalent}
                        onChange={(e) => setSelectedTalent(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">-- Sélectionner un talent (optionnel) --</option>
                        {talents.map(talent => (
                          <option key={talent.id} value={talent.id}>
                            {talent.name} ({talent.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    marginTop: '32px'
                  }}>
                    <button
                      onClick={() => setStep(1)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#fff',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ← Retour
                    </button>

                    <button
                      onClick={generateEditablePDF}
                      disabled={loading}
                      style={{
                        padding: '12px 32px',
                        backgroundColor: loading ? '#94a3b8' : '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Génération...' : '🚀 Générer le PDF éditable'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3 : Éditeur PDF */}
            {step === 3 && pdfUrl && (
              <div>
                <PDFEditor
                  documentId={document?.id}
                  pdfUrl={pdfUrl}
                  fields={editableFields}
                  initialData={formData}
                  onSave={handleSave}
                  editable={true}
                  showToolbar={true}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}