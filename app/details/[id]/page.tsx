'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getDetailBySlug } from '@/lib/sanity';

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

// Helper function to get measurements based on category
function getMeasurements(detail: any) {
  const category = detail.category;
  const measurements = [];

  switch(category) {
    case 'hands':
      if (detail.handSize) measurements.push({ label: 'HAND', value: detail.handSize });
      if (detail.ringSize) measurements.push({ label: 'RING', value: detail.ringSize });
      if (detail.wristSize) measurements.push({ label: 'WRIST', value: detail.wristSize });
      break;
    case 'feet':
      if (detail.footSize) measurements.push({ label: 'SHOE', value: detail.footSize });
      if (detail.legLength) measurements.push({ label: 'LEG LENGTH', value: detail.legLength });
      break;
    case 'legs':
      if (detail.height) measurements.push({ label: 'HEIGHT', value: detail.height });
      if (detail.legLength) measurements.push({ label: 'LEG LENGTH', value: detail.legLength });
      break;
    case 'body':
      if (detail.height) measurements.push({ label: 'HEIGHT', value: detail.height });
      if (detail.bust) measurements.push({ label: 'BUST', value: detail.bust });
      if (detail.waist) measurements.push({ label: 'WAIST', value: detail.waist });
      if (detail.hips) measurements.push({ label: 'HIPS', value: detail.hips });
      break;
    case 'face':
      if (detail.height) measurements.push({ label: 'HEIGHT', value: detail.height });
      if (detail.eyes) measurements.push({ label: 'EYES', value: detail.eyes });
      if (detail.hair) measurements.push({ label: 'HAIR', value: detail.hair });
      if (detail.skinTone) measurements.push({ label: 'SKIN', value: detail.skinTone });
      break;
    case 'hair':
      if (detail.height) measurements.push({ label: 'HEIGHT', value: detail.height });
      if (detail.hair) measurements.push({ label: 'HAIR', value: detail.hair });
      if (detail.eyes) measurements.push({ label: 'EYES', value: detail.eyes });
      break;
    case 'torso':
      if (detail.height) measurements.push({ label: 'HEIGHT', value: detail.height });
      if (detail.bust) measurements.push({ label: 'BUST', value: detail.bust });
      if (detail.waist) measurements.push({ label: 'WAIST', value: detail.waist });
      break;
    default:
      if (detail.height) measurements.push({ label: 'HEIGHT', value: detail.height });
  }

  return measurements;
}

export default function DetailDetailPage() {
  const params = useParams();
  const detailSlug = params.id as string;
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [detail, setDetail] = useState<any>(null);
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

  // Fetch detail from both Prisma and Sanity
  useEffect(() => {
    async function fetchDetail() {
      try {
        // Try fetching from Prisma first
        const prismaResponse = await fetch(`/api/talents?type=DETAILS`);
        if (prismaResponse.ok) {
          const prismaTalents = await prismaResponse.json();
          const prismaDetail = prismaTalents.find((t: any) => t.slug === detailSlug);

          if (prismaDetail) {
            // Transform Prisma data to match expected format
            setDetail({
              _id: prismaDetail.id,
              name: prismaDetail.name,
              slug: prismaDetail.slug,
              category: prismaDetail.category,
              mainImage: prismaDetail.mainImage,
              hoverImage: prismaDetail.hoverImage,
              heroVideo: prismaDetail.heroVideo,
              heroImage: prismaDetail.heroImage,
              galleryImages: prismaDetail.galleryImages || [],
              portfolioImage: prismaDetail.portfolioImage,
              portfolioGallery: prismaDetail.portfolioGallery || [],
              campaigns: prismaDetail.campaigns || [],
              campaignsImage: prismaDetail.campaignsImage,
              instagramImage: prismaDetail.instagramImage,
              instagramUrl: prismaDetail.instagramUrl,
              height: prismaDetail.height,
              eyes: prismaDetail.eyes,
              hair: prismaDetail.hair,
              handSize: prismaDetail.handSize,
              ringSize: prismaDetail.ringSize,
              wristSize: prismaDetail.wristSize,
              footSize: prismaDetail.footSize,
              legLength: prismaDetail.legLength,
              neckSize: prismaDetail.neckSize,
              waist: prismaDetail.waist,
              hips: prismaDetail.hips,
              bust: prismaDetail.bust,
              skinTone: prismaDetail.skinTone,
              faceSpecialty: prismaDetail.faceSpecialty || [],
              isPrisma: true
            });
            setLoading(false);
            return;
          }
        }

        // Fallback to Sanity if not found in Prisma
        // const data = await getDetailBySlug(detailSlug);
        // setDetail(data);
        const data = null;
        setDetail(data);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [detailSlug]);

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

  if (!detail) {
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
          <h1>Detail model not found</h1>
          <Link href="/details" style={{ color: 'white', marginTop: '20px', display: 'inline-block' }}>
            ← Back to Details
          </Link>
        </div>
      </main>
    );
  }

  const measurements = getMeasurements(detail);

  return (
    <>
      <Navbar scrollDirection={scrollDirection} />

      {/* Back Arrow */}
      <Link
        href="/details"
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
        {/* 1. Hero Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '50vh',
          overflow: 'hidden'
        }}>
          <img
            src={detail.heroImage || detail.mainImage}
            alt={detail.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
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
              {detail.name}
            </h1>
            {/* Navigation Links */}
            <div style={{
              display: 'flex',
              gap: '30px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <a href="#portfolio" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>MY WORK</a>
              <a href="#social" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>INSTAGRAM</a>
              <a href="#campaigns" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>CAMPAIGNS</a>
            </div>
          </div>
        </div>

        {/* 2. Measurements Line */}
        {measurements.length > 0 && (
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
              {measurements.map((m, idx) => (
                <div key={idx}>
                  <span style={{ color: '#999' }}>{m.label}</span> {m.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. MY WORK Zone */}
        <div id="portfolio" style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          overflow: 'hidden',
          cursor: 'pointer'
        }}>
          <img
            src={detail.portfolioImage || detail.hoverImage || detail.mainImage}
            alt="My Work"
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
              fontSize: 'clamp(60px, 10vw, 120px)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>
              MY WORK
            </h2>
            {detail.portfolioGallery && detail.portfolioGallery.length > 0 && (
              <Link
                href={`/details/${detail.slug}/portfolio`}
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
                VIEW PORTFOLIO
              </Link>
            )}
          </div>
        </div>

        {/* 4 & 5. SOCIAL and CAMPAIGNS - Side by Side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '40px',
          padding: '0 20px'
        }}>
          {/* SOCIAL Zone */}
          <div id="social" style={{
            position: 'relative',
            height: '80vh',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <img
              src={detail.instagramImage || detail.mainImage}
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
                href={detail.instagramUrl || 'https://www.instagram.com/zmrmodels/'}
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

          {/* CAMPAIGNS Zone */}
          <div id="campaigns" style={{
            position: 'relative',
            height: '80vh',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <img
              src={detail.campaignsImage || detail.mainImage}
              alt="Campaigns"
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
                CAMPAIGNS
              </h2>
              {detail.campaigns && detail.campaigns.length > 0 && (
                <div style={{
                  marginTop: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  justifyContent: 'center'
                }}>
                  {detail.campaigns.slice(0, 3).map((campaign: any, idx: number) => (
                    <span key={idx} style={{
                      color: 'white',
                      fontSize: '12px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '6px 12px',
                      border: '1px solid white',
                      borderRadius: '20px'
                    }}>
                      {campaign.brandName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
