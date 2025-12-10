'use client';

import { useState } from 'react';

// Image de test (utilisez une image de mannequin existante)
const TEST_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';

export default function DemoImagesPage() {
  const [selectedOption, setSelectedOption] = useState<number>(1);

  const options = [
    {
      id: 1,
      name: 'Layout 1: Pleine largeur classique',
      description: 'Sections pleine largeur avec marges, style actuel du site',
      containerStyle: { maxWidth: '100%', padding: '0' },
      heroStyle: { height: '70vh', marginTop: '120px' },
      portfolioStyle: { height: '60vh', marginTop: '40px' },
      showsSocialStyle: { height: '55vh' },
      gridStyle: { gap: '40px', padding: '0 40px', marginTop: '40px' }
    },
    {
      id: 2,
      name: 'Layout 2: Conteneur centré 1200px',
      description: 'Sections limitées à 1200px, centrées avec marges',
      containerStyle: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
      heroStyle: { height: '65vh', marginTop: '120px', borderRadius: '12px' },
      portfolioStyle: { height: '55vh', marginTop: '32px', borderRadius: '12px' },
      showsSocialStyle: { height: '50vh', borderRadius: '12px' },
      gridStyle: { gap: '24px', padding: '0', marginTop: '32px' }
    },
    {
      id: 3,
      name: 'Layout 3: Conteneur centré 1000px (plus étroit)',
      description: 'Sections limitées à 1000px, plus compact',
      containerStyle: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
      heroStyle: { height: '60vh', marginTop: '120px', borderRadius: '16px' },
      portfolioStyle: { height: '50vh', marginTop: '28px', borderRadius: '16px' },
      showsSocialStyle: { height: '45vh', borderRadius: '16px' },
      gridStyle: { gap: '20px', padding: '0', marginTop: '28px' }
    },
    {
      id: 4,
      name: 'Layout 4: Style magazine (très étroit)',
      description: 'Sections limitées à 800px, style éditorial',
      containerStyle: { maxWidth: '800px', margin: '0 auto', padding: '0 16px' },
      heroStyle: { height: '70vh', marginTop: '120px', borderRadius: '8px' },
      portfolioStyle: { height: '60vh', marginTop: '24px', borderRadius: '8px' },
      showsSocialStyle: { height: '55vh', borderRadius: '8px' },
      gridStyle: { gap: '16px', padding: '0', marginTop: '24px' }
    },
    {
      id: 5,
      name: 'Layout 5: Grille asymétrique',
      description: 'Hero large, Shows/Social en colonnes étroites',
      containerStyle: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
      heroStyle: { height: '55vh', marginTop: '120px', borderRadius: '12px' },
      portfolioStyle: { height: '50vh', marginTop: '24px', borderRadius: '12px' },
      showsSocialStyle: { height: '60vh', borderRadius: '12px' },
      gridStyle: { gap: '16px', padding: '0', marginTop: '24px' }
    },
    {
      id: 6,
      name: 'Layout 6: Très compact',
      description: 'Toutes les sections visibles sans trop scroller',
      containerStyle: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
      heroStyle: { height: '45vh', marginTop: '120px', borderRadius: '12px' },
      portfolioStyle: { height: '40vh', marginTop: '20px', borderRadius: '12px' },
      showsSocialStyle: { height: '40vh', borderRadius: '12px' },
      gridStyle: { gap: '16px', padding: '0', marginTop: '20px' }
    },
    {
      id: 7,
      name: 'Layout 7: Cards carrées',
      description: 'Sections avec aspect-ratio 16:9 pour un look cinématique',
      containerStyle: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
      heroStyle: { height: 'auto', aspectRatio: '16/9', marginTop: '120px', borderRadius: '12px' },
      portfolioStyle: { height: 'auto', aspectRatio: '16/9', marginTop: '24px', borderRadius: '12px' },
      showsSocialStyle: { height: 'auto', aspectRatio: '4/5', borderRadius: '12px' },
      gridStyle: { gap: '20px', padding: '0', marginTop: '24px' }
    },
    {
      id: 8,
      name: 'Layout 8: Mix hauteurs fixes + ratio',
      description: 'Hero en 16:9, Shows/Social en portrait',
      containerStyle: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
      heroStyle: { height: 'auto', aspectRatio: '2/1', marginTop: '120px', borderRadius: '16px' },
      portfolioStyle: { height: 'auto', aspectRatio: '21/9', marginTop: '24px', borderRadius: '16px' },
      showsSocialStyle: { height: 'auto', aspectRatio: '3/4', borderRadius: '16px' },
      gridStyle: { gap: '16px', padding: '0', marginTop: '24px' }
    },
  ];

  const currentOption = options.find(o => o.id === selectedOption) || options[0];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'black',
      color: 'white'
    }}>
      {/* Header fixe */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{
          fontSize: '18px',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          Comparaison des layouts - Page Talent
        </h1>

        {/* Sélecteur d'options */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center'
        }}>
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedOption === option.id ? 'white' : 'transparent',
                color: selectedOption === option.id ? 'black' : 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
            >
              {option.id}
            </button>
          ))}
        </div>

        {/* Description */}
        <div style={{
          textAlign: 'center',
          marginTop: '12px'
        }}>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>
            {currentOption.name}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            {currentOption.description}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div style={currentOption.containerStyle}>

        {/* Hero Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#111',
          ...currentOption.heroStyle
        }}>
          <img
            src={TEST_IMAGE}
            alt="Hero"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '0',
            width: '100%',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', letterSpacing: '0.3em', marginBottom: '8px', opacity: 0.7 }}>ZMR</p>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '0.02em' }}>VERONICA GENNADIEVNA</h2>
            <p style={{ fontSize: '11px', marginTop: '16px', letterSpacing: '0.2em', opacity: 0.8 }}>
              PORTFOLIO · SHOWS · INSTAGRAM · WORK
            </p>
          </div>
        </div>

        {/* Measurements mock */}
        <div style={{
          padding: '20px',
          textAlign: 'center',
          borderBottom: '1px solid #222',
          marginTop: currentOption.id === 1 ? '0' : '0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ padding: '4px 12px', border: '1px solid #444', borderRadius: '20px', fontSize: '10px', color: '#999' }}>MODEL</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '11px', color: '#999', flexWrap: 'wrap' }}>
            <span>HEIGHT <span style={{ color: 'white' }}>175CM</span></span>
            <span>EYES <span style={{ color: 'white' }}>BLUE</span></span>
            <span>HAIR <span style={{ color: 'white' }}>BROWN</span></span>
            <span>BUST <span style={{ color: 'white' }}>86CM</span></span>
            <span>WAIST <span style={{ color: 'white' }}>60CM</span></span>
          </div>
        </div>

        {/* Portfolio Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#111',
          ...currentOption.portfolioStyle
        }}>
          <img
            src={TEST_IMAGE}
            alt="Portfolio"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '0',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 900 }}>MY WORK</h2>
            <p style={{ fontSize: '11px', marginTop: '12px', letterSpacing: '0.2em', textDecoration: 'underline' }}>
              VIEW PORTFOLIO
            </p>
          </div>
        </div>

        {/* Shows + Social */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          ...currentOption.gridStyle
        }}>
          {/* SHOWS */}
          <div style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#111',
            ...currentOption.showsSocialStyle
          }}>
            <img
              src={TEST_IMAGE}
              alt="Shows"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '0',
              width: '100%',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 900 }}>SHOWS</h2>
              <p style={{ fontSize: '10px', marginTop: '10px', letterSpacing: '0.2em', textDecoration: 'underline' }}>
                VIEW SHOWS
              </p>
            </div>
          </div>

          {/* SOCIAL */}
          <div style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#111',
            ...currentOption.showsSocialStyle
          }}>
            <img
              src={TEST_IMAGE}
              alt="Social"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '0',
              width: '100%',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 900 }}>SOCIAL</h2>
              <p style={{ fontSize: '10px', marginTop: '10px', letterSpacing: '0.2em', textDecoration: 'underline' }}>
                VIEW INSTAGRAM
              </p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: '100px' }} />

      </div>
    </div>
  );
}
