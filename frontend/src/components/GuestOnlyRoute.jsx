import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard that redirects already-authenticated customers away from
 * guest-only pages (such as /login and /register) directly to the CarCraft homepage ("/").
 * 
 * Waits for session restoration (authLoading) to prevent UI flicker or false logouts.
 * Strictly distinguishes customers from dealer users so dealer workflows remain intact.
 */
export default function GuestOnlyRoute({ children }) {
  const { isAuthenticated, user, authLoading } = useAuth();

  const customerIsLoggedIn = Boolean(
    isAuthenticated &&
    user &&
    (!user.role || user.role === 'CUSTOMER' || user.role !== 'DEALER')
  );

  // While restoring customer session from token, do not flash guest UI
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#040508' }} />
    );
  }

  // If already authenticated customer, redirect to homepage
  if (customerIsLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
