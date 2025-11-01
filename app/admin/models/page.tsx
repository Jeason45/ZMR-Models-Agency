'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { getAllTalents, urlFor } from '@/lib/sanity';

type TalentCategory = 'all' | 'models' | 'acting' | 'promo' | 'details';
type TalentStatus = 'all' | 'active' | 'inactive' | 'archived';

export default function AdminModelsPage() {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<TalentCategory>('all');
  const [statusFilter, setStatusFilter] = useState<TalentStatus>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [selectedTalent, setSelectedTalent] = useState<any>(null);

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      const data = await getAllTalents();
      setTalents(data);
    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTalents = talents
    .filter(t => categoryFilter === 'all' || t.talentCategory === categoryFilter)
    .filter(t => statusFilter === 'all' || (t.status || 'active') === statusFilter)
    .filter(t => searchTerm === '' || t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b._createdAt || b._updatedAt || 0).getTime() -
             new Date(a._createdAt || a._updatedAt || 0).getTime();
    });

  const getStats = () => {
    const modelsCount = talents.filter(t => t.talentCategory === 'models').length;
    const actingCount = talents.filter(t => t.talentCategory === 'acting').length;
    const promoCount = talents.filter(t => t.talentCategory === 'promo').length;
    const detailsCount = talents.filter(t => t.talentCategory === 'details').length;

    return {
      total: talents.length,
      models: modelsCount,
      acting: actingCount,
      promo: promoCount,
      details: detailsCount
    };
  };

  const stats = getStats();

  const getTalentBadgeColor = (talentCategory: string) => {
    switch (talentCategory) {
      case 'models':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'acting':
        return { bg: '#fce7f3', color: '#db2777' };
      case 'promo':
        return { bg: '#f3e8ff', color: '#9333ea' };
      case 'details':
        return { bg: '#d1fae5', color: '#059669' };
      default:
        return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  const getTalentLabel = (talentCategory: string) => {
    switch (talentCategory) {
      case 'models':
        return 'Mannequins';
      case 'acting':
        return 'Comédiens';
      case 'promo':
        return 'Promo';
      case 'details':
        return 'Détails';
      default:
        return talentCategory;
    }
  };

  const getTalentUrl = (talent: any) => {
    return `/${talent.talentCategory}/${talent.slug}`;
  };

  const getStudioUrl = (talent: any) => {
    return `/studio/desk/${talent._type};${talent._id}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Actif', bg: '#d1fae5', color: '#059669' };
      case 'inactive':
        return { label: 'Inactif', bg: '#fee2e2', color: '#dc2626' };
      case 'archived':
        return { label: 'Archivé', bg: '#f1f5f9', color: '#64748b' };
      default:
        return { label: 'Actif', bg: '#d1fae5', color: '#059669' };
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <AdminSidebar />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '280px',
        padding: '40px'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                Gestion des Talents
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b'
              }}>
                Gérez tous vos talents : mannequins, comédiens, promo & détails
              </p>
            </div>

            <a
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: 'white',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
            >
              + Ajouter un talent
            </a>
          </div>

          {/* Statistics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>
                {stats.total}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mannequins
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#1e40af' }}>
                {stats.models}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Comédiens
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#db2777' }}>
                {stats.acting}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Promo
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#9333ea' }}>
                {stats.promo}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Détails
              </p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#059669' }}>
                {stats.details}
              </p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Rechercher un talent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Category Filters */}
            <div style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: 'white',
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              {[
                { value: 'all', label: 'Tous' },
                { value: 'models', label: 'Mannequins' },
                { value: 'acting', label: 'Comédiens' },
                { value: 'promo', label: 'Promo' },
                { value: 'details', label: 'Détails' }
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setCategoryFilter(category.value as TalentCategory)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: categoryFilter === category.value ? '#6366f1' : 'transparent',
                    color: categoryFilter === category.value ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: 'white',
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              {[
                { value: 'active', label: 'Actifs' },
                { value: 'inactive', label: 'Inactifs' },
                { value: 'archived', label: 'Archivés' },
                { value: 'all', label: 'Tous statuts' }
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value as TalentStatus)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: statusFilter === status.value ? '#10b981' : 'transparent',
                    color: statusFilter === status.value ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'name')}
              style={{
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: 'white',
                color: '#64748b',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="recent">Plus récents</option>
              <option value="name">Nom (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Talents Grid */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#64748b'
          }}>
            Chargement...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {filteredTalents.map((talent) => {
              const badgeColor = getTalentBadgeColor(talent.talentCategory);

              return (
                <div
                  key={talent._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Image */}
                  {talent.mainImage && (
                    <div style={{
                      width: '100%',
                      height: '300px',
                      overflow: 'hidden',
                      backgroundColor: '#f1f5f9'
                    }}>
                      <img
                        src={typeof talent.mainImage === 'string' ? talent.mainImage : urlFor(talent.mainImage).width(400).height(500).url()}
                        alt={talent.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px'
                    }}>
                      {talent.name}
                    </h3>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: badgeColor.bg,
                        color: badgeColor.color,
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px'
                      }}>
                        {getTalentLabel(talent.talentCategory)}
                      </span>
                      {talent.category && (
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '6px'
                        }}>
                          {talent.category}
                        </span>
                      )}
                      {talent.categories && (
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '6px'
                        }}>
                          {Array.isArray(talent.categories) ? talent.categories[0] : talent.categories}
                        </span>
                      )}
                      <span style={{
                        padding: '4px 12px',
                        backgroundColor: getStatusBadge(talent.status || 'active').bg,
                        color: getStatusBadge(talent.status || 'active').color,
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '6px'
                      }}>
                        {getStatusBadge(talent.status || 'active').label}
                      </span>
                    </div>

                    {talent.height && (
                      <p style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        {talent.height}
                        {talent.bust && ` • ${talent.bust}`}
                      </p>
                    )}

                    {talent.ageRange && (
                      <p style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        {talent.ageRange}
                      </p>
                    )}

                    {talent.instagramFollowers && (
                      <p style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        📸 {talent.instagramFollowers} followers
                      </p>
                    )}

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '12px'
                    }}>
                      <button
                        onClick={() => setSelectedTalent(talent)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: '#f1f5f9',
                          color: '#64748b',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Détails
                      </button>
                      <a
                        href={getTalentUrl(talent)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'block'
                        }}
                      >
                        Voir
                      </a>
                      <a
                        href={getStudioUrl(talent)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'block'
                        }}
                      >
                        Modifier
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredTalents.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📋</p>
            <p style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>
              Aucun talent trouvé
            </p>
          </div>
        )}

        {/* Talent Detail Modal */}
        {selectedTalent && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setSelectedTalent(null)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0f172a'
                }}>
                  {selectedTalent.name}
                </h3>
                <button
                  onClick={() => setSelectedTalent(null)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '32px',
                padding: '32px'
              }}>
                {/* Left: Image */}
                <div>
                  {selectedTalent.mainImage && (
                    <img
                      src={typeof selectedTalent.mainImage === 'string' ? selectedTalent.mainImage : urlFor(selectedTalent.mainImage).width(600).height(800).url()}
                      alt={selectedTalent.name}
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                </div>

                {/* Right: Details */}
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{
                      fontSize: '13px',
                      color: '#94a3b8',
                      fontWeight: 500,
                      marginBottom: '8px'
                    }}>
                      TYPE
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '6px 14px',
                        backgroundColor: getTalentBadgeColor(selectedTalent.talentCategory).bg,
                        color: getTalentBadgeColor(selectedTalent.talentCategory).color,
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}>
                        {getTalentLabel(selectedTalent.talentCategory)}
                      </span>
                      <span style={{
                        padding: '6px 14px',
                        backgroundColor: getStatusBadge(selectedTalent.status || 'active').bg,
                        color: getStatusBadge(selectedTalent.status || 'active').color,
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}>
                        {getStatusBadge(selectedTalent.status || 'active').label}
                      </span>
                    </div>
                  </div>

                  {selectedTalent.category && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        CATÉGORIE
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.category}
                      </p>
                    </div>
                  )}

                  {selectedTalent.categories && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        CATÉGORIES
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {Array.isArray(selectedTalent.categories) ? selectedTalent.categories.join(', ') : selectedTalent.categories}
                      </p>
                    </div>
                  )}

                  {selectedTalent.height && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        TAILLE
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.height}
                      </p>
                    </div>
                  )}

                  {selectedTalent.bust && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        MENSURATIONS
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.bust}
                        {selectedTalent.waist && ` - ${selectedTalent.waist}`}
                        {selectedTalent.hips && ` - ${selectedTalent.hips}`}
                      </p>
                    </div>
                  )}

                  {selectedTalent.ageRange && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        ÂGE
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.ageRange}
                      </p>
                    </div>
                  )}

                  {selectedTalent.languages && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        LANGUES
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.languages}
                      </p>
                    </div>
                  )}

                  {selectedTalent.skills && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        COMPÉTENCES
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.skills}
                      </p>
                    </div>
                  )}

                  {selectedTalent.instagramFollowers && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        INSTAGRAM
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.instagramFollowers} followers
                      </p>
                    </div>
                  )}

                  {selectedTalent.tiktokFollowers && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        TIKTOK
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.tiktokFollowers} followers
                      </p>
                    </div>
                  )}

                  {selectedTalent.eyes && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        YEUX
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.eyes}
                      </p>
                    </div>
                  )}

                  {selectedTalent.hair && (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: '8px'
                      }}>
                        CHEVEUX
                      </p>
                      <p style={{
                        fontSize: '16px',
                        color: '#0f172a',
                        fontWeight: 500
                      }}>
                        {selectedTalent.hair}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <a
                      href={getTalentUrl(selectedTalent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      Voir sur le site
                    </a>
                    <a
                      href={getStudioUrl(selectedTalent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      Modifier
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
