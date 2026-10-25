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

      // Check if MFA Authenticator App verification is required
      if (res?.mfa_required) {
        return {
          success: false,
          mfaRequired: true,
          challengeToken: res.challenge_token,
          expiresIn: res.expires_in || 300,
          message: res.message || 'Two-factor authenticator verification required.',
          email,
          rememberMe,
        };
      }

      // Safe bootstrap flow (when admin has not enrolled 2FA yet)
      if (res?.tokens) {
        const u = res.user;

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
          isMfaEnabled: Boolean(u.is_mfa_enabled),
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
        errMsg = 'Unable to connect to the server.';
      } else {
        const status = err.response.status;
        const data = err.response.data;

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
   * Step 2: Verify Authenticator TOTP or Recovery Code
   * Connects to POST /api/auth/dealer/mfa/verify/
   */
  const verifyMFA = async ({ challengeToken, code, rememberMe = false, email = '' }) => {
    setLoading(true);
    try {
      if (!challengeToken || !code) {
        throw new Error('Please enter the authenticator verification code.');
      }

      const res = await authApi.dealerVerifyMFA(challengeToken, code);

      if (res?.tokens) {
        const u = res.user;
        const isAuthorizedDealer = Boolean(u?.is_dealer || u?.role === 'DEALER' || u?.is_superuser);
        if (!isAuthorizedDealer) {
          return { success: false, error: 'You are not authorized as a Dealer.' };
        }

        const token = res.tokens.access;
        const refreshToken = res.tokens.refresh;

        sessionStorage.setItem('carcraft_dealer_token', token);
        sessionStorage.setItem('carcraft_dealer_refresh_token', refreshToken);
        sessionStorage.setItem(DEALER_AUTH_KEY, 'true');

        if (rememberMe && email) {
          localStorage.setItem(DEALER_REMEMBER_EMAIL_KEY, email);
          localStorage.setItem('carcraft_dealer_token', token);
          setRememberedEmail(email);
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
          isMfaEnabled: true,
        };

        setDealer(verifiedDealer);
        sessionStorage.setItem('carcraft_dealer_profile', JSON.stringify(verifiedDealer));
        setIsDealerAuthenticated(true);

        return { success: true };
      } else {
        throw new Error('Verification failed. Invalid server response.');
      }
    } catch (err) {
      let errMsg = '';
      if (!err.response) {
        errMsg = 'Unable to connect to the authentication server.';
      } else {
        const data = err.response.data;
        const rawDetail =
          data?.errors?.detail ||
          data?.errors?.code?.[0] ||
          data?.errors?.challenge_token?.[0] ||
          data?.message ||
          data?.error;
        errMsg = typeof rawDetail === 'string' ? rawDetail : 'Invalid or expired verification code.';
      }
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dealer 2FA Management Actions
   */
  const setupMFA = async (password) => {
    return authApi.dealerSetupMFA(password);
  };

  const confirmMFA = async (code) => {
    const res = await authApi.dealerConfirmMFA(code);
    if (res?.success) {
      setDealer((prev) => ({ ...prev, isMfaEnabled: true }));
    }
    return res;
  };

  const getMFAStatus = async () => {
    return authApi.dealerGetMFAStatus();
  };

  const disableMFA = async (password, code) => {
    const res = await authApi.dealerDisableMFA(password, code);
    if (res?.success) {
      setDealer((prev) => ({ ...prev, isMfaEnabled: false }));
    }
    return res;
  };

  const regenerateRecoveryCodes = async (password, code) => {
    return authApi.dealerRegenerateRecoveryCodes(password, code);
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
        verifyMFA,
        setupMFA,
        confirmMFA,
        getMFAStatus,
        disableMFA,
        regenerateRecoveryCodes,
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
