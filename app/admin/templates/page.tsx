'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

interface Template {
  id: string;
  name: string;
  type: string;
  category: string;
  requiresSignature: boolean;
  editableFields: any[] | null;
}

export default function TemplatesListPage() {
  const router = useRouter();
  const { sidebarWidth, isMobile } = useSidebar();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/document-templates');
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeColors: Record<string, { bg: string; color: string }> = {
    CONTRAT: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' },
    FACTURE: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399' },
    DEVIS: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
    ADMINISTRATIF: { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }
  };

  const stats = {
    total: templates.length,
    configured: templates.filter(t => t.editableFields && t.editableFields.length > 0).length,
    withSignature: templates.filter(t => t.requiresSignature).length
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
            Templates
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
            Configurez les champs éditables pour chaque template de document
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
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
              Total Templates
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
              Configurés
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#34d399' }}>
              {loading ? '...' : stats.configured}
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
              Avec Signature
            </p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#fb923c' }}>
              {loading ? '...' : stats.withSignature}
            </p>
          </div>
        </div>

        {/* Templates List */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Chargement...
          </div>
        ) : templates.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📄</p>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Aucun template trouvé</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {templates.map(template => {
              const isConfigured = template.editableFields && template.editableFields.length > 0;
              const typeStyle = typeColors[template.type] || { bg: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.6)' };

              return (
                <div
                  key={template.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: '20px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>
                        {template.name}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.color
                      }}>
                        {template.type}
                      </span>
                      {template.requiresSignature && (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: 'rgba(251, 146, 60, 0.15)',
                          color: '#fb923c'
                        }}>
                          Signature
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {isConfigured ? (
                        <>
                          <span style={{ color: '#34d399', fontSize: '16px' }}>✓</span>
                          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {template.editableFields?.length} champ(s) configuré(s)
                          </span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: '#ef4444', fontSize: '16px' }}>✗</span>
                          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            Non configuré
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/admin/templates/${template.id}/configure`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: '#fb923c',
                      color: 'black',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isConfigured ? 'Modifier' : 'Configurer'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
