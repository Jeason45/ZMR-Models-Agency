'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';

interface AgencySettings {
  id?: string;
  nom_agence: string;
  adresse_agence: string;
  telephone_agence: string;
  email_agence: string;
  site_web_agence: string;
  siret_agence: string;
  forme_juridique: string;
  capital: string;
  ville_rcs: string;
  numero_rcs: string;
  representant_nom: string;
  representant_qualite: string;
  logo_path?: string;
  signature_path?: string;
  tva_par_defaut: number;
  delai_paiement_defaut: string;
  validite_devis_defaut: number;
}

export default function AgencySettingsPage() {
  const { isCollapsed, isMobile } = useSidebar();
  const sidebarWidth = isCollapsed ? 80 : 260;

  const [settings, setSettings] = useState<AgencySettings>({
    nom_agence: '',
    adresse_agence: '',
    telephone_agence: '',
    email_agence: '',
    site_web_agence: '',
    siret_agence: '',
    forme_juridique: 'SAS',
    capital: '',
    ville_rcs: '',
    numero_rcs: '',
    representant_nom: '',
    representant_qualite: '',
    tva_par_defaut: 20.0,
    delai_paiement_defaut: '30 jours',
    validite_devis_defaut: 30,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/agency-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/agency-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block' as const,
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.7)'
  };

  const sectionStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '24px',
    backdropFilter: 'blur(10px)'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 600,
    color: 'white',
    marginBottom: '20px'
  };

  if (loading) {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          transition: 'margin-left 0.3s ease'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(212, 175, 55, 0.3)',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

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
        transition: 'margin-left 0.3s ease',
        padding: isMobile ? '20px' : '40px',
        paddingTop: isMobile ? '80px' : '40px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
              Paramètres
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '8px'
            }}>
              Paramètres de l'agence
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
              Ces informations seront automatiquement utilisées dans vos documents (devis, contrats, factures...)
            </p>
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: '16px',
              marginBottom: '24px',
              backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '8px',
              color: message.type === 'success' ? '#34d399' : '#f87171',
              fontSize: '14px',
              fontWeight: 500
            }}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Informations de base */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>
                Informations de base
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    Nom de l'agence *
                  </label>
                  <input
                    type="text"
                    value={settings.nom_agence}
                    onChange={(e) => setSettings({ ...settings, nom_agence: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    value={settings.adresse_agence}
                    onChange={(e) => setSettings({ ...settings, adresse_agence: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Téléphone *
                  </label>
                  <input
                    type="text"
                    value={settings.telephone_agence}
                    onChange={(e) => setSettings({ ...settings, telephone_agence: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={settings.email_agence}
                    onChange={(e) => setSettings({ ...settings, email_agence: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    Site web
                  </label>
                  <input
                    type="url"
                    value={settings.site_web_agence}
                    onChange={(e) => setSettings({ ...settings, site_web_agence: e.target.value })}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Informations juridiques */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>
                Informations juridiques
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>
                    SIRET *
                  </label>
                  <input
                    type="text"
                    value={settings.siret_agence}
                    onChange={(e) => setSettings({ ...settings, siret_agence: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Forme juridique *
                  </label>
                  <select
                    value={settings.forme_juridique}
                    onChange={(e) => setSettings({ ...settings, forme_juridique: e.target.value })}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="SAS">SAS</option>
                    <option value="SARL">SARL</option>
                    <option value="EURL">EURL</option>
                    <option value="SA">SA</option>
                    <option value="SNC">SNC</option>
                    <option value="EI">EI</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>
                    Capital social *
                  </label>
                  <input
                    type="text"
                    value={settings.capital}
                    onChange={(e) => setSettings({ ...settings, capital: e.target.value })}
                    placeholder="Ex: 50 000 EUR"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Ville RCS *
                  </label>
                  <input
                    type="text"
                    value={settings.ville_rcs}
                    onChange={(e) => setSettings({ ...settings, ville_rcs: e.target.value })}
                    placeholder="Ex: Paris"
                    style={inputStyle}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>
                    Numéro RCS *
                  </label>
                  <input
                    type="text"
                    value={settings.numero_rcs}
                    onChange={(e) => setSettings({ ...settings, numero_rcs: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Représentant légal */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>
                Représentant légal
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={settings.representant_nom}
                    onChange={(e) => setSettings({ ...settings, representant_nom: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Qualité *
                  </label>
                  <input
                    type="text"
                    value={settings.representant_qualite}
                    onChange={(e) => setSettings({ ...settings, representant_qualite: e.target.value })}
                    placeholder="Ex: Président, Gérant..."
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Paramètres par défaut */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>
                Paramètres par défaut pour les documents
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>
                    TVA par défaut (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.tva_par_defaut}
                    onChange={(e) => setSettings({ ...settings, tva_par_defaut: parseFloat(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Délai de paiement
                  </label>
                  <input
                    type="text"
                    value={settings.delai_paiement_defaut}
                    onChange={(e) => setSettings({ ...settings, delai_paiement_defaut: e.target.value })}
                    placeholder="Ex: 30 jours"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Validité devis (jours)
                  </label>
                  <input
                    type="number"
                    value={settings.validite_devis_defaut}
                    onChange={(e) => setSettings({ ...settings, validite_devis_defaut: parseInt(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '12px 32px',
                  background: saving ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                  color: saving ? 'rgba(255, 255, 255, 0.5)' : 'black',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: saving ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!saving) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!saving) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                  }
                }}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
