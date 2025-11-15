'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import Link from 'next/link';

interface Template {
  id: string;
  name: string;
  slug: string;
  type: string;
  format: string;
  description?: string;
  isDefault: boolean;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  adresse_client?: string;
  code_postal?: string;
  ville?: string;
}

interface Ligne {
  description: string;
  quantite: number;
  unite: string;
  prix_unitaire: number;
  total_ht: number;
}

export default function CreateDocumentPage() {
  const { isCollapsed } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;

  // États
  const [step, setStep] = useState(1); // 1: Type/Template, 2: Client, 3: Formulaire
  const [documentType, setDocumentType] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [lignes, setLignes] = useState<Ligne[]>([
    { description: '', quantite: 1, unite: 'jour', prix_unitaire: 0, total_ht: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [saveToContact, setSaveToContact] = useState(false);

  // Fonction pour vérifier si un client a toutes les infos nécessaires
  const checkContactCompleteness = (contact: Contact): { isComplete: boolean; missing: string[] } => {
    const requiredFields = [
      { key: 'name', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Téléphone' },
      { key: 'adresse_client', label: 'Adresse' },
      { key: 'code_postal', label: 'Code postal' },
      { key: 'ville', label: 'Ville' }
    ];

    const missing: string[] = [];

    requiredFields.forEach(field => {
      const value = contact[field.key as keyof Contact];
      if (!value || value.toString().trim() === '') {
        missing.push(field.label);
      }
    });

    return {
      isComplete: missing.length === 0,
      missing
    };
  };

  // Charger les templates selon le type
  useEffect(() => {
    if (documentType) {
      loadTemplates();
    }
  }, [documentType]);

  // Charger les contacts
  useEffect(() => {
    loadContacts();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch(`/api/documents/templates?type=${documentType}&format=html`);
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
        // Sélectionner automatiquement le template par défaut
        const defaultTemplate = data.templates.find((t: Template) => t.isDefault);
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
        }
      }
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();
      // L'API retourne directement un tableau
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        console.error('Format de réponse inattendu:', data);
      }
    } catch (error) {
      console.error('Erreur chargement contacts:', error);
    }
  };

  // Auto-remplissage des données
  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    setIsLoading(true);

    // Vérifier les champs manquants
    const { missing } = checkContactCompleteness(contact);
    setMissingFields(missing);

    try {
      const response = await fetch('/api/documents/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate?.id,
          contactId: contact.id
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormData(result.data);
        setStep(3);
      }
    } catch (error) {
      console.error('Erreur auto-remplissage:', error);
      setError('Erreur lors de l\'auto-remplissage');
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une ligne de prestation
  const addLigne = () => {
    setLignes([...lignes, { description: '', quantite: 1, unite: 'jour', prix_unitaire: 0, total_ht: 0 }]);
  };

  // Supprimer une ligne
  const removeLigne = (index: number) => {
    const newLignes = lignes.filter((_, i) => i !== index);
    setLignes(newLignes.length > 0 ? newLignes : [{ description: '', quantite: 1, unite: 'jour', prix_unitaire: 0, total_ht: 0 }]);
  };

  // Mettre à jour une ligne
  const updateLigne = (index: number, field: keyof Ligne, value: any) => {
    const newLignes = [...lignes];
    newLignes[index] = { ...newLignes[index], [field]: value };

    // Recalculer le total de la ligne
    if (field === 'quantite' || field === 'prix_unitaire') {
      newLignes[index].total_ht = newLignes[index].quantite * newLignes[index].prix_unitaire;
    }

    setLignes(newLignes);
    calculateTotals(newLignes);
  };

  // Calculer les totaux automatiquement
  const calculateTotals = (currentLignes: Ligne[]) => {
    const sousTotal = currentLignes.reduce((sum, ligne) => sum + ligne.total_ht, 0);
    const tvaRate = parseFloat(formData.tva_pourcentage || '20') / 100;
    const tvaMontant = sousTotal * tvaRate;
    const totalTTC = sousTotal + tvaMontant;

    setFormData({
      ...formData,
      sous_total_ht: sousTotal.toFixed(2),
      tva_montant: tvaMontant.toFixed(2),
      total_ttc: totalTTC.toFixed(2)
    });
  };

  // Générer le PDF
  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Si la checkbox est cochée, sauvegarder les modifications dans la fiche client
      if (saveToContact && selectedContact) {
        try {
          const updateResponse = await fetch(`/api/contacts/${selectedContact.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.nom_client,
              email: formData.email_client,
              phone: formData.telephone_client,
              adresse_client: formData.adresse_client,
              code_postal: formData.code_postal_client,
              ville: formData.ville_client
            })
          });

          if (updateResponse.ok) {
            console.log('✅ Fiche client mise à jour avec succès');
          }
        } catch (updateError) {
          console.error('Erreur lors de la mise à jour du contact:', updateError);
          // On continue même si la mise à jour échoue
        }
      }

      // Préparer les données finales
      const finalData = {
        ...formData,
        lignes: lignes.map(l => ({
          description: l.description,
          quantite: l.quantite,
          unite: l.unite,
          prix_unitaire: l.prix_unitaire.toFixed(2),
          total_ht: l.total_ht.toFixed(2)
        }))
      };

      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate?.id,
          contactId: selectedContact?.id,
          data: finalData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la génération');
      }

      // Le document a été généré ET sauvegardé en base par l'API
      console.log('✅ Document généré:', result.document);

      const message = saveToContact && selectedContact
        ? '✅ PDF généré, sauvegardé et fiche client mise à jour !'
        : '✅ PDF généré et sauvegardé avec succès !';

      alert(message);

      // Télécharger le PDF pour l'utilisateur
      const pdfPath = result.document.filePath;
      const a = document.createElement('a');
      a.href = pdfPath;
      a.download = result.document.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Rediriger vers la page des documents après 1 seconde
      setTimeout(() => {
        window.location.href = '/admin/documents';
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du PDF');
    } finally {
      setIsLoading(false);
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
          padding: '25px 30px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1f2937', marginBottom: '5px' }}>
              ✨ Créer un Document
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Système intelligent avec auto-remplissage client
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

        {/* Steps Indicator */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px 30px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {[
              { num: 1, label: 'Type & Template' },
              { num: 2, label: 'Client' },
              { num: 3, label: 'Contenu' }
            ].map(({ num, label }) => (
              <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  backgroundColor: step >= num ? '#2563eb' : '#e5e7eb',
                  color: step >= num ? '#fff' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '16px'
                }}>
                  {num}
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: step === num ? 600 : 400,
                  color: step >= num ? '#1f2937' : '#9ca3af'
                }}>
                  {label}
                </span>
                {num < 3 && (
                  <div style={{
                    width: '50px',
                    height: '2px',
                    backgroundColor: step > num ? '#2563eb' : '#e5e7eb',
                    marginLeft: '10px'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Type & Template */}
        {step === 1 && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '20px' }}>
              📄 Choisissez le type de document
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {['DEVIS', 'FACTURE', 'CONTRAT'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDocumentType(type)}
                  style={{
                    padding: '25px',
                    backgroundColor: documentType === type ? '#eff6ff' : '#fff',
                    border: `2px solid ${documentType === type ? '#2563eb' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                    {type === 'DEVIS' ? '📄' : type === 'FACTURE' ? '💰' : '📜'}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: documentType === type ? '#2563eb' : '#1f2937'
                  }}>
                    {type}
                  </div>
                </button>
              ))}
            </div>

            {documentType && templates.length > 0 && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '15px', marginTop: '30px' }}>
                  🎨 Sélectionnez un template
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      style={{
                        padding: '20px',
                        backgroundColor: selectedTemplate?.id === template.id ? '#eff6ff' : '#f9fafb',
                        border: `2px solid ${selectedTemplate?.id === template.id ? '#2563eb' : '#e5e7eb'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '10px'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                          {template.name}
                        </h4>
                        {template.isDefault && (
                          <span style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            backgroundColor: '#10b981',
                            color: '#fff',
                            borderRadius: '12px',
                            fontWeight: 600
                          }}>
                            DÉFAUT
                          </span>
                        )}
                      </div>
                      {template.description && (
                        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
                          {template.description}
                        </p>
                      )}
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Format: {template.format.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedTemplate}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: selectedTemplate ? '#2563eb' : '#9ca3af',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: selectedTemplate ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  Continuer →
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 2: Client Selection */}
        {step === 2 && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '10px' }}>
              👤 Sélectionnez un client
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '25px' }}>
              Les informations du client seront automatiquement remplies
            </p>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '15px' }}>⏳</div>
                <p style={{ color: '#6b7280' }}>Chargement des données...</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '15px'
              }}>
                {contacts.map((contact) => {
                  const { isComplete, missing } = checkContactCompleteness(contact);

                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      style={{
                        padding: '20px',
                        backgroundColor: '#f9fafb',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#2563eb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      {/* Badge de complétude */}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        padding: '4px 10px',
                        backgroundColor: isComplete ? '#d1fae5' : '#fee2e2',
                        color: isComplete ? '#065f46' : '#991b1b',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {isComplete ? '✓ Complet' : `⚠️ ${missing.length} manquant${missing.length > 1 ? 's' : ''}`}
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '8px', paddingRight: '80px' }}>
                        {contact.name}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                        📧 {contact.email}
                      </p>
                      {contact.phone && (
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                          📞 {contact.phone}
                        </p>
                      )}

                      {/* Afficher les champs manquants */}
                      {!isComplete && (
                        <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '8px', fontWeight: 500 }}>
                          Manquant : {missing.join(', ')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '10px 25px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Retour
              </button>

              <button
                onClick={() => setStep(3)}
                style={{
                  padding: '10px 25px',
                  backgroundColor: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Continuer sans client →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Form */}
        {step === 3 && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '25px' }}>
              📝 Informations du document
            </h2>

            {/* Alert si infos manquantes */}
            {missingFields.length > 0 && selectedContact && (
              <div style={{
                marginBottom: '25px',
                padding: '15px 20px',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'start',
                gap: '12px'
              }}>
                <div style={{ fontSize: '20px' }}>⚠️</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#92400e', marginBottom: '5px' }}>
                    Informations client incomplètes
                  </h4>
                  <p style={{ fontSize: '13px', color: '#92400e' }}>
                    Les champs suivants sont manquants : <strong>{missingFields.join(', ')}</strong>
                  </p>
                  <p style={{ fontSize: '12px', color: '#b45309', marginTop: '5px' }}>
                    💡 Vous pouvez les compléter ci-dessous et choisir de les sauvegarder dans la fiche client.
                  </p>
                </div>
              </div>
            )}

            {/* Informations Client - Éditables */}
            {selectedContact && (
              <div style={{
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f0f9ff',
                borderRadius: '10px',
                border: '2px solid #bfdbfe'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                    👤 Informations Client
                  </h3>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#1e40af',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={saveToContact}
                      onChange={(e) => setSaveToContact(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                        accentColor: '#2563eb'
                      }}
                    />
                    💾 Sauvegarder les modifications dans la fiche client
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                      Nom <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nom_client || ''}
                      onChange={(e) => setFormData({ ...formData, nom_client: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${!formData.nom_client ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email_client || ''}
                      onChange={(e) => setFormData({ ...formData, email_client: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${!formData.email_client ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                      Téléphone <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone_client || ''}
                      onChange={(e) => setFormData({ ...formData, telephone_client: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${!formData.telephone_client ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                      Adresse <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.adresse_client || ''}
                      onChange={(e) => setFormData({ ...formData, adresse_client: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${!formData.adresse_client ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                      Code postal <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code_postal_client || ''}
                      onChange={(e) => setFormData({ ...formData, code_postal_client: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${!formData.code_postal_client ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                      Ville <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ville_client || ''}
                      onChange={(e) => setFormData({ ...formData, ville_client: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `1px solid ${!formData.ville_client ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: '#fff'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Info Document */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '15px' }}>
                📄 Informations générales
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                    Numéro de document
                  </label>
                  <input
                    type="text"
                    value={formData.numero_devis || ''}
                    onChange={(e) => setFormData({ ...formData, numero_devis: e.target.value })}
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
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date_devis || ''}
                    onChange={(e) => setFormData({ ...formData, date_devis: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '15px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                  Objet du {documentType.toLowerCase()}
                </label>
                <textarea
                  value={formData.objet_devis || ''}
                  onChange={(e) => setFormData({ ...formData, objet_devis: e.target.value })}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  placeholder="Ex: Prestation mannequinat pour shooting photo mode printemps/été 2025"
                />
              </div>
            </div>

            {/* Prestations */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                  📊 Prestations
                </h3>
                <button
                  onClick={addLigne}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ➕ Ajouter une ligne
                </button>
              </div>

              {lignes.map((ligne, index) => (
                <div key={index} style={{
                  padding: '15px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 0.8fr 1fr 1fr 40px', gap: '10px', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                        Description
                      </label>
                      <input
                        type="text"
                        value={ligne.description}
                        onChange={(e) => updateLigne(index, 'description', e.target.value)}
                        placeholder="Ex: Mannequin senior - Shooting photo"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                        Qté
                      </label>
                      <input
                        type="number"
                        value={ligne.quantite}
                        onChange={(e) => updateLigne(index, 'quantite', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                        Unité
                      </label>
                      <select
                        value={ligne.unite}
                        onChange={(e) => updateLigne(index, 'unite', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      >
                        <option value="jour">jour</option>
                        <option value="heure">heure</option>
                        <option value="forfait">forfait</option>
                        <option value="unité">unité</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                        Prix unitaire HT (€)
                      </label>
                      <input
                        type="number"
                        value={ligne.prix_unitaire}
                        onChange={(e) => updateLigne(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '5px' }}>
                        Total HT (€)
                      </label>
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        textAlign: 'right'
                      }}>
                        {ligne.total_ht.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeLigne(index)}
                      style={{
                        padding: '8px',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '15px' }}>
                💰 Totaux
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '12px', maxWidth: '400px', marginLeft: 'auto' }}>
                <div style={{ textAlign: 'right', fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                  Sous-total HT:
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>
                  {formData.sous_total_ht || '0.00'} €
                </div>

                <div style={{ textAlign: 'right', fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                  TVA ({formData.tva_pourcentage || '20'}%):
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>
                  {formData.tva_montant || '0.00'} €
                </div>

                <div style={{
                  textAlign: 'right',
                  fontSize: '16px',
                  color: '#1f2937',
                  fontWeight: 700,
                  borderTop: '2px solid #2563eb',
                  paddingTop: '10px'
                }}>
                  TOTAL TTC:
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  textAlign: 'right',
                  color: '#2563eb',
                  borderTop: '2px solid #2563eb',
                  paddingTop: '10px'
                }}>
                  {formData.total_ttc || '0.00'} €
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Retour
              </button>

              <button
                onClick={handleGenerate}
                disabled={isLoading || lignes.every(l => !l.description)}
                style={{
                  padding: '12px 35px',
                  backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isLoading ? '⏳ Génération...' : '📄 Générer le PDF'}
              </button>
            </div>

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
        )}
      </div>
    </div>
  );
}
