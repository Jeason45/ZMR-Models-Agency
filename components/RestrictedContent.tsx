'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RestrictedContentProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  blurAmount?: number; // 0-20, default 10
  overlayOpacity?: number; // 0-1, default 0.6
  message?: string;
  showLoginButton?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function RestrictedContent({
  children,
  isAuthenticated,
  blurAmount = 10,
  overlayOpacity = 0.6,
  message = 'Contenu réservé aux membres',
  showLoginButton = true,
  className = '',
  style = {},
}: RestrictedContentProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Si l'utilisateur est authentifié, afficher le contenu normalement
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div
      className={`restricted-content ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenu flouté */}
      <div
        style={{
          filter: `blur(${blurAmount}px)`,
          transform: 'scale(1.1)', // Évite les bords flous visibles
          transition: 'filter 0.3s ease',
        }}
      >
        {children}
      </div>

      {/* Overlay avec message */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `rgba(15, 23, 42, ${overlayOpacity})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0.9,
          transition: 'opacity 0.3s ease',
          padding: '20px',
        }}
      >
        {/* Icône cadenas */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Message */}
        <p
          style={{
            color: 'white',
            fontSize: '15px',
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: '20px',
            maxWidth: '280px',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        {/* Boutons */}
        {showLoginButton && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/member/login"
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-block',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Se connecter
            </Link>
            <Link
              href="/member/register"
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'border-color 0.2s, background 0.2s',
                display: 'inline-block',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Créer un compte
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant pour une image restreinte (version simplifiée)
interface RestrictedImageProps {
  src: string;
  alt: string;
  isAuthenticated: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export function RestrictedImage({
  src,
  alt,
  isAuthenticated,
  width = '100%',
  height = 'auto',
  className = '',
  style = {},
  objectFit = 'cover',
}: RestrictedImageProps) {
  return (
    <RestrictedContent
      isAuthenticated={isAuthenticated}
      className={className}
      style={{ width, height, ...style }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
        }}
      />
    </RestrictedContent>
  );
}

// Composant pour une galerie restreinte
interface RestrictedGalleryProps {
  images: string[];
  isAuthenticated: boolean;
  columns?: number;
  gap?: number;
  className?: string;
}

export function RestrictedGallery({
  images,
  isAuthenticated,
  columns = 3,
  gap = 16,
  className = '',
}: RestrictedGalleryProps) {
  // Si authentifié, afficher la galerie normalement
  if (isAuthenticated) {
    return (
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              aspectRatio: '1',
              overflow: 'hidden',
              borderRadius: '8px',
            }}
          >
            <img
              src={src}
              alt={`Gallery image ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Sinon, afficher une préview floutée
  const previewCount = Math.min(images.length, columns);
  const hiddenCount = images.length - previewCount;

  return (
    <RestrictedContent
      isAuthenticated={false}
      message={`${images.length} photos exclusives réservées aux membres`}
      style={{ borderRadius: '8px' }}
    >
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {images.slice(0, previewCount).map((src, index) => (
          <div
            key={index}
            style={{
              aspectRatio: '1',
              overflow: 'hidden',
              borderRadius: '8px',
              position: 'relative',
            }}
          >
            <img
              src={src}
              alt={`Gallery image ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {index === previewCount - 1 && hiddenCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(15, 23, 42, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 600,
                }}
              >
                +{hiddenCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </RestrictedContent>
  );
}
