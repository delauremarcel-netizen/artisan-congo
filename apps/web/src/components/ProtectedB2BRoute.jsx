import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useB2BAuth } from '@/contexts/B2BAuthContext.jsx';
import { Loader2 } from 'lucide-react';

const ProtectedB2BRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useB2BAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/b2b/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedB2BRoute;