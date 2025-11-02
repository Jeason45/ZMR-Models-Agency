'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getActorBySlug } from '@/lib/sanity';

function Navbar({ scrollDirection }: { scrollDirection: 'up' | 'down' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const menuItems = [
    { name: 'Models', href: '/models' },
    { name: 'Acting', href: '/acting' },
    { name: 'Promo', href: '/promo' },
    { name: 'Détails', href: '/details' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Logo with scroll effect */}
      {!isMenuOpen && (
        <Link
          href="/"
          style={{
            position: 'fixed',
            top: scrollDirection === 'down' ? '-300px' : '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'top 0.5s ease-in-out'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              color: 'white',
              fontWeight: 300,
              letterSpacing: '0.2em',
              fontSize: 'clamp(35px, 8vw, 110px)',
              lineHeight: 1,
              margin: 0,
              transition: 'opacity 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              ZMR
            </h1>
            <p style={{
              color: 'white',
              fontWeight: 300,
              letterSpacing: '0.4em',
              fontSize: 'clamp(9px, 1.3vw, 12px)',
              textTransform: 'uppercase',
              marginTop: '12px'
            }}>
              Models Agency
            </p>
          </div>
        </Link>
      )}

      {/* Top Right Icons */}
      {!isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: scrollDirection === 'down' ? '-300px' : '32px',
          right: '32px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          transition: 'top 0.5s ease-in-out'
        }}>
          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>

          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/zmrmodelsagency"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
            aria-label="Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Menu"
          >
            <span style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'white',
              marginBottom: '8px'
            }} />
            <span style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'white'
            }} />
          </button>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          zIndex: 45,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '150px'
        }}>
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            style={{
              width: '100%',
              maxWidth: '600px',
              fontSize: '32px',
              fontWeight: 300,
              border: 'none',
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '16px',
              outline: 'none',
              background: 'transparent'
            }}
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            style={{
              position: 'fixed',
              top: '32px',
              right: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: '#0a0a0a',
              transform: 'rotate(45deg)'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: '#0a0a0a',
              transform: 'rotate(-45deg)'
            }} />
          </button>
        </div>
      )}

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(16px, 3vh, 32px)'
          }}>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                style={{
                  color: 'white',
                  fontSize: 'clamp(32px, 6vw, 100px)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  textDecoration: 'none',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 'clamp(20px, 4vh, 32px)',
              right: 'clamp(20px, 4vw, 32px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              zIndex: 50
            }}
            aria-label="Close Menu"
          >
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: 'white',
              transform: 'rotate(45deg)'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: 'white',
              transform: 'rotate(-45deg)'
            }} />
          </button>
        </div>
      )}
    </>
  );
}

