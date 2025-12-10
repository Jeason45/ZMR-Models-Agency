'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemberAuth } from '@/hooks/useMemberAuth';
import RestrictedContent from '@/components/RestrictedContent';
import MemberIcon from '@/components/MemberIcon';

// Styles responsive pour desktop petit et mobile
const mobileStyles = `
  /* ===== PETITS ÉCRANS DESKTOP (13" et moins) ===== */
  @media (max-width: 1400px) {
    .navbar-logo h1 {
      font-size: clamp(24px, 5vw, 60px) !important;
    }
    .navbar-logo p {
      font-size: clamp(7px, 0.9vw, 10px) !important;
      margin-top: 6px !important;
    }
    .explore-main {
      padding-top: 140px !important;
    }
    .explore-search {
      margin-bottom: 24px !important;
    }
    .explore-filters {
      margin-bottom: 16px !important;
    }
    .explore-filters button {
      padding: 8px 16px !important;
      font-size: 12px !important;
    }
  }

  /* ===== MOBILE ===== */
  @media (max-width: 768px) {
    .explore-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
      padding: 0 12px !important;
    }
    .explore-grid .talent-card {
      margin-bottom: 8px !important;
    }
    .explore-grid .talent-card h3 {
      font-size: 12px !important;
      margin-bottom: 2px !important;
    }
    .explore-grid .talent-card p {
      font-size: 9px !important;
    }
    .explore-grid .talent-card .type-badges {
      top: 6px !important;
      left: 6px !important;
      gap: 4px !important;
    }
    .explore-grid .talent-card .type-badge {
      padding: 2px 6px !important;
      font-size: 7px !important;
    }
    .explore-search {
      padding: 0 16px !important;
      margin-bottom: 20px !important;
    }
    .explore-search input {
      padding: 12px 44px 12px 16px !important;
      font-size: 14px !important;
    }
    .explore-filters {
      gap: 6px !important;
      padding: 0 12px !important;
      margin-bottom: 16px !important;
    }
    .explore-filters button {
      padding: 8px 12px !important;
      font-size: 11px !important;
    }
    .explore-main {
      padding-top: 120px !important;
    }
  }
`;

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
          <div className="navbar-logo" style={{ textAlign: 'center' }}>
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

// Types et sous-catégories
const TALENT_CATEGORIES = {
  MODELS: {
    label: 'Models',
    subcategories: [
      { value: 'woman', label: 'Women' },
      { value: 'man', label: 'Men' }
    ]
  },
  ACTING: {
    label: 'Advertising',
    subcategories: [
      { value: 'commercial', label: 'Commercial' },
      { value: 'cinema', label: 'Cinema' },
      { value: 'theater', label: 'Theater' }
    ]
  },
  PROMO: {
    label: 'Promo',
    subcategories: [
      { value: 'beauty', label: 'Beauty & Fashion' },
      { value: 'luxury', label: 'Luxury Events' },
      { value: 'lifestyle', label: 'Lifestyle' },
      { value: 'hostess', label: 'Hostess' }
    ]
  },
  DETAILS: {
    label: 'Parts Models',
    subcategories: [
      { value: 'hands', label: 'Hands' },
      { value: 'feet', label: 'Feet' },
      { value: 'face', label: 'Face' },
      { value: 'legs', label: 'Legs' },
      { value: 'body', label: 'Body' }
    ],
    specialties: [
      { value: 'lips', label: 'Lips' },
      { value: 'eyes', label: 'Eyes' },
      { value: 'teeth', label: 'Teeth' },
      { value: 'skin', label: 'Skin' }
    ]
  }
};

