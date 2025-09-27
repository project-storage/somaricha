import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['owner', 'customer'] 
}) => {
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if user doesn't have required role
  if (userRole && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // If user doesn't have required role, redirect to home or show unauthorized page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;