import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { requireLogin } from '../utils/authGuard';
import LoginRequiredModal from './LoginRequiredModal';

const AuthActionGuardContext = createContext(null);

export function AuthActionGuardProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const guardCustomerAction = () => requireLogin(isAuthenticated, setShowLoginModal);

    return (
        <AuthActionGuardContext.Provider value={guardCustomerAction}>
            {children}
            <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                message="Login required to continue."
            />
        </AuthActionGuardContext.Provider>
    );
}

export function useRequireLogin() {
    const guardCustomerAction = useContext(AuthActionGuardContext);
    if (!guardCustomerAction) {
        throw new Error('useRequireLogin must be used within an AuthActionGuardProvider');
    }
    return guardCustomerAction;
}