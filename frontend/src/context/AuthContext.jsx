import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

const STORAGE_KEY = 'carcraft_auth_user_v1';

export const DEMO_PROFILES = [
  {
    id: 'usr_apex_01',
    login: 'rahul_sharma',
    password: 'Customer@123',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    tier: 'Apex VIP',
    badge: 'CONCIERGE ACCESS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'March 2024',
    allocationTier: 'Priority Level 1',
  },
  {
    id: 'usr_track_02',
    login: 'rohit',
    password: 'Customer@123',
    name: 'Rohit Verma',
    email: 'rohit@example.com',
    tier: 'Circuit Pilot',
    badge: 'NÜRBURGRING CERTIFIED',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'January 2025',
    allocationTier: 'Track Certified',
  },
  {
    id: 'usr_collector_03',
    login: 'ananya',
    password: 'Customer@123',
    name: 'Ananya Sen',
    email: 'ananya@example.com',
    tier: 'Heritage Collector',
    badge: 'PRIVATE GARAGE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'November 2023',
    allocationTier: 'Collector Reserve',
  }
];

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync profile from backend on app mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('carcraft_access_token');
    if (token) {
      authApi.getProfile()
        .then((res) => {
          if (res?.user) {
            const apiUser = res.user;
            setUser((prev) => ({
              ...prev,
              id: apiUser.id,
              username: apiUser.username,
              name: [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || apiUser.username,
              email: apiUser.email,
              role: apiUser.role,
              phone: apiUser.phone || '',
              customerProfile: apiUser.customer_profile || {},
              tier: prev?.tier || 'Apex VIP',
              badge: prev?.badge || 'VERIFIED CLIENT',
              avatar: prev?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            }));
          }
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('carcraft_access_token');
          localStorage.removeItem('carcraft_refresh_token');
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(emailOrUsername, password);
      if (res?.tokens) {
        localStorage.setItem('carcraft_access_token', res.tokens.access);
        localStorage.setItem('carcraft_refresh_token', res.tokens.refresh);

        const apiUser = res.user;
        const formattedUser = {
          id: apiUser.id,
          username: apiUser.username,
          name: [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || apiUser.username,
          email: apiUser.email,
          role: apiUser.role,
          phone: apiUser.phone || '',
          customerProfile: apiUser.customer_profile || {},
          tier: 'Apex VIP',
          badge: apiUser.role === 'DEALER' ? 'PRINCIPAL DEALER' : 'VERIFIED MEMBER',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          joinedDate: 'Member',
          allocationTier: 'Standard Priority',
          token: res.tokens.access,
        };

        setUser(formattedUser);
        addToast(`Welcome back, ${formattedUser.name}`, 'success');
        return formattedUser;
      } else {
        throw new Error('Invalid response from authentication server');
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.errors?.detail ||
        err.response?.data?.errors?.non_field_errors?.[0] ||
        err.response?.data?.message ||
        'Authentication failed. Please verify your credentials.';
      addToast(errMsg, 'error');
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (profileIndex = 0) => {
    const demo = DEMO_PROFILES[profileIndex] || DEMO_PROFILES[0];
    try {
      return await login(demo.login, demo.password);
    } catch {
      // Graceful fallback to static demo profile if backend server is rebooting
      setUser(demo);
      addToast(`Authenticated as ${demo.name} (${demo.tier})`, 'success');
      return demo;
    }
  };

  const register = async ({ name, username, email, password, phone, tier = 'Apex VIP' }) => {
    setLoading(true);
    try {
      // Split name into first and last
      const nameParts = (name || '').trim().split(' ');
      const firstName = nameParts[0] || username;
      const lastName = nameParts.slice(1).join(' ') || '';
      const autoUsername = username || email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');

      const res = await authApi.register({
        username: autoUsername,
        email,
        password,
        confirm_password: password,
        first_name: firstName,
        last_name: lastName,
        phone: phone || '',
      });

      if (res?.tokens) {
        localStorage.setItem('carcraft_access_token', res.tokens.access);
        localStorage.setItem('carcraft_refresh_token', res.tokens.refresh);

        const apiUser = res.user;
        const formattedUser = {
          id: apiUser.id,
          username: apiUser.username,
          name: [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || apiUser.username,
          email: apiUser.email,
          role: apiUser.role,
          tier,
          badge: 'CONCIERGE ACCESS',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          token: res.tokens.access,
        };

        setUser(formattedUser);
        addToast(`Registration complete. Welcome to CARCRAFT, ${formattedUser.name}`, 'success');
        return formattedUser;
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.errors?.username?.[0] ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        'Registration failed. Please check your details.';
      addToast(errMsg, 'error');
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const prevName = user?.name || 'User';
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('carcraft_access_token');
    localStorage.removeItem('carcraft_refresh_token');
    addToast(`${prevName} signed out successfully`, 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        demoProfiles: DEMO_PROFILES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
