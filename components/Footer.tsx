import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '80px 40px 40px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '60px',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          {/* Column 1: Agency Info */}
          <div>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              color: '#ffffff'
            }}>
              ZMR Models Agency
            </h3>
            <div style={{
              fontSize: '13px',
              lineHeight: '1.8',
              color: '#9ca3af'
            }}>
              <p style={{ marginBottom: '4px' }}>[Adresse à compléter]</p>
              <p style={{ marginBottom: '16px' }}>[Code postal, Ville]</p>
              <p style={{ marginBottom: '4px' }}>
                <a
                  href="tel:+33000000000"
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  [Téléphone]
                </a>
              </p>
              <p>
                <a
                  href="mailto:contact@zmr-models.com"
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  contact@zmr-models.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Divisions */}
          <div>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              color: '#ffffff'
            }}>
              Divisions
            </h3>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px',
              color: '#9ca3af'
            }}>
              <Link
                href="/models"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Models
              </Link>
              <Link
                href="/acting"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Acting
              </Link>
              <Link
                href="/promo"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Promo
              </Link>
              <Link
                href="/details"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Détails
              </Link>
            </nav>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              color: '#ffffff'
            }}>
              Company
            </h3>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px',
              color: '#9ca3af'
            }}>
              <Link
                href="/contact"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Contact
              </Link>
              <Link
                href="/blog"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              color: '#ffffff'
            }}>
              Follow Us
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px',
              color: '#9ca3af'
            }}>
              <a
                href="https://www.instagram.com/zmrmodelsagency"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@zmrmodelsagency"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid #1f2937',
          paddingTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          textAlign: 'center'
        }}>
          {/* Legal Links */}
          <nav style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '11px',
            color: '#6b7280'
          }}>
            <Link
              href="/mentions-legales"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/conditions-generales"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Conditions générales
            </Link>
          </nav>

          {/* Copyright */}
          <p style={{
            fontSize: '11px',
            color: '#6b7280'
          }}>
            © {new Date().getFullYear()} ZMR Models Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
