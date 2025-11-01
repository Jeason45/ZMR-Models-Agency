'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactDemoPage() {
  const [selectedDesign, setSelectedDesign] = useState(1);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      padding: '40px 20px',
      color: 'white'
    }}>
      <Link href="/contact" style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        color: 'white',
        textDecoration: 'none',
        fontSize: '14px',
        opacity: 0.7,
        zIndex: 1000
      }}>
        ← Retour
      </Link>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: 200,
          letterSpacing: '0.1em',
          marginBottom: '60px'
        }}>
          PROPOSITIONS DE DESIGN - PAGE CONTACT
        </h1>

        {/* Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '60px',
          flexWrap: 'wrap'
        }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedDesign(num)}
              style={{
                padding: '12px 24px',
                backgroundColor: selectedDesign === num ? 'white' : 'transparent',
                color: selectedDesign === num ? 'black' : 'white',
                border: '1px solid white',
                cursor: 'pointer',
                fontSize: '13px',
                letterSpacing: '0.1em',
                transition: 'all 0.3s'
              }}
            >
              OPTION {num}
            </button>
          ))}
        </div>

        {/* Design 1: Radio Buttons Horizontal */}
        {selectedDesign === 1 && (
          <DesignOption1 />
        )}

        {/* Design 2: Liste Verticale Minimaliste */}
        {selectedDesign === 2 && (
          <DesignOption2 />
        )}

        {/* Design 3: Tabs Style */}
        {selectedDesign === 3 && (
          <DesignOption3 />
        )}

        {/* Design 4: Cards Horizontal Slim */}
        {selectedDesign === 4 && (
          <DesignOption4 />
        )}

        {/* Design 5: Dropdown Select Élégant */}
        {selectedDesign === 5 && (
          <DesignOption5 />
        )}

        {/* Design 6: Boutons Pills */}
        {selectedDesign === 6 && (
          <DesignOption6 />
        )}
      </div>
    </main>
  );
}

// OPTION 1: Radio Buttons Horizontal
function DesignOption1() {
  const [selected, setSelected] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 300,
        letterSpacing: '0.1em',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Quelle est la nature de votre demande ?
      </h2>

      <div style={{
        display: 'flex',
        gap: '60px',
        justifyContent: 'center',
        marginBottom: '60px'
      }}>
        {['Professional', 'Model'].map((type) => (
          <label
            key={type}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              cursor: 'pointer',
              transition: 'opacity 0.3s',
              opacity: selected === type || !selected ? 1 : 0.4
            }}
            onClick={() => setSelected(type)}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '2px',
              transition: 'all 0.3s'
            }}>
              {selected === type && (
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'white'
                }} />
              )}
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: 400,
                marginBottom: '6px',
                letterSpacing: '0.05em'
              }}>
                {type === 'Professional' ? 'Demande Professionnelle' : 'Devenir Mannequin'}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 300,
                letterSpacing: '0.03em'
              }}>
                {type === 'Professional' ? 'Castings, shootings, collaborations' : 'Rejoindre notre agence'}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// OPTION 2: Liste Verticale Minimaliste
function DesignOption2() {
  const [selected, setSelected] = useState('');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 300,
        letterSpacing: '0.1em',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Quelle est la nature de votre demande ?
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {[
          { value: 'Professional', title: 'Demande Professionnelle', desc: 'Castings, shootings, collaborations' },
          { value: 'Model', title: 'Devenir Mannequin', desc: 'Rejoindre notre agence' }
        ].map((option) => (
          <div
            key={option.value}
            onClick={() => setSelected(option.value)}
            style={{
              padding: '24px 32px',
              borderLeft: `2px solid ${selected === option.value ? 'white' : 'transparent'}`,
              backgroundColor: selected === option.value ? 'rgba(255,255,255,0.03)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{
              fontSize: '16px',
              fontWeight: 400,
              marginBottom: '6px',
              letterSpacing: '0.05em'
            }}>
              {option.title}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 300
            }}>
              {option.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// OPTION 3: Tabs Style
function DesignOption3() {
  const [selected, setSelected] = useState('Professional');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 300,
        letterSpacing: '0.1em',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Quelle est la nature de votre demande ?
      </h2>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '40px'
      }}>
        {[
          { value: 'Professional', label: 'Demande Professionnelle' },
          { value: 'Model', label: 'Devenir Mannequin' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelected(tab.value)}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${selected === tab.value ? 'white' : 'transparent'}`,
              color: selected === tab.value ? 'white' : 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontWeight: 400
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p style={{
        textAlign: 'center',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 300
      }}>
        {selected === 'Professional' ? 'Castings, shootings, collaborations' : 'Rejoindre notre agence'}
      </p>
    </div>
  );
}

// OPTION 4: Cards Horizontal Slim
function DesignOption4() {
  const [selected, setSelected] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 300,
        letterSpacing: '0.1em',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Quelle est la nature de votre demande ?
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {[
          { value: 'Professional', title: 'Demande Professionnelle', desc: 'Castings, shootings' },
          { value: 'Model', title: 'Devenir Mannequin', desc: 'Rejoindre l\'agence' }
        ].map((option) => (
          <div
            key={option.value}
            onClick={() => setSelected(option.value)}
            style={{
              padding: '20px 24px',
              border: `1px solid ${selected === option.value ? 'white' : 'rgba(255,255,255,0.2)'}`,
              backgroundColor: selected === option.value ? 'rgba(255,255,255,0.05)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '15px',
              fontWeight: 400,
              marginBottom: '6px',
              letterSpacing: '0.05em'
            }}>
              {option.title}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}>
              {option.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// OPTION 5: Dropdown Select Élégant
function DesignOption5() {
  const [selected, setSelected] = useState('');

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 300,
        letterSpacing: '0.1em',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Quelle est la nature de votre demande ?
      </h2>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{
          width: '100%',
          padding: '20px',
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '15px',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          outline: 'none',
          fontWeight: 300
        }}
      >
        <option value="" style={{ backgroundColor: '#000' }}>Sélectionnez une option</option>
        <option value="Professional" style={{ backgroundColor: '#000' }}>Demande Professionnelle - Castings, shootings</option>
        <option value="Model" style={{ backgroundColor: '#000' }}>Devenir Mannequin - Rejoindre notre agence</option>
      </select>
    </div>
  );
}

// OPTION 6: Boutons Pills
function DesignOption6() {
  const [selected, setSelected] = useState('');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 300,
        letterSpacing: '0.1em',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Quelle est la nature de votre demande ?
      </h2>

      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {[
          { value: 'Professional', label: 'Demande Professionnelle' },
          { value: 'Model', label: 'Devenir Mannequin' }
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            style={{
              padding: '14px 32px',
              backgroundColor: selected === option.value ? 'white' : 'transparent',
              color: selected === option.value ? 'black' : 'white',
              border: '1px solid white',
              borderRadius: '30px',
              fontSize: '13px',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontWeight: 400,
              textTransform: 'uppercase'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {selected && (
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 300
        }}>
          {selected === 'Professional' ? 'Castings, shootings, collaborations' : 'Rejoindre notre agence'}
        </p>
      )}
    </div>
  );
}
