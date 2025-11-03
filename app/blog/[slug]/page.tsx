'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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
  publishedAt: string;
  readTime: number | null;
};

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();

      if (response.ok) {
        setPost(data);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
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

  const formatContent = (content: string) => {
    // Conversion simple du markdown en HTML
    // Remplacer ## par <h2>
    let formatted = content.replace(/^## (.+)$/gm, '<h2 style="font-size: 28px; font-weight: 400; color: #000000; margin-bottom: 20px; margin-top: 40px; letter-spacing: 0.01em;">$1</h2>');

    // Remplacer les paragraphes
    formatted = formatted.replace(/^(?!<h).+$/gm, (match) => {
      if (match.trim()) {
        return `<p style="font-size: 16px; line-height: 1.8; color: #6b7280; margin-bottom: 16px;">${match}</p>`;
      }
      return match;
    });

    return formatted;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Chargement...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '18px', color: '#000000' }}>Article non trouvé</p>
        <Link href="/blog" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'underline' }}>
          ← Retour au blog
        </Link>
      </div>
    );
  }

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

          <Link href="/blog" style={{
            fontSize: '14px',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ← Retour au blog
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <div style={{
        paddingTop: '100px',
        paddingBottom: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '100px 40px 40px'
      }}>
        {/* Category */}
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#6b7280',
          marginBottom: '16px'
        }}>
          {post.category}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: 300,
          lineHeight: '1.2',
          color: '#000000',
          marginBottom: '24px',
          letterSpacing: '0.01em'
        }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '13px',
          color: '#9ca3af',
          paddingBottom: '40px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span>Par {post.author}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          {post.readTime && (
            <>
              <span>•</span>
              <span>{post.readTime} min de lecture</span>
            </>
          )}
        </div>
      </div>

      {/* Cover Image */}
      <div style={{
        width: '100%',
        height: '600px',
        backgroundColor: '#f3f4f6',
        marginBottom: '60px'
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
      </div>

      {/* Article Content */}
      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 40px 100px'
      }}>
        {/* Introduction (excerpt) */}
        <div style={{
          fontSize: '18px',
          lineHeight: '1.8',
          color: '#374151',
          marginBottom: '40px',
          fontWeight: 300
        }}>
          <p>{post.excerpt}</p>
        </div>

        {/* Content */}
        <div
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{
            paddingTop: '40px',
            borderTop: '1px solid #e5e7eb',
            marginTop: '60px'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '8px 16px',
                    borderRadius: '4px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div style={{
          paddingTop: '40px',
          marginTop: '40px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#000000'
          }}>
            Partager
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '13px',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Facebook
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '13px',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              Twitter
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '13px',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
