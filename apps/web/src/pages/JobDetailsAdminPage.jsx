import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function JobDetailsAdminPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Détails du chantier {id}</h1>
      <button onClick={() => navigate('/admin/chantiers')} className="btn-mobile-optimized bg-secondary text-secondary-foreground">
        Retour aux chantiers
      </button>
    </div>
  );
}