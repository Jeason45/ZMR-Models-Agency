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
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('grid');
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

  // Play video on selection
  useEffect(() => {
    if (selectedVideoIndex !== null) {
      const video = videoRefs.current[selectedVideoIndex];
      if (video) {
        video.play();
      }
    }
  }, [selectedVideoIndex]);

  const handleVideoClick = (index: number) => {
    // Pause current video
    const currentVideo = videoRefs.current[selectedVideoIndex];
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }

    // Select new video
    setSelectedVideoIndex(index);
  };

  const handleMouseEnter = (index: number) => {
    if (index !== selectedVideoIndex) {
      const video = videoRefs.current[index];
      if (video) {
        video.play();
      }
    }
  };

  const handleMouseLeave = (index: number) => {
    if (index !== selectedVideoIndex) {
      const video = videoRefs.current[index];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  const handleGridMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play();
    }
  };

  const handleGridMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
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

  const getCardPosition = (index: number) => {
    const diff = index - selectedVideoIndex;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (diff === 0) {
      return {
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '280px' : 'clamp(300px, 40vw, 420px)',
        height: isMobile ? '498px' : 'clamp(533px, 71vw, 747px)',
        opacity: 1,
        zIndex: 10,
        scale: 1
      };
    } else if (diff === -1) {
      return {
        left: isMobile ? '15%' : '25%',
        transform: 'translateX(-50%) scale(0.8)',
        width: isMobile ? '100px' : '150px',
        height: isMobile ? '178px' : '267px',
        opacity: 0.5,
        zIndex: 5
      };
    } else if (diff === -2) {
      return {
        left: isMobile ? '5%' : '10%',
        transform: 'translateX(-50%) scale(0.6)',
        width: isMobile ? '100px' : '150px',
        height: isMobile ? '178px' : '267px',
        opacity: 0.25,
        zIndex: 3
      };
    } else if (diff === 1) {
      return {
        left: isMobile ? '85%' : '75%',
        transform: 'translateX(-50%) scale(0.8)',
        width: isMobile ? '100px' : '150px',
        height: isMobile ? '178px' : '267px',
        opacity: 0.5,
        zIndex: 5
      };
    } else if (diff === 2) {
      return {
        left: isMobile ? '95%' : '90%',
        transform: 'translateX(-50%) scale(0.6)',
        width: isMobile ? '100px' : '150px',
        height: isMobile ? '178px' : '267px',
        opacity: 0.25,
        zIndex: 3
      };
    } else if (diff < -2) {
      return {
        left: isMobile ? '0%' : '5%',
        transform: 'translateX(-50%) scale(0.5)',
        width: isMobile ? '100px' : '150px',
        height: isMobile ? '178px' : '267px',
        opacity: 0.1,
        zIndex: 1
      };
    } else {
      return {
        left: isMobile ? '100%' : '95%',
        transform: 'translateX(-50%) scale(0.5)',
        width: isMobile ? '100px' : '150px',
        height: isMobile ? '178px' : '267px',
        opacity: 0.1,
        zIndex: 1
      };
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      padding: '20px 10px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Back button */}
      <Link
        href={`/acting/${actorSlug}`}
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

      {/* View Mode Toggle */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: '8px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Grid View Button */}
        <button
          onClick={() => setViewMode('grid')}
          style={{
            background: viewMode === 'grid' ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: 'none',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            if (viewMode !== 'grid') {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseOut={(e) => {
            if (viewMode !== 'grid') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="Grid View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </button>

        {/* Carousel View Button */}
        <button
          onClick={() => setViewMode('carousel')}
          style={{
            background: viewMode === 'carousel' ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: 'none',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            if (viewMode !== 'carousel') {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseOut={(e) => {
            if (viewMode !== 'carousel') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="Carousel View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
            <polyline points="17 2 12 7 7 2"></polyline>
          </svg>
        </button>
      </div>

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
          {actor.name}
        </h1>
        <p style={{
          color: '#999',
          fontSize: 'clamp(11px, 2vw, 14px)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginTop: '20px'
        }}>
          Reels
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 30vw, 350px), 1fr))',
          gap: 'clamp(20px, 3vw, 40px)',
          padding: '0 clamp(20px, 5vw, 80px)',
          maxWidth: '1600px',
          margin: '0 auto',
          paddingBottom: '100px'
        }}>
          {actor.reelsGallery.map((videoUrl: string, index: number) => (
            <div
              key={index}
              style={{
                position: 'relative',
                aspectRatio: '9/16',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={() => handleGridMouseEnter(index)}
              onMouseLeave={() => handleGridMouseLeave(index)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.border = '2px solid rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
              }}
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
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                backdropFilter: 'blur(10px)'
              }}>
                REEL {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Magnetic Gallery Container */}
      {viewMode === 'carousel' && (
        <div style={{
          position: 'relative',
          minHeight: 'clamp(500px, 80vh, 800px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {actor.reelsGallery.map((videoUrl: string, index: number) => {
          const position = getCardPosition(index);
          const isSelected = index === selectedVideoIndex;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: position.width,
                height: position.height,
                left: position.left,
                transform: position.transform,
                opacity: position.opacity,
                zIndex: position.zIndex,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#1a1a1a',
                border: isSelected
                  ? '3px solid rgba(255,255,255,0.4)'
                  : '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={() => handleVideoClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.opacity = String(Math.min(Number(position.opacity) + 0.2, 1));
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.opacity = String(position.opacity);
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
                padding: isSelected ? '10px 20px' : '6px 12px',
                borderRadius: '8px',
                fontSize: isSelected ? '16px' : '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                opacity: isSelected ? 1 : 0.8,
                transition: 'all 0.3s ease',
                pointerEvents: 'none'
              }}>
                REEL {index + 1}
              </div>

              {/* Play indicator for non-selected */}
              {!isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: position.opacity > 0.4 ? '40px' : '30px',
                  height: position.opacity > 0.4 ? '40px' : '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: position.opacity > 0.4 ? '12px solid white' : '9px solid white',
                    borderTop: position.opacity > 0.4 ? '8px solid transparent' : '6px solid transparent',
                    borderBottom: position.opacity > 0.4 ? '8px solid transparent' : '6px solid transparent',
                    marginLeft: '3px'
                  }} />
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* Counter - Only show in carousel mode */}
      {viewMode === 'carousel' && (
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

      {/* Navigation arrows - Only show in carousel mode */}
      {viewMode === 'carousel' && selectedVideoIndex > 0 && (
        <button
          onClick={() => handleVideoClick(selectedVideoIndex - 1)}
          style={{
            position: 'fixed',
            left: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
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
            zIndex: 100,
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
      )}

      {viewMode === 'carousel' && selectedVideoIndex < actor.reelsGallery.length - 1 && (
        <button
          onClick={() => handleVideoClick(selectedVideoIndex + 1)}
          style={{
            position: 'fixed',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
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
            zIndex: 100,
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
      )}
    </main>
  );
}
