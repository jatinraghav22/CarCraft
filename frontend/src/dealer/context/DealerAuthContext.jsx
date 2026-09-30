import React, { createContext, useContext, useState, useEffect } from 'react';
import { dealerInfoMock } from '../data/dealerMock';
import authApi from '../../api/authApi';

const DealerAuthContext = createContext(null);

const DEALER_AUTH_KEY = 'carcraft_dealer_authenticated';
const DEALER_REMEMBER_EMAIL_KEY = 'carcraft_dealer_remembered_email';

export function DealerAuthProvider({ children }) {
  const [dealer, setDealer] = useState(() => {
    try {
      const saved = sessionStorage.getItem('carcraft_dealer_profile') || localStorage.getItem('carcraft_dealer_profile');
      return saved ? JSON.parse(saved) : dealerInfoMock;
    } catch {
      return dealerInfoMock;
    }
  });

  const [isDealerAuthenticated, setIsDealerAuthenticated] = useState(() => {
    const token = sessionStorage.getItem('carcraft_dealer_token') || localStorage.getItem('carcraft_dealer_token');
    const storedAuth = sessionStorage.getItem(DEALER_AUTH_KEY);
    return Boolean(token && storedAuth === 'true');
  });

  const [loading, setLoading] = useState(false);
  const [rememberedEmail, setRememberedEmail] = useState(() => {
    return localStorage.getItem(DEALER_REMEMBER_EMAIL_KEY) || 'admin';
  });

  // Verify and sync profile on mount if token exists
  useEffect(() => {
    const token = sessionStorage.getItem('carcraft_dealer_token') || localStorage.getItem('carcraft_dealer_token');
    if (token) {
      authApi.getProfile()
        .then((res) => {
          if (res?.user && (res.user.role === 'DEALER' || res.user.is_dealer || res.user.is_superuser)) {
            const u = res.user;
            const profile = u.dealer_profile || u.profile || {};
            const updatedDealer = {
              dealerId: `DLR-${u.id}`,
              name: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username,
              username: u.username,
              email: u.email,
              phone: u.phone || '+91 98450 12890',
              businessName: profile.dealership_name || 'CarCraft Atelier & Master Dealership',
              licenseNumber: profile.license_number || 'CC-IN-88291',
              status: 'ACTIVE',
              tier: 'Flagship Principal Dealer',
              role: u.role,
            };
            setDealer(updatedDealer);
            setIsDealerAuthenticated(true);
            sessionStorage.setItem(DEALER_AUTH_KEY, 'true');
            sessionStorage.setItem('carcraft_dealer_profile', JSON.stringify(updatedDealer));
          } else {
            // Not a dealer account
            logout();
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    }
  }, []);

  // Keep sessionStorage in sync
  useEffect(() => {
    sessionStorage.setItem(DEALER_AUTH_KEY, String(isDealerAuthenticated));
  }, [isDealerAuthenticated]);

  /**
   * Dealer Login action
   * Connects to POST /api/auth/dealer/login/
   */
  const login = async ({ email, password, rememberMe = false }) => {
    setLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Please enter both dealer identifier and password.');
      }

      const res = await authApi.dealerLogin(email, password);

      if (res?.tokens) {
        const u = res.user;

        // Step 11: Validate Dealer / Admin role explicitly
        const isAuthorizedDealer = Boolean(u?.is_dealer || u?.role === 'DEALER' || u?.is_superuser);
        if (!isAuthorizedDealer) {
          return { success: false, error: 'You are not authorized as a Dealer.' };
        }

        const token = res.tokens.access;
        const refreshToken = res.tokens.refresh;

        sessionStorage.setItem('carcraft_dealer_token', token);
        sessionStorage.setItem('carcraft_dealer_refresh_token', refreshToken);
        sessionStorage.setItem(DEALER_AUTH_KEY, 'true');

        if (rememberMe) {
          localStorage.setItem(DEALER_REMEMBER_EMAIL_KEY, email);
          localStorage.setItem('carcraft_dealer_token', token);
          setRememberedEmail(email);
        } else {
          localStorage.removeItem(DEALER_REMEMBER_EMAIL_KEY);
          localStorage.removeItem('carcraft_dealer_token');
          setRememberedEmail('');
        }

        const profile = u.dealer_profile || u.profile || {};
        const verifiedDealer = {
          dealerId: `DLR-${u.id}`,
          name: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username,
          username: u.username,
          email: u.email,
          phone: u.phone || '+91 98450 12890',
          businessName: profile.dealership_name || 'CarCraft Atelier & Master Dealership',
          licenseNumber: profile.license_number || 'CC-IN-88291',
          status: 'ACTIVE',
          tier: 'Flagship Principal Dealer',
          role: u.role,
        };

        setDealer(verifiedDealer);
        sessionStorage.setItem('carcraft_dealer_profile', JSON.stringify(verifiedDealer));
        setIsDealerAuthenticated(true);

        return { success: true };
      } else {
        throw new Error('Authentication failed. Invalid server response.');
      }
    } catch (err) {
      let errMsg = '';
      if (!err.response) {
        // Network connection failure (e.g. backend server stopped, ECONNREFUSED)
        errMsg = 'Unable to connect to the server.';
      } else {
        const status = err.response.status;
        const data = err.response.data;

        // Extract detailed validation message if provided by Django REST Framework
        const rawDetail =
          data?.errors?.detail ||
          data?.errors?.non_field_errors ||
          data?.detail ||
          data?.message ||
          data?.error;

        const specificError = Array.isArray(rawDetail)
          ? rawDetail[0]
          : (typeof rawDetail === 'string' ? rawDetail : null);

        if (status === 401) {
          errMsg = specificError || 'Invalid username or password.';
        } else if (status === 403) {
          errMsg = specificError || 'You are not authorized as a Dealer.';
        } else if (status === 404) {
          errMsg = 'Dealer login API was not found.';
        } else if (status >= 500) {
          errMsg = 'Server error. Please try again.';
        } else if (specificError) {
          errMsg = specificError;
        } else {
          errMsg = 'Invalid username or password.';
        }
      }
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dealer Logout action
   */
  const logout = () => {
    sessionStorage.removeItem('carcraft_dealer_token');
    sessionStorage.removeItem('carcraft_dealer_refresh_token');
    sessionStorage.removeItem('carcraft_dealer_profile');
    localStorage.removeItem('carcraft_dealer_token');
    localStorage.removeItem('carcraft_dealer_profile');
    sessionStorage.setItem(DEALER_AUTH_KEY, 'false');
    setIsDealerAuthenticated(false);
  };


  return (
    <DealerAuthContext.Provider
      value={{
        dealer,
        isDealerAuthenticated,
        login,
        logout,
        loading,
        rememberedEmail
      }}
    >
      {children}
    </DealerAuthContext.Provider>
  );
}

export function useDealerAuth() {
  const context = useContext(DealerAuthContext);
  if (!context) {
    throw new Error('useDealerAuth must be used within a DealerAuthProvider');
  }
  return context;
}

export default DealerAuthContext;
