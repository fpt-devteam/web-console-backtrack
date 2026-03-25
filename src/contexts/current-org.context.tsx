import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setActiveOrgId } from '@/lib/api-client';

const STORAGE_KEY = 'backtrack_current_org_id';

function getStored(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStored(orgId: string | null) {
  try {
    if (orgId) sessionStorage.setItem(STORAGE_KEY, orgId);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

type CurrentOrgContextValue = {
  currentOrgId: string | null;
  setCurrentOrgId: (orgId: string | null) => void;
};

const CurrentOrgContext = createContext<CurrentOrgContextValue | null>(null);

export function CurrentOrgProvider({ children }: { children: React.ReactNode }) {
  const [currentOrgId, setState] = useState<string | null>(getStored);

  const setCurrentOrgId = useCallback((orgId: string | null) => {
    setState(orgId);
    setStored(orgId);
    setActiveOrgId(orgId); // keep Axios interceptor in sync
  }, []);

  // On mount: restore the bridge from sessionStorage (handles page refresh)
  useEffect(() => {
    setActiveOrgId(currentOrgId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ currentOrgId, setCurrentOrgId }),
    [currentOrgId, setCurrentOrgId]
  );

  return (
    <CurrentOrgContext.Provider value={value}>
      {children}
    </CurrentOrgContext.Provider>
  );
}

export function useCurrentOrgId(): CurrentOrgContextValue {
  const ctx = useContext(CurrentOrgContext);
  if (!ctx) throw new Error('useCurrentOrgId must be used within CurrentOrgProvider');
  return ctx;
}
