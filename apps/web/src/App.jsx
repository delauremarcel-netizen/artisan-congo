
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

import HomePage from '@/pages/HomePage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import ArtisanSignupPage from '@/pages/ArtisanSignupPage.jsx';
import ClientSignupPage from '@/pages/ClientSignupPage.jsx';
import ArtisanSearchPage from '@/pages/ArtisanSearchPage.jsx';
import ArtisanProfilePage from '@/pages/ArtisanProfilePage.jsx';
import DemandeServicePage from '@/pages/DemandeServicePage.jsx';
import PaiementPage from '@/pages/PaiementPage.jsx';
import AvisPage from '@/pages/AvisPage.jsx';
import ArtisanDashboardPage from '@/pages/ArtisanDashboardPage.jsx';
import ClientDashboardPage from '@/pages/ClientDashboardPage.jsx';
import AdminDashboardPage from '@/pages/AdminDashboardPage.jsx';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground">Page non trouvée</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup-artisan" element={<ArtisanSignupPage />} />
        <Route path="/signup-client" element={<ClientSignupPage />} />
        <Route path="/search" element={<ArtisanSearchPage />} />
        <Route path="/artisan/:id" element={<ArtisanProfilePage />} />
        
        {/* Protected Client Routes */}
        <Route 
          path="/demande/:artisanId" 
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <DemandeServicePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/paiement/:demandeId" 
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <PaiementPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/avis/:demandeId" 
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <AvisPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-client" 
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Artisan Routes */}
        <Route 
          path="/dashboard-artisan" 
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
