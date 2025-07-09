import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API from '../services/axiosInstance';

export interface AuthError {
  code: 'USER_NOT_FOUND' | 'INVALID_PASSWORD' | 'NETWORK_ERROR' | 'UNKNOWN';
  message: string;
}

export interface CurrentUser {
  sub: string;
  role?: string;
  email?: string;
  exp?: number;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // ⏳ Decode token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<CurrentUser>(token);
        setCurrentUser(decoded);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('Invalid token');
        logout(); // auto logout if decode fails
      }
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', 
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      const token = res.data.access_token;

      if (rememberMe) {
        localStorage.setItem('accessToken', token);
      } else {
        sessionStorage.setItem('accessToken', token);
      }

      const decoded = jwtDecode<CurrentUser>(token);
      setCurrentUser(decoded);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/dashboard');

      return null;
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status === 404) return { code: 'USER_NOT_FOUND', message: 'No account found for that email.' };
        if (status === 401) return { code: 'INVALID_PASSWORD', message: 'Incorrect password.' };
        return { code: 'UNKNOWN', message: 'Something went wrong. Try again later.' };
      } else {
        return { code: 'NETWORK_ERROR', message: 'Check your internet connection.' };
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Record<string, string>) => {
    setLoading(true);
    try {
      await API.post('/auth/register', {
        ...userData,
        email: userData.email.trim().toLowerCase(),
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    delete API.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login');
  };

  return { login, register, logout, loading, currentUser };
};
