'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// URL de base pour l'auth membre
const MEMBER_AUTH_BASE = '/api/auth/member';

export default function MemberLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Gérer les messages des query params
    const verified = searchParams.get('verified');
    const pendingApproval = searchParams.get('pending_approval');
    const newAccount = searchParams.get('new_account');
    const errorParam = searchParams.get('error');

    if (verified === 'true') {
      if (pendingApproval === 'true') {
        setSuccess('Votre email a été vérifié ! Votre compte est maintenant en attente de validation par un administrateur. Vous recevrez un email une fois approuvé.');
      } else {
        setSuccess('Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.');
      }
    }

    if (errorParam === 'invalid_token') {
      setError('Le lien de vérification est invalide ou a déjà été utilisé.');
    } else if (errorParam === 'token_expired') {
      setError('Le lien de vérification a expiré. Veuillez demander un nouveau lien.');
    } else if (errorParam === 'verification_failed') {
      setError('La vérification a échoué. Veuillez réessayer.');
    } else if (errorParam === 'pending_approval') {
      if (newAccount === 'true') {
        setSuccess('Votre compte a été créé ! Il est en attente de validation par un administrateur. Vous recevrez un email une fois approuvé.');
      } else {
        setError('Votre compte est en attente de validation par un administrateur. Vous recevrez un email une fois approuvé.');
      }
    } else if (errorParam === 'suspended') {
      setError('Votre compte a été suspendu. Contactez-nous pour plus d\'informations.');
    } else if (errorParam === 'banned') {
      setError('Votre compte a été banni.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Appel à notre propre API de login membre
      const res = await fetch('/api/members/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Email ou mot de passe incorrect');
        return;
      }

      // Succès - rediriger vers la page d'accueil
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Rediriger vers l'auth Google via l'API membre
    window.location.href = `${MEMBER_AUTH_BASE}/signin/google?callbackUrl=/`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: '#0f172a',
          padding: '40px 30px',
          textAlign: 'center',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 300,
              letterSpacing: '4px',
              margin: 0,
            }}>
              ZMR MODELS
            </h1>
          </Link>
          <p style={{
            color: '#94a3b8',
            fontSize: '13px',
            marginTop: '8px',
            letterSpacing: '1px',
          }}>
            ESPACE MEMBRE
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '40px 30px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '8px',
            textAlign: 'center',
          }}>
            Connexion
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '30px',
            textAlign: 'center',
          }}>
            Accédez à votre espace membre
          </p>

          {/* Messages */}
          {success && (
            <div style={{
              padding: '12px 16px',
              background: '#dcfce7',
              borderRadius: '8px',
              color: '#166534',
              fontSize: '14px',
              marginBottom: '20px',
            }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#fee2e2',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '12px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '20px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#475569',
                marginBottom: '6px',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="vous@exemple.com"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#475569',
                marginBottom: '6px',
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                placeholder="Votre mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#94a3b8' : '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.background = '#1e293b')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.background = '#0f172a')}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Pas encore de compte ?{' '}
              <Link href="/member/register" style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: 500,
              }}>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          background: '#f8fafc',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
        }}>
          <Link href="/" style={{
            fontSize: '13px',
            color: '#64748b',
            textDecoration: 'none',
          }}>
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
