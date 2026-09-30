import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('carcraft_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('carcraft_compare', JSON.stringify(compareList));
    } catch (e) {
      console.error('Failed to save compare list to localStorage', e);
    }
  }, [compareList]);

  const addToCompare = (vehicle) => {
    if (!vehicle || !vehicle.id) return { success: false, message: 'Invalid vehicle' };
    if (compareList.some((v) => v.id === vehicle.id)) {
      setCompareList((prev) => prev.filter((v) => v.id !== vehicle.id));
      return { success: true, action: 'removed', message: `${vehicle.model} removed from compare.` };
    }
    if (compareList.length >= 3) {
      return { success: false, action: 'limit', message: 'Maximum 3 vehicles can be compared simultaneously.' };
    }
    setCompareList((prev) => [...prev, vehicle]);
    return { success: true, action: 'added', message: `${vehicle.model} added to compare (${compareList.length + 1}/3).` };
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) => prev.filter((v) => v.id !== id));
  };

  const isInCompare = (id) => {
    return compareList.some((v) => v.id === id);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        compareCount: compareList.length,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
