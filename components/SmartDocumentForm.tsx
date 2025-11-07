'use client';

import { useState, useEffect } from 'react';
import { FieldMappingConfig } from '@/lib/documentDataMapper';

interface SmartDocumentFormProps {
  templateId: string;
  contactId?: string;
  talentId?: string;
  onDataChange: (data: Record<string, any>) => void;
  onMetadataChange?: (metadata: any) => void;
}

export default function SmartDocumentForm({
  templateId,
  contactId,
  talentId,
  onDataChange,
  onMetadataChange
}: SmartDocumentFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldMapping, setFieldMapping] = useState<Record<string, FieldMappingConfig>>({});
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);

  // CSS pour cacher les spinners des inputs de prix
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .no-spinner::-webkit-outer-spin-button,
      .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .no-spinner[type=number] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Charger les données pré-remplies
  useEffect(() => {
    async function loadPreFilledData() {
      try {
        setLoading(true);

        const response = await fetch('/api/documents/prepare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId, contactId, talentId })
        });

        if (response.ok) {
          const result = await response.json();
          setFormData(result.data);
          setFieldMapping(result.mapping);
          setMetadata(result.metadata);

          if (onMetadataChange) {
            onMetadataChange(result.metadata);
          }
        }
      } catch (error) {
        console.error('Error loading pre-filled data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPreFilledData();
  }, [templateId, contactId, talentId]);

  // Notifier le parent à chaque changement
  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  // Calculs automatiques en temps réel
  useEffect(() => {
    const newData = { ...formData };
    let hasChanges = false;

    // Calculer les totaux de chaque ligne
    Object.keys(formData).forEach(fieldName => {
      const lineMatch = fieldName.match(/ligne_(\d+)_total/);
      if (lineMatch) {
        const lineNum = lineMatch[1];
        const prix = parseFloat(formData[`ligne_${lineNum}_prix_unitaire`] || 0);
        const qte = parseFloat(formData[`ligne_${lineNum}_quantite`] || 1);
        const total = prix * qte;
        const totalStr = total.toFixed(2);

        if (formData[fieldName] !== totalStr) {
          newData[fieldName] = totalStr;
          hasChanges = true;
        }
      }
    });

    // Calculer le sous-total
    if ('sous_total' in formData) {
      let sousTotal = 0;
      Object.keys(formData).forEach(key => {
        if (key.match(/ligne_\d+_total/)) {
          sousTotal += parseFloat(formData[key] || 0);
        }
      });
      const sousTotalStr = sousTotal.toFixed(2);

      if (formData['sous_total'] !== sousTotalStr) {
        newData['sous_total'] = sousTotalStr;
        hasChanges = true;
      }
    }

    // Calculer le montant TVA
    if ('tva_montant' in formData) {
      const sousTotal = parseFloat(formData['sous_total'] || 0);
      const tvaRate = parseFloat(formData['tva_pourcentage'] || 20);
      const tvaMontant = (sousTotal * tvaRate) / 100;
      const tvaMontantStr = tvaMontant.toFixed(2);

      if (formData['tva_montant'] !== tvaMontantStr) {
        newData['tva_montant'] = tvaMontantStr;
        hasChanges = true;
      }
    }

    // Calculer le total TTC
    if ('total_ttc' in formData) {
      const sousTotal = parseFloat(formData['sous_total'] || 0);
      const tvaMontant = parseFloat(formData['tva_montant'] || 0);
      const totalTTC = sousTotal + tvaMontant;
      const totalTTCStr = totalTTC.toFixed(2);

      if (formData['total_ttc'] !== totalTTCStr) {
        newData['total_ttc'] = totalTTCStr;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setFormData(newData);
    }
  }, [formData]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const renderField = (fieldName: string, config: FieldMappingConfig) => {
    const value = formData[fieldName] || '';
    const isAutoFilled = config.autoFill;
    const isRequired = config.required;
    // Tous les champs sont modifiables
    const isReadOnly = false;

    // Badge auto-rempli
    const autoFilledBadge = isAutoFilled && (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        marginLeft: '8px'
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Auto
      </span>
    );

    // Label
    const label = (
      <label style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        fontWeight: 600,
        marginBottom: '8px',
        color: '#475569'
      }}>
        {config.label || fieldName.replace(/_/g, ' ')}
        {isRequired && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        {autoFilledBadge}
      </label>
    );

    // Champ textarea
    if (config.type === 'textarea') {
      return (
        <div key={fieldName}>
          {label}
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            readOnly={isReadOnly}
            placeholder={config.placeholder}
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: isReadOnly ? '#f8fafc' : '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: isReadOnly ? '#64748b' : '#0f172a',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>
      );
    }

    // Champ select
    if (config.type === 'select' && config.options) {
      return (
        <div key={fieldName}>
          {label}
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            disabled={isReadOnly}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: isReadOnly ? '#f8fafc' : '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: isReadOnly ? '#64748b' : '#0f172a',
              fontSize: '14px',
              outline: 'none',
              cursor: isReadOnly ? 'not-allowed' : 'pointer'
            }}
          >
            {config.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    // Champ date
    if (config.type === 'date') {
      return (
        <div key={fieldName}>
          {label}
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            readOnly={isReadOnly}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: isReadOnly ? '#f8fafc' : '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: isReadOnly ? '#64748b' : '#0f172a',
              fontSize: '14px',
              outline: 'none',
              cursor: isReadOnly ? 'not-allowed' : 'pointer'
            }}
          />
        </div>
      );
    }

    // Champ number
    if (config.type === 'number') {
      return (
        <div key={fieldName}>
          {label}
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              readOnly={isReadOnly}
              placeholder={config.placeholder}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: config.suffix ? '50px' : '16px',
                backgroundColor: isReadOnly ? '#f8fafc' : '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: isReadOnly ? '#64748b' : '#0f172a',
                fontSize: '14px',
                outline: 'none',
                fontFamily: config.format === 'currency' ? 'monospace' : 'inherit'
              }}
            />
            {config.suffix && (
              <span style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {config.suffix}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Champ text par défaut
    return (
      <div key={fieldName}>
        {label}
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          readOnly={isReadOnly}
          placeholder={config.placeholder}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: isReadOnly ? '#f8fafc' : '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: isReadOnly ? '#64748b' : '#0f172a',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>
    );
  };

  // Grouper les champs par section
  const groupFields = () => {
    const groups: Record<string, string[]> = {
      agence: [],
      devis: [],
      client: [],
      destinataire: [],
      talent: [],
      contrat: [],
      lignes: [],
      totaux: [],
      conditions: [],
      signature: [],
      autres: []
    };

    Object.keys(fieldMapping).forEach(fieldName => {
      if (fieldName.includes('_agence')) groups.agence.push(fieldName);
      else if (fieldName.includes('numero_devis') || fieldName.includes('date_devis')) groups.devis.push(fieldName);
      else if (fieldName.includes('numero_contrat') || fieldName.includes('date_debut') || fieldName.includes('duree_')) groups.contrat.push(fieldName);
      else if (fieldName.includes('_client')) groups.client.push(fieldName);
      else if (fieldName.includes('_destinataire')) groups.destinataire.push(fieldName);
      else if (fieldName.includes('_talent')) groups.talent.push(fieldName);
      else if (fieldName.includes('ligne_')) groups.lignes.push(fieldName);
      else if (fieldName.includes('total') || fieldName.includes('tva') || fieldName.includes('sous_total')) groups.totaux.push(fieldName);
      else if (fieldName.includes('territoire') || fieldName.includes('clause_') || fieldName.includes('pourcentage_') || fieldName.includes('delai_') || fieldName.includes('preavis_') || fieldName.includes('validite_') || fieldName.includes('acompte_')) groups.conditions.push(fieldName);
      else if (fieldName.includes('lieu_signature') || fieldName.includes('date_signature') || fieldName.includes('juridiction_')) groups.signature.push(fieldName);
      else groups.autres.push(fieldName);
    });

    // Retirer les groupes vides
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) delete groups[key];
    });

    return groups;
  };

  const renderLineField = (fieldName: string, config: FieldMappingConfig) => {
    const value = formData[fieldName] || '';
    const isCalculated = config.source === 'calculated';

    // Description = textarea
    if (fieldName.includes('_description')) {
      return (
        <textarea
          key={fieldName}
          value={value}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          placeholder="Description de la prestation"
          rows={2}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#0f172a',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            minHeight: '60px'
          }}
        />
      );
    }

    // Quantité = input number entier
    if (fieldName.includes('_quantite')) {
      return (
        <input
          key={fieldName}
          type="number"
          step="1"
          min="1"
          value={value}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          placeholder="1"
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#0f172a',
            fontSize: '14px',
            outline: 'none',
            textAlign: 'right'
          }}
        />
      );
    }

    // Prix unitaire = input number avec décimales (sans spinner)
    if (fieldName.includes('_prix_unitaire') || fieldName.includes('_prix')) {
      return (
        <input
          key={fieldName}
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          placeholder="0.00"
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#0f172a',
            fontSize: '14px',
            outline: 'none',
            textAlign: 'right',
            fontFamily: 'monospace'
          }}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          className="no-spinner"
        />
      );
    }

    // Total = readonly/calculé
    if (fieldName.includes('_total')) {
      return (
        <input
          key={fieldName}
          type="text"
          value={value ? `${parseFloat(value).toFixed(2)} €` : '0.00 €'}
          readOnly
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#64748b',
            fontSize: '14px',
            outline: 'none',
            textAlign: 'right',
            fontWeight: 600,
            cursor: 'not-allowed'
          }}
        />
      );
    }

    return null;
  };

  const renderLignesSection = (fields: string[]) => {
    if (fields.length === 0) return null;

    // Grouper par numéro de ligne
    const ligneGroups: Record<string, string[]> = {};
    fields.forEach(fieldName => {
      const match = fieldName.match(/ligne_(\d+)_/);
      if (match) {
        const lineNum = match[1];
        if (!ligneGroups[lineNum]) ligneGroups[lineNum] = [];
        ligneGroups[lineNum].push(fieldName);
      }
    });

    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#0f172a',
          marginBottom: '20px'
        }}>
          <span>📊</span>
          Lignes de prestation
        </h3>

        {/* En-têtes de colonnes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 2fr 120px 150px 150px',
          gap: '12px',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>#</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Description</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Quantité</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Prix unitaire</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Total</div>
        </div>

        {Object.keys(ligneGroups).sort().map(lineNum => {
          const lineFields = ligneGroups[lineNum];
          // Ordre correct : description, quantite, prix_unitaire, total
          const sortedFields = lineFields.sort((a, b) => {
            const getOrder = (field: string) => {
              if (field.includes('_description')) return 0;
              if (field.includes('_quantite')) return 1;
              if (field.includes('_prix_unitaire')) return 2;
              if (field.includes('_total')) return 3;
              return 4;
            };
            return getOrder(a) - getOrder(b);
          });

          return (
            <div key={lineNum} style={{ marginBottom: lineNum !== Object.keys(ligneGroups).sort().pop() ? '12px' : '0' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 120px 150px 150px',
                gap: '12px',
                alignItems: 'start'
              }}>
                {/* Numéro de ligne */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#6366f1',
                  backgroundColor: '#eef2ff',
                  borderRadius: '8px'
                }}>
                  {lineNum}
                </div>
                {sortedFields.map(fieldName => renderLineField(fieldName, fieldMapping[fieldName]))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSection = (title: string, icon: string, fields: string[]) => {
    if (fields.length === 0) return null;

    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '16px',
          fontWeight: 600,
          color: '#0f172a',
          marginBottom: '20px'
        }}>
          <span>{icon}</span>
          {title}
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {fields.map(fieldName => renderField(fieldName, fieldMapping[fieldName]))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Chargement des données...
      </div>
    );
  }

  const groups = groupFields();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Métadonnées */}
      {metadata && (
        <div style={{
          padding: '16px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#1e40af'
        }}>
          <strong>{metadata.autoFieldsGenerated} champs auto-remplis</strong>
          {' • '}
          <strong>{metadata.manualFieldsRequired} champs à remplir</strong>
        </div>
      )}

      {/* Sections */}
      {groups.agence && renderSection('Informations de l\'agence', '🏢', groups.agence)}
      {groups.devis && renderSection('Informations du devis', '📄', groups.devis)}
      {groups.contrat && renderSection('Informations du contrat', '📜', groups.contrat)}
      {groups.client && renderSection('Informations client', '👤', groups.client)}
      {groups.destinataire && renderSection('Destinataire', '📧', groups.destinataire)}
      {groups.talent && renderSection('Informations du talent', '🎭', groups.talent)}
      {groups.lignes && renderLignesSection(groups.lignes)}
      {groups.totaux && renderSection('Totaux', '💰', groups.totaux)}
      {groups.conditions && renderSection('Conditions', '📝', groups.conditions)}
      {groups.signature && renderSection('Signature', '✍️', groups.signature)}
      {groups.autres && renderSection('Autres informations', '📌', groups.autres)}
    </div>
  );
}
