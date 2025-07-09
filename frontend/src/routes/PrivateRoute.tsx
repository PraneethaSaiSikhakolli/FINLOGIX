import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;      
  role?: string;    
  exp: number;
}

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const isAdminRoute = location.pathname.startsWith('/admin');
    const userRole = decoded.role || 'user'; // fallback if role not in token

    if (isAdminRoute && userRole !== 'admin') {
      return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
  } catch (err) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
