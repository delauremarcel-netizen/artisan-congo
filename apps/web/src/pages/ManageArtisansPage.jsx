import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageArtisansPage() {
  const navigate = useNavigate();
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestion des Artisans</h1>
      <button onClick={() => navigate('/admin/dashboard')} className="btn-mobile-optimized bg-primary text-primary-foreground">
        Retour au Dashboard
      </button>
    </div>
  );
}