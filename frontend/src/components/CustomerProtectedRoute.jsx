import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CustomerProtectedRoute({ children }) {
    const location = useLocation();
    const { isAuthenticated, user, authLoading } = useAuth();

    if (authLoading) {
        return <div style={{ minHeight: '100vh', background: '#040508' }} />;
    }

    if (!isAuthenticated || !user || user.role === 'DEALER') {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}