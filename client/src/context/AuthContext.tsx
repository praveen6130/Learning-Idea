import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isHost: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber: string, role?: string, bio?: string) => Promise<void>;
  forgotPassword: (email: string, phoneNumber: string, newPassword: string) => Promise<void>;
  logout: () => void;
  switchPersona: (persona: 'host' | 'student-approved' | 'student-pending' | 'admin-pending') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize or fetch user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Token validation failed, clearing token');
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      // If no stored token, user stays null so they can sign in or register with their own credentials!
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      localStorage.setItem('auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phoneNumber: string, role = 'student', bio = '') => {
    setIsLoading(true);
    try {
      const res = await authApi.register({ name, email, password, phoneNumber, role, bio });
      localStorage.setItem('auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string, phoneNumber: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email, phoneNumber, newPassword });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const switchPersona = async (persona: 'host' | 'student-approved' | 'student-pending' | 'admin-pending') => {
    setIsLoading(true);
    try {
      const res = await authApi.switchPersona(persona);
      localStorage.setItem('auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const isApproved = user ? user.status === 'approved' || user.role === 'host' : false;
  const isAdmin = user ? user.role === 'admin' || user.role === 'host' : false;
  const isHost = user ? user.role === 'host' : false;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isApproved,
        isAdmin,
        isHost,
        login,
        register,
        forgotPassword,
        logout,
        switchPersona,
        refreshUser,
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
