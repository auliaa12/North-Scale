import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Customer
  const [admin, setAdmin] = useState(null); // Admin
  const [loading, setLoading] = useState(true);

  const loginAdmin = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: adminData, token } = response.data;
      localStorage.setItem('admin_token', token);
      setAdmin({ ...adminData, role: 'admin' });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await userAPI.login(credentials);
      const { user: userData, token } = response.data;
      localStorage.setItem('user_token', token);
      setUser({ ...userData, role: 'user' });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  };

  const logout = async (role = 'user') => {
    try {
      if (role === 'admin') {
        await authAPI.logout();
        localStorage.removeItem('admin_token');
        setAdmin(null);
      } else {
        await userAPI.logout();
        localStorage.removeItem('user_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force cleanup
      if (role === 'admin') {
        localStorage.removeItem('admin_token');
        setAdmin(null);
      } else {
        localStorage.removeItem('user_token');
        setUser(null);
      }
    }
  };

  const checkAuth = async () => {
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('user_token');

    // Check Admin Token
    if (adminToken) {
      try {
        const response = await authAPI.getUser();
        setAdmin({ ...response.data, role: 'admin' });
      } catch (error) {
        localStorage.removeItem('admin_token');
        setAdmin(null);
      }
    }

    // Check User Token (Independent)
    if (userToken) {
      try {
        const response = await userAPI.getCurrentUser();
        setUser({ ...response.data, role: 'user' });
      } catch (error) {
        localStorage.removeItem('user_token');
        setUser(null);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,   // Customer
    admin,  // Admin
    loading,
    loginAdmin,
    loginUser,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdminAuthenticated: !!admin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



