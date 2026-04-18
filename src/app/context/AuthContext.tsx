import React, { createContext, useContext, useState } from 'react';
import { MockUser, MOCK_USERS } from './mockUsers';

interface AuthContextType {
  currentUser: MockUser | null;
  users: MockUser[];
  login: (email: string, password: string) => { success: boolean; error?: string; user?: MockUser };
  logout: () => void;
  addUser: (user: MockUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password. Please check your credentials.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (user: MockUser) => {
    setUsers(prev => [...prev, user]);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, addUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
