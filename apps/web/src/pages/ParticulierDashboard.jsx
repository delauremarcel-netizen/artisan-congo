import React from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ParticulierDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-muted/10 py-12">
      <SEOHead title="Mon Espace | ArtisanCongo" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bonjour, {currentUser?.name || 'Client'}</h1>
          <p className="text-muted-foreground mt-1">Gérez vos projets et trouvez les meilleurs artisans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Mes devis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Suivez vos demandes de devis et comparez les offres des artisans.
              </p>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to="/mes-demandes-devis">
                  Voir mes demandes <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> Trouver un artisan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Parcourez notre annuaire pour trouver le professionnel idéal.
              </p>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to="/artisans">
                  Rechercher <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Mon profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gérez vos informations personnelles et vos préférences.
              </p>
              <Button asChild variant="outline" className="w-full justify-between">
                <Link to="/edit-profile">
                  Paramètres <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 text-center max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Un nouveau projet en tête ?</h2>
          <p className="text-muted-foreground mb-6">
            Décrivez votre besoin et recevez rapidement des devis gratuits de la part d'artisans qualifiés près de chez vous.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/demande-devis">
              Demander un devis gratuit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParticulierDashboard;