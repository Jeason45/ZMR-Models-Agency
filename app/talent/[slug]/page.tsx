'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useMemberAuth } from '@/hooks/useMemberAuth';
import RestrictedContent from '@/components/RestrictedContent';
import MemberIcon from '@/components/MemberIcon';

// Styles responsive - plein écran sur desktop, compact sur mobile
const responsiveStyles = `
  /* ===== STYLES PETITS ÉCRANS DESKTOP (13" et moins) ===== */
  @media (max-width: 1400px) {
    .navbar-logo h1 {
      font-size: clamp(24px, 5vw, 60px) !important;
    }
    .navbar-logo p {
      font-size: clamp(7px, 0.9vw, 10px) !important;
      margin-top: 6px !important;
    }
    .section-hero .hero-content {
      bottom: 30px !important;
    }
    .section-hero h1 {
      font-size: clamp(24px, 4vw, 50px) !important;
    }
    .shows-social-grid {
      gap: 20px !important;
      margin-top: 20px !important;
    }
  }

  /* ===== STYLES MOBILE ===== */
  @media (max-width: 768px) {
    .measurements-section {
      padding: 10px 8px !important;
    }
    .measurements-section .type-badges {
      gap: 4px !important;
      margin-bottom: 8px !important;
    }
    .measurements-section .type-badge {
      padding: 2px 8px !important;
      font-size: 7px !important;
    }
    .measurements-section .measurements-list {
      gap: 4px 8px !important;
      font-size: 8px !important;
    }
    .measurements-section .measurements-list > div {
      white-space: nowrap !important;
    }
    .measurements-section .extra-info {
      margin-top: 6px !important;
      font-size: 8px !important;
    }
    .measurements-section .extra-info span {
      font-size: 8px !important;
    }

    .section-hero {
      height: 50vh !important;
      min-height: 300px !important;
    }
    .section-portfolio {
      height: 40vh !important;
      min-height: 220px !important;
    }
    .section-shows-social {
      height: 35vh !important;
      min-height: 180px !important;
    }
    .section-showreel {
      padding: 24px 12px !important;
    }
    .section-showreel h2 {
      margin-bottom: 20px !important;
    }
    .section-work {
      padding: 20px 12px !important;
    }
    .section-work h2 {
      margin-bottom: 16px !important;
    }

    .shows-social-grid {
      gap: 12px !important;
      padding: 0 12px !important;
      margin-top: 16px !important;
    }

    .section-shows-social h2 {
      font-size: clamp(16px, 4vw, 28px) !important;
    }
    .section-shows-social span,
    .section-shows-social a {
      font-size: 8px !important;
      margin-top: 8px !important;
    }
    .section-shows-social .card-content {
      bottom: 20px !important;
    }

    .section-portfolio h2 {
      font-size: clamp(18px, 5vw, 32px) !important;
    }
    .section-portfolio a {
      font-size: 8px !important;
      margin-top: 8px !important;
    }
    .section-portfolio .card-content {
      bottom: 20px !important;
    }

    .section-hero .hero-content {
      bottom: 20px !important;
    }
    .section-hero h1 {
      font-size: clamp(20px, 5vw, 40px) !important;
      margin-bottom: 12px !important;
    }
    .section-hero .hero-nav {
      gap: 12px !important;
    }
    .section-hero .hero-nav a {
      font-size: 9px !important;
    }
  }
`;

// Types pour les expériences unifiées
interface Experience {
  id: string;
  title: string;
  type: 'show' | 'credit' | 'collab' | 'campaign';
  description?: string;
  brand?: string;
  role?: string;
  year?: string;
  images: string[];
  video?: string;
  order: number;
}

// Labels pour les badges de type d'expérience
const EXPERIENCE_TYPE_LABELS: Record<string, string> = {
  show: 'SHOW',
  credit: 'CREDIT',
  collab: 'COLLAB',
  campaign: 'CAMPAIGN'
};

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