export default function ExplorePage() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredTalentId, setHoveredTalentId] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');

  // Auth pour contenu restreint
  const { isAuthenticated, isLoading: authLoading } = useMemberAuth();

  // Vérifie si le contenu d'un talent est restreint
  const isContentRestricted = (talent: any) => {
    const category = talent.category?.toLowerCase();
    return (
      category === 'hands' ||
      category === 'feet' ||
      talent.hasRestrictedContent === true
    );
  };

  // Filtres avancés avec multi-sélection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Multi-select types
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]); // Multi-select subcategories
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]); // Pour DETAILS
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedEyes, setSelectedEyes] = useState<string>('all');
  const [selectedHair, setSelectedHair] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Toggle type selection
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // Si on désélectionne un type, on retire aussi ses sous-catégories
        const newTypes = prev.filter(t => t !== type);
        // Reset subcategories for this type
        const typeSubs = TALENT_CATEGORIES[type as keyof typeof TALENT_CATEGORIES]?.subcategories || [];
        setSelectedSubcategories(subs => subs.filter(s => !typeSubs.some(ts => ts.value === s)));
        if (type === 'DETAILS') {
          setSelectedSpecialties([]);
        }
        return newTypes;
      }
      return [...prev, type];
    });
  };

  // Toggle subcategory selection
  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  // Toggle specialty selection (for DETAILS)
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  // Get active subcategories based on selected types
  const getActiveSubcategories = () => {
    if (selectedTypes.length === 0) return [];
    return selectedTypes.flatMap(type =>
      TALENT_CATEGORIES[type as keyof typeof TALENT_CATEGORIES]?.subcategories || []
    );
  };

  // Check if DETAILS specialties should show
  const showSpecialties = selectedTypes.includes('DETAILS');

  // Count active filters
  const activeFilterCount = selectedTypes.length + selectedSubcategories.length + selectedSpecialties.length +
    (selectedGender !== 'all' ? 1 : 0) + (selectedEyes !== 'all' ? 1 : 0) + (selectedHair !== 'all' ? 1 : 0);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedTypes([]);
    setSelectedSubcategories([]);
    setSelectedSpecialties([]);
    setSelectedGender('all');
    setSelectedEyes('all');
    setSelectedHair('all');
    setSearchQuery('');
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

  // Fetch all talents
  useEffect(() => {
    async function fetchTalents() {
      try {
        const response = await fetch('/api/talents?status=active&includeMultiTypes=true');
        const data = response.ok ? await response.json() : [];
        setTalents(data);
      } catch (error) {
        console.error('Error fetching talents:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTalents();
  }, []);

  // Filter talents with multi-selection logic
  const filteredTalents = talents.filter(talent => {
    // Search filter
    if (searchQuery && !talent.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter (multi-select - talent must have at least one of the selected types)
    if (selectedTypes.length > 0) {
      const talentTypes = talent.types || [talent.type];
      const hasMatchingType = selectedTypes.some(type =>
        talent.type === type || (Array.isArray(talentTypes) && talentTypes.includes(type))
      );
      if (!hasMatchingType) return false;
    }

    // Subcategory filter (multi-select)
    if (selectedSubcategories.length > 0) {
      const talentCategory = talent.category?.toLowerCase();
      const talentPromoCategories = talent.promoCategories || [];

      // Check if talent matches any selected subcategory
      const hasMatchingSubcategory = selectedSubcategories.some(sub => {
        // Direct category match
        if (talentCategory === sub.toLowerCase()) return true;
        // Check promo categories (for PROMO type)
        if (Array.isArray(talentPromoCategories)) {
          return talentPromoCategories.some((pc: string) =>
            pc.toLowerCase().includes(sub.toLowerCase())
          );
        }
        return false;
      });
      if (!hasMatchingSubcategory) return false;
    }

    // Specialty filter (for DETAILS - multi-select)
    if (selectedSpecialties.length > 0) {
      const talentSpecialties = talent.faceSpecialty || [];
      const hasMatchingSpecialty = selectedSpecialties.some(spec =>
        Array.isArray(talentSpecialties) && talentSpecialties.some((ts: string) =>
          ts.toLowerCase() === spec.toLowerCase()
        )
      );
      if (!hasMatchingSpecialty) return false;
    }

    // Gender filter (for models) - only if no subcategory is selected or if models type is selected
    if (selectedGender !== 'all') {
      if (talent.category !== selectedGender) {
        return false;
      }
    }

    // Eyes filter
    if (selectedEyes !== 'all' && (!talent.eyes || !talent.eyes.toLowerCase().includes(selectedEyes.toLowerCase()))) {
      return false;
    }

    // Hair filter
    if (selectedHair !== 'all' && (!talent.hair || !talent.hair.toLowerCase().includes(selectedHair.toLowerCase()))) {
      return false;
    }

    return true;
  });

  const getTalentUrl = (talent: any) => {
    return `/talent/${talent.slug}`;
  };

  const getTypeBadges = (talent: any) => {
    const types = talent.types || [talent.type];
    const typeLabels: Record<string, string> = {
      'MODELS': 'Models',
      'ACTING': 'Advertising',
      'PROMO': 'Promo',
      'DETAILS': 'Parts'
    };
    return types.map((t: string) => typeLabels[t] || t);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      <Navbar scrollDirection={scrollDirection} />
      <main className="explore-main" style={{
        minHeight: '100vh',
        backgroundColor: "black",
        paddingTop: '180px',
        paddingBottom: '80px'
      }}>

        {/* Search Bar */}
        <div className="explore-search" style={{
          maxWidth: '800px',
          margin: '0 auto 32px',
          padding: '0 40px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <input
              type="text"
              placeholder="Search by name..."
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

        {/* Main Type Filter - Multi-select chips */}
        <div className="explore-filters" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          padding: '0 20px'
        }}>
          {Object.entries(TALENT_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() => toggleType(key)}
              style={{
                background: selectedTypes.includes(key) ? 'white' : 'transparent',
                border: `1px solid ${selectedTypes.includes(key) ? 'white' : 'rgba(255, 255, 255, 0.3)'}`,
                color: selectedTypes.includes(key) ? 'black' : 'white',
                fontSize: '13px',
                fontWeight: selectedTypes.includes(key) ? 500 : 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '10px 20px',
                borderRadius: '25px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {category.label}
              {selectedTypes.includes(key) && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Subcategories - Show when types are selected */}
        {getActiveSubcategories().length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            padding: '0 20px'
          }}>
            {getActiveSubcategories().map((sub) => (
              <button
                key={sub.value}
                onClick={() => toggleSubcategory(sub.value)}
                style={{
                  background: selectedSubcategories.includes(sub.value)
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'transparent',
                  border: `1px solid ${selectedSubcategories.includes(sub.value)
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(255, 255, 255, 0.2)'}`,
                  color: selectedSubcategories.includes(sub.value)
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '12px',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  transition: 'all 0.2s ease'
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Specialties for DETAILS type */}
        {showSpecialties && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            padding: '0 20px'
          }}>
            <span style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginRight: '8px',
              alignSelf: 'center'
            }}>
              Specialties:
            </span>
            {TALENT_CATEGORIES.DETAILS.specialties.map((spec) => (
              <button
                key={spec.value}
                onClick={() => toggleSpecialty(spec.value)}
                style={{
                  background: selectedSpecialties.includes(spec.value)
                    ? 'rgba(255, 200, 150, 0.2)'
                    : 'transparent',
                  border: `1px solid ${selectedSpecialties.includes(spec.value)
                    ? 'rgba(255, 200, 150, 0.6)'
                    : 'rgba(255, 255, 255, 0.15)'}`,
                  color: selectedSpecialties.includes(spec.value)
                    ? 'rgba(255, 220, 180, 1)'
                    : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '11px',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: '15px',
                  transition: 'all 0.2s ease'
                }}
              >
                {spec.label}
              </button>
            ))}
          </div>
        )}

        {/* Toggle More Filters + Active filter count */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: 'none',
              border: 'none',
              color: showFilters ? 'white' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
              fontWeight: 300,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.3s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <circle cx="10" cy="12" r="2" fill="currentColor" />
              <circle cx="14" cy="18" r="2" fill="currentColor" />
            </svg>
            {showFilters ? 'Hide Filters' : 'More Filters'}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              style={{
                background: 'rgba(255, 100, 100, 0.1)',
                border: '1px solid rgba(255, 100, 100, 0.3)',
                color: 'rgba(255, 150, 150, 1)',
                fontSize: '12px',
                fontWeight: 400,
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div style={{
            maxWidth: '900px',
            margin: '0 auto 40px',
            padding: '28px 32px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px'
            }}>
              {/* Gender Filter */}
              <div>
                <label style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}>
                  Gender
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'woman', label: 'Women' },
                    { value: 'man', label: 'Men' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedGender(option.value)}
                      style={{
                        background: selectedGender === option.value
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'transparent',
                        border: `1px solid ${selectedGender === option.value
                          ? 'rgba(255, 255, 255, 0.4)'
                          : 'rgba(255, 255, 255, 0.15)'}`,
                        color: selectedGender === option.value
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eyes Filter */}
              <div>
                <label style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}>
                  Eye Color
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'blue', label: 'Blue' },
                    { value: 'green', label: 'Green' },
                    { value: 'brown', label: 'Brown' },
                    { value: 'hazel', label: 'Hazel' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedEyes(option.value)}
                      style={{
                        background: selectedEyes === option.value
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'transparent',
                        border: `1px solid ${selectedEyes === option.value
                          ? 'rgba(255, 255, 255, 0.4)'
                          : 'rgba(255, 255, 255, 0.15)'}`,
                        color: selectedEyes === option.value
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Filter */}
              <div>
                <label style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}>
                  Hair Color
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'blonde', label: 'Blonde' },
                    { value: 'brown', label: 'Brown' },
                    { value: 'black', label: 'Black' },
                    { value: 'red', label: 'Red' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedHair(option.value)}
                      style={{
                        background: selectedHair === option.value
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'transparent',
                        border: `1px solid ${selectedHair === option.value
                          ? 'rgba(255, 255, 255, 0.4)'
                          : 'rgba(255, 255, 255, 0.15)'}`,
                        color: selectedHair === option.value
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Talents Grid */}
        <div className="explore-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          padding: '0 40px',
          maxWidth: '1800px',
          margin: '0 auto'
        }}>
          {filteredTalents.map((talent) => (
            <Link
              key={talent.id}
              href={getTalentUrl(talent)}
              className="talent-card"
              style={{
                textDecoration: 'none'
              }}
              onMouseEnter={() => setHoveredTalentId(talent.id)}
              onMouseLeave={() => setHoveredTalentId(null)}
            >
              {/* Image Container - avec floutage si restreint */}
              <RestrictedContent
                isAuthenticated={isAuthenticated || authLoading || !isContentRestricted(talent)}
                blurAmount={12}
                message="Contenu réservé aux membres"
                showLoginButton={false}
              >
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
                      src={talent.mainImage || '/placeholder.jpg'}
                      alt={talent.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: `${talent.mainImagePositionX ?? 50}% ${talent.mainImagePositionY ?? 20}%`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: hoveredTalentId === talent.id ? 0 : 1,
                        transition: 'opacity 0.5s ease-in-out'
                      }}
                    />
                    {/* Hover Image */}
                    {talent.hoverImage && (
                      <img
                        src={talent.hoverImage}
                        alt={talent.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: `${talent.hoverImagePositionX ?? 50}% ${talent.hoverImagePositionY ?? 20}%`,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          opacity: hoveredTalentId === talent.id ? 1 : 0,
                          transition: 'opacity 0.5s ease-in-out'
                        }}
                      />
                    )}
                  </div>

                  {/* Type Badges */}
                  <div className="type-badges" style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap'
                  }}>
                    {getTypeBadges(talent).map((badge: string, index: number) => (
                      <span
                        key={index}
                        className="type-badge"
                        style={{
                          padding: '4px 10px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          borderRadius: '4px'
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </RestrictedContent>

              {/* Talent Name & Info Below Image */}
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
                  opacity: hoveredTalentId === talent.id ? 0.6 : 1
                }}>
                  {talent.name}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '12px',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  margin: 0
                }}>
                  {talent.height && `${talent.height}`}
                  {talent.eyes && ` · ${talent.eyes} eyes`}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results Message */}
        {filteredTalents.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '18px',
            fontWeight: 300
          }}>
            No talents found matching your criteria
          </div>
        )}
      </main>
    </>
  );
}
