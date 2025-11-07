'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import Link from 'next/link';

export default function TestGenerationPage() {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Données d'exemple pour le devis
  const sampleData = {
    // Agence
    nom_agence: 'ZMR Models Agency',
    adresse_agence: '123 Avenue des Champs-Élysées',
    code_postal_agence: '75008',
    ville_agence: 'Paris',
    telephone_agence: '+33 1 23 45 67 89',
    email_agence: 'contact@zmr-models.com',
    siret_agence: '123 456 789 00012',

    // Document
    numero_devis: 'DEV-2025-001',
    date_devis: new Date().toLocaleDateString('fr-FR'),
    date_validite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    objet_devis: 'Prestation mannequinat pour shooting photo mode printemps/été 2025',

    // Client
    nom_client: 'Fashion Corp SARL',
    adresse_client: '456 Rue du Commerce',
    code_postal_client: '75001',
    ville_client: 'Paris',
    telephone_client: '+33 1 98 76 54 32',
    email_client: 'contact@fashioncorp.fr',

    // Lignes de prestations
    lignes: [
      {
        description: 'Mannequin senior - Shooting photo (1 journée)',
        quantite: 1,
        unite: 'jour',
        prix_unitaire: '800.00',
        total_ht: '800.00'
      },
      {
        description: 'Mannequin junior - Shooting photo (1 journée)',
        quantite: 2,
        unite: 'jour',
        prix_unitaire: '500.00',
        total_ht: '1000.00'
      },
      {
        description: 'Frais de déplacement et hébergement',
        quantite: 1,
        unite: 'forfait',
        prix_unitaire: '300.00',
        total_ht: '300.00'
      }
    ],

    // Totaux
    sous_total_ht: '2100.00',
    tva_pourcentage: '20',
    tva_montant: '420.00',
    total_ttc: '2520.00',

    // Conditions
    conditions_reglement: '30 jours net',
    mode_reglement: 'Virement bancaire',
    acompte_pourcentage: '30',
    acompte_montant: '756.00',
    delai_livraison: 'Prestation le 15 mars 2025',
    validite_jours: '30'
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/documents/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateName: 'devis-moderne',
          data: sampleData,
          options: {
            format: 'A4',
            landscape: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }

      // Télécharger le PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert('✅ PDF généré avec succès !');

    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du PDF');
      console.error('Erreur:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s ease',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                🧪 Test Génération PDF - HTML Templates
              </h1>
              <p style={{ color: '#6b7280', fontSize: '15px' }}>
                Système professionnel de génération de documents avec Puppeteer
              </p>
            </div>

            <Link
              href="/admin/documents"
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              ← Retour
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div style={{
          backgroundColor: '#d1fae5',
          borderLeft: '4px solid #10b981',
          padding: '20px 25px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: '15px'
          }}>
            <div style={{ fontSize: '28px' }}>✨</div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#065f46', marginBottom: '8px' }}>
                Nouveau Système Professionnel
              </h3>
              <p style={{ fontSize: '14px', color: '#047857', marginBottom: '12px' }}>
                Plus besoin de positionner les champs manuellement ! Le système utilise des templates HTML/CSS professionnels.
              </p>
              <ul style={{ fontSize: '14px', color: '#047857', margin: 0, paddingLeft: '20px' }}>
                <li>✅ Templates HTML/CSS comme les vrais CRM (HubSpot, Zoho)</li>
                <li>✅ Design professionnel et cohérent</li>
                <li>✅ Génération PDF avec Puppeteer (Chrome headless)</li>
                <li>✅ Facile à personnaliser</li>
                <li>✅ Rendu parfait garanti</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Données d'exemple */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            📋 Données d'exemple
          </h2>

          <div style={{
            backgroundColor: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <pre style={{ margin: 0, color: '#374151' }}>
              {JSON.stringify(sampleData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            🚀 Générer le PDF
          </h2>

          <p style={{
            color: '#6b7280',
            marginBottom: '25px',
            fontSize: '15px'
          }}>
            Cliquez sur le bouton ci-dessous pour générer un devis professionnel au format PDF
          </p>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              padding: '15px 40px',
              backgroundColor: isGenerating ? '#9ca3af' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
            }}
          >
            {isGenerating ? '⏳ Génération en cours...' : '📄 Générer le PDF de devis'}
          </button>

          {error && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Informations techniques */}
        <div style={{
          marginTop: '25px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            ℹ️ Informations techniques
          </h3>

          <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.8' }}>
            <p><strong>Template utilisé :</strong> devis-moderne.html</p>
            <p><strong>Moteur de génération :</strong> Puppeteer (Chromium headless)</p>
            <p><strong>Système de template :</strong> Mustache.js</p>
            <p><strong>Format de sortie :</strong> PDF A4</p>
            <p><strong>Temps de génération :</strong> ~2-3 secondes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
