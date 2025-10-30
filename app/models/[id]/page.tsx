'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import modelsData from '@/data/models/models.json';

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
      {/* Logo */}
      <div style={{
        position: 'fixed',
        top: scrollDirection === 'down' ? '-150px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        transition: 'top 0.5s ease-in-out'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              color: 'white',
              fontWeight: 300,
              letterSpacing: '0.2em',
              fontSize: 'clamp(35px, 8vw, 110px)',
              lineHeight: 1,
              margin: 0
            }}>
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
      </div>

      {/* Top Right Icons */}
      <div style={{
        position: 'fixed',
        top: scrollDirection === 'down' ? '-100px' : '32px',
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
            padding: 0
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
        </button>

        {/* Instagram Icon */}
        <a href="https://www.instagram.com/zmrmodels/" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
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
        >
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.3s',
            marginBottom: '8px',
            transform: isMenuOpen ? 'rotate(45deg) translateY(10px)' : 'none'
          }} />
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.3s',
            transform: isMenuOpen ? 'rotate(-45deg) translateY(-10px)' : 'none'
          }} />
        </button>
      </div>

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
              backgroundColor: 'black',
              transform: 'rotate(45deg)'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: 'black',
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
          backgroundColor: 'white',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px'
          }}>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  color: 'black',
                  fontSize: 'clamp(50px, 8vw, 100px)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  textDecoration: 'none',
                  transition: 'opacity 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(false)}
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
              backgroundColor: 'black',
              transform: 'rotate(45deg)'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: 'black',
              transform: 'rotate(-45deg)'
            }} />
          </button>
        </div>
      )}
    </>
  );
}

export default function ModelDetailPage() {
  const params = useParams();
  const modelId = params.id as string;
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
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

  // Find model from JSON data
  const allModels = [...modelsData.women, ...modelsData.men];
  const model = allModels.find((m) => m.id === modelId);

  if (!model) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Model not found</h1>
          <Link href="/models" style={{ color: 'white', marginTop: '20px', display: 'inline-block' }}>
            ← Back to Models
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
        href="/models"
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
          {model.heroVideo ? (
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
              <source src={model.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={model.image}
              alt={model.name}
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
              {model.name}
            </h1>
            {/* Navigation Links */}
            <div style={{
              display: 'flex',
              gap: '30px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <a href="#" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>PORTFOLIO</a>
              <a href="#" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>INSTAGRAM</a>
              <a href="#" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>DIGITALS</a>
              <a href="#" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>VIDEO</a>
              <a href="#" style={{ color: 'white', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid transparent', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'} onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>SHOWS</a>
            </div>
          </div>
        </div>

        {/* 2. Measurements Line */}
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
            <div><span style={{ color: '#999' }}>HEIGHT</span> 6'2'' 1/2</div>
            <div><span style={{ color: '#999' }}>NECK</span> 15''</div>
            <div><span style={{ color: '#999' }}>WAIST</span> 28''</div>
            <div><span style={{ color: '#999' }}>SUIT</span> 37L</div>
            <div><span style={{ color: '#999' }}>INSEAM</span> 34''</div>
            <div><span style={{ color: '#999' }}>SHOE</span> 12</div>
            <div><span style={{ color: '#999' }}>EYES</span> BROWN</div>
            <div><span style={{ color: '#999' }}>HAIR</span> BLACK</div>
          </div>
        </div>

        {/* 3. MY WORK Zone */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          overflow: 'hidden',
          cursor: 'pointer'
        }}>
          <img
            src={model.imageHover || model.image}
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
            <a
              href="#"
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
            </a>
          </div>
        </div>

        {/* 4 & 5. MY WORLD and SHOWS - Side by Side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '40px',
          padding: '0 20px'
        }}>
          {/* MY WORLD Zone */}
          <div style={{
            position: 'relative',
            height: '80vh',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <img
              src={model.image}
              alt="My World"
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
                MY WORLD
              </h2>
              <a
                href="#"
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

          {/* SHOWS Zone */}
          <div style={{
            position: 'relative',
            height: '80vh',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <img
              src={model.imageHover || model.image}
              alt="Shows"
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
                SHOWS
              </h2>
              <a
                href="#"
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
                VIDEOS
              </a>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
