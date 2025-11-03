'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useSidebar } from '@/components/SidebarContext';
import ImageUpload from '@/components/ImageUpload';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags?: string[];
  author: string;
  published: boolean;
  publishedAt: string | null;
  readTime: number | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

const categories = ['Actualités', 'Success Stories', 'Conseils', 'Behind-the-Scenes', 'Industrie'];

export default function AdminBlogPage() {
  const { sidebarWidth } = useSidebar();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Actualités',
    tags: '',
    author: 'ZMR Models Agency',
    published: false,
    readTime: null as number | null,
    metaTitle: '',
    metaDescription: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blog?published=all');
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'published') return post.published;
    if (filter === 'draft') return !post.published;
    return true;
  });

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Actualités',
      tags: '',
      author: 'ZMR Models Agency',
      published: false,
      readTime: null,
      metaTitle: '',
      metaDescription: ''
    });
    setShowModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      tags: post.tags ? post.tags.join(', ') : '',
      author: post.author,
      published: post.published,
      readTime: post.readTime,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de l'image
    if (!formData.coverImage) {
      alert('Veuillez sélectionner une image de couverture');
      return;
    }

    setSaving(true);

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const payload = {
        ...formData,
        tags: tagsArray,
        readTime: formData.readTime ? parseInt(formData.readTime.toString()) : null
      };

      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        fetchPosts();
      } else {
        const error = await response.json();
        alert(error.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non publié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f1f5f9'
    }}>
      <AdminSidebar />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: `${sidebarWidth}px`,
        padding: '32px 40px',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}>
              Blog
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 400
            }}>
              Gérez les articles du blog
            </p>
          </div>
          <button
            onClick={openCreateModal}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvel article
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Total Articles
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f172a'
            }}>
              {posts.length}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Publiés
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#10b981'
            }}>
              {posts.filter(p => p.published).length}
            </p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Brouillons
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#f59e0b'
            }}>
              {posts.filter(p => !p.published).length}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'published', label: 'Publiés' },
            { key: 'draft', label: 'Brouillons' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === key ? '#6366f1' : 'white',
                color: filter === key ? 'white' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
              Chargement...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
              Aucun article trouvé
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Article
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Catégorie
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Statut
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Vues
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Date
                    </th>
                    <th style={{
                      padding: '12px 20px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '4px'
                          }}>
                            {post.title}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#64748b'
                          }}>
                            /{post.slug}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#64748b',
                          backgroundColor: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '4px'
                        }}>
                          {post.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => togglePublish(post)}
                          style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: post.published ? '#10b981' : '#f59e0b',
                            backgroundColor: post.published ? '#f0fdf4' : '#fef3c7',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {post.published ? '✓ Publié' : 'Brouillon'}
                        </button>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#0f172a'
                        }}>
                          {post.views}
                        </p>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <p style={{
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          {formatDate(post.publishedAt)}
                        </p>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'flex-end'
                        }}>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#f1f5f9',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#64748b',
                              cursor: 'pointer',
                              textDecoration: 'none',
                              transition: 'all 0.2s'
                            }}
                          >
                            Voir
                          </Link>
                          <button
                            onClick={() => openEditModal(post)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#f1f5f9',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#64748b',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#6366f1';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#f1f5f9';
                              e.currentTarget.style.color = '#64748b';
                            }}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#f1f5f9',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#64748b',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#ef4444';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#f1f5f9';
                              e.currentTarget.style.color = '#64748b';
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 10
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#0f172a'
              }}>
                {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '24px'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Title */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}>
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      // Auto-generate slug
                      if (!editingPost) {
                        const slug = e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-+|-+$/g, '');
                        setFormData(prev => ({ ...prev, slug }));
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}>
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Category & Author */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px'
                    }}>
                      Catégorie *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontFamily: 'inherit'
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px'
                    }}>
                      Auteur
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <ImageUpload
                  currentImage={formData.coverImage}
                  onImageUploaded={(url) => setFormData({ ...formData, coverImage: url })}
                  category="blog"
                />

                {/* Excerpt */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}>
                    Extrait *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Content */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}>
                    Contenu * (format markdown simple)
                  </label>
                  <textarea
                    required
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Utilisez ## pour les titres&#10;&#10;## Premier titre&#10;Votre paragraphe ici..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Tags & Read Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px'
                    }}>
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Fashion Week, Elite, Shooting"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px'
                    }}>
                      Temps lecture (min)
                    </label>
                    <input
                      type="number"
                      value={formData.readTime || ''}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value ? parseInt(e.target.value) : null })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                {/* SEO */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}>
                    Meta Title (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '8px'
                  }}>
                    Meta Description (SEO)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Published Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px'
                }}>
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <label htmlFor="published" style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}>
                    Publier immédiatement
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#6366f1',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1
                  }}
                >
                  {saving ? 'Enregistrement...' : editingPost ? 'Mettre à jour' : 'Créer l\'article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
