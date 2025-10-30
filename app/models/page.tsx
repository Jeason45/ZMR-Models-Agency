'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllModels, urlFor } from '@/lib/sanity';

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

type Model = {
  id: string;
  name: string;
  image: string;
  imageHover?: string;
  height?: string;
  bust?: string;
  chest?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
};

export default function ModelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'women' | 'men'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [models, setModels] = useState<any[]>([]);
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

  // Fetch models from Sanity
  useEffect(() => {
    async function fetchModels() {
      try {
        const data = await getAllModels();
        setModels(data);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  // Filter by category
  const categoryFiltered = selectedCategory === 'all'
    ? models
    : models.filter(m => m.category === (selectedCategory === 'women' ? 'woman' : 'man'));

  // Filter by search query
  const filteredModels = categoryFiltered.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading models...</div>
      </main>
    );
  }

  return (
    <>
      <Navbar scrollDirection={scrollDirection} />
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        paddingTop: '200px',
        paddingBottom: '80px'
      }}>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        marginBottom: '40px'
      }}>
        {['all', 'women', 'men'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as 'all' | 'women' | 'men')}
            style={{
              background: 'none',
              border: 'none',
              color: selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.4)',
              fontSize: '16px',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '8px 16px',
              transition: 'color 0.3s',
              borderBottom: selectedCategory === category ? '1px solid white' : '1px solid transparent'
            }}
          >
            {category}
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

      {/* Models Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '0 40px',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        {filteredModels.map((model) => (
          <Link
            key={model._id}
            href={`/models/${model.slug}`}
            style={{
              textDecoration: 'none'
            }}
            onMouseEnter={() => setHoveredModelId(model._id)}
            onMouseLeave={() => setHoveredModelId(null)}
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
                position: 'relative',
                transition: 'transform 0.3s',
                transform: hoveredModelId === model._id ? 'scale(1.02)' : 'scale(1)'
              }}>
                {/* Model Image */}
                <img
                  src={hoveredModelId === model._id && model.hoverImage ? model.hoverImage : model.mainImage}
                  alt={model.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s'
                  }}
                />
              </div>
            </div>

            {/* Model Name Below Image */}
            <div style={{
              textAlign: 'center',
              padding: '0 16px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 300,
                letterSpacing: '0.05em',
                margin: 0,
                transition: 'opacity 0.3s',
                opacity: hoveredModelId === model.id ? 0.6 : 1
              }}>
                {model.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Message */}
      {filteredModels.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '18px',
          fontWeight: 300
        }}>
          No models found matching "{searchQuery}"
        </div>
      )}

      {/* Add Model Instructions */}
      <div style={{
        maxWidth: '800px',
        margin: '100px auto 0',
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 300,
          marginBottom: '20px'
        }}>
          Comment ajouter un mannequin ?
        </h2>
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '16px',
          fontWeight: 300,
          lineHeight: 1.8,
          textAlign: 'left'
        }}>
          <p style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'white' }}>1. Ajouter des photos :</strong><br />
            Place 2 photos du mannequin dans <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>/public/models/women/</code> ou <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>/public/models/men/</code>
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'white' }}>2. Ajouter les informations :</strong><br />
            Ouvre le fichier <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>/data/models/models.json</code> et ajoute les informations du mannequin
          </p>
          <p>
            <strong style={{ color: 'white' }}>3. Exemple :</strong>
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '16px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px',
            textAlign: 'left',
            marginTop: '12px'
          }}>
{`{
  "id": "6",
  "name": "Prénom Nom",
  "image": "/models/women/nom-photo.jpg",
  "imageHover": "/models/women/nom-photo-2.jpg",
  "height": "175 cm",
  "bust": "84 cm",
  "waist": "61 cm",
  "hips": "89 cm",
  "shoes": "38 EU",
  "hair": "Blonde",
  "eyes": "Blue"
}`}
          </pre>
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Les mannequins sont triés par ordre alphabétique du prénom.<br />
            La 2ème photo (imageHover) s'affiche au survol de la souris.
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
