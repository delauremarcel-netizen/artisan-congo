import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { User, Building2, Wrench, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AccountTypeSelectionPage = () => {
  const navigate = useNavigate();
  const { signupData, setAccountType } = useAuth();

  useEffect(() => {
    if (!signupData) {
      navigate('/signup');
    }
  }, [signupData, navigate]);

  const handleSelect = (type) => {
    setAccountType(type);
    navigate(`/signup/${type}`);
  };

  return (
    <>
      <Helmet>
        <title>Type de compte (Étape 2/3) - ArtisanCongo</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 py-12 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Quel type de compte souhaitez-vous créer ?</h1>
            <p className="text-muted-foreground text-lg">Étape 2 sur 3 : Choisissez le profil qui vous correspond le mieux</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Particulier - Prominent Option */}
            <Card 
              className="md:col-span-2 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/50"
              onClick={() => handleSelect('particulier')}
            >
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-2">Je suis un client (Particulier)</h3>
                  <p className="text-muted-foreground">
                    Je recherche des artisans qualifiés pour mes projets, je veux comparer des devis et lire des avis.
                  </p>
                  <ul className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
                    <li className="flex items-center text-emerald-600 dark:text-emerald-400">✓ 100% Gratuit</li>
                    <li className="flex items-center text-muted-foreground">✓ Demandes de devis</li>
                    <li className="flex items-center text-muted-foreground">✓ Contact direct</li>
                  </ul>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full bg-muted items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            {/* Artisan Option */}
            <Card 
              className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/50"
              onClick={() => handleSelect('artisan')}
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                  <Wrench className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Je suis un Artisan</h3>
                <p className="text-muted-foreground flex-1 mb-6">
                  Je souhaite proposer mes services, développer ma clientèle et gérer mes chantiers.
                </p>
                <div className="pt-4 border-t flex justify-between items-center mt-auto">
                  <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">Essai 3 mois gratuit</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            {/* Entreprise Option */}
            <Card 
              className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/50"
              onClick={() => handleSelect('entreprise')}
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Je suis une Entreprise</h3>
                <p className="text-muted-foreground flex-1 mb-6">
                  Je représente une société qui recherche des sous-traitants ou souhaite publier des missions.
                </p>
                <div className="pt-4 border-t flex justify-between items-center mt-auto">
                  <span className="text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 px-3 py-1 rounded-full">Compte pro</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountTypeSelectionPage;