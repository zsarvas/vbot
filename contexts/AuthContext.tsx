import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthContextType, AuthUser, LoginCredentials, RegisterCredentials } from '../types/AuthTypes';

// Auth reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthUser }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check existing auth
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // API helper function
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
        return true;
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.error || 'Login failed' });
        return false;
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Login failed' });
      return false;
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
        return true;
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.error || 'Registration failed' });
        return false;
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message || 'Registration failed' });
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiCall('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh auth - check if user is still authenticated
  const refreshAuth = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await apiCall('/api/auth/me');

      if (response.success && response.user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check authentication status on app start
  useEffect(() => {
    refreshAuth();
  }, []);

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Hook for protected routes
export const useRequireAuth = (requiredRole?: string) => {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    } else if (
      requiredRole && 
      auth.user && 
      auth.user.role !== requiredRole && 
      auth.user.role !== 'admin'
    ) {
      // Redirect if user doesn't have required role (admins can access everything)
      window.location.href = '/';
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, requiredRole]);

  return auth;
}; 