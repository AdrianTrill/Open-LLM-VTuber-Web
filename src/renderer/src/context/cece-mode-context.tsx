import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type CeceMode = 'customer' | 'training';

interface CeceModeContextType {
  ceceMode: CeceMode;
  switchCeceMode: (mode: CeceMode) => void;
}

const CeceModeContext = createContext<CeceModeContextType>({
  ceceMode: 'customer',
  switchCeceMode: () => {},
});

export function CeceModeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [ceceMode, setCeceMode] = useState<CeceMode>('customer');

  const switchCeceMode = useCallback((mode: CeceMode) => {
    const baseUrl = localStorage.getItem('baseUrl') || '';
    setCeceMode(mode);
    fetch(`${baseUrl}/api/mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
      .then((r) => r.json())
      .then((d) => setCeceMode(d.mode || mode))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const baseUrl = localStorage.getItem('baseUrl') || '';
    fetch(`${baseUrl}/api/mode`)
      .then((r) => r.json())
      .then((d) => setCeceMode(d.mode || 'customer'))
      .catch(() => {});

    const interval = setInterval(() => {
      fetch(`${baseUrl}/api/mode`)
        .then((r) => r.json())
        .then((d) => setCeceMode(d.mode || 'customer'))
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(() => ({ ceceMode, switchCeceMode }), [ceceMode, switchCeceMode]);

  return (
    <CeceModeContext.Provider value={value}>
      {children}
    </CeceModeContext.Provider>
  );
}

export const useCeceMode = () => useContext(CeceModeContext);
