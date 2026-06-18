
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ArrowLeft } from 'lucide-react';

export default function ClientSignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', localisation: '', password: '', passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      return setError('Les mots de passe ne correspondent pas.');
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await pb.collection('users').create({
        ...formData,
        role: 'client',
        statut: 'actif'
      }, { $autoCancel: false });
      
      await login(formData.email, formData.password);
      navigate('/dashboard-client');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/30">
      <header className="p-4 border-b bg-background">
        <Link to="/signup" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow-lg border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Inscription Client</h1>
            <p className="text-muted-foreground">Créez votre compte pour trouver des artisans</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Nom complet</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="input-field" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Téléphone</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="input-field" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Ville</label>
                <input type="text" name="localisation" value={formData.localisation} onChange={handleChange} className="input-field" placeholder="ex: Brazzaville" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Mot de passe</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" minLength={8} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Confirmer le mot de passe</label>
              <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} className="input-field" minLength={8} required />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full pt-4">
              {isSubmitting ? 'Création en cours...' : 'Créer mon compte client'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
