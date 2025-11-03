'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readTime: number | null;
  author: string;
};

const categories = ['Tous', 'Actualités', 'Success Stories', 'Conseils', 'Behind-the-Scenes', 'Industrie'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'Tous'
        ? '/api/blog'
        : `/api/blog?category=${encodeURIComponent(selectedCategory)}`;

      const response = await fetch(url);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 50,
        padding: '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '0.2em',
            color: '#000000',
            textDecoration: 'none'
          }}>
            ZMR
          </Link>

          <Link href="/" style={{
            fontSize: '14px',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ← Retour
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        paddingTop: '120px',
        paddingBottom: '60px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '120px 40px 60px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 300,
          letterSpacing: '0.05em',
          color: '#000000',
          marginBottom: '20px'
        }}>
          BLOG
        </h1>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#6b7280'
        }}>
          Actualités, conseils et coulisses de l'industrie du mannequinat
        </p>
      </div>

      {/* Categories Filter */}
      <div style={{
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '60px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          paddingBottom: '20px'
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                fontSize: '13px',
                fontWeight: selectedCategory === category ? 600 : 400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: selectedCategory === category ? '#000000' : '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: selectedCategory === category ? '2px solid #000000' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 40px 100px'
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '16px' }}>Chargement...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '16px' }}>
              Aucun article dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '40px'
          }}>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Article Card */}
                <article>
                  {/* Image */}
                  <div style={{
                    width: '100%',
                    height: '280px',
                    backgroundColor: '#f3f4f6',
                    marginBottom: '24px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {/* Category Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: '#ffffff',
                      padding: '6px 12px',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#000000'
                    }}>
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    {/* Meta */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '11px',
                      color: '#9ca3af',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      <span>{formatDate(post.publishedAt)}</span>
                      {post.readTime && (
                        <>
                          <span>•</span>
                          <span>{post.readTime} min</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: 400,
                      lineHeight: '1.4',
                      color: '#000000',
                      marginBottom: '12px',
                      letterSpacing: '0.01em'
                    }}>
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#6b7280'
                    }}>
                      {post.excerpt}
                    </p>

                    {/* Read More */}
                    <div style={{
                      marginTop: '16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#000000'
                    }}>
                      Lire la suite →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
