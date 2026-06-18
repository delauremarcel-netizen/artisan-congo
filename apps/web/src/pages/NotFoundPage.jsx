import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Home, Search, Briefcase, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const NotFoundPage = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isAdmin = currentUser?.role === 'admin' || currentUser?.account_type === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Page non trouvée (404) | ArtisanCongo</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
      </Helmet>
      
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4 animate-fade-in">
        <div className="max-w-2xl w-full text-center space-y-8">
          
          <div className="relative inline-block">
            <h1 className="text-[120px] md:text-[180px] font-extrabold text-primary/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-card rounded-full shadow-lg border border-border flex items-center justify-center animate-slide-in">
                <ShieldAlert className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Page non trouvée
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              La page que vous cherchez (<code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">{location.pathname}</code>) n'existe pas ou a été supprimée.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl border-border hover:bg-muted">
              <Link to="/artisans">
                <Search className="w-5 h-5 mr-2" />
                Chercher un artisan
              </Link>
            </Button>
          </div>

          <div className="pt-12 border-t border-border mt-12 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Liens utiles
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {currentUser && (
                <Link to="/client/missions" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <Briefcase className="w-4 h-4 mr-1.5 text-primary" />
                  Mes missions
                </Link>
              )}
              <Link to="/contact" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors">
                Nous contacter
              </Link>
              <Link to="/faq" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors">
                Centre d'aide
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Administration
                </Link>
              )}
              {(!currentUser || !isAdmin) && (
                <Link to="/admin-login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Accès Admin
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;