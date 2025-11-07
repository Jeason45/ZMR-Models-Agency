'use client';

import { useEffect, useRef, useState } from 'react';
import { Designer } from '@pdfme/ui';
import { Template } from '@pdfme/common';
import { text, image, barcodes } from '@pdfme/schemas';

interface PDFMEDesignerProps {
  documentType?: string;
  onSaveTemplate?: (template: Template) => void;
}

export default function PDFMEDesigner({
  documentType = 'devis',
  onSaveTemplate
}: PDFMEDesignerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<Designer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showDocumentSelector, setShowDocumentSelector] = useState(true);
  const [selectedDocType, setSelectedDocType] = useState(documentType);

  // Charger le PDF et le convertir en base64
  const loadPdfAsBase64 = async (pdfPath: string): Promise<string> => {
    try {
      const response = await fetch(pdfPath);
      if (!response.ok) throw new Error('PDF non trouvé');

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      throw new Error(`Erreur lors du chargement du PDF: ${err}`);
    }
  };

  // Initialiser le Designer avec le PDF sélectionné
  const initializeDesigner = async (docType: string) => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setError('');

    try {
      // Chemins possibles pour le PDF
      const possiblePaths = [
        `/storage/documents/${docType}.pdf`,
        `/storage/test/${docType}_test_editable.pdf`,
        `/documents/${docType}.pdf`
      ];

      let basePdf = '';
      for (const path of possiblePaths) {
        try {
          basePdf = await loadPdfAsBase64(path);
          if (basePdf) break;
        } catch (err) {
          console.log(`PDF non trouvé: ${path}`);
        }
      }

      if (!basePdf) {
        throw new Error(`Aucun PDF trouvé pour ${docType}`);
      }

      // Schémas de base pour démarrer
      const initialSchemas = getInitialSchemas(docType);

      // Template initial
      const template: Template = {
        basePdf,
        schemas: [initialSchemas]
      };

      // Plugins disponibles
      const plugins = {
        text,
        image,
        qrcode: barcodes.qrcode
      };

      // Détruire l'ancien designer s'il existe
      if (designerRef.current) {
        designerRef.current.destroy();
      }

      // Créer le nouveau designer
      const designer = new Designer({
        domContainer: containerRef.current,
        template,
        plugins
      });

      // Sauvegarder la référence
      designerRef.current = designer;

      // Callback quand le template change
      designer.onChangeTemplate((newTemplate) => {
        console.log('Template modifié:', newTemplate);
      });

      // Callback pour la sauvegarde
      designer.onSaveTemplate((template) => {
        console.log('Template sauvegardé:', template);
        if (onSaveTemplate) {
          onSaveTemplate(template);
        }
        // Télécharger aussi comme JSON
        downloadTemplateAsJSON(template);
      });

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'initialisation');
      setIsLoading(false);
    }
  };

  // Schémas initiaux selon le type de document
  const getInitialSchemas = (docType: string) => {
    const commonFields = [
      {
        name: 'numero_document',
        type: 'text',
        position: { x: 120, y: 20 },
        width: 50,
        height: 8,
      },
      {
        name: 'date_document',
        type: 'text',
        position: { x: 120, y: 30 },
        width: 50,
        height: 8,
      },
      {
        name: 'nom_client',
        type: 'text',
        position: { x: 20, y: 60 },
        width: 80,
        height: 8,
      },
      {
        name: 'adresse_client',
        type: 'text',
        position: { x: 20, y: 70 },
        width: 80,
        height: 8,
      }
    ];

    return commonFields;
  };

  // Télécharger le template en JSON
  const downloadTemplateAsJSON = (template: Template) => {
    const jsonStr = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${selectedDocType}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Exporter le template manuellement
  const handleExport = () => {
    if (designerRef.current) {
      const template = designerRef.current.getTemplate();
      downloadTemplateAsJSON(template);

      // Copier dans le presse-papier
      const jsonStr = JSON.stringify(template, null, 2);
      navigator.clipboard.writeText(jsonStr);

      alert('✅ Template exporté et copié dans le presse-papier !');
    }
  };

  // Sélectionner le type de document
  const selectDocumentType = (docType: string) => {
    setSelectedDocType(docType);
    setShowDocumentSelector(false);
    initializeDesigner(docType);
  };

  // Upload manuel d'un PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const basePdf = reader.result as string;

        if (designerRef.current) {
          const currentTemplate = designerRef.current.getTemplate();
          const newTemplate = { ...currentTemplate, basePdf };
          designerRef.current.updateTemplate(newTemplate);
          alert('✅ PDF chargé avec succès !');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Modal de sélection de document */}
      {showDocumentSelector && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '10px',
              textAlign: 'center',
              color: '#333'
            }}>
              📄 Quel type de document voulez-vous configurer ?
            </h2>
            <p style={{
              textAlign: 'center',
              color: '#666',
              marginBottom: '30px'
            }}>
              Choisissez le type de document pour charger le template correspondant
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Devis */}
              <button
                onClick={() => selectDocumentType('devis')}
                style={{
                  padding: '30px 20px',
                  backgroundColor: '#fff',
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(245,158,11,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#f59e0b' }}>
                  Devis
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Proposition commerciale
                </div>
              </button>

              {/* Facture */}
              <button
                onClick={() => selectDocumentType('facture')}
                style={{
                  padding: '30px 20px',
                  backgroundColor: '#fff',
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#d1fae5';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(16,185,129,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>💰</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#10b981' }}>
                  Facture
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Document de facturation
                </div>
              </button>

              {/* Contrat */}
              <button
                onClick={() => selectDocumentType('contrat')}
                style={{
                  padding: '30px 20px',
                  backgroundColor: '#fff',
                  border: '2px solid #8b5cf6',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#ede9fe';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(139,92,246,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📜</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#8b5cf6' }}>
                  Contrat
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Accord légal
                </div>
              </button>
            </div>

            {/* Upload manuel */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '20px',
              textAlign: 'center'
            }}>
              <label style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}>
                📂 Ou charger un PDF personnalisé
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Barre d'outils */}
      {!showDocumentSelector && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            📤 Exporter Template
          </button>

          <button
            onClick={() => setShowDocumentSelector(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            🔄 Changer de document
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 100
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Chargement du designer...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '20px 30px',
          borderRadius: '12px',
          border: '2px solid #dc2626',
          textAlign: 'center',
          zIndex: 100
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>❌</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{error}</div>
        </div>
      )}

      {/* Container du Designer */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '600px'
        }}
      />
    </div>
  );
}
