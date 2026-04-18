import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<string | null>;
  register: (name: string, email: string, password: string, role: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('currentUser');
      
      if (token && storedUser) {
        try {
          // In a real app, we might verify the token with the backend here
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<string | null> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      if (user.role !== role) {
        return `You are not registered as a ${role}`;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      
      return null;
    } catch (error: any) {
      return error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<string | null> => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      
      return null;
    } catch (error: any) {
      return error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

