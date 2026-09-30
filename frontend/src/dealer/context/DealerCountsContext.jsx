import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import dealerApi from '../services/dealerApi';

const DealerCountsContext = createContext(null);

export function DealerCountsProvider({ children }) {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchCounts = useCallback(async () => {
    try {
      setError(null);
      const res = await dealerApi.getNavigationCounts();
      if (res && res.success) {
        setCounts({
          testDrives: res.test_drives,
          pendingTestDrives: res.pending_test_drives,
          serviceAppointments: res.service_appointments,
          pendingServiceAppointments: res.pending_service_appointments,
          clientOrders: res.client_orders,
          pendingOrders: res.pending_orders,
          inventory: res.inventory,
          availableVehicles: res.available_vehicles,
          totalParts: res.total_parts,
          notifications: res.notifications,
        });
      } else {
        setCounts(null);
      }
    } catch (err) {
      console.error('[DealerCounts] Failed to load real database counts:', err);
      setError(err.message || 'Failed to load telemetry counts');
      setCounts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on initial mount and route change
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, location.pathname]);

  // Refetch when window regains focus to reflect live customer bookings immediately
  useEffect(() => {
    const handleFocus = () => {
      fetchCounts();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchCounts]);

  // Periodic background telemetry refresh (every 20s)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCounts();
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchCounts]);

  return (
    <DealerCountsContext.Provider
      value={{
        counts,
        loading,
        error,
        refreshCounts: fetchCounts,
      }}
    >
      {children}
    </DealerCountsContext.Provider>
  );
}

export function useDealerCounts() {
  const context = useContext(DealerCountsContext);
  if (!context) {
    return {
      counts: null,
      loading: false,
      error: null,
      refreshCounts: () => {},
    };
  }
  return context;
}

export default DealerCountsContext;
