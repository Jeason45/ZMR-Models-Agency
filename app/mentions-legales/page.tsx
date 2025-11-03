'use client';

import Link from 'next/link';

export default function MentionsLegalesPage() {
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
          MENTIONS LÉGALES
        </h1>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {/* Section 1 */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Éditeur du site
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
                <span style={{ color: '#000000' }}>Forme juridique :</span> [À compléter]
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Siège social :</span> [À compléter]
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Capital social :</span> [À compléter]
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>SIRET :</span> [À compléter]
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>TVA :</span> [À compléter]
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Téléphone :</span> [À compléter]
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Email :</span> contact@zmr-models.com
              </p>
              <p>
                <span style={{ color: '#000000' }}>Directeur de publication :</span> [À compléter]
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Hébergement
            </h2>
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Hébergeur :</span> Vercel Inc.
              </p>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#000000' }}>Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </p>
              <p>
                <span style={{ color: '#000000' }}>Site web :</span>{' '}
                <a
                  href="https://vercel.com"
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
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Section 3 */}
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
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '16px' }}>
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est la propriété exclusive de ZMR Models Agency ou de ses partenaires, et est protégé par les lois relatives à la propriété intellectuelle.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Toute reproduction, distribution, modification ou publication, même partielle, est strictement interdite sans accord écrit préalable.
              </p>
              <p>
                Les photographies et vidéos des mannequins sont la propriété de ZMR Models Agency et/ou des photographes. Toute utilisation non autorisée constitue une contrefaçon sanctionnée par le Code de la Propriété Intellectuelle.
              </p>
            </div>
          </section>

          {/* Section 4 */}
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
            <div style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '16px' }}>
                Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Pour exercer ces droits : <span style={{ color: '#000000' }}>contact@zmr-models.com</span>
              </p>
              <p>
                Consultez notre{' '}
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
                </Link>.
              </p>
            </div>
          </section>

          {/* Section 5 */}
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
              Ce site utilise uniquement des cookies strictement nécessaires à son fonctionnement. Vous pouvez configurer votre navigateur pour les refuser.
            </p>
          </section>

          {/* Section 6 */}
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
              color: '#6b7280'
            }}>
              <p style={{ marginBottom: '16px' }}>
                ZMR Models Agency s'efforce d'assurer l'exactitude des informations diffusées, mais ne peut garantir leur exhaustivité. L'Agence se réserve le droit de modifier le contenu à tout moment.
              </p>
              <p>
                L'Agence décline toute responsabilité pour les dommages directs ou indirects résultant de l'utilisation du site.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '20px'
            }}>
              Droit applicable
            </h2>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#6b7280'
            }}>
              Les présentes mentions sont soumises au droit français. En cas de litige, et à défaut d'accord amiable, compétence est attribuée aux tribunaux français.
            </p>
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
