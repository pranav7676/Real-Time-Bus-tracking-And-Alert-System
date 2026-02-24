import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, getToken, setToken, removeToken } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  countryCode?: string;
  onboardingDone?: boolean;
  plan?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; countryCode?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setIsLoaded(true);
        return;
      }
      const profile = await api.getProfile();
      setUser({
        id: profile._id || profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        phone: profile.phone,
        countryCode: profile.countryCode,
        onboardingDone: profile.onboardingDone,
        plan: profile.plan,
      });
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; countryCode?: string }) => {
    const res = await api.register(data);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoaded,
      isSignedIn: !!user,
      login,
      register,
      logout,
      updateUser,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
