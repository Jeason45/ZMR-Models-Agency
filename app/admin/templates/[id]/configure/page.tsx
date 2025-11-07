'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, Trash2, Edit2, X } from 'lucide-react';

interface FieldPosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EditableField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'number' | 'textarea';
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  position: FieldPosition;
}

interface Template {
  id: string;
  name: string;
  type: string;
  pdfUrl: string;
  editableFields: EditableField[] | null;
}

export default function TemplateConfigurePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [fields, setFields] = useState<EditableField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [placingField, setPlacingField] = useState(false);
  const [pdfScale, setPdfScale] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Form state for adding/editing fields
  const [fieldForm, setFieldForm] = useState({
    name: '',
    label: '',
    type: 'text' as EditableField['type'],
    required: false,
    placeholder: ''
  });

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    // Check if PDF preview can be loaded
    const checkPdfPreview = async () => {
      try {
        const res = await fetch(`/api/admin/templates/${templateId}/preview`, { method: 'HEAD' });
        if (!res.ok) {
          const errorData = await fetch(`/api/admin/templates/${templateId}/preview`).then(r => r.json());
          setPdfError(errorData.error || 'Impossible de charger le PDF d\'aperçu');
          setPdfLoading(false);
        }
      } catch (error) {
        setPdfError('Erreur lors du chargement du PDF');
        setPdfLoading(false);
      }
    };

    if (templateId) {
      checkPdfPreview();
    }
  }, [templateId]);

  useEffect(() => {
    const handleResize = () => {
      calculatePdfScale();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTemplate = async () => {
    try {
      const res = await fetch(`/api/document-templates/${templateId}`);
      const data = await res.json();
      setTemplate(data);
      setFields((data.editableFields as EditableField[]) || []);

      // Calculate PDF scale after loading
      setTimeout(calculatePdfScale, 500);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePdfScale = () => {
    if (!iframeRef.current) return;

    const iframeWidth = iframeRef.current.offsetWidth;
    const standardPdfWidth = 595; // Standard A4 width in points
    const scale = iframeWidth / standardPdfWidth;
    setPdfScale(scale);
    setPdfLoading(false);
  };

  const handleAddFieldClick = () => {
    setFieldForm({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: ''
    });
    setEditingFieldIndex(null);
    setShowAddFieldModal(true);
  };

  const handleEditField = (index: number) => {
    const field = fields[index];
    setFieldForm({
      name: field.name,
      label: field.label,
      type: field.type,
      required: field.required,
      placeholder: field.placeholder || ''
    });
    setEditingFieldIndex(index);
    setShowAddFieldModal(true);
  };

  const handleDeleteField = (index: number) => {
    if (confirm(`Supprimer le champ "${fields[index].label}" ?`)) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const handleFieldFormSubmit = () => {
    // Validate form
    if (!fieldForm.name || !fieldForm.label) {
      alert('Le nom et le label sont requis');
      return;
    }

    // Check for duplicate names (except when editing the same field)
    const isDuplicate = fields.some((f, i) =>
      f.name === fieldForm.name && i !== editingFieldIndex
    );

    if (isDuplicate) {
      alert('Un champ avec ce nom existe déjà');
      return;
    }

    setShowAddFieldModal(false);
    setPlacingField(true);
  };

  const handlePdfClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingField || !pdfContainerRef.current) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / pdfScale;
    const y = (e.clientY - rect.top) / pdfScale;

    const newField: EditableField = {
      ...fieldForm,
      position: {
        page: 1,
        x: Math.round(x),
        y: Math.round(y),
        width: 300,
        height: 40
      }
    };

    if (editingFieldIndex !== null) {
      // Update existing field
      const updatedFields = [...fields];
      updatedFields[editingFieldIndex] = newField;
      setFields(updatedFields);
    } else {
      // Add new field
      setFields([...fields, newField]);
    }

    setPlacingField(false);
    setEditingFieldIndex(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/templates/${templateId}/fields`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editableFields: fields })
      });

      if (!res.ok) throw new Error('Failed to save');

      alert('Configuration sauvegardée !');
      router.push('/admin/templates');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Chargement...
      </div>
    );
  }

  if (!template) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Template non trouvé
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: '350px',
        backgroundColor: '#f9fafb',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => router.push('/admin/templates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#6b7280',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Retour
          </button>

          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
            {template.name}
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Configuration des champs éditables
          </p>
        </div>

        {/* Fields List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={handleAddFieldClick}
              disabled={placingField}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: placingField ? '#9ca3af' : '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: placingField ? 'not-allowed' : 'pointer'
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Ajouter un champ
            </button>
          </div>

          {placingField && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#92400e'
            }}>
              Cliquez sur le PDF pour placer le champ "{fieldForm.label}"
              <button
                onClick={() => setPlacingField(false)}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fbbf24',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
            </div>
          )}

          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            Champs configurés ({fields.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {fields.map((field, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                      {field.label}
                      {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {field.name} • {field.type}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleEditField(index)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#6366f1',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit2 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      onClick={() => handleDeleteField(index)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                  Position: Page {field.position.page}, X:{field.position.x}, Y:{field.position.y}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: saving ? '#9ca3af' : '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={{ flex: 1, position: 'relative', overflow: 'auto', backgroundColor: '#e5e7eb' }}>
        {pdfError ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            zIndex: 100,
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              Impossible de charger le PDF
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
              {pdfError}
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
              Pour utiliser le configurateur de champs, le template doit avoir un fichier DOCX associé.
              Veuillez d'abord configurer le filePath dans la base de données ou via Prisma Studio.
            </div>
            <button
              onClick={() => router.push('/admin/templates')}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Retour à la liste
            </button>
          </div>
        ) : pdfLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            zIndex: 100
          }}>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Génération du PDF d'aperçu...
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Cela peut prendre quelques secondes
            </div>
          </div>
        )}

        <div
          ref={pdfContainerRef}
          onClick={handlePdfClick}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: placingField ? 'crosshair' : 'default',
            opacity: pdfLoading ? 0.3 : 1
          }}
        >
          <iframe
            ref={iframeRef}
            src={`/api/admin/templates/${templateId}/preview`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: placingField ? 'none' : 'auto'
            }}
            onLoad={calculatePdfScale}
          />

          {/* Field Overlays */}
          {fields.map((field, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${field.position.x * pdfScale}px`,
                top: `${field.position.y * pdfScale}px`,
                width: `${field.position.width * pdfScale}px`,
                height: `${field.position.height * pdfScale}px`,
                border: '2px solid #6366f1',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6366f1',
                pointerEvents: placingField ? 'none' : 'auto',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!placingField) {
                  handleEditField(index);
                }
              }}
            >
              {field.label}
              {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Field Modal */}
      {showAddFieldModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                {editingFieldIndex !== null ? 'Modifier le champ' : 'Ajouter un champ'}
              </h2>
              <button
                onClick={() => setShowAddFieldModal(false)}
                style={{
                  padding: '4px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nom du champ (identifiant unique) *
                </label>
                <input
                  type="text"
                  value={fieldForm.name}
                  onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                  placeholder="ex: client_name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Label (texte affiché) *
                </label>
                <input
                  type="text"
                  value={fieldForm.label}
                  onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                  placeholder="ex: Nom du client"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Type de champ
                </label>
                <select
                  value={fieldForm.type}
                  onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value as EditableField['type'] })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="text">Texte</option>
                  <option value="email">Email</option>
                  <option value="date">Date</option>
                  <option value="number">Nombre</option>
                  <option value="textarea">Texte long</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Placeholder (texte indicatif)
                </label>
                <input
                  type="text"
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm({ ...fieldForm, placeholder: e.target.value })}
                  placeholder="ex: Entrez votre nom"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="required"
                  checked={fieldForm.required}
                  onChange={(e) => setFieldForm({ ...fieldForm, required: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="required" style={{ fontSize: '14px', color: '#374151' }}>
                  Champ obligatoire
                </label>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddFieldModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleFieldFormSubmit}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#6366f1',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Placer sur le PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
