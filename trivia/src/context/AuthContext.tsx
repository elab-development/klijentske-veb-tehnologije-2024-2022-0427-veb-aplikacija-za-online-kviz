import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '../types/auth';
import { AuthService } from '../lib/auth/AuthService';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage
    setUser(AuthService.getCurrent());
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        const u = AuthService.login(email, password);
        setUser(u);
      },
      register: async (name: string, email: string, password: string) => {
        const u = AuthService.register(name, email, password);
        setUser(u);
      },
      logout: () => {
        AuthService.logout();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
