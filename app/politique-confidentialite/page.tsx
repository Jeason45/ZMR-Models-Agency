'use client';

import Link from 'next/link';

export default function PolitiqueConfidentialitePage() {
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
          POLITIQUE DE CONFIDENTIALITÉ
        </h1>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {/* Introduction */}
          <section>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              ZMR Models Agency accorde une grande importance à la protection de vos données personnelles et s'engage à les traiter de manière transparente et sécurisée, conformément au RGPD et à la loi Informatique et Libertés.
            </p>
          </section>

          {/* Responsable */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Responsable du traitement
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Raison sociale :</span> ZMR Models Agency
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Adresse :</span> [À compléter]
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Email :</span> contact@zmr-models.com
              </p>
              <p>
                <span style={{ color: '#000000' }}>Téléphone :</span> [À compléter]
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Données collectées
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div>
                <p style={{ color: '#000000', marginBottom: '8px' }}>Formulaire de contact</p>
                <p>Nom, prénom, email, téléphone, message, type de contact, préférences de rappel.</p>
              </div>
              <div>
                <p style={{ color: '#000000', marginBottom: '8px' }}>Candidatures mannequins</p>
                <p>Identité, coordonnées, photos et vidéos professionnelles, mensurations, expériences, documents administratifs.</p>
              </div>
              <div>
                <p style={{ color: '#000000', marginBottom: '8px' }}>Données techniques</p>
                <p>Adresse IP, type de navigateur, pages visitées, temps de navigation.</p>
              </div>
            </div>
          </section>

          {/* Finalités */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Finalités du traitement
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '8px' }}>• Gestion des demandes de contact et rendez-vous</p>
              <p style={{ marginBottom: '8px' }}>• Traitement des candidatures de mannequins</p>
              <p style={{ marginBottom: '8px' }}>• Gestion contractuelle et commerciale</p>
              <p style={{ marginBottom: '8px' }}>• Communications relatives aux services</p>
              <p style={{ marginBottom: '8px' }}>• Amélioration du site</p>
              <p>• Respect des obligations légales</p>
            </div>
          </section>

          {/* Base légale */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Base légale
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '8px' }}>• Consentement (candidatures, communications)</p>
              <p style={{ marginBottom: '8px' }}>• Exécution d'un contrat (relations contractuelles)</p>
              <p style={{ marginBottom: '8px' }}>• Intérêt légitime (amélioration des services)</p>
              <p>• Obligations légales (comptabilité, fiscalité)</p>
            </div>
          </section>

          {/* Destinataires */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Destinataires
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '16px' }}>
                Vos données sont destinées au personnel autorisé de ZMR Models Agency, à nos prestataires techniques (hébergement, CRM, emailing) et aux autorités compétentes sur demande légale.
              </p>
              <p>Nous ne vendons ni ne louons vos données à des tiers.</p>
            </div>
          </section>

          {/* Conservation */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Durée de conservation
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '8px' }}>• Demandes de contact : 3 ans</p>
              <p style={{ marginBottom: '8px' }}>• Candidatures non retenues : 2 ans</p>
              <p style={{ marginBottom: '8px' }}>• Données contractuelles : durée du contrat + 5 ans</p>
              <p>• Documents signés : durée légale de conservation</p>
            </div>
          </section>

          {/* Droits */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Vos droits
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '16px' }}>
                Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de limitation, de portabilité, d'opposition et de retrait du consentement.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Pour exercer vos droits : <span style={{ color: '#000000' }}>contact@zmr-models.com</span>
              </p>
              <p>
                Vous pouvez également introduire une réclamation auprès de la{' '}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#6b7280',
                    textDecoration: 'underline',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  CNIL
                </a>.
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Sécurité
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement, accès restreint, sauvegardes régulières, hébergement sécurisé.
            </p>
          </section>

          {/* Signatures électroniques */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Signatures électroniques
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '16px' }}>
                Lors de la signature électronique de documents, nous collectons et conservons : image de signature, horodatage certifié, adresse IP, hash cryptographique du document (SHA-256), informations du navigateur.
              </p>
              <p>
                Ces données sont nécessaires pour garantir la valeur juridique de la signature électronique conformément au règlement eIDAS.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Cookies
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              Notre site utilise uniquement des cookies strictement nécessaires au fonctionnement. Vous pouvez configurer votre navigateur pour les refuser.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Modifications
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              Nous nous réservons le droit de modifier cette politique à tout moment. En cas de modification substantielle, nous vous en informerons.
            </p>
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
