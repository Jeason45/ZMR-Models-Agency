'use client';

import { useState } from 'react';

export default function FooterTest() {
  const [selected, setSelected] = useState<1 | 2 | 3>(1);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px' }}>
      {/* Selector */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto 60px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 600 }}>
          Footer Minimaliste - Test
        </h1>
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setSelected(num as 1 | 2 | 3)}
              style={{
                padding: '10px 20px',
                backgroundColor: selected === num ? '#000' : '#fff',
                color: selected === num ? '#fff' : '#000',
                border: '1px solid #000',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Option {num}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Container */}
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          padding: '300px 40px',
          textAlign: 'center',
          color: '#999',
          borderBottom: '1px solid #ddd'
        }}>
          Contenu de la page...
        </div>

        {/* Option 1 - Minimaliste Horizontal */}
        {selected === 1 && (
          <footer style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '40px 40px 32px'
          }}>
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {/* Social Links */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                marginBottom: '32px',
                fontSize: '13px'
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
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Instagram
                </a>
                <span style={{ color: '#4b5563' }}>·</span>
                <a
                  href="https://www.tiktok.com/@zmrmodelsagency"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  TikTok
                </a>
              </div>

              {/* Legal + Copyright */}
              <div style={{
                borderTop: '1px solid #1f2937',
                paddingTop: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {/* Legal Links */}
                <nav style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '16px',
                  fontSize: '11px'
                }}>
                  <a
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
                  </a>
                  <span style={{ color: '#4b5563' }}>·</span>
                  <a
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
                  </a>
                  <span style={{ color: '#4b5563' }}>·</span>
                  <a
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
                  </a>
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
        )}

        {/* Option 2 - Double ligne centrée */}
        {selected === 2 && (
          <footer style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '40px 40px 32px'
          }}>
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              {/* Social */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                marginBottom: '32px',
                fontSize: '13px'
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
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Instagram
                </a>
                <span style={{ color: '#4b5563' }}>·</span>
                <a
                  href="https://www.tiktok.com/@zmrmodelsagency"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  TikTok
                </a>
              </div>

              {/* Legal + Copyright */}
              <div style={{
                borderTop: '1px solid #1f2937',
                paddingTop: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {/* Legal Links */}
                <nav style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '16px',
                  fontSize: '11px'
                }}>
                  <a
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
                  </a>
                  <span style={{ color: '#4b5563' }}>·</span>
                  <a
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
                  </a>
                  <span style={{ color: '#4b5563' }}>·</span>
                  <a
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
                  </a>
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
        )}

        {/* Option 3 - Ultra compact */}
        {selected === 3 && (
          <footer style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '32px 40px 28px'
          }}>
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {/* Social en haut */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '28px',
                fontSize: '13px'
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
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Instagram
                </a>
                <span style={{ color: '#4b5563' }}>·</span>
                <a
                  href="https://www.tiktok.com/@zmrmodelsagency"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  TikTok
                </a>
              </div>

              {/* Legal + Copyright sur une seule ligne */}
              <div style={{
                textAlign: 'center',
                fontSize: '11px',
                color: '#6b7280',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '12px',
                alignItems: 'center'
              }}>
                <a
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
                </a>
                <span style={{ color: '#4b5563' }}>·</span>
                <a
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
                </a>
                <span style={{ color: '#4b5563' }}>·</span>
                <a
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
                </a>
                <span style={{ color: '#4b5563' }}>·</span>
                <span>© {new Date().getFullYear()} ZMR Models Agency. All rights reserved.</span>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Description */}
      <div style={{
        maxWidth: '600px',
        margin: '40px auto 0',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
          Option {selected}
        </h3>
        {selected === 1 && (
          <p>
            <strong>Social en haut + Séparation visuelle :</strong> Social links centrés, puis une ligne de séparation, puis mentions légales et copyright.
            Design clair avec séparation visuelle entre social et légal.
          </p>
        )}
        {selected === 2 && (
          <p>
            <strong>Même structure avec espacement :</strong> Social en haut, séparation, légal et copyright.
            Similaire à l'option 1 mais avec un espacement légèrement différent.
          </p>
        )}
        {selected === 3 && (
          <p>
            <strong>Ultra compact :</strong> Social en haut, puis tout le reste (légal + copyright) sur une seule ligne.
            Le plus compact possible, parfait pour économiser de l'espace vertical.
          </p>
        )}
      </div>
    </div>
  );
}
