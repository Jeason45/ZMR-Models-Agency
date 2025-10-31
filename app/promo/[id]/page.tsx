'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPromoBySlug } from '@/lib/sanity';

export default function PromoDetailPage() {
  const params = useParams();
  const promoSlug = params.id as string;
  const [promo, setPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPromo() {
      try {
        const data = await getPromoBySlug(promoSlug);
        setPromo(data);
      } catch (error) {
        console.error('Error fetching promo:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPromo();
  }, [promoSlug]);

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Loading...</div>
      </main>
    );
  }

  if (!promo) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Promo talent not found</div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white'
    }}>
      {/* Back Button */}
      <Link
        href="/promo"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 100,
          color: 'white',
          fontSize: '24px',
          textDecoration: 'none',
          transition: 'opacity 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        ←
      </Link>

      {/* Hero Section with Video or Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {promo.heroVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          >
            <source src={promo.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={promo.mainImage}
            alt={promo.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}

        {/* Name Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: 'clamp(60px, 12vw, 160px)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {promo.name}
          </h1>
        </div>
      </div>

      {/* Info Line */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'clamp(40px, 8vw, 120px)',
        padding: 'clamp(60px, 10vh, 120px) 40px',
        flexWrap: 'wrap'
      }}>
        {promo.height && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(11px, 1.5vw, 14px)',
              letterSpacing: '0.2em',
              color: '#666',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>Height</div>
            <div style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 300
            }}>{promo.height}</div>
          </div>
        )}
        {promo.eyes && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(11px, 1.5vw, 14px)',
              letterSpacing: '0.2em',
              color: '#666',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>Eyes</div>
            <div style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 300
            }}>{promo.eyes}</div>
          </div>
        )}
        {promo.hair && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(11px, 1.5vw, 14px)',
              letterSpacing: '0.2em',
              color: '#666',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>Hair</div>
            <div style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 300
            }}>{promo.hair}</div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(40px, 8vw, 80px)',
        padding: '40px 20px 80px',
        flexWrap: 'wrap'
      }}>
        <a
          href="#collaborations"
          style={{
            color: 'white',
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'opacity 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Collaborations
        </a>
        <a
          href="#events"
          style={{
            color: 'white',
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'opacity 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Events
        </a>
        <a
          href="#social"
          style={{
            color: 'white',
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'opacity 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Social
        </a>
      </div>

      {/* SOCIAL Section (left) and COLLABORATIONS Section (right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 600px), 1fr))',
        gap: 'clamp(40px, 5vw, 80px)',
        padding: '0 clamp(20px, 5vw, 80px) clamp(80px, 12vh, 160px)',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        {/* SOCIAL Section - LEFT */}
        <div id="social" style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 60px)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(20px, 3vh, 40px)'
          }}>
            Social
          </h2>

          {promo.socialImage && (
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <img
                src={promo.socialImage}
                alt="Social"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Followers Stats */}
          <div style={{
            display: 'flex',
            gap: '40px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            {promo.instagramFollowers && (
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  Instagram
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 300
                }}>
                  {promo.instagramFollowers}
                </div>
              </div>
            )}
            {promo.tiktokFollowers && (
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  TikTok
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 300
                }}>
                  {promo.tiktokFollowers}
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {promo.instagramUrl && (
              <a
                href={promo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'white',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  letterSpacing: '0.1em',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.6'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                VIEW INSTAGRAM →
              </a>
            )}
            {promo.tiktokUrl && (
              <a
                href={promo.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'white',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  letterSpacing: '0.1em',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.6'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                VIEW TIKTOK →
              </a>
            )}
          </div>
        </div>

        {/* COLLABORATIONS Section - RIGHT */}
        <div id="collaborations" style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 60px)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(20px, 3vh, 40px)'
          }}>
            Collaborations
          </h2>

          {promo.collaborationsImage && (
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              overflow: 'hidden',
              marginBottom: '30px'
            }}>
              <img
                src={promo.collaborationsImage}
                alt="Collaborations"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Brand Logos */}
          {promo.collaborations && promo.collaborations.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '20px',
              alignItems: 'center'
            }}>
              {promo.collaborations.map((collab: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    aspectRatio: '1/1'
                  }}
                >
                  {collab.logo ? (
                    <img
                      src={collab.logo}
                      alt={collab.brandName}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}>
                      {collab.brandName}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EVENTS Section - Full Width */}
      <div id="events" style={{
        padding: '0 clamp(20px, 5vw, 80px) clamp(80px, 12vh, 160px)',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(32px, 6vw, 60px)',
          fontWeight: 900,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 'clamp(20px, 3vh, 40px)',
          textAlign: 'center'
        }}>
          Events
        </h2>

        {promo.eventsImage && (
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            marginBottom: '40px'
          }}>
            <img
              src={promo.eventsImage}
              alt="Events"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        {promo.eventsGallery && promo.eventsGallery.length > 0 && (
          <div>
            <Link
              href={`/promo/${promoSlug}/events`}
              style={{
                display: 'inline-block',
                color: 'white',
                fontSize: '14px',
                textDecoration: 'underline',
                letterSpacing: '0.1em',
                marginTop: '20px',
                transition: 'opacity 0.3s',
                textAlign: 'center',
                width: '100%'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.6'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              VIEW EVENTS GALLERY →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
