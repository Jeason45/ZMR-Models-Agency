'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, CheckCircle, XCircle } from 'lucide-react';

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

  const typeColors: Record<string, string> = {
    CONTRAT: '#6366f1',
    FACTURE: '#10b981',
    DEVIS: '#f59e0b',
    ADMINISTRATIF: '#8b5cf6'
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Configuration des Templates
        </h1>
        <p style={{ color: '#6b7280' }}>
          Configurez les champs éditables pour chaque template de document
        </p>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {templates.map(template => {
          const isConfigured = template.editableFields && template.editableFields.length > 0;

          return (
            <div
              key={template.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {template.name}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: `${typeColors[template.type] || '#6b7280'}22`,
                    color: typeColors[template.type] || '#6b7280'
                  }}>
                    {template.type}
                  </span>
                  {template.requiresSignature && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: '#fef3c7',
                      color: '#f59e0b'
                    }}>
                      ✍️ Signature
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isConfigured ? (
                    <>
                      <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {template.editableFields?.length} champ(s) configuré(s)
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
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
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
              >
                <Settings style={{ width: '16px', height: '16px' }} />
                {isConfigured ? 'Modifier' : 'Configurer'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
