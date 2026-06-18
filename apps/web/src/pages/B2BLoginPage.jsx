import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useB2BAuth } from '@/contexts/B2BAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead.jsx';

const B2BLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useB2BAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/b2b/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie.");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <SEOHead title="Connexion B2B | Artisan Congo" />
      
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-1 text-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Espace Entreprise</CardTitle>
          <CardDescription>
            Connectez-vous à votre portail B2B
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="contact@entreprise.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link to="#" className="text-sm font-medium text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-white"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Se souvenir de moi
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Se connecter"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/b2b/signup" className="font-semibold text-primary hover:underline">
                Créer un compte entreprise
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default B2BLoginPage;