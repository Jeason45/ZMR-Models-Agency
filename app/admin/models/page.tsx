'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { getAllModels, urlFor } from '@/lib/sanity';

export default function AdminModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filteredModels = filter === 'all'
    ? models
    : models.filter(m => m.category === filter);

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
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
              {filteredModels.length} modèle{filteredModels.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Filters */}
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
                  transition: 'all 0.3s',
                  cursor: 'pointer'
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
                    <a
                      href={`/models/${model.slug?.current}`}
                      target="_blank"
                      rel="noopener noreferrer"
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
      </div>
    </div>
  );
}
