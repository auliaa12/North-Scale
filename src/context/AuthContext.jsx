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

      if (adminData.role !== 'admin') {
        return {
          success: false,
          message: 'Access denied. You are not an admin.'
        };
      }

      localStorage.setItem('admin_token', token);
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      console.error("Admin Login Error Details:", error);
      if (!error.response) {
        return {
          success: false,
          message: 'Network Error: Unable to connect to server. Check console for "Mixed Content" or CORS errors.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await userAPI.login(credentials);
      const { user: userData, token } = response.data;

      if (userData.role === 'admin') {
        return {
          success: false,
          message: 'Admin account detected. Please use Admin Login.'
        };
      }

      localStorage.setItem('user_token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Login Error Details:", error);
      if (!error.response) {
        return {
          success: false,
          message: 'Network Error: Unable to connect to server. Check console for "Mixed Content" or CORS errors.'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
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
    // Check LocalStorage instead of SessionStorage for persistence
    const adminToken = localStorage.getItem('admin_token');
    const userToken = localStorage.getItem('user_token');

    console.log("Checking auth...", { adminToken, userToken });

    // Check Admin Token
    if (adminToken) {
      try {
        const response = await authAPI.getUser({
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (response.data.role !== 'admin') {
          // Token is valid but user is not admin
          console.error("Access denied: User is not admin");
          localStorage.removeItem('admin_token');
          setAdmin(null);
        } else {
          console.log("Admin verified:", response.data);
          setAdmin(response.data);
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
        localStorage.removeItem('admin_token');
        setAdmin(null);
      }
    }

    // Check User Token (Independent)
    if (userToken) {
      try {
        const response = await userAPI.getCurrentUser({
          headers: { Authorization: `Bearer ${userToken}` }
        });
        // Prevent Admin from logging in as User
        if (response.data.role === 'admin') {
          console.error("Access denied: Admin cannot login as user");
          localStorage.removeItem('user_token');
          setUser(null);
        } else {
          console.log("User verified:", response.data);
          setUser(response.data);
        }
      } catch (error) {
        console.error("User verification failed:", error);
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



