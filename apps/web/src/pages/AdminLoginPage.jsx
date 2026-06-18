import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SEOHead } from '@/components/SEOHead.jsx';
import apiServerClient from '@/lib/apiServerClient.js';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await apiServerClient.fetch('/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Identifiants incorrects ou accès non autorisé.');
      }

      // Store token in localStorage as requested
      localStorage.setItem('adminToken', data.token);
      
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-800 p-4">
      <SEOHead title="Connexion Administration | ArtisanCongo" />

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
              <ShieldAlert className="w-8 h-8 text-green-700" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Espace Admin
            </h1>
            <p className="text-gray-500 font-medium">
              Veuillez vous identifier pour continuer.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 font-semibold">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@artisancongo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-green-600 focus-visible:border-green-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-900 font-semibold">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-green-600 focus-visible:border-green-600"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 mt-4 bg-green-700 hover:bg-green-800 text-white text-base font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authentification...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Accéder au tableau de bord
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;