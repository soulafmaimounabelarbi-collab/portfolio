import React, { createContext, useContext } from 'react';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

type StoreType = ReturnType<typeof usePortfolioStore>;

const PortfolioContext = createContext<StoreType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const store = usePortfolioStore();
  return (
    <PortfolioContext.Provider value={store}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): StoreType {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within <PortfolioProvider>');
  return ctx;
}
