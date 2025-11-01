'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllPromos } from '@/lib/sanity';

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

export default function PromoPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beauty-fashion' | 'luxury-events' | 'lifestyle'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPromoId, setHoveredPromoId] = useState<string | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [promos, setPromos] = useState<any[]>([]);
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
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, []);

  // Fetch promos from Sanity
  useEffect(() => {
    async function fetchPromos() {
      try {
        const data = await getAllPromos();
        setPromos(data);
      } catch (error) {
        console.error('Error fetching promos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPromos();
  }, []);

  // Filter by category (now checking if selectedCategory is in the categories array)
  const categoryFiltered = selectedCategory === 'all'
    ? promos
    : promos.filter(p => p.categories && p.categories.includes(selectedCategory));

  // Filter by search query
  const filteredPromos = categoryFiltered.filter((promo) =>
    promo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return null;
  }

  return (
    <>
      <Navbar scrollDirection={scrollDirection} />
      <main style={{
        minHeight: '100vh',
        backgroundColor: "black",
        paddingTop: '200px',
        paddingBottom: '80px'
      }}>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        padding: '0 20px'
      }}>
        {[
          { value: 'all', label: 'All' },
          { value: 'beauty-fashion', label: 'Beauty & Fashion' },
          { value: 'luxury-events', label: 'Luxury Events' },
          { value: 'lifestyle', label: 'Lifestyle' }
        ].map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value as any)}
            style={{
              background: 'none',
              border: 'none',
              color: selectedCategory === category.value ? 'white' : 'rgba(255, 255, 255, 0.4)',
              fontSize: '16px',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '8px 16px',
              transition: 'color 0.3s',
              borderBottom: selectedCategory === category.value ? '1px solid white' : '1px solid transparent'
            }}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{
        maxWidth: '1800px',
        margin: '0 auto 60px',
        padding: '0 40px'
      }}>
        <div style={{
          position: 'relative',
          width: '100%'
        }}>
          <input
            type="text"
            placeholder=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 56px 16px 24px',
              fontSize: '16px',
              fontWeight: 300,
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50px',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          {/* Search Icon */}
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Promos Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '0 40px',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        {filteredPromos.map((promo) => (
          <Link
            key={promo._id}
            href={`/promo/${promo.slug}`}
            style={{
              textDecoration: 'none'
            }}
            onMouseEnter={() => setHoveredPromoId(promo._id)}
            onMouseLeave={() => setHoveredPromoId(null)}
          >
            {/* Image Container */}
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              cursor: 'pointer',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1a1a1a',
                position: 'relative'
              }}>
                {/* Main Image */}
                <img
                  src={promo.mainImage}
                  alt={promo.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: hoveredPromoId === promo._id ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                />
                {/* Hover Image */}
                {promo.hoverImage && (
                  <img
                    src={promo.hoverImage}
                    alt={promo.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: hoveredPromoId === promo._id ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Promo Name & Followers Below Image */}
            <div style={{
              textAlign: 'center',
              padding: '0 16px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 300,
                letterSpacing: '0.05em',
                margin: '0 0 8px 0',
                transition: 'opacity 0.3s',
                opacity: hoveredPromoId === promo._id ? 0.6 : 1
              }}>
                {promo.name}
              </h3>
              {/* Followers Info */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                letterSpacing: '0.1em'
              }}>
                {promo.instagramFollowers && (
                  <span>IG: {promo.instagramFollowers}</span>
                )}
                {promo.tiktokFollowers && (
                  <span>TT: {promo.tiktokFollowers}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Message */}
      {filteredPromos.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '18px',
          fontWeight: 300
        }}>
          No promo talents found matching "{searchQuery}"
        </div>
      )}
    </main>
    </>
  );
}
