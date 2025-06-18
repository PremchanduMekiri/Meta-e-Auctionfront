


import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';


interface UserData {
  id: string;
  email: string;
  role: 'buyer' | 'supplier' | 'admin';
}

interface AuthContextType {
  userId: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string, role: 'supplier' | 'buyer') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const storedUserId = localStorage.getItem('userId');

    if (storedUser && storedUserId) {
      setUser(JSON.parse(storedUser));
      setUserId(storedUserId);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://meta-e-auction.infororg.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        setUserId(userData.id);
        setIsAdmin(false);

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://meta-e-auction.infororg.com/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const adminData: User = await response.json();
        console.log('Admin login success:', adminData);

        setUser(adminData);
        setUserId(adminData.id);
        setIsAdmin(true);

        localStorage.setItem('userData', JSON.stringify(adminData));
        localStorage.setItem('userId', adminData.id);

        return true;
      } else {
        const errorText = await response.text();
        console.error('Admin login failed:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    role: 'supplier' | 'buyer'
  ): Promise<boolean> => {
    try {
      const response = await fetch('https://meta-e-auction.infororg.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, role }),
      });

      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        setUserId(userData.id);
        setIsAdmin(false);

        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    setIsAdmin(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    window.location.href = '/';

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        isAuthenticated: !!user,
        isAdmin,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
