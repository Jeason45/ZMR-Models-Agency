'use client';

import Link from 'next/link';

export default function BlogArticleTestPage() {
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

          <Link href="/blog-test" style={{
            fontSize: '14px',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ← Retour au blog
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <div style={{
        paddingTop: '100px',
        paddingBottom: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '100px 40px 40px'
      }}>
        {/* Category */}
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#6b7280',
          marginBottom: '16px'
        }}>
          Behind-the-Scenes
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: 300,
          lineHeight: '1.2',
          color: '#000000',
          marginBottom: '24px',
          letterSpacing: '0.01em'
        }}>
          Premier shooting avec Elite Paris
        </h1>

        {/* Meta */}
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '13px',
          color: '#9ca3af',
          paddingBottom: '40px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span>Par ZMR Models Agency</span>
          <span>•</span>
          <span>15 Mars 2024</span>
          <span>•</span>
          <span>5 min de lecture</span>
        </div>
      </div>

      {/* Cover Image */}
      <div style={{
        width: '100%',
        height: '600px',
        backgroundColor: '#f3f4f6',
        marginBottom: '60px'
      }}>
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=600&fit=crop"
          alt="Cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Article Content */}
      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 40px 100px'
      }}>
        {/* Introduction */}
        <div style={{
          fontSize: '18px',
          lineHeight: '1.8',
          color: '#374151',
          marginBottom: '40px',
          fontWeight: 300
        }}>
          <p>
            Cette semaine marque un tournant majeur pour ZMR Models Agency avec notre première collaboration avec la prestigieuse maison Elite Paris. Une opportunité exceptionnelle qui témoigne de la qualité de notre travail et de nos mannequins.
          </p>
        </div>

        {/* Section 1 */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 400,
            color: '#000000',
            marginBottom: '20px',
            letterSpacing: '0.01em'
          }}>
            Une collaboration prestigieuse
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            Le shooting s'est déroulé dans les studios mythiques du Marais, avec une équipe de photographes et stylistes de renommée internationale. Nos mannequins ont eu l'opportunité de travailler sur une campagne qui sera diffusée dans les plus grands magazines de mode européens.
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#6b7280'
          }}>
            Cette collaboration est le fruit de mois de travail et de préparation. Elle démontre que ZMR Models Agency s'impose comme un acteur incontournable de l'industrie du mannequinat en France.
          </p>
        </section>

        {/* Quote */}
        <blockquote style={{
          borderLeft: '3px solid #000000',
          paddingLeft: '32px',
          margin: '40px 0',
          fontSize: '20px',
          lineHeight: '1.6',
          color: '#374151',
          fontStyle: 'italic',
          fontWeight: 300
        }}>
          "Travailler avec Elite Paris est un rêve devenu réalité. Cette expérience nous propulse vers de nouveaux horizons."
        </blockquote>

        {/* Section 2 */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 400,
            color: '#000000',
            marginBottom: '20px',
            letterSpacing: '0.01em'
          }}>
            Les coulisses du shooting
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            Dès 6h du matin, nos mannequins étaient sur place pour les essayages et le maquillage. L'atmosphère était électrique, mêlant excitation et professionnalisme. Chaque détail compte lors d'un shooting de cette envergure.
          </p>
        </section>

        {/* Image Gallery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          margin: '40px 0'
        }}>
          <div style={{
            width: '100%',
            height: '300px',
            backgroundColor: '#f3f4f6'
          }}>
            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop"
              alt="Gallery 1"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div style={{
            width: '100%',
            height: '300px',
            backgroundColor: '#f3f4f6'
          }}>
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop"
              alt="Gallery 2"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>

        {/* Section 3 */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 400,
            color: '#000000',
            marginBottom: '20px',
            letterSpacing: '0.01em'
          }}>
            Vers de nouveaux projets
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#6b7280'
          }}>
            Cette première collaboration avec Elite Paris ouvre la porte à de nombreux autres projets. Nous sommes déjà en discussion pour de futures campagnes et événements. L'avenir s'annonce prometteur pour ZMR Models Agency et nos talents.
          </p>
        </section>

        {/* Tags */}
        <div style={{
          paddingTop: '40px',
          borderTop: '1px solid #e5e7eb',
          marginTop: '60px'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {['Fashion Week', 'Elite Paris', 'Shooting', 'Behind-the-Scenes'].map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  padding: '8px 16px',
                  borderRadius: '4px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Share */}
        <div style={{
          paddingTop: '40px',
          marginTop: '40px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#000000'
          }}>
            Partager
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{
              fontSize: '13px',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Facebook
            </a>
            <a href="#" style={{
              fontSize: '13px',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Twitter
            </a>
            <a href="#" style={{
              fontSize: '13px',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </article>

      {/* Navigation to other articles */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '60px',
        paddingBottom: '100px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '0.05em',
            color: '#000000',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Articles similaires
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {/* Related Article 1 */}
            <Link href="/blog-test" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                marginBottom: '16px'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=200&fit=crop"
                  alt="Related 1"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#000000',
                marginBottom: '8px'
              }}>
                Comment créer un book photo professionnel
              </h4>
              <p style={{
                fontSize: '13px',
                color: '#6b7280'
              }}>
                Conseils • 8 min
              </p>
            </Link>

            {/* Related Article 2 */}
            <Link href="/blog-test" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                marginBottom: '16px'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=200&fit=crop"
                  alt="Related 2"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#000000',
                marginBottom: '8px'
              }}>
                Success Story : Marie décroche Vogue
              </h4>
              <p style={{
                fontSize: '13px',
                color: '#6b7280'
              }}>
                Success Stories • 6 min
              </p>
            </Link>

            {/* Related Article 3 */}
            <Link href="/blog-test" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f3f4f6',
                marginBottom: '16px'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=200&fit=crop"
                  alt="Related 3"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#000000',
                marginBottom: '8px'
              }}>
                Les tendances du printemps 2024
              </h4>
              <p style={{
                fontSize: '13px',
                color: '#6b7280'
              }}>
                Actualités • 4 min
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
