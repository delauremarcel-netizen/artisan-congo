import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CompanyDashboard = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 bg-muted px-4 text-center">
      <Helmet>
        <title>Tableau de bord Entreprise | ArtisanCongo</title>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Espace Entreprise</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Gérez vos demandes de devis, vos projets et vos artisans favoris.
      </p>
      <Button asChild>
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
};

export default CompanyDashboard;