// Composant pour afficher les mensurations adaptées au type
function MeasurementsSection({ talent }: { talent: any }) {
  const types = talent.types || [talent.type];

  // Mensurations communes
  const commonMeasurements = [
    { key: 'height', label: 'HEIGHT' },
    { key: 'eyes', label: 'EYES' },
    { key: 'hair', label: 'HAIR' },
  ];

  // Mensurations MODELS
  const modelMeasurements = [
    { key: 'neck', label: 'NECK' },
    { key: 'bust', label: 'BUST' },
    { key: 'chest', label: 'CHEST' },
    { key: 'waist', label: 'WAIST' },
    { key: 'hips', label: 'HIPS' },
    { key: 'suit', label: 'SUIT' },
    { key: 'inseam', label: 'INSEAM' },
    { key: 'shoes', label: 'SHOE' },
  ];

  // Mensurations DETAILS (Parts Models)
  const detailsMeasurements = [
    { key: 'handSize', label: 'HAND SIZE' },
    { key: 'ringSize', label: 'RING SIZE' },
    { key: 'wristSize', label: 'WRIST SIZE' },
    { key: 'footSize', label: 'FOOT SIZE' },
    { key: 'legLength', label: 'LEG LENGTH' },
    { key: 'neckSize', label: 'NECK SIZE' },
    { key: 'skinTone', label: 'SKIN TONE' },
  ];

  // Infos ACTING
  const actingInfo = [
    { key: 'ageRange', label: 'AGE RANGE' },
  ];

  // Infos PROMO
  const promoInfo = [
    { key: 'instagramFollowers', label: 'INSTAGRAM', formatter: (v: number) => v ? `${(v/1000).toFixed(0)}K` : null },
    { key: 'tiktokFollowers', label: 'TIKTOK', formatter: (v: number) => v ? `${(v/1000).toFixed(0)}K` : null },
  ];

  // Construire la liste des mesures à afficher
  const measurementsToShow: { key: string; label: string; formatter?: (v: any) => string | null }[] = [...commonMeasurements];

  if (types.includes('MODELS')) {
    measurementsToShow.push(...modelMeasurements);
  }
  if (types.includes('DETAILS')) {
    measurementsToShow.push(...detailsMeasurements);
  }
  if (types.includes('ACTING')) {
    measurementsToShow.push(...actingInfo);
  }
  if (types.includes('PROMO')) {
    measurementsToShow.push(...promoInfo);
  }

  // Filtrer celles qui ont une valeur
  const visibleMeasurements = measurementsToShow.filter(m => {
    const value = talent[m.key];
    if (m.formatter) {
      return m.formatter(value) !== null;
    }
    return value;
  });

  if (visibleMeasurements.length === 0) return null;

  return (
    <div className="measurements-section" style={{
      padding: '10px 40px',
      textAlign: 'center',
      borderBottom: '1px solid #222'
    }}>
      {/* Type badges */}
      <div className="type-badges" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {types.map((type: string) => (
          <span
            key={type}
            className="type-badge"
            style={{
              padding: '6px 16px',
              border: '1px solid #444',
              borderRadius: '20px',
              fontSize: '11px',
              color: '#999',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            {type === 'MODELS' ? 'Model' : type === 'ACTING' ? 'Actor' : type === 'PROMO' ? 'Promo' : type === 'DETAILS' ? 'Parts Model' : type}
          </span>
        ))}
      </div>

      {/* Measurements */}
      <div className="measurements-list" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap',
        fontSize: '13px',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        {visibleMeasurements.map(m => {
          const value = talent[m.key];
          const displayValue = m.formatter ? m.formatter(value) : value;
          return (
            <div key={m.key}>
              <span style={{ color: '#999' }}>{m.label}</span> {displayValue}
            </div>
          );
        })}
      </div>

      {/* Languages & Skills for ACTING */}
      {types.includes('ACTING') && (
        <div className="extra-info" style={{ marginTop: '20px' }}>
          {talent.languages && talent.languages.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#999', fontSize: '12px', letterSpacing: '0.1em' }}>LANGUAGES: </span>
              <span style={{ color: 'white', fontSize: '13px' }}>{talent.languages.join(', ')}</span>
            </div>
          )}
          {talent.skills && talent.skills.length > 0 && (
            <div>
              <span style={{ color: '#999', fontSize: '12px', letterSpacing: '0.1em' }}>SKILLS: </span>
              <span style={{ color: 'white', fontSize: '13px' }}>{talent.skills.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Face Specialties for DETAILS */}
      {types.includes('DETAILS') && talent.faceSpecialty && talent.faceSpecialty.length > 0 && (
        <div className="extra-info" style={{ marginTop: '20px' }}>
          <span style={{ color: '#999', fontSize: '12px', letterSpacing: '0.1em' }}>SPECIALTIES: </span>
          <span style={{ color: 'white', fontSize: '13px', textTransform: 'capitalize' }}>
            {talent.faceSpecialty.join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}

// Composant Work Section avec expériences unifiées
function WorkSection({ experiences }: { experiences: Experience[] }) {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  if (!experiences || experiences.length === 0) return null;

  // Trier par ordre
  const sortedExperiences = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <div className="section-work" style={{ padding: '40px' }}>
      <h2 style={{
        color: 'white',
        fontSize: 'clamp(22px, 3.5vw, 50px)',
        fontWeight: 900,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        margin: 0,
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        EXPERIENCE
      </h2>

      {/* Liste des expériences */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {sortedExperiences.map((exp) => (
          <div
            key={exp.id}
            onClick={() => setSelectedExperience(exp)}
            style={{
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '4px',
              backgroundColor: '#111',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Image ou placeholder */}
            <div style={{
              aspectRatio: '4/3',
              backgroundColor: '#222',
              backgroundImage: exp.images?.[0] ? `url(${exp.images[0]})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {/* Badge de type */}
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '4px 10px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#000',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                borderRadius: '2px'
              }}>
                {EXPERIENCE_TYPE_LABELS[exp.type] || exp.type.toUpperCase()}
              </span>

              {/* Video indicator */}
              {exp.video && (
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '10px',
                  borderRadius: '2px'
                }}>
                  VIDEO
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px' }}>
              <h3 style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 500,
                margin: 0,
                marginBottom: '4px'
              }}>
                {exp.title}
              </h3>
              {exp.brand && (
                <p style={{ color: '#999', fontSize: '13px', margin: 0, marginBottom: '4px' }}>
                  {exp.brand}
                </p>
              )}
              {exp.role && (
                <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
                  {exp.role}
                </p>
              )}
              {exp.year && (
                <p style={{ color: '#555', fontSize: '11px', margin: 0, marginTop: '8px' }}>
                  {exp.year}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour détail d'une expérience */}
      {selectedExperience && (
        <div
          onClick={() => setSelectedExperience(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#111',
              borderRadius: '8px',
              padding: '40px'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedExperience(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>

            {/* Badge */}
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: 'white',
              color: '#000',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              borderRadius: '2px',
              marginBottom: '16px'
            }}>
              {EXPERIENCE_TYPE_LABELS[selectedExperience.type]}
            </span>

            <h2 style={{
              color: 'white',
              fontSize: '32px',
              fontWeight: 600,
              margin: 0,
              marginBottom: '8px'
            }}>
              {selectedExperience.title}
            </h2>

            {selectedExperience.brand && (
              <p style={{ color: '#999', fontSize: '18px', margin: 0, marginBottom: '4px' }}>
                {selectedExperience.brand}
              </p>
            )}

            {selectedExperience.role && (
              <p style={{ color: '#666', fontSize: '14px', margin: 0, marginBottom: '4px' }}>
                Role: {selectedExperience.role}
              </p>
            )}

            {selectedExperience.year && (
              <p style={{ color: '#555', fontSize: '13px', margin: 0, marginBottom: '24px' }}>
                {selectedExperience.year}
              </p>
            )}

            {selectedExperience.description && (
              <p style={{ color: '#ccc', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedExperience.description}
              </p>
            )}

            {/* Video */}
            {selectedExperience.video && (
              <div style={{ marginBottom: '24px' }}>
                <video
                  controls
                  style={{ width: '100%', borderRadius: '4px' }}
                >
                  <source src={selectedExperience.video} type="video/mp4" />
                </video>
              </div>
            )}

            {/* Gallery */}
            {selectedExperience.images && selectedExperience.images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                {selectedExperience.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selectedExperience.title} ${idx + 1}`}
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TalentDetailPage() {
  const params = useParams();
  const talentSlug = params.slug as string;
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const { isAuthenticated } = useMemberAuth();

  // Helper pour vérifier si le contenu est restreint
  const isContentRestricted = () => {
    if (!talent) return false;
    const restrictedCategories = ['hands', 'feet'];
    return restrictedCategories.includes(talent.category?.toLowerCase()) || talent.hasRestrictedContent;
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
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  // Fetch talent from API
  useEffect(() => {
    async function fetchTalent() {
      try {
        // Essayer de récupérer depuis l'API Prisma
        const response = await fetch('/api/talents?status=active');
        if (response.ok) {
          const talents = await response.json();
          const foundTalent = talents.find((t: any) => t.slug === talentSlug);

          if (foundTalent) {
            setTalent(foundTalent);
            setLoading(false);
            return;
          }
        }

        // Pas trouvé
        setTalent(null);
      } catch (error) {
        console.error('Error fetching talent:', error);
        setTalent(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTalent();
  }, [talentSlug]);

  // Lien de retour vers la page All Models
  const getBackLink = () => {
    return '/explore';
  };

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

  if (!talent) {
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
          <h1>Talent not found</h1>
          <Link href="/explore" style={{ color: 'white', marginTop: '20px', display: 'inline-block' }}>
            &larr; Back to All Models
          </Link>
        </div>
      </main>
    );
  }

  const types = talent.types || [talent.type];
  const experiences: Experience[] = talent.experiences || [];

  // Déterminer si les sections existent (pour tous les types qui ont les images/vidéos)
  const hasShows = talent.showsImage || talent.showsVideo;
  const hasSocial = talent.instagramImage || talent.socialImage || talent.instagramUrl;

  // Construire les liens de navigation du hero - toujours PORTFOLIO en premier
  const heroNavLinks = [
    { href: '#portfolio', label: 'PORTFOLIO' },
  ];
  if (hasShows) {
    heroNavLinks.push({ href: '#shows', label: 'SHOWS' });
  }
  if (hasSocial) {
    heroNavLinks.push({ href: '#social', label: 'INSTAGRAM' });
  }
  if (experiences.length > 0) {
    heroNavLinks.push({ href: '#experience', label: 'EXPERIENCE' });
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
      <Navbar scrollDirection={scrollDirection} />

      {/* Back Arrow */}
      <Link
        href={getBackLink()}
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
        &larr;
      </Link>

      <main style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        paddingTop: '0'
      }}>
        {/* 1. Hero Section - Video or Image (Full Width) */}
        <RestrictedContent
          isAuthenticated={isAuthenticated || !isContentRestricted()}
          blurAmount={15}
          overlayOpacity={0.75}
          message="Contenu exclusif - Connectez-vous pour voir ce profil"
          showLoginButton={true}
          style={{
            width: '100%',
            height: '100vh'
          }}
        >
          <div className="section-hero" style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
          }}>
            {talent.heroVideo ? (
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
                <source src={talent.heroVideo} type="video/mp4" />
              </video>
            ) : (
              <img
                src={talent.heroImage || talent.mainImage}
                alt={talent.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: talent.imagePositions?.heroImage
                    ? `${talent.imagePositions.heroImage.x}% ${talent.imagePositions.heroImage.y}%`
                    : 'center center'
                }}
              />
            )}
          <div className="hero-content" style={{
            position: 'absolute',
            bottom: 'clamp(30px, 5vh, 60px)',
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h1 style={{
              color: 'white',
              fontSize: 'clamp(24px, 4vw, 60px)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              textAlign: 'center',
              margin: 0,
              marginBottom: 'clamp(15px, 2.5vh, 30px)',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}>
              {talent.name}
            </h1>
            {/* Navigation Links */}
            <div className="hero-nav" style={{
              display: 'flex',
              gap: 'clamp(15px, 2.5vw, 30px)',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {heroNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    color: 'white',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderBottom: '1px solid transparent',
                    paddingBottom: '4px',
                    transition: 'border-color 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderBottomColor = 'white'}
                  onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          </div>
        </RestrictedContent>

        {/* 2. Measurements Section (Full Width) - Adapté selon les types */}
        <MeasurementsSection talent={talent} />

        {/* 3. Portfolio Section (Full Width) - TOUJOURS affiché avec fallback */}
        <RestrictedContent
          isAuthenticated={isAuthenticated || !isContentRestricted()}
          blurAmount={15}
          overlayOpacity={0.75}
          message="Galerie Portfolio exclusive - Connectez-vous pour y accéder"
          showLoginButton={true}
          style={{
            width: '100%',
            height: '100vh'
          }}
        >
          <div id="portfolio" className="section-portfolio" style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <img
              src={talent.portfolioImage || talent.hoverImage || talent.mainImage}
              alt="Portfolio"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: talent.imagePositions?.portfolioImage
                  ? `${talent.imagePositions.portfolioImage.x}% ${talent.imagePositions.portfolioImage.y}%`
                  : 'center center'
              }}
            />
            <div className="card-content" style={{
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
                fontSize: 'clamp(24px, 4vw, 60px)',
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: 0,
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
              }}>
                PORTFOLIO
              </h2>
              <Link
                href={`/talent/${talent.slug}/portfolio`}
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
            </div>
          </div>
        </RestrictedContent>

        {/* 4. Shows + Social - Côte à côte */}
        {(hasShows || hasSocial) && (
          <div className="shows-social-grid" style={{
            display: 'grid',
            gridTemplateColumns: hasShows && hasSocial ? '1fr 1fr' : '1fr',
            gap: '40px',
            marginTop: '40px',
            padding: '0'
          }}>
            {/* SHOWS Zone (Left) */}
            {hasShows && (
              <div id="shows" className="section-shows-social" style={{
                position: 'relative',
                height: '100vh',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                {talent.showsVideo ? (
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
                    <source src={talent.showsVideo} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={talent.showsImage}
                    alt="Shows"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: talent.imagePositions?.showsImage
                        ? `${talent.imagePositions.showsImage.x}% ${talent.imagePositions.showsImage.y}%`
                        : 'center center'
                    }}
                  />
                )}
                <div className="card-content" style={{
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
                    fontSize: 'clamp(22px, 3.5vw, 50px)',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    margin: 0,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    SHOWS
                  </h2>
                  <span
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      marginTop: '20px',
                      textDecoration: 'none',
                      borderBottom: '1px solid white',
                      paddingBottom: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    VIEW SHOWS
                  </span>
                </div>
              </div>
            )}

            {/* SOCIAL Zone (Right) */}
            {hasSocial && (
              <div id="social" className="section-shows-social" style={{
                position: 'relative',
                height: '100vh',
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                <img
                  src={talent.instagramImage || talent.socialImage || talent.mainImage}
                  alt="Social"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: talent.imagePositions?.instagramImage
                      ? `${talent.imagePositions.instagramImage.x}% ${talent.imagePositions.instagramImage.y}%`
                      : talent.imagePositions?.socialImage
                        ? `${talent.imagePositions.socialImage.x}% ${talent.imagePositions.socialImage.y}%`
                        : 'center center'
                  }}
                />
                <div className="card-content" style={{
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
                    fontSize: 'clamp(22px, 3.5vw, 50px)',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    margin: 0,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    SOCIAL
                  </h2>
                  {talent.instagramUrl && (
                    <a
                      href={talent.instagramUrl}
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
                  )}
                  {talent.tiktokUrl && (
                    <a
                      href={talent.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginTop: '12px',
                        textDecoration: 'none',
                        borderBottom: '1px solid white',
                        paddingBottom: '4px'
                      }}
                    >
                      VIEW TIKTOK
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Experience Section - Pleine largeur en dessous */}
        {experiences.length > 0 && (
          <div id="experience" style={{
            marginTop: '40px',
            backgroundColor: '#0a0a0a'
          }}>
            <WorkSection experiences={experiences} />
          </div>
        )}

        {/* Showreel Section pour ACTING */}
        {types.includes('ACTING') && talent.showreelVideo && (
          <div className="section-showreel" style={{
            padding: '60px 40px',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: 'clamp(22px, 3.5vw, 50px)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '40px'
            }}>
              SHOWREEL
            </h2>
            <video
              controls
              style={{
                maxWidth: '900px',
                width: '100%',
                borderRadius: '4px'
              }}
              poster={talent.showreelImage}
            >
              <source src={talent.showreelVideo} type="video/mp4" />
            </video>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}