export default function ActorDetailPage() {
  const params = useParams();
  const actorSlug = params.id as string;
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [actor, setActor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';

      if (direction !== scrollDirectionRef.current && Math.abs(scrollY - lastScrollY.current) > 10) {
        scrollDirectionRef.current = direction;
        setScrollDirection(direction);
      }

      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  // Fetch actor from both Prisma and Sanity
  useEffect(() => {
    async function fetchActor() {
      try {
        // Try fetching from Prisma first
        const prismaResponse = await fetch(`/api/talents?type=ACTING`);
        if (prismaResponse.ok) {
          const prismaTalents = await prismaResponse.json();
          const prismaActor = prismaTalents.find((t: any) => t.slug === actorSlug);

          if (prismaActor) {
            // Transform Prisma data to match expected format
            setActor({
              _id: prismaActor.id,
              name: prismaActor.name,
              slug: prismaActor.slug,
              category: prismaActor.category,
              mainImage: prismaActor.mainImage,
              hoverImage: prismaActor.hoverImage,
              heroVideo: prismaActor.heroVideo,
              heroImage: prismaActor.heroImage,
              galleryImages: prismaActor.galleryImages || [],
              showreelVideo: prismaActor.showreelVideo,
              showreelImage: prismaActor.showreelImage,
              reelsGallery: prismaActor.reelsGallery || [],
              credits: prismaActor.credits || [],
              creditsImage: prismaActor.creditsImage,
              instagramImage: prismaActor.instagramImage,
              instagramUrl: prismaActor.instagramUrl,
              height: prismaActor.height,
              eyes: prismaActor.eyes,
              hair: prismaActor.hair,
              ageRange: prismaActor.ageRange,
              languages: prismaActor.languages || [],
              skills: prismaActor.skills || [],
              isPrisma: true
            });
            setLoading(false);
            return;
          }
        }

        // Fallback to Sanity if not found in Prisma
        // const data = await getActorBySlug(actorSlug);
        // setActor(data);
        const data = null;
        setActor(data);
      } catch (error) {
        console.error('Error fetching actor:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActor();
  }, [actorSlug]);

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Loading...</div>
      </main>
    );
  }

  if (!actor) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Actor not found</h1>
          <Link href="/acting" style={{ color: 'white', marginTop: '20px', display: 'inline-block' }}>
            ← Back to Acting
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar scrollDirection={scrollDirection} />

      {/* Back Arrow */}
      <Link
        href="/acting"
        style={{
          position: 'fixed',
          top: '40px',
          left: '40px',
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

      <main style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        paddingTop: '0'
      }}>
        {/* 1. Hero Section - Video or Image */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '50vh',
          overflow: 'hidden'
        }}>
          {actor.heroVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src={actor.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={actor.heroImage || actor.mainImage}
              alt={actor.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h1 style={{
              color: 'white',
              fontSize: 'clamp(60px, 10vw, 120px)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textAlign: 'center',
              margin: 0,
              marginBottom: '30px',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>
              {actor.name}
            </h1>
            {/* Navigation Links */}
            <div style={{
              display: 'flex',
              gap: '30px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <Link href={`/acting/${actor.slug}/reels`} style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>SHOWREEL</Link>
              <a href="#credits" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>CREDITS</a>
              <a href="#social" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>SOCIAL</a>
            </div>
          </div>
        </div>

        {/* 2. Info Line */}
        <div style={{
          padding: '40px',
          textAlign: 'center',
          borderBottom: '1px solid #222'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            fontSize: '13px',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {actor.ageRange && <div><span style={{ color: '#999' }}>AGE RANGE</span> {actor.ageRange}</div>}
            {actor.languages && <div><span style={{ color: '#999' }}>LANGUAGES</span> {actor.languages}</div>}
            {actor.skills && <div><span style={{ color: '#999' }}>SKILLS</span> {actor.skills}</div>}
            {actor.height && <div><span style={{ color: '#999' }}>HEIGHT</span> {actor.height}</div>}
            {actor.eyes && <div><span style={{ color: '#999' }}>EYES</span> {actor.eyes}</div>}
            {actor.hair && <div><span style={{ color: '#999' }}>HAIR</span> {actor.hair}</div>}
          </div>
        </div>

        {/* 3. SHOWREEL Zone */}
        <div id="showreel" style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          overflow: 'hidden',
          cursor: 'pointer'
        }}>
          {actor.showreelVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src={actor.showreelVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={actor.showreelImage || actor.hoverImage || actor.mainImage}
              alt="Showreel"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            left: '0',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: 'clamp(60px, 10vw, 120px)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>
              SHOWREEL
            </h2>
            <Link
              href={`/acting/${actor.slug}/reels`}
              style={{
                color: 'white',
                fontSize: '14px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: '20px',
                textDecoration: 'none',
                borderBottom: '1px solid white',
                paddingBottom: '4px',
                pointerEvents: 'auto'
              }}
            >
              VIEW REELS
            </Link>
          </div>
        </div>

        {/* 4 & 5. SOCIAL and CREDITS - Side by Side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '40px',
          padding: '0 20px'
        }}>
          {/* SOCIAL Zone - LEFT */}
          <div id="social" style={{
            position: 'relative',
            height: '80vh',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <img
              src={actor.instagramImage || actor.mainImage}
              alt="Social"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: '0',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h2 style={{
                color: 'white',
                fontSize: 'clamp(40px, 8vw, 80px)',
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: 0,
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
              }}>
                SOCIAL
              </h2>
              <a
                href={actor.instagramUrl || 'https://www.instagram.com/zmrmodels/'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'white',
                  fontSize: '14px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginTop: '20px',
                  textDecoration: 'none',
                  borderBottom: '1px solid white',
                  paddingBottom: '4px'
                }}
              >
                VIEW INSTAGRAM
              </a>
            </div>
          </div>

          {/* CREDITS Zone - RIGHT */}
          <div id="credits" style={{
            position: 'relative',
            minHeight: '80vh',
            overflow: 'hidden',
            backgroundColor: '#111',
            padding: '60px 40px'
          }}>
            {actor.creditsImage && (
              <img
                src={actor.creditsImage}
                alt="Credits"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.3,
                  zIndex: 0
                }}
              />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                color: 'white',
                fontSize: 'clamp(40px, 8vw, 80px)',
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: '0 0 40px 0',
                textAlign: 'center',
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
              }}>
                CREDITS
              </h2>

              {actor.credits && actor.credits.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {actor.credits.map((credit: any, index: number) => (
                    <div key={index} style={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '20px',
                      borderLeft: '3px solid white'
                    }}>
                      <div style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}>
                        {credit.title}
                      </div>
                      <div style={{
                        color: '#999',
                        fontSize: '14px',
                        display: 'flex',
                        gap: '15px'
                      }}>
                        {credit.role && <span>Role: {credit.role}</span>}
                        {credit.type && <span>• {credit.type}</span>}
                        {credit.year && <span>• {credit.year}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  color: '#999',
                  textAlign: 'center',
                  fontSize: '16px'
                }}>
                  No credits available yet
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
