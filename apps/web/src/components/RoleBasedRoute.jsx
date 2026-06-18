import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function RoleBasedRoute({ children, allowedRoles }) {
  const { currentUser, isClient, isArtisan, isAdmin, isLoading } = useAuth();

  if (isLoading) return <div>Chargement...</div>;

  if (!currentUser) return <Navigate to="/login" replace />;

  const hasRole = 
    (allowedRoles.includes('client') && isClient) ||
    (allowedRoles.includes('artisan') && isArtisan) ||
    (allowedRoles.includes('admin') && isAdmin);

  if (!hasRole) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (isArtisan) return <Navigate to="/artisan/mes-demandes" replace />;
    return <Navigate to="/client/mes-demandes" replace />;
  }

  return children;
}