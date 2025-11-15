import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '32px clamp(20px, 5vw, 40px) 28px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Legal Links */}
        <nav style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '11px',
          marginBottom: '16px'
        }}>
          <Link
            href="/mentions-legales"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Mentions légales
          </Link>
          <span style={{ color: '#4b5563' }}>·</span>
          <Link
            href="/politique-confidentialite"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Politique de confidentialité
          </Link>
          <span style={{ color: '#4b5563' }}>·</span>
          <Link
            href="/conditions-generales"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#9ca3af'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            Conditions générales
          </Link>
        </nav>

        {/* Copyright */}
        <p style={{
          fontSize: '11px',
          color: '#6b7280'
        }}>
          © {new Date().getFullYear()} ZMR Models Agency. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
