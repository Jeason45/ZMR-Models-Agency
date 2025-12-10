'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemberAuth } from '@/hooks/useMemberAuth';
import RestrictedContent from '@/components/RestrictedContent';
import MemberIcon from '@/components/MemberIcon';

function Navbar({ scrollDirection }: { scrollDirection: 'up' | 'down' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: 'All Models', href: '/explore' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    router.push(href);
  };

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
              fontSize: 'clamp(32px, 6vw, 72px)',
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
              fontSize: 'clamp(8px, 1vw, 11px)',
              textTransform: 'uppercase',
              marginTop: '10px'
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
          top: scrollDirection === 'down' ? '-300px' : 'clamp(20px, 4vh, 32px)',
          right: 'clamp(16px, 4vw, 32px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 24px)',
          transition: 'top 0.5s ease-in-out'
        }}>
        {/* Member Icon */}
        <MemberIcon size={20} color="white" />

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
            width: 'clamp(28px, 4vw, 32px)',
            height: 'clamp(28px, 4vw, 32px)',
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
            marginBottom: 'clamp(6px, 1vw, 8px)'
          }} />
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'white'
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
                onClick={(e) => handleMenuClick(e, item.href)}
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

type CategoryType = 'all' | 'hands' | 'face' | 'feet' | 'legs' | 'body' | 'hair' | 'torso' | 'eyes' | 'lips' | 'others';

export default function DetailsPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredDetailId, setHoveredDetailId] = useState<string | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [details, setDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const { isAuthenticated } = useMemberAuth();

  // Helper pour vérifier si le contenu est restreint
  const isContentRestricted = (detail: any) => {
    const restrictedCategories = ['hands', 'feet'];
    return restrictedCategories.includes(detail.category?.toLowerCase()) || detail.hasRestrictedContent;
  };

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

  // Fetch details from both Sanity and Prisma
  useEffect(() => {
    async function fetchDetails() {
      try {
        // Fetch from Sanity
        // const sanityData = await getAllDetails();
        const sanityData: any[] = [];

        // Fetch from Prisma
        const prismaResponse = await fetch('/api/talents?type=DETAILS');
        const prismaDetails = prismaResponse.ok ? await prismaResponse.json() : [];

        // Transform Prisma details to match Sanity format
        const transformedPrismaDetails = prismaDetails.map((detail: any) => ({
          _id: detail.id,
          slug: detail.slug,
          name: detail.name,
          category: detail.category,
          mainImage: detail.mainImage,
          hoverImage: detail.hoverImage,
          height: detail.height,
          hasRestrictedContent: detail.hasRestrictedContent,
          isPrisma: true
        }));

        // Merge both sources
        const allDetails = [...sanityData, ...transformedPrismaDetails];
        setDetails(allDetails);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, []);

  // Filter by category
  const categoryFiltered = selectedCategory === 'all'
    ? details
    : details.filter(d => d.category === selectedCategory);

  // Filter by search query
  const filteredDetails = categoryFiltered.filter((detail) =>
    detail.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        gap: '20px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        padding: '0 20px'
      }}>
        {[
          { value: 'all', label: 'All' },
          { value: 'hands', label: 'Hands' },
          { value: 'face', label: 'Face' },
          { value: 'eyes', label: 'Eyes' },
          { value: 'lips', label: 'Lips' },
          { value: 'feet', label: 'Feet' },
          { value: 'legs', label: 'Legs' },
          { value: 'body', label: 'Body' },
          { value: 'hair', label: 'Hair' },
          { value: 'torso', label: 'Torso' },
          { value: 'others', label: 'Others' }
        ].map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value as CategoryType)}
            style={{
              background: 'none',
              border: 'none',
              color: selectedCategory === category.value ? 'white' : 'rgba(255, 255, 255, 0.4)',
              fontSize: '14px',
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

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '0 40px',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        {filteredDetails.map((detail) => (
          <Link
            key={detail._id}
            href={`/talent/${detail.slug}`}
            style={{
              textDecoration: 'none'
            }}
            onMouseEnter={() => setHoveredDetailId(detail._id)}
            onMouseLeave={() => setHoveredDetailId(null)}
          >
            {/* Image Container - avec floutage si restreint */}
            <RestrictedContent
              isAuthenticated={isAuthenticated || !isContentRestricted(detail)}
              blurAmount={12}
              overlayOpacity={0.7}
              message="Contenu réservé aux membres"
              showLoginButton={false}
              style={{
                aspectRatio: '3/4',
                marginBottom: '16px',
                borderRadius: '4px'
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1a1a1a',
                position: 'relative'
              }}>
                {/* Main Image */}
                <img
                  src={detail.mainImage}
                  alt={detail.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: hoveredDetailId === detail._id ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                />
                {/* Hover Image */}
                {detail.hoverImage && (
                  <img
                    src={detail.hoverImage}
                    alt={detail.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: hoveredDetailId === detail._id ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out'
                    }}
                  />
                )}
              </div>
            </RestrictedContent>

            {/* Detail Name & Category Below Image */}
            <div style={{
              textAlign: 'center',
              padding: '0 16px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 300,
                letterSpacing: '0.05em',
                margin: '0 0 4px 0',
                transition: 'opacity 0.3s',
                opacity: hoveredDetailId === detail._id ? 0.6 : 1
              }}>
                {detail.name}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '13px',
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: 0
              }}>
                {detail.category}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Message */}
      {filteredDetails.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '18px',
          fontWeight: 300
        }}>
          No details models found matching "{searchQuery}"
        </div>
      )}
    </main>
    </>
  );
}
