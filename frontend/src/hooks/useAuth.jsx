import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccount, setHasAdminAccount] = useState(true); // Default to true, or we can check with an API call

  useEffect(() => {
    const initAuth = async () => {
        const savedUser = localStorage.getItem('gate_admin_user');
        const token = localStorage.getItem('gate_access_token');
        
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    };
    initAuth();
  }, []);

  const register = async (email, password) => {
    try {
      const result = await apiService.register(email, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const login = async (identifier, password) => {
    try {
      const result = await apiService.login(identifier, password);
      if (result.success) {
        setUser(result.user);
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.detail || 'Invalid email or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gate_admin_user');
    localStorage.removeItem('gate_access_token');
    localStorage.removeItem('gate_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user, 
      hasAdminAccount,
      loading 
    }}>
      {!loading && children}
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
