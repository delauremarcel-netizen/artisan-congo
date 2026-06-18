import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SubscriptionPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 bg-muted px-4 text-center">
      <Helmet>
        <title>Abonnements | ArtisanCongo</title>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Abonnements</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Découvrez nos offres pour booster votre visibilité sur la plateforme.
      </p>
      <Button asChild>
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
};

export default SubscriptionPage;