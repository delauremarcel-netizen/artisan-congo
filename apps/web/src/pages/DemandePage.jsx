
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function DemandePage() {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  
  const [formData, setFormData] = useState({ description: '', localisation: '', montantEstime: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated || role !== 'client') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
        <p className="text-muted-foreground mb-6">Vous devez être connecté en tant que client pour faire une demande.</p>
        <Link to="/login" className="btn-primary">Se connecter</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        artisanId,
        metier: 'Service', // simplified for demo
        description: formData.description,
        localisation: formData.localisation,
        montantEstime: Number(formData.montantEstime)
      };

      const res = await apiServerClient.fetch('/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Erreur lors de la création de la demande');
      
      navigate('/dashboard-client');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted/20">
      <header className="p-4 border-b bg-background">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-4 mt-8">
        <div className="bg-card p-8 rounded-2xl border shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Nouvelle Demande de Service</h1>
          
          {error && <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Description détaillée du besoin</label>
              <textarea 
                required
                className="input-field min-h-[120px] py-3"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez précisément ce que vous attendez..."
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Lieu d'intervention</label>
              <input 
                required type="text"
                className="input-field"
                value={formData.localisation}
                onChange={e => setFormData({...formData, localisation: e.target.value})}
                placeholder="Adresse complète ou quartier"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Budget estimé (FCFA)</label>
              <input 
                required type="number" min="0"
                className="input-field"
                value={formData.montantEstime}
                onChange={e => setFormData({...formData, montantEstime: e.target.value})}
                placeholder="Ex: 50000"
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
              {isSubmitting ? 'Envoi...' : 'Envoyer la demande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
