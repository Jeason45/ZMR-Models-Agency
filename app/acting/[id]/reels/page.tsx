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
    if (selectedVideoIndex === null) {
      const video = videoRefs.current[index];
      if (video) {
        video.play();
      }
    }
  };

  const handleMouseLeave = (index: number) => {
    if (selectedVideoIndex === null) {
      const video = videoRefs.current[index];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  const handleVideoClick = (index: number) => {
    // Pause all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Set selected and play it
    setSelectedVideoIndex(index);
    setTimeout(() => {
      const selectedVideo = videoRefs.current[index];
      if (selectedVideo) {
        selectedVideo.play();
      }
    }, 100);
  };

  const closeGallery = () => {
    const video = videoRefs.current[selectedVideoIndex!];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
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

  const isGalleryMode = selectedVideoIndex !== null;

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      padding: '40px 20px',
      transition: 'all 0.5s ease'
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
          transition: 'opacity 0.3s',
          opacity: isGalleryMode ? 0 : 1,
          pointerEvents: isGalleryMode ? 'none' : 'auto'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = isGalleryMode ? '0' : '0.5'}
        onMouseOut={(e) => e.currentTarget.style.opacity = isGalleryMode ? '0' : '1'}
      >
        ←
      </Link>

      {/* Close Gallery button (appears in gallery mode) */}
      {isGalleryMode && (
        <button
          onClick={closeGallery}
          style={{
            position: 'fixed',
            top: '40px',
            right: '40px',
            zIndex: 100,
            color: 'white',
            fontSize: '40px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.3s',
            lineHeight: 1,
            padding: 0
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.5'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          ×
        </button>
      )}

      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        paddingTop: '80px',
        opacity: isGalleryMode ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: isGalleryMode ? 'none' : 'auto'
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

      {/* Reels Gallery Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isGalleryMode ? '20px' : '30px',
        maxWidth: isGalleryMode ? '100%' : '1400px',
        margin: '0 auto',
        flexWrap: isGalleryMode ? 'nowrap' : 'wrap',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '80vh'
      }}>
        {actor.reelsGallery.map((videoUrl: string, index: number) => {
          const isSelected = selectedVideoIndex === index;
          const isInGalleryMode = selectedVideoIndex !== null;

          return (
            <div
              key={index}
              style={{
                position: 'relative',
                aspectRatio: '9/16',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                width: isSelected
                  ? 'clamp(300px, 50vw, 600px)'
                  : isInGalleryMode
                    ? 'clamp(100px, 15vw, 200px)'
                    : 'clamp(280px, 30vw, 400px)',
                opacity: isInGalleryMode && !isSelected ? 0.5 : 1,
                transform: isSelected ? 'scale(1)' : isInGalleryMode ? 'scale(0.9)' : 'scale(1)',
                flexShrink: 0
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => handleVideoClick(index)}
              onMouseOver={(e) => {
                if (!isInGalleryMode || isSelected) {
                  e.currentTarget.style.transform = isSelected ? 'scale(1.02)' : 'scale(1.02)';
                }
              }}
              onMouseOut={(e) => {
                if (isSelected) {
                  e.currentTarget.style.transform = 'scale(1)';
                } else if (isInGalleryMode) {
                  e.currentTarget.style.transform = 'scale(0.9)';
                } else {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                muted={!isSelected}
                loop
                playsInline
                controls={isSelected}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'all 0.3s ease'
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
                letterSpacing: '0.1em',
                opacity: isInGalleryMode && !isSelected ? 0 : 1,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
              }}>
                REEL {index + 1}
              </div>

              {/* Play indicator for non-selected in gallery mode */}
              {isInGalleryMode && !isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: '15px solid white',
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    marginLeft: '3px'
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Counter in gallery mode */}
      {isGalleryMode && (
        <div style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '16px',
          letterSpacing: '0.2em',
          fontWeight: 300,
          zIndex: 100
        }}>
          REEL {selectedVideoIndex + 1} / {actor.reelsGallery.length}
        </div>
      )}
    </main>
  );
}
