import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentAdmin, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentAdmin || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Double check role if it exists in the schema
  if (currentAdmin.role && currentAdmin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;