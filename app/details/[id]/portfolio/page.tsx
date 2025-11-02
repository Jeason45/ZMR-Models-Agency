'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DetailPortfolioGalleryPage() {
  const params = useParams();
  const detailSlug = params.id as string;
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        // Try fetching from Prisma first
        const prismaResponse = await fetch(`/api/talents?type=DETAILS`);
        if (prismaResponse.ok) {
          const prismaTalents = await prismaResponse.json();
          const prismaDetail = prismaTalents.find((t: any) => t.slug === detailSlug);

          if (prismaDetail) {
            // Transform Prisma data to match expected format
            setDetail({
              _id: prismaDetail.id,
              name: prismaDetail.name,
              slug: prismaDetail.slug,
              portfolioGallery: prismaDetail.portfolioGallery || [],
              isPrisma: true
            });
            setLoading(false);
            return;
          }
        }

        // Fallback if not found in Prisma
        const data = null;
        setDetail(data);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [detailSlug]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && detail.portfolioGallery) {
      setSelectedImageIndex((selectedImageIndex + 1) % detail.portfolioGallery.length);
    }
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && detail.portfolioGallery) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? detail.portfolioGallery.length - 1 : selectedImageIndex - 1
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Escape') handleCloseModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

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
        <div>Loading portfolio gallery...</div>
      </main>
    );
  }

  if (!detail || !detail.portfolioGallery || detail.portfolioGallery.length === 0) {
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
        <h1>No portfolio gallery available</h1>
        <Link href={`/details/${detailSlug}`} style={{ color: 'white' }}>
          ← Back to profile
        </Link>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      padding: '20px 10px',
      position: 'relative'
    }}>
      {/* Back button */}
      <Link
        href={`/details/${detailSlug}`}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
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
        marginBottom: 'clamp(40px, 8vh, 80px)',
        paddingTop: 'clamp(60px, 10vh, 80px)'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(32px, 8vw, 80px)',
          fontWeight: 900,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: 0
        }}>
          {detail.name}
        </h1>
        <p style={{
          color: '#999',
          fontSize: 'clamp(11px, 2vw, 14px)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '20px'
        }}>
          Portfolio Gallery
        </p>
      </div>

      {/* Grid Gallery */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 30vw, 350px), 1fr))',
        gap: 'clamp(20px, 3vw, 40px)',
        padding: '0 clamp(20px, 5vw, 80px)',
        maxWidth: '1600px',
        margin: '0 auto',
        paddingBottom: '100px'
      }}>
        {detail.portfolioGallery.map((imageUrl: string, index: number) => (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.border = '2px solid rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
            }}
          >
            <img
              src={imageUrl}
              alt={`Portfolio ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedImageIndex !== null && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 201,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            style={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 201,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ‹
          </button>

          {/* Image */}
          <img
            src={detail.portfolioGallery[selectedImageIndex]}
            alt={`Portfolio ${selectedImageIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '12px'
            }}
          />

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            style={{
              position: 'fixed',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 201,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ›
          </button>

          {/* Counter */}
          <div style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '16px',
            letterSpacing: '0.2em',
            fontWeight: 300,
            zIndex: 201
          }}>
            {selectedImageIndex + 1} / {detail.portfolioGallery.length}
          </div>
        </div>
      )}
    </main>
  );
}
