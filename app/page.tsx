'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastScrollY = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');

  const videos = [
    '/videos/hero.mp4',
    '/videos/hero2.mp4',
    '/videos/hero3.mp4',
  ];

  const menuItems = [
    { name: 'Models', href: '/models' },
    { name: 'Acting', href: '/acting' },
    { name: 'Promo', href: '/promo' },
    { name: 'Détails', href: '/details' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play was prevented, ignore the error
          console.log('Video playback prevented:', error);
        });
      }
    }
  }, [currentVideoIndex]);

  // Scroll detection effect
  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';

      if (direction !== scrollDirectionRef.current && Math.abs(scrollY - lastScrollY.current) > 10) {
        scrollDirectionRef.current = direction;
        setScrollDirection(direction);
      }

      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  return (
    <>
      <main className="relative w-screen h-screen overflow-hidden">
        {/* Background Video Slideshow */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
            key={currentVideoIndex}
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
          </video>
        </div>

        {/* Logo positioned at top with elegant spacing */}
        {!isMenuOpen && (
          <Link
            href="/"
            className="fixed left-1/2 -translate-x-1/2 z-10 no-underline cursor-pointer transition-[top] duration-500 ease-in-out"
            style={{ top: scrollDirection === 'down' ? '-300px' : '20px' }}
          >
            <div className="text-center">
              <h1
                className="text-white font-light tracking-[0.2em] leading-none m-0 transition-opacity duration-300 hover:opacity-70"
                style={{ fontSize: 'clamp(35px, 8vw, 110px)' }}
              >
                ZMR
              </h1>
              <p
                className="text-white font-light tracking-[0.4em] uppercase mt-3"
                style={{ fontSize: 'clamp(9px, 1.3vw, 12px)' }}
              >
                Models Agency
              </p>
            </div>
          </Link>
        )}

        {/* Top Right Icons: Search, Hamburger */}
        {!isMenuOpen && (
          <div
            className="fixed right-4 md:right-8 z-50 flex items-center gap-4 md:gap-6 transition-[top] duration-500 ease-in-out"
            style={{ top: scrollDirection === 'down' ? '-300px' : '32px' }}
          >
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>

            {/* Instagram Icon */}
            <a
              href="https://www.instagram.com/zmrmodelsagency"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center no-underline"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 bg-transparent border-none cursor-pointer p-0"
              aria-label="Menu"
            >
              <span className="w-full h-0.5 bg-white mb-2" />
              <span className="w-full h-0.5 bg-white" />
            </button>
          </div>
        )}
      </main>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 w-full h-full bg-white z-45 flex items-start justify-center pt-24 md:pt-[150px]">
          <div className="w-full max-w-[600px] px-4 md:px-8">
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="w-full text-2xl md:text-[32px] font-light border-none border-b border-gray-200 pb-4 outline-none bg-transparent"
            />
          </div>

          {/* Close Search Button */}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="fixed top-4 md:top-8 right-4 md:right-8 z-50 flex justify-center items-center w-8 h-8 bg-transparent border-none cursor-pointer p-0"
            aria-label="Close Search"
          >
            <span className="absolute w-full h-0.5 bg-black rotate-45" />
            <span className="absolute w-full h-0.5 bg-black -rotate-45" />
          </button>
        </div>
      )}

      {/* Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 w-full h-full bg-black z-40 flex items-center justify-center p-5">
          <nav
            className="flex flex-col items-center"
            style={{
              gap: 'clamp(12px, 2.5vh, 28px)',
              marginTop: 'clamp(0px, 8vh, 60px)'
            }}
          >
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className="text-white font-light tracking-tight no-underline transition-opacity duration-300 hover:opacity-50"
                style={{ fontSize: 'clamp(28px, 5.5vw, 90px)' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Close Button (X) */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="fixed z-50 flex justify-center items-center w-8 h-8 bg-transparent border-none cursor-pointer p-0"
            style={{
              top: 'clamp(20px, 4vh, 32px)',
              right: 'clamp(20px, 4vw, 32px)'
            }}
            aria-label="Close Menu"
          >
            <span className="absolute w-full h-0.5 bg-white rotate-45" />
            <span className="absolute w-full h-0.5 bg-white -rotate-45" />
          </button>
        </div>
      )}

      {/* Footer - only on homepage */}
      <Footer />
    </>
  );
}
