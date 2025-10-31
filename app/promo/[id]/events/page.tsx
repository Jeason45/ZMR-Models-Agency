'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPromoBySlug } from '@/lib/sanity';

export default function EventsGalleryPage() {
  const params = useParams();
  const promoSlug = params.id as string;
  const [promo, setPromo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPromo() {
      try {
        const data = await getPromoBySlug(promoSlug);
        setPromo(data);
      } catch (error) {
        console.error('Error fetching promo:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPromo();
  }, [promoSlug]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && promo.eventsGallery) {
      setSelectedImageIndex((selectedImageIndex + 1) % promo.eventsGallery.length);
    }
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && promo.eventsGallery) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? promo.eventsGallery.length - 1 : selectedImageIndex - 1
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
        <div>Loading events...</div>
      </main>
    );
  }

  if (!promo || !promo.eventsGallery || promo.eventsGallery.length === 0) {
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
        <h1>No events available</h1>
        <Link href={`/promo/${promoSlug}`} style={{ color: 'white' }}>
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
        href={`/promo/${promoSlug}`}
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
          {promo.name}
        </h1>
        <p style={{
          color: '#999',
          fontSize: 'clamp(11px, 2vw, 14px)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '20px'
        }}>
          Events Gallery
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
        {promo.eventsGallery.map((imageUrl: string, index: number) => (
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
              alt={`Event ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Event Number Overlay */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              backdropFilter: 'blur(10px)'
            }}>
              {index + 1}
            </div>
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
            src={promo.eventsGallery[selectedImageIndex]}
            alt={`Event ${selectedImageIndex + 1}`}
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
            {selectedImageIndex + 1} / {promo.eventsGallery.length}
          </div>
        </div>
      )}
    </main>
  );
}
