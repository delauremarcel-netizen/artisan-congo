import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SubscriptionSuccessPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 bg-muted px-4 text-center">
      <Helmet>
        <title>Succès | ArtisanCongo</title>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Paiement Réussi !</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Votre abonnement a été activé avec succès. Merci de votre confiance.
      </p>
      <Button asChild>
        <Link to="/artisan-dashboard">Aller au tableau de bord</Link>
      </Button>
    </div>
  );
};

export default SubscriptionSuccessPage;