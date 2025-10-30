'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getModelBySlug } from '@/lib/sanity';

export default function PortfolioPage() {
  const params = useParams();
  const modelSlug = params.id as string;
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModel() {
      try {
        const data = await getModelBySlug(modelSlug);
        setModel(data);
      } catch (error) {
        console.error('Error fetching model:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchModel();
  }, [modelSlug]);

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Loading portfolio...</div>
      </main>
    );
  }

  if (!model || !model.portfolioGallery || model.portfolioGallery.length === 0) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>No portfolio images available</h1>
        <Link href={`/models/${modelSlug}`} style={{ color: 'white' }}>
          ← Back to model page
        </Link>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      padding: '40px 20px'
    }}>
      {/* Back button */}
      <Link
        href={`/models/${modelSlug}`}
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
        ←
      </Link>

      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        paddingTop: '80px'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(40px, 8vw, 80px)',
          fontWeight: 900,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: 0
        }}>
          {model.name}
        </h1>
        <p style={{
          color: '#999',
          fontSize: '14px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '20px'
        }}>
          Portfolio
        </p>
      </div>

      {/* Portfolio Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {model.portfolioGallery.map((image: string, index: number) => (
          <div
            key={index}
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={image}
              alt={`${model.name} portfolio ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
