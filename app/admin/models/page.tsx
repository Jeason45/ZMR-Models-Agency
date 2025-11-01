'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { getAllModels, urlFor } from '@/lib/sanity';

export default function AdminModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [selectedModel, setSelectedModel] = useState<any>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const data = await getAllModels();
      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = models
    .filter(m => filter === 'all' || m.category === filter)
    .filter(m => searchTerm === '' || m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Sort by recent (_createdAt or _updatedAt from Sanity)
      return new Date(b._createdAt || b._updatedAt || 0).getTime() -
             new Date(a._createdAt || a._updatedAt || 0).getTime();
    });

  const getStats = () => {
    const women = models.filter(m => m.category === 'Woman').length;
    const men = models.filter(m => m.category === 'Man').length;
    return { total: models.length, women, men };
  };

  const stats = getStats();

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
                Gestion des Modèles
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b'
              }}>
                Gérez votre portfolio de mannequins
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
              + Ajouter un modèle
            </a>
          </div>

          {/* Statistics Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
                TOTAL MODÈLES
              </p>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>
                {stats.total}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
                FEMMES
              </p>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#db2777' }}>
                {stats.women}
              </p>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
                HOMMES
              </p>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#1e40af' }}>
                {stats.men}
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
                placeholder="Rechercher un modèle..."
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
              {['all', 'Woman', 'Man'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: filter === category ? '#6366f1' : 'transparent',
                    color: filter === category ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {category === 'all' ? 'Tous' : category === 'Woman' ? 'Femmes' : 'Hommes'}
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

        {/* Models Grid */}
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
            {filteredModels.map((model) => (
              <div
                key={model._id}
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
                {model.profileImage && (
                  <div style={{
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9'
                  }}>
                    <img
                      src={urlFor(model.profileImage).width(400).height(500).url()}
                      alt={model.name}
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
                    {model.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: model.category === 'Woman' ? '#fce7f3' : '#dbeafe',
                      color: model.category === 'Woman' ? '#db2777' : '#1e40af',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '6px'
                    }}>
                      {model.category}
                    </span>
                  </div>

                  {model.measurements && (
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      marginBottom: '4px'
                    }}>
                      {model.measurements.height && `${model.measurements.height}cm`}
                      {model.measurements.bust && ` • ${model.measurements.bust}`}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px'
                  }}>
                    <button
                      onClick={() => setSelectedModel(model)}
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
                      href={`/models/${model.slug?.current}`}
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
                      href={`/studio/desk/model;${model._id}`}
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
            ))}
          </div>
        )}

        {!loading && filteredModels.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📋</p>
            <p style={{ fontSize: '16px', color: '#64748b', fontWeight: 500 }}>
              Aucun modèle trouvé
            </p>
          </div>
        )}

        {/* Model Detail Modal */}
        {selectedModel && (
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
            onClick={() => setSelectedModel(null)}
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
                  {selectedModel.name}
                </h3>
                <button
                  onClick={() => setSelectedModel(null)}
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
                  {selectedModel.profileImage && (
                    <img
                      src={urlFor(selectedModel.profileImage).width(600).height(800).url()}
                      alt={selectedModel.name}
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
                      CATÉGORIE
                    </p>
                    <span style={{
                      padding: '6px 14px',
                      backgroundColor: selectedModel.category === 'Woman' ? '#fce7f3' : '#dbeafe',
                      color: selectedModel.category === 'Woman' ? '#db2777' : '#1e40af',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>
                      {selectedModel.category}
                    </span>
                  </div>

                  {selectedModel.measurements && (
                    <>
                      {selectedModel.measurements.height && (
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
                            {selectedModel.measurements.height} cm
                          </p>
                        </div>
                      )}

                      {selectedModel.measurements.bust && (
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
                            {selectedModel.measurements.bust}
                            {selectedModel.measurements.waist && ` - ${selectedModel.measurements.waist}`}
                            {selectedModel.measurements.hips && ` - ${selectedModel.measurements.hips}`}
                          </p>
                        </div>
                      )}

                      {selectedModel.measurements.shoeSize && (
                        <div style={{ marginBottom: '20px' }}>
                          <p style={{
                            fontSize: '13px',
                            color: '#94a3b8',
                            fontWeight: 500,
                            marginBottom: '8px'
                          }}>
                            POINTURE
                          </p>
                          <p style={{
                            fontSize: '16px',
                            color: '#0f172a',
                            fontWeight: 500
                          }}>
                            {selectedModel.measurements.shoeSize}
                          </p>
                        </div>
                      )}

                      {selectedModel.measurements.hairColor && (
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
                            {selectedModel.measurements.hairColor}
                          </p>
                        </div>
                      )}

                      {selectedModel.measurements.eyeColor && (
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
                            {selectedModel.measurements.eyeColor}
                          </p>
                        </div>
                      )}
                    </>
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
                      href={`/models/${selectedModel.slug?.current}`}
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
                      href={`/studio/desk/model;${selectedModel._id}`}
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
