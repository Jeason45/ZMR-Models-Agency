'use client';

import { useState } from 'react';

interface FieldPosition {
  name: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  type?: string;
}

interface FieldPositionsManagerProps {
  fields: FieldPosition[];
  onImport: (fields: FieldPosition[]) => void;
  documentType: string;
}

export default function FieldPositionsManager({
  fields,
  onImport,
  documentType
}: FieldPositionsManagerProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Exporter la configuration
  const handleExport = () => {
    const positions: Record<string, any> = {};
    const mapping: Record<string, any> = {};

    fields.forEach(field => {
      positions[field.name] = {
        page: field.page,
        x: Math.round(field.x),
        y: Math.round(field.y),
        width: Math.round(field.width),
        height: Math.round(field.height)
      };

      mapping[field.name] = {
        label: field.label,
        type: field.type || 'text'
      };
    });

    const exportData = {
      documentType,
      version: '1.0',
      timestamp: new Date().toISOString(),
      fields: fields.map(f => ({
        ...f,
        x: Math.round(f.x),
        y: Math.round(f.y),
        width: Math.round(f.width),
        height: Math.round(f.height)
      })),
      positions,
      mapping
    };

    const jsonStr = JSON.stringify(exportData, null, 2);

    // Copier dans le presse-papier
    navigator.clipboard.writeText(jsonStr);

    // Télécharger aussi comme fichier
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `positions_${documentType.toLowerCase()}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setShowExportDialog(true);
  };

  // Importer une configuration
  const handleImport = () => {
    try {
      const data = JSON.parse(importText);

      if (data.fields && Array.isArray(data.fields)) {
        onImport(data.fields);
        setShowImportDialog(false);
        setImportText('');
        alert('✅ Configuration importée avec succès !');
      } else {
        alert('❌ Format de configuration invalide');
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'import : JSON invalide');
    }
  };

  // Sauvegarder dans le localStorage
  const handleSaveLocal = () => {
    const key = `field_positions_${documentType}`;
    localStorage.setItem(key, JSON.stringify(fields));
    alert('✅ Configuration sauvegardée localement');
  };

  // Charger depuis le localStorage
  const handleLoadLocal = () => {
    const key = `field_positions_${documentType}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        const data = JSON.parse(saved);
        onImport(data);
        alert('✅ Configuration chargée depuis la sauvegarde locale');
      } catch (error) {
        alert('❌ Erreur lors du chargement');
      }
    } else {
      alert('ℹ️ Aucune sauvegarde locale trouvée');
    }
  };

  // Templates prédéfinis
  const applyTemplate = (template: string) => {
    let templateFields: FieldPosition[] = [];

    switch (template) {
      case 'minimal':
        templateFields = [
          { name: 'numero_devis', label: 'Numéro', x: 400, y: 50, width: 150, height: 25, page: 1, type: 'text' },
          { name: 'date_devis', label: 'Date', x: 400, y: 80, width: 150, height: 20, page: 1, type: 'date' },
          { name: 'nom_client', label: 'Client', x: 50, y: 180, width: 250, height: 25, page: 1, type: 'text' },
          { name: 'total_ttc', label: 'Total TTC', x: 470, y: 650, width: 80, height: 30, page: 1, type: 'number' }
        ];
        break;

      case 'standard':
        // Template standard avec tous les champs essentiels
        templateFields = generateStandardTemplate();
        break;

      case 'complet':
        // Template complet avec tous les champs possibles
        templateFields = generateCompleteTemplate();
        break;
    }

    if (templateFields.length > 0) {
      onImport(templateFields);
      alert(`✅ Template "${template}" appliqué`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {/* Boutons flottants */}
      <button
        onClick={() => setShowImportDialog(true)}
        title="Importer une configuration"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        📥
      </button>

      <button
        onClick={handleExport}
        title="Exporter la configuration"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        📤
      </button>

      <button
        onClick={handleSaveLocal}
        title="Sauvegarder localement"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#f59e0b',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        💾
      </button>

      <button
        onClick={handleLoadLocal}
        title="Charger sauvegarde locale"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#8b5cf6',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        📂
      </button>

      {/* Dialog Import */}
      {showImportDialog && (
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
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <h2 style={{ marginBottom: '20px' }}>📥 Importer une configuration</h2>

            {/* Templates rapides */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px', color: '#666' }}>Templates rapides :</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => applyTemplate('minimal')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    border: '1px solid #1976d2',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Minimal
                </button>
                <button
                  onClick={() => applyTemplate('standard')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e8f5e9',
                    color: '#388e3c',
                    border: '1px solid #388e3c',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Standard
                </button>
                <button
                  onClick={() => applyTemplate('complet')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#fce4ec',
                    color: '#c2185b',
                    border: '1px solid #c2185b',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Complet
                </button>
              </div>
            </div>

            <p style={{ marginBottom: '10px', color: '#666' }}>Ou collez votre configuration JSON :</p>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Collez votre configuration JSON ici..."
              style={{
                width: '100%',
                height: '200px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '12px',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportText('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f0f2f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Export */}
      {showExportDialog && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: '#fff',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 2000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <div>
              <div style={{ fontWeight: 600 }}>Configuration exportée !</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Copiée dans le presse-papier et téléchargée
              </div>
            </div>
            <button
              onClick={() => setShowExportDialog(false)}
              style={{
                marginLeft: '20px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Générer un template standard
function generateStandardTemplate(): FieldPosition[] {
  return [
    // En-tête
    { name: 'numero_devis', label: 'Numéro de devis', x: 400, y: 50, width: 150, height: 25, page: 1, type: 'text' },
    { name: 'date_devis', label: 'Date du devis', x: 400, y: 80, width: 150, height: 20, page: 1, type: 'date' },

    // Client
    { name: 'nom_client', label: 'Nom client', x: 50, y: 180, width: 250, height: 25, page: 1, type: 'text' },
    { name: 'adresse_client', label: 'Adresse', x: 50, y: 210, width: 250, height: 20, page: 1, type: 'text' },
    { name: 'telephone_client', label: 'Téléphone', x: 50, y: 235, width: 120, height: 20, page: 1, type: 'text' },
    { name: 'email_client', label: 'Email', x: 180, y: 235, width: 180, height: 20, page: 1, type: 'email' },

    // Lignes
    { name: 'ligne_1_description', label: 'Description L1', x: 50, y: 350, width: 250, height: 25, page: 1, type: 'text' },
    { name: 'ligne_1_quantite', label: 'Qté', x: 310, y: 350, width: 40, height: 25, page: 1, type: 'number' },
    { name: 'ligne_1_prix_unitaire', label: 'PU HT', x: 360, y: 350, width: 70, height: 25, page: 1, type: 'number' },
    { name: 'ligne_1_total', label: 'Total', x: 440, y: 350, width: 80, height: 25, page: 1, type: 'number' },

    // Totaux
    { name: 'sous_total_ht', label: 'Sous-total HT', x: 440, y: 550, width: 80, height: 22, page: 1, type: 'number' },
    { name: 'tva_montant', label: 'TVA', x: 440, y: 575, width: 80, height: 22, page: 1, type: 'number' },
    { name: 'total_ttc', label: 'TOTAL TTC', x: 440, y: 605, width: 80, height: 30, page: 1, type: 'number' }
  ];
}

// Générer un template complet
function generateCompleteTemplate(): FieldPosition[] {
  // Inclut tous les champs possibles avec positions optimisées
  const fields = generateStandardTemplate();

  // Ajouter plus de champs...
  fields.push(
    { name: 'nom_agence', label: 'ZMR Models Agency', x: 50, y: 50, width: 200, height: 25, page: 1, type: 'text' },
    { name: 'adresse_agence', label: 'Adresse agence', x: 50, y: 80, width: 200, height: 20, page: 1, type: 'text' },
    // ... etc
  );

  return fields;
}