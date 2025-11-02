'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

interface Template {
  id: string;
  name: string;
  slug: string;
  type: string;
  category: string;
  description: string;
  variables: string[];
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

export default function GenerateDocumentPage() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;

  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedTalent, setSelectedTalent] = useState('');
  const [selectedContact, setSelectedContact] = useState('');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    const initialData: Record<string, any> = {};
    template.variables.forEach(variable => {
      initialData[variable] = '';
    });
    setFormData(initialData);
    setStep(2);
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);

      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          data: formData,
          talentId: selectedTalent || null,
          contactId: selectedContact || null,
          category: selectedTemplate.category,
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
      setLoading(false);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  // Group templates by type
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = [];
    }
    acc[template.type].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  const categories = [
    {
      value: 'all',
      label: 'Tous',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      color: '#6366f1'
    },
    {
      value: 'talent',
      label: 'Talents',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <polyline points="17 11 19 13 23 9"/>
        </svg>
      ),
      color: '#8b5cf6'
    },
    {
      value: 'client',
      label: 'Clients',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      color: '#3b82f6'
    },
    {
      value: 'commercial',
      label: 'Commercial',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
      ),
      color: '#10b981'
    },
    {
      value: 'admin',
      label: 'Administration',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      color: '#f59e0b'
    }
  ];

  const types = [
    { value: 'all', label: 'Tous les types' },
    { value: 'CONTRAT', label: 'Contrats' },
    { value: 'FACTURE', label: 'Factures' },
    { value: 'DEVIS', label: 'Devis' },
    { value: 'ADMINISTRATIF', label: 'Administratif' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONTRAT':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        );
      case 'FACTURE':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        );
      case 'DEVIS':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2" ry="2"/>
            <path d="M9 12h6"/>
            <path d="M9 16h6"/>
          </svg>
        );
      case 'ADMINISTRATIF':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONTRAT': return '#8b5cf6';
      case 'FACTURE': return '#10b981';
      case 'DEVIS': return '#f59e0b';
      case 'ADMINISTRATIF': return '#6b7280';
      default: return '#6366f1';
    }
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
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                marginBottom: '8px'
              }}>
                Générer un document
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                margin: 0
              }}>
                {step === 1 ? 'Sélectionnez un modèle de document' : `Étape ${step} sur 2`}
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

          {/* Step 1: Select Template */}
          {step === 1 && (
            <div>
              {/* Search Bar */}
              <div style={{
                marginBottom: '24px',
                padding: '24px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}>
                <div style={{
                  position: 'relative',
                  marginBottom: '20px'
                }}>
                  <svg
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher un modèle de document..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      color: '#0f172a',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.backgroundColor = '#fff';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                  />
                </div>

                {/* Category Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '16px'
                }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: selectedCategory === cat.value ? cat.color : '#fff',
                        color: selectedCategory === cat.value ? '#fff' : '#64748b',
                        border: `1px solid ${selectedCategory === cat.value ? cat.color : '#e2e8f0'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        if (selectedCategory !== cat.value) {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedCategory !== cat.value) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }
                      }}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '14px',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: 500
                  }}
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div style={{
                marginBottom: '20px',
                padding: '12px 20px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1e40af',
                fontWeight: 500
              }}>
                {filteredTemplates.length} modèle{filteredTemplates.length > 1 ? 's' : ''} trouvé{filteredTemplates.length > 1 ? 's' : ''}
              </div>

              {/* Templates by Type */}
              {Object.keys(groupedTemplates).length === 0 ? (
                <div style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}>
                  <svg
                    style={{ margin: '0 auto 16px' }}
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>
                    Aucun modèle trouvé
                  </p>
                  <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                    Essayez de modifier vos filtres
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {Object.entries(groupedTemplates).map(([type, typeTemplates]) => (
                    <div
                      key={type}
                      style={{
                        padding: '24px',
                        backgroundColor: '#fff',
                        border: `2px solid ${getTypeColor(type)}20`,
                        borderRadius: '16px',
                        boxShadow: `0 1px 3px ${getTypeColor(type)}10`
                      }}
                    >
                      {/* Type Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '20px',
                        padding: '16px 20px',
                        background: `linear-gradient(135deg, ${getTypeColor(type)}15 0%, ${getTypeColor(type)}05 100%)`,
                        borderRadius: '12px',
                        border: `1px solid ${getTypeColor(type)}30`
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#fff',
                          borderRadius: '10px',
                          color: getTypeColor(type),
                          boxShadow: `0 2px 8px ${getTypeColor(type)}20`
                        }}>
                          {getTypeIcon(type)}
                        </div>
                        <h2 style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#0f172a',
                          margin: 0,
                          flex: 1
                        }}>
                          {type}
                        </h2>
                        <span style={{
                          padding: '6px 14px',
                          backgroundColor: '#fff',
                          color: getTypeColor(type),
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 700,
                          boxShadow: `0 2px 8px ${getTypeColor(type)}15`
                        }}>
                          {typeTemplates.length}
                        </span>
                      </div>

                      {/* Templates Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '16px'
                      }}>
                        {typeTemplates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            style={{
                              padding: '20px',
                              backgroundColor: '#fff',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              position: 'relative'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = getTypeColor(type);
                              e.currentTarget.style.boxShadow = `0 4px 12px ${getTypeColor(type)}20`;
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'start',
                              marginBottom: '12px'
                            }}>
                              <h3 style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#0f172a',
                                margin: 0,
                                flex: 1
                              }}>
                                {template.name}
                              </h3>
                              <span style={{
                                padding: '4px 10px',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#64748b',
                                textTransform: 'uppercase',
                                flexShrink: 0,
                                marginLeft: '8px'
                              }}>
                                {template.category}
                              </span>
                            </div>

                            <p style={{
                              fontSize: '13px',
                              color: '#64748b',
                              marginBottom: '16px',
                              lineHeight: '1.5'
                            }}>
                              {template.description}
                            </p>

                            <div style={{
                              display: 'flex',
                              gap: '8px',
                              flexWrap: 'wrap',
                              alignItems: 'center'
                            }}>
                              {template.requiresSignature && (
                                <span style={{
                                  padding: '4px 10px',
                                  backgroundColor: '#f0fdf4',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  color: '#15803d',
                                  fontWeight: 600,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  Signature requise
                                </span>
                              )}
                              <span style={{
                                padding: '4px 10px',
                                backgroundColor: '#eff6ff',
                                borderRadius: '6px',
                                fontSize: '11px',
                                color: '#3b82f6',
                                fontWeight: 600
                              }}>
                                {template.variables.length} champ{template.variables.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Fill Data */}
          {step === 2 && selectedTemplate && (
            <div>
              {/* Selected Template Info */}
              <div style={{
                marginBottom: '32px',
                padding: '24px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: 0,
                      marginBottom: '8px'
                    }}>
                      {selectedTemplate.name}
                    </h2>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {selectedTemplate.description}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedTemplate(null);
                      setFormData({});
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#fff',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    Changer
                  </button>
                </div>
              </div>

              {/* Link to Talent/Contact */}
              {(selectedTemplate.category === 'talent' || selectedTemplate.category === 'client') && (
                <div style={{
                  marginBottom: '32px',
                  padding: '24px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px'
                }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1e40af',
                    marginBottom: '16px',
                    margin: 0
                  }}>
                    Lier à un {selectedTemplate.category === 'talent' ? 'talent' : 'client'} (optionnel)
                  </h3>

                  {selectedTemplate.category === 'talent' ? (
                    <select
                      value={selectedTalent}
                      onChange={(e) => setSelectedTalent(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#fff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        color: '#0f172a',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="">Sélectionner un talent</option>
                      {talents.map(talent => (
                        <option key={talent.id} value={talent.id}>
                          {talent.name} ({talent.type})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={selectedContact}
                      onChange={(e) => setSelectedContact(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: '#fff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        color: '#0f172a',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="">Sélectionner un client</option>
                      {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.name} ({contact.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Form Fields */}
              <div style={{
                marginBottom: '32px',
                padding: '24px',
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '24px'
                }}>
                  Informations du document
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: '#475569'
                      }}>
                        {variable.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        value={formData[variable] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          [variable]: e.target.value
                        })}
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
                        placeholder={`Entrer ${variable.replace(/_/g, ' ').toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
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
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  Retour
                </button>
                <button
                  onClick={handleGenerateDocument}
                  disabled={loading}
                  style={{
                    padding: '12px 32px',
                    backgroundColor: loading ? '#9ca3af' : '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#4f46e5';
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#6366f1';
                  }}
                >
                  {loading ? 'Génération en cours...' : 'Générer le document'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
