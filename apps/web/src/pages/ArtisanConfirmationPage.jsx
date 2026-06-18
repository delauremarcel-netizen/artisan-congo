import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead.jsx';

const ArtisanConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const artisan = location.state?.artisan;

  useEffect(() => {
    // Prevent going back to the form
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 py-12">
      <SEOHead title="Inscription Réussie | ArtisanCongo" />
      
      <div className="max-w-xl w-full bg-card border border-border shadow-lg rounded-2xl p-8 md:p-12 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight text-center text-balance">
          Compte créé avec succès !
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 text-center leading-relaxed text-balance">
          Votre compte est en attente de validation par l'administrateur. Vous recevrez un email dès que votre profil sera activé.
        </p>

        {artisan && (
          <div className="w-full bg-muted/50 rounded-xl p-6 mb-8 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Récapitulatif de vos informations</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm">
                <User className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                <span className="font-medium text-foreground">{artisan.name}</span>
              </li>
              <li className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                <span className="text-muted-foreground">{artisan.email}</span>
              </li>
              <li className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                <span className="text-muted-foreground">{artisan.phone}</span>
              </li>
              <li className="flex items-center text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                <span className="text-muted-foreground">{artisan.city}</span>
              </li>
              <li className="flex items-center text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
                <span className="text-muted-foreground">{artisan.category}</span>
              </li>
            </ul>
          </div>
        )}

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Button 
            asChild 
            className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            <Link to="/artisan/login">
              <User className="w-5 h-5 mr-2" />
              Consulter mon profil
            </Link>
          </Button>

          <Button 
            asChild 
            variant="outline" 
            className="flex-1 h-12 text-base font-medium border-input hover:bg-accent"
          >
            <Link to="/">
              <Home className="w-5 h-5 mr-2 text-muted-foreground" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtisanConfirmationPage;