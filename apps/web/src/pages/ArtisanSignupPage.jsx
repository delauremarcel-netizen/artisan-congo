
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ArrowLeft } from 'lucide-react';

const PROFESSIONS = [
  'Maçon', 'Plombier', 'Électricien', 'Peintre', 'Carreleur', 'Soudeur', 
  'Menuisier bois', 'Menuisier aluminium', 'Frigoriste', 'Climaticien', 
  'Mécanicien automobile', 'Réparateur électroménager', 'Jardinier', 
  'Femme de ménage', 'Agent de sécurité', 'Informaticien', 'Photographe', 
  'Traiteur', 'Couturier', 'Homme à tout faire'
];

export default function ArtisanSignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', localisation: '', password: '', passwordConfirm: '', metier: PROFESSIONS[0], description: ''
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
      // 1. Create User
      const user = await pb.collection('users').create({
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        localisation: formData.localisation,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        role: 'artisan',
        statut: 'actif'
      }, { $autoCancel: false });
      
      // 2. Login to get permissions to create artisan profile
      await login(formData.email, formData.password);

      // 3. Create Artisan Profile
      await pb.collection('artisans').create({
        nom: formData.nom,
        email: formData.email,
        categorie: formData.metier,
        ville: formData.localisation,
        telephone: formData.telephone,
        description: formData.description,
        statut: 'pending'
      }, { $autoCancel: false });

      navigate('/dashboard-artisan');
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
        <div className="w-full max-w-2xl bg-card p-8 rounded-2xl shadow-lg border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Inscription Artisan</h1>
            <p className="text-muted-foreground">Rejoignez notre réseau de professionnels</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Nom complet</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="input-field" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-sm font-semibold">Téléphone</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="input-field" required />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-sm font-semibold">Ville</label>
                <input type="text" name="localisation" value={formData.localisation} onChange={handleChange} className="input-field" placeholder="ex: Pointe-Noire" required />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-sm font-semibold">Métier</label>
                <select name="metier" value={formData.metier} onChange={handleChange} className="input-field bg-background" required>
                  {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Description de vos services</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[100px] py-3" placeholder="Présentez votre expérience et vos compétences..." required />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" minLength={8} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Confirmer le mot de passe</label>
                <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} className="input-field" minLength={8} required />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
              {isSubmitting ? 'Création en cours...' : 'Créer mon profil Artisan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
