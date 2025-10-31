'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getActorBySlug } from '@/lib/sanity';

export default function ReelsPage() {
  const params = useParams();
  const actorSlug = params.id as string;
  const [actor, setActor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    async function fetchActor() {
      try {
        const data = await getActorBySlug(actorSlug);
        setActor(data);
      } catch (error) {
        console.error('Error fetching actor:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActor();
  }, [actorSlug]);

  const handleMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play();
    }
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0; // Reset to start
    }
  };

  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index);
  };

  const closeFullscreen = () => {
    setSelectedVideoIndex(null);
  };

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
        <div>Loading reels...</div>
      </main>
    );
  }

  if (!actor || !actor.reelsGallery || actor.reelsGallery.length === 0) {
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
        <h1>No reels available</h1>
        <Link href={`/acting/${actorSlug}`} style={{ color: 'white' }}>
          ← Back to profile
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
        href={`/acting/${actorSlug}`}
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
          {actor.name}
        </h1>
        <p style={{
          color: '#999',
          fontSize: '14px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '20px'
        }}>
          Reels
        </p>
      </div>

      {/* Reels Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {actor.reelsGallery.map((videoUrl: string, index: number) => (
          <div
            key={index}
            style={{
              position: 'relative',
              aspectRatio: '9/16',
              overflow: 'hidden',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => handleVideoClick(index)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Reel Number Overlay */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.1em'
            }}>
              REEL {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Video Modal */}
      {selectedVideoIndex !== null && (
        <div
          onClick={closeFullscreen}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '40px',
              cursor: 'pointer',
              zIndex: 1001,
              lineHeight: 1,
              padding: 0
            }}
          >
            ×
          </button>

          {/* Video container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '600px',
              aspectRatio: '9/16'
            }}
          >
            <video
              autoPlay
              controls
              loop
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            >
              <source src={actor.reelsGallery[selectedVideoIndex]} type="video/mp4" />
            </video>
          </div>

          {/* Reel number indicator */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '18px',
            letterSpacing: '0.2em',
            fontWeight: 300
          }}>
            REEL {selectedVideoIndex + 1} / {actor.reelsGallery.length}
          </div>
        </div>
      )}
    </main>
  );
}
