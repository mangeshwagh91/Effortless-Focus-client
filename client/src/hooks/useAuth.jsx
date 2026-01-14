import { useState, useEffect, createContext, useContext } from 'react';
import { demoUser, enableDemoMode, getDemoUser } from '../lib/demoData';

// Enable demo mode immediately (before any components render)
enableDemoMode();

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true); // Always in demo mode for prototype

  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

  // Initialize demo mode on mount (for prototype/judges)
  useEffect(() => {
    enableDemoMode();
    setUser(demoUser);
    setIsDemoMode(true);
    setLoading(false);
  }, []);

  // Load user on mount if token exists (for production mode - currently disabled)
  useEffect(() => {
    if (!isDemoMode && token) {
      fetchCurrentUser();
    }
  }, [token, isDemoMode]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token invalid, clear it
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, name, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('authToken', data.token);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Prevent logout in demo mode (for judges/prototype)
    if (isDemoMode) {
      console.log('Logout disabled in demo mode');
      return;
    }
    
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    // Clear all app data on logout
    localStorage.removeItem('effortless-focus-tasks');
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('demo_emails');
    localStorage.removeItem('demo_tasks');
    localStorage.removeItem('demo_user');
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await fetch(`${API_URL}/auth/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return { success: true };
      }
      
      return { success: false };
    } catch (err) {
      console.error('Failed to update preferences:', err);
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    isDemoMode,
    register,
    login,
    logout,
    updatePreferences
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
