'use client';

import Link from 'next/link';

export default function ConditionsGeneralesPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 50,
        padding: '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '0.2em',
            color: '#000000',
            textDecoration: 'none'
          }}>
            ZMR
          </Link>

          <Link href="/" style={{
            fontSize: '14px',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ← Retour
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '140px 40px 80px'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 300,
          letterSpacing: '0.1em',
          color: '#000000',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          CONDITIONS GÉNÉRALES D'UTILISATION
        </h1>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {/* Objet */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Objet
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              Les présentes Conditions Générales d'Utilisation définissent les modalités d'utilisation du site zmr-models.com édité par ZMR Models Agency. L'utilisation du Site implique l'acceptation pleine et entière de ces conditions.
            </p>
          </section>

          {/* Accès */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Accès au site
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p>
                Le Site est accessible gratuitement à tout utilisateur. Tous les frais d'accès (matériel, connexion Internet) sont à votre charge.
              </p>
              <p>
                L'Agence ne saurait être tenue responsable des interruptions temporaires, dysfonctionnements liés à votre connexion ou cas de force majeure.
              </p>
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Services proposés
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '8px' }}>• Consultation des portfolios de mannequins</p>
              <p style={{ marginBottom: '8px' }}>• Prise de contact et demande de rendez-vous</p>
              <p style={{ marginBottom: '8px' }}>• Candidature pour rejoindre l'agence</p>
              <p style={{ marginBottom: '16px' }}>• Signature électronique de documents</p>
              <p>
                L'Agence se réserve le droit de modifier, suspendre ou interrompre tout ou partie du Site à tout moment.
              </p>
            </div>
          </section>

          {/* Utilisation */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Utilisation du site
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <p style={{ color: '#000000', marginBottom: '8px' }}>Utilisation conforme</p>
                <p>
                  Vous vous engagez à utiliser le Site de manière loyale et conforme. Il est interdit : d'utiliser le Site à des fins illégales, de porter atteinte aux droits de propriété intellectuelle, d'introduire des virus, de tenter d'accéder de manière non autorisée aux systèmes, de collecter massivement des données (scraping), de diffamer ou harceler.
                </p>
              </div>
              <div>
                <p style={{ color: '#000000', marginBottom: '8px' }}>Formulaires</p>
                <p>
                  Vous vous engagez à fournir des informations exactes et complètes. Toute fausse information pourra entraîner le rejet de votre demande.
                </p>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Propriété intellectuelle
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p>
                L'ensemble du contenu du Site est la propriété exclusive de ZMR Models Agency ou de ses partenaires, et est protégé par les lois relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, modification ou publication est interdite sans autorisation écrite préalable.
              </p>
              <p>
                Les photographies et vidéos des mannequins sont protégées. Toute utilisation non autorisée constitue une contrefaçon sanctionnée par le Code de la Propriété Intellectuelle.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Protection des données
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              Le traitement de vos données personnelles est régi par notre{' '}
              <Link
                href="/politique-confidentialite"
                style={{
                  color: '#6b7280',
                  textDecoration: 'underline',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                Politique de Confidentialité
              </Link>, conforme au RGPD.
            </p>
          </section>

          {/* Signature électronique */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Signature électronique
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p>
                Le Site propose un système de signature électronique conforme au règlement eIDAS. La signature électronique a la même valeur juridique qu'une signature manuscrite.
              </p>
              <p>
                Le système conserve les preuves légales : horodatage certifié, hash cryptographique (SHA-256), adresse IP et informations techniques du signataire.
              </p>
            </div>
          </section>

          {/* Liens hypertextes */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Liens hypertextes
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p>
                Le Site peut contenir des liens vers d'autres sites. L'Agence n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
              <p>
                La création de liens vers le Site est soumise à l'autorisation préalable écrite de l'Agence.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Limitation de responsabilité
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p>
                L'Agence s'efforce d'assurer l'exactitude des informations diffusées, mais ne peut garantir leur exhaustivité.
              </p>
              <p>
                L'Agence ne saurait être tenue responsable des dommages résultant de l'utilisation du Site, erreurs, omissions, indisponibilité, actes de piratage ou utilisation frauduleuse.
              </p>
            </div>
          </section>

          {/* Modification */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Modification des CGU
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              L'Agence se réserve le droit de modifier les présentes CGU à tout moment. Les CGU applicables sont celles en vigueur au moment de votre utilisation du Site.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Droit applicable et juridiction
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <p>
                Les présentes CGU sont régies par le droit français.
              </p>
              <p>
                En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera porté devant les tribunaux français.
              </p>
              <p>
                Vous pouvez recourir gratuitement à un médiateur de la consommation en cas de litige (article L.612-1 du Code de la consommation).
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Contact
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Email :</span>{' '}
                <a
                  href="mailto:contact@zmr-models.com"
                  style={{
                    color: '#6b7280',
                    textDecoration: 'underline',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  contact@zmr-models.com
                </a>
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Téléphone :</span> [À compléter]
              </p>
              <p>
                <span style={{ color: '#000000' }}>Courrier :</span> ZMR Models Agency, [Adresse à compléter]
              </p>
            </div>
          </section>

          {/* Date */}
          <div style={{
            paddingTop: '40px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
