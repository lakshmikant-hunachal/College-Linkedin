import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, adminCode?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  switchAccount: (role: UserRole, adminCode?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string, adminCode?: string) => {
    const res = await api.post('/auth/login', { email, password, adminCode });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    setUser(res.data.user);
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const switchAccount = async (role: UserRole, adminCode?: string) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/switch-account', { role, adminCode });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchAccount,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
