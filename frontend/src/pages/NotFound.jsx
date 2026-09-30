import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#06080c' }}>
      <Navbar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 24px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(190, 242, 100, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(190, 242, 100, 0.08)',
            border: '1px solid rgba(190, 242, 100, 0.25)',
            color: '#bef264',
            fontSize: '11px',
            fontFamily: 'Space Grotesk, monospace',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          <Compass size={14} />
          TELEMETRY COORDINATE LOST // 404
        </div>

        <h1
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          PAGE NOT FOUND
        </h1>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: '#94a3b8',
            maxWidth: '460px',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          The requested track coordinate or inventory asset does not exist in the CARCRAFT database.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            borderRadius: '12px',
            background: '#bef264',
            color: '#080a08',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            boxShadow: '0 0 25px rgba(190, 242, 100, 0.4)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 35px rgba(190, 242, 100, 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(190, 242, 100, 0.4)';
          }}
        >
          <ArrowLeft size={18} />
          BACK TO CARCRAFT
        </Link>
      </div>
      <Footer />
    </div>
  );
}
