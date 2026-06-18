import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Smartphone, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead.jsx';

const ArtisanLoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { artisanLogin, isArtisanAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/artisan-dashboard';

  useEffect(() => {
    if (isArtisanAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isArtisanAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    try {
      await artisanLogin(emailOrPhone, password);
      toast.success('Connexion réussie !');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4 py-12">
      <SEOHead title="Connexion Artisan | ArtisanCongo" />
      
      <div className="w-full max-w-md mb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>

      <div className="w-full max-w-md bg-card border border-border shadow-lg rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold text-primary mb-2">Connectez-vous</h1>
          <p className="text-[16px] text-muted-foreground">Accédez à votre profil artisan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="emailOrPhone" className="text-foreground font-medium">Téléphone ou email</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground flex gap-1">
                <Smartphone className="w-4 h-4" />
                <span className="text-xs">/</span>
                <Mail className="w-4 h-4" />
              </div>
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="Ex: +243 123 456 789 ou email@example.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                className="pl-14 h-12 bg-background border-border rounded-lg focus-visible:ring-primary text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 h-12 bg-background border-border rounded-lg focus-visible:ring-primary text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-[16px] font-semibold mt-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground" 
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connexion...</>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link to="/contact" className="text-[14px] text-primary hover:underline font-medium">
            Mot de passe oublié ?
          </Link>
          <Link to="/artisan-signup-simplified" className="text-[14px] text-primary hover:underline font-medium">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtisanLoginPage;