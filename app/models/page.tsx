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
              backgroundColor: "black",
              transform: 'rotate(45deg)'
            }} />
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              backgroundColor: "black",
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
          backgroundColor: "black",
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
    const pageStartTime = performance.now();
    console.log('🚀 DIAGNOSTIC: Page Models - Début chargement');

    async function fetchModels() {
      try {
        const fetchStartTime = performance.now();

        // Récupérer les models Sanity et Prisma en parallèle
        // const [sanityData, prismaResponse] = await Promise.all([
        //   getAllModels(),
        //   fetch('/api/models?status=active')
        // ]);
        const sanityData: any[] = [];
        const prismaResponse = await fetch('/api/models?status=active');

        const prismaModels = prismaResponse.ok ? await prismaResponse.json() : [];

        // Transformer les models Prisma au format Sanity
        const transformedPrismaModels = prismaModels.map((model: any) => ({
          _id: model.id,
          _type: 'model',
          name: model.name,
          slug: model.slug, // Déjà une string, on la garde telle quelle
          category: model.category,
          status: model.status,
          mainImage: model.mainImage, // Chemin local direct
          hoverImage: model.hoverImage,
          isPrisma: true,
        }));

        // Fusionner les deux sources
        const allModels = [...sanityData, ...transformedPrismaModels];

        const fetchEndTime = performance.now();
        console.log(`📥 Fetch terminé: ${(fetchEndTime - fetchStartTime).toFixed(2)}ms`);

        const renderStartTime = performance.now();
        setModels(allModels);

        requestAnimationFrame(() => {
          const renderEndTime = performance.now();
          const totalTime = renderEndTime - pageStartTime;
          console.log(`🎨 Rendu terminé: ${(renderEndTime - renderStartTime).toFixed(2)}ms`);
          console.log(`⏱️  TOTAL (Fetch + Rendu): ${totalTime.toFixed(2)}ms`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });
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
            href={`/models/${typeof model.slug === 'string' ? model.slug : model.slug?.current}`}
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
                position: 'relative'
              }}>
                {/* Main Image */}
                <img
                  src={typeof model.mainImage === 'string' ? model.mainImage : urlFor(model.mainImage).width(800).height(1200).url()}
                  alt={model.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: hoveredModelId === model._id ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                />
                {/* Hover Image */}
                {model.hoverImage && (
                  <img
                    src={typeof model.hoverImage === 'string' ? model.hoverImage : urlFor(model.hoverImage).width(800).height(1200).url()}
                    alt={model.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: hoveredModelId === model._id ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out'
                    }}
                  />
                )}
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
    </main>
    </>
  );
}
