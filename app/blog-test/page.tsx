'use client';

import Link from 'next/link';
import { useState } from 'react';

// Données de test
const categories = ['Tous', 'Actualités', 'Success Stories', 'Conseils', 'Behind-the-Scenes'];

const articles = [
  {
    id: 1,
    slug: 'premier-shooting-avec-elite',
    title: 'Premier shooting avec Elite Paris',
    excerpt: 'Découvrez les coulisses de notre collaboration exceptionnelle avec la maison Elite pour la Fashion Week.',
    category: 'Behind-the-Scenes',
    date: '15 Mars 2024',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
    readTime: '5 min'
  },
  {
    id: 2,
    slug: 'conseils-book-photos',
    title: 'Comment créer un book photo professionnel',
    excerpt: 'Nos experts vous donnent tous les conseils pour réussir votre book et maximiser vos chances.',
    category: 'Conseils',
    date: '12 Mars 2024',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop',
    readTime: '8 min'
  },
  {
    id: 3,
    slug: 'success-story-marie',
    title: 'Success Story : Marie décroche Vogue',
    excerpt: 'Le parcours inspirant de Marie, de sa signature chez ZMR à la couverture de Vogue Paris.',
    category: 'Success Stories',
    date: '10 Mars 2024',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop',
    readTime: '6 min'
  },
  {
    id: 4,
    slug: 'tendances-printemps-2024',
    title: 'Les tendances du printemps 2024',
    excerpt: 'Analyse des tendances qui vont marquer la saison printemps-été 2024 dans le monde du mannequinat.',
    category: 'Actualités',
    date: '8 Mars 2024',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
    readTime: '4 min'
  },
  {
    id: 5,
    slug: 'casting-secrets',
    title: 'Les secrets d\'un casting réussi',
    excerpt: 'Ce que les directeurs de casting recherchent vraiment lors des auditions.',
    category: 'Conseils',
    date: '5 Mars 2024',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1c8370?w=800&h=600&fit=crop',
    readTime: '7 min'
  },
  {
    id: 6,
    slug: 'paris-fashion-week-recap',
    title: 'Paris Fashion Week : Notre récap',
    excerpt: 'Retour sur les moments forts de la Fashion Week parisienne avec nos mannequins.',
    category: 'Actualités',
    date: '2 Mars 2024',
    image: 'https://images.unsplash.com/photo-1566404791232-af9fe0ae8f8b?w=800&h=600&fit=crop',
    readTime: '10 min'
  }
];

export default function BlogTestPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredArticles = selectedCategory === 'Tous'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '40px'
        }}>
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/blog-test/${article.slug}`}
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
                    src={article.image}
                    alt={article.title}
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
                    {article.category}
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
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
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
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#6b7280'
                  }}>
                    {article.excerpt}
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

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#6b7280'
          }}>
            <p style={{ fontSize: '16px' }}>
              Aucun article dans cette catégorie pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
