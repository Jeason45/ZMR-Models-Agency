'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    '/videos/hero.mp4',
    '/videos/hero2.mp4',
    '/videos/hero3.mp4',
  ];

  const menuItems = [
    { name: 'Models', href: '/models' },
    { name: 'Acting', href: '/acting' },
    { name: 'Promo', href: '/promo' },
    { name: 'Détails', href: '/details' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentVideoIndex]);

  return (
    <>
      <main style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Background Video Slideshow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            key={currentVideoIndex}
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
          </video>
        </div>

        {/* Logo positioned at top with elegant spacing */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'none'
        }}>
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
        </div>

        {/* Top Right Icons: Search, Instagram, Hamburger */}
        <div style={{
          position: 'fixed',
          top: '32px',
          right: '32px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
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
            href="https://www.instagram.com/zmrmodels/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none'
            }}
            aria-label="Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
            </svg>
          </a>

          {/* Hamburger Menu Button */}
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
      </main>

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
          <div style={{ width: '100%', maxWidth: '600px', padding: '0 32px' }}>
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              style={{
                width: '100%',
                fontSize: '32px',
                fontWeight: 300,
                border: 'none',
                borderBottom: '1px solid #e0e0e0',
                paddingBottom: '16px',
                outline: 'none',
                background: 'transparent'
              }}
            />
          </div>

          {/* Close Search Button */}
          <button
            onClick={() => setIsSearchOpen(false)}
            style={{
              position: 'fixed',
              top: '32px',
              right: '32px',
              zIndex: 50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Close Search"
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

      {/* Full Screen Menu Overlay */}
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

          {/* Instagram Link */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <a
              href="https://www.instagram.com/zmrmodels/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'black',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                textDecoration: 'none',
                transition: 'opacity 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Instagram
            </a>
          </div>

          {/* Close Button (X) */}
          <button
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'fixed',
              top: '32px',
              right: '32px',
              zIndex: 50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Close Menu"
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
