'use client';

import { Suspense } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import PDFMEDesigner from '@/components/PDFMEDesigner';
import Link from 'next/link';
import { Template } from '@pdfme/common';

function PositionEditorContent() {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;

  const handleSaveTemplate = (template: Template) => {
    console.log('Template sauvegardé:', template);
    // Ici vous pouvez sauvegarder le template dans votre base de données
    // ou dans le localStorage
    localStorage.setItem('pdf_template', JSON.stringify(template));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <AdminSidebar />

      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '5px'
            }}>
              🎨 Éditeur de Positions PDF - PDFME
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Positionnez visuellement les champs sur vos documents PDF avec drag & drop
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
            ← Retour aux documents
          </Link>
        </div>

        {/* Info Banner */}
        <div style={{
          backgroundColor: '#dbeafe',
          borderLeft: '4px solid #3b82f6',
          padding: '16px 30px',
          margin: '20px 30px',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>ℹ️</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e40af', marginBottom: '5px' }}>
                Nouveau Designer Professionnel avec PDFME
              </h3>
              <ul style={{ fontSize: '14px', color: '#1e40af', margin: 0, paddingLeft: '20px' }}>
                <li>✨ Interface drag & drop fluide et professionnelle</li>
                <li>🔍 Zoom et navigation optimisés (rendering canvas natif)</li>
                <li>📐 Guides d'alignement automatiques</li>
                <li>💾 Export/Import de templates JSON</li>
                <li>🎯 Positionnement précis au pixel près</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Guide rapide */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px 30px',
          margin: '0 30px 20px 30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '15px' }}>
            📖 Guide rapide
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            fontSize: '14px',
            color: '#4b5563'
          }}>
            <div>
              <strong>1. Sélectionnez un document</strong>
              <p style={{ margin: '5px 0 0 0' }}>Choisissez Devis, Facture ou Contrat</p>
            </div>
            <div>
              <strong>2. Ajoutez des champs</strong>
              <p style={{ margin: '5px 0 0 0' }}>Cliquez sur "+" pour ajouter des champs</p>
            </div>
            <div>
              <strong>3. Positionnez avec drag & drop</strong>
              <p style={{ margin: '5px 0 0 0' }}>Glissez et redimensionnez les champs</p>
            </div>
            <div>
              <strong>4. Exportez le template</strong>
              <p style={{ margin: '5px 0 0 0' }}>Cliquez sur "📤 Exporter Template"</p>
            </div>
          </div>
        </div>

        {/* Designer Container */}
        <div style={{
          flex: 1,
          margin: '0 30px 30px 30px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          minHeight: '600px'
        }}>
          <PDFMEDesigner onSaveTemplate={handleSaveTemplate} />
        </div>
      </div>
    </div>
  );
}

export default function PositionEditorPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Chargement...</div>
        </div>
      </div>
    }>
      <PositionEditorContent />
    </Suspense>
  );
}
