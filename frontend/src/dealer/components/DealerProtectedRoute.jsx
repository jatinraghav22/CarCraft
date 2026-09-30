// ==========================================================================
// CARCRAFT DEALER SUITE - PROTECTED ROUTE COMPONENT
// Ensures unauthorized visitors are redirected to /dealer/login.
// ==========================================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDealerAuth } from '../context/DealerAuthContext';

export default function DealerProtectedRoute({ children }) {
  const { isDealerAuthenticated, loading } = useDealerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#04050a',
          color: '#bef264',
          fontFamily: "'Space Grotesk', monospace",
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(190, 242, 100, 0.2)',
            borderTopColor: '#bef264',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <div style={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Verifying Dealer Atelier Security Credentials...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isDealerAuthenticated) {
    return <Navigate to="/dealer/login" state={{ from: location }} replace />;
  }

  return children;
}
