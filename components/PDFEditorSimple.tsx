'use client';

import { useState, useEffect } from 'react';

interface PDFField {
  name: string;
  label: string;
  type: string;
  value?: any;
  required?: boolean;
  placeholder?: string;
}

interface PDFEditorSimpleProps {
  documentId?: string;
  pdfUrl: string;
  fields: PDFField[];
  initialData?: Record<string, any>;
  onSave?: (data: Record<string, any>) => void;
  onFieldChange?: (fieldName: string, value: any) => void;
  editable?: boolean;
  showToolbar?: boolean;
}

export default function PDFEditorSimple({
  documentId,
  pdfUrl,
  fields = [],
  initialData = {},
  onSave,
  onFieldChange,
  editable = true,
  showToolbar = true
}: PDFEditorSimpleProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'pdf' | 'form'>('form');

  // Charger les données initiales
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Gérer les changements de champs
  const handleFieldChange = (fieldName: string, value: any) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);

    // Calculs automatiques pour les devis
    if (fieldName.includes('ligne_')) {
      calculateTotals(newData);
    }

    // Callback externe
    if (onFieldChange) {
      onFieldChange(fieldName, value);
    }
  };

  // Calculer les totaux automatiquement
  const calculateTotals = (data: Record<string, any>) => {
    let sousTotal = 0;

    // Calculer les totaux de chaque ligne
    for (let i = 1; i <= 5; i++) {
      const quantite = parseFloat(data[`ligne_${i}_quantite`] || 0);
      const prix = parseFloat(data[`ligne_${i}_prix_unitaire`] || 0);
      const total = quantite * prix;

      data[`ligne_${i}_total`] = total.toFixed(2);
      sousTotal += total;
    }

    // Calculer sous-total, TVA et total TTC
    data['sous_total'] = sousTotal.toFixed(2);
    const tvaRate = parseFloat(data['tva_pourcentage'] || 20);
    const tvaMontant = (sousTotal * tvaRate) / 100;
    data['tva_montant'] = tvaMontant.toFixed(2);
    data['total_ttc'] = (sousTotal + tvaMontant).toFixed(2);

    setFormData(data);
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!onSave) return;

    try {
      setSaving(true);

      // Si on a un documentId, mettre à jour le PDF côté serveur
      if (documentId) {
        const response = await fetch('/api/documents/generate-editable', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId,
            data: formData
          })
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la sauvegarde');
        }

        const result = await response.json();
        console.log('Document sauvegardé:', result);
      }

      // Appeler le callback externe
      onSave(formData);

      alert('✅ Document sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Exporter le PDF
  const handleExport = () => {
    window.open(pdfUrl, '_blank');
  };

  // Grouper les champs par catégorie
  const groupFields = () => {
    const groups: Record<string, PDFField[]> = {
      document: [],
      client: [],
      talent: [],
      prestations: [],
      totaux: [],
      autres: []
    };

    fields.forEach(field => {
      if (field.name.includes('date_') || field.name.includes('numero_')) {
        groups.document.push(field);
      } else if (field.name.includes('_client') || field.name.includes('_destinataire')) {
        groups.client.push(field);
      } else if (field.name.includes('_talent')) {
        groups.talent.push(field);
      } else if (field.name.includes('ligne_')) {
        groups.prestations.push(field);
      } else if (field.name.includes('total') || field.name.includes('tva')) {
        groups.totaux.push(field);
      } else {
        groups.autres.push(field);
      }
    });

    return groups;
  };

  const renderField = (field: PDFField) => {
    const value = formData[field.name] || '';
    const isCalculated = field.name.includes('_total') ||
                        field.name === 'sous_total' ||
                        field.name === 'tva_montant' ||
                        field.name === 'total_ttc';

    return (
      <div key={field.name} style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '6px',
          color: '#475569'
        }}>
          {field.label || field.name.replace(/_/g, ' ')}
          {field.required && <span style={{ color: '#ef4444' }}> *</span>}
          {isCalculated && (
            <span style={{
              marginLeft: '8px',
              padding: '2px 6px',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontSize: '10px',
              borderRadius: '4px'
            }}>
              Auto
            </span>
          )}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={!editable || isCalculated}
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: isCalculated ? '#f8fafc' : '#fff',
              resize: 'vertical'
            }}
          />
        ) : (
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={!editable || isCalculated}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: isCalculated ? '#f8fafc' : '#fff'
            }}
          />
        )}
      </div>
    );
  };

  const fieldGroups = groupFields();

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Toolbar */}
      {showToolbar && (
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('form')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'form' ? '#6366f1' : '#f1f5f9',
                color: activeTab === 'form' ? '#fff' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📝 Formulaire
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === 'pdf' ? '#6366f1' : '#f1f5f9',
                color: activeTab === 'pdf' ? '#fff' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📄 Aperçu PDF
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {editable && (
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '10px 24px',
                  backgroundColor: saving ? '#94a3b8' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
              </button>
            )}

            <button
              onClick={handleExport}
              style={{
                padding: '10px 24px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📥 Télécharger PDF
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div style={{ padding: '24px' }}>
        {activeTab === 'form' ? (
          /* Vue Formulaire */
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px'
            }}>
              {/* Informations du document */}
              {fieldGroups.document.length > 0 && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '20px',
                    color: '#1e293b'
                  }}>
                    📄 Informations du document
                  </h3>
                  {fieldGroups.document.map(renderField)}
                </div>
              )}

              {/* Informations client */}
              {fieldGroups.client.length > 0 && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '20px',
                    color: '#1e293b'
                  }}>
                    👤 Informations client
                  </h3>
                  {fieldGroups.client.map(renderField)}
                </div>
              )}

              {/* Informations talent */}
              {fieldGroups.talent.length > 0 && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '20px',
                    color: '#1e293b'
                  }}>
                    🎭 Informations talent
                  </h3>
                  {fieldGroups.talent.map(renderField)}
                </div>
              )}
            </div>

            {/* Lignes de prestations */}
            {fieldGroups.prestations.length > 0 && (
              <div style={{
                marginTop: '24px',
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  color: '#1e293b'
                }}>
                  📊 Lignes de prestation
                </h3>

                {/* Organiser par ligne */}
                {[1, 2, 3, 4, 5].map(lineNum => {
                  const lineFields = fieldGroups.prestations.filter(f =>
                    f.name.includes(`ligne_${lineNum}_`)
                  );

                  if (lineFields.length === 0) return null;

                  return (
                    <div key={lineNum} style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: lineNum < 5 ? '1px solid #f1f5f9' : 'none'
                    }}>
                      {lineFields
                        .sort((a, b) => {
                          // Ordre : description, quantite, prix, total
                          const order = ['description', 'quantite', 'prix', 'total'];
                          const aIndex = order.findIndex(o => a.name.includes(o));
                          const bIndex = order.findIndex(o => b.name.includes(o));
                          return aIndex - bIndex;
                        })
                        .map(renderField)}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Totaux */}
            {fieldGroups.totaux.length > 0 && (
              <div style={{
                marginTop: '24px',
                padding: '24px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                border: '1px solid #fbbf24'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  color: '#92400e'
                }}>
                  💰 Totaux
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {fieldGroups.totaux.map(renderField)}
                </div>
              </div>
            )}

            {/* Autres champs */}
            {fieldGroups.autres.length > 0 && (
              <div style={{
                marginTop: '24px',
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  color: '#1e293b'
                }}>
                  📝 Informations complémentaires
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  {fieldGroups.autres.map(renderField)}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Vue PDF */
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <iframe
              src={pdfUrl}
              style={{
                width: '100%',
                height: '800px',
                border: 'none'
              }}
              title="Aperçu du PDF"
            />
          </div>
        )}
      </div>
    </div>
  );
}