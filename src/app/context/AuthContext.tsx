import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  uid?: string;
  branch?: string;
  token?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session on mount
    const checkSession = async () => {
      const savedUser = localStorage.getItem('nexus_user');
      const token = localStorage.getItem('nexus_token');
      if (savedUser && token) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser({ ...user, token });
        } catch (e) {
          localStorage.removeItem('nexus_user');
          localStorage.removeItem('nexus_token');
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { token, user } = data.data;
        const userWithToken = { ...user, token };
        
        setCurrentUser(userWithToken);
        localStorage.setItem('nexus_user', JSON.stringify(user));
        localStorage.setItem('nexus_token', token);
        
        return { success: true, user: userWithToken };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Authentication failed.' };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed.' };
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_token');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
