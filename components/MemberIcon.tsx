'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMemberAuth } from '@/hooks/useMemberAuth';

interface MemberIconProps {
  size?: number;
  color?: string;
}

export default function MemberIcon({ size = 20, color = 'white' }: MemberIconProps) {
  const { isAuthenticated, isLoading, user } = useMemberAuth();
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    // Skeleton pendant le chargement
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    );
  }

  if (isAuthenticated && user) {
    // Utilisateur connecté - afficher avatar ou icône profil
    return (
      <Link
        href="/member/dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          opacity: isHovered ? 0.7 : 1,
          transition: 'opacity 0.3s',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Mon compte"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'Avatar'}
            style={{
              width: size + 4,
              height: size + 4,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255, 255, 255, 0.5)',
            }}
          />
        ) : (
          <div
            style={{
              width: size + 4,
              height: size + 4,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <svg
              width={size - 4}
              height={size - 4}
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </Link>
    );
  }

  // Utilisateur non connecté - afficher icône de connexion
  return (
    <Link
      href="/member/login"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        opacity: isHovered ? 0.7 : 1,
        transition: 'opacity 0.3s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Se connecter"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </Link>
  );
}
