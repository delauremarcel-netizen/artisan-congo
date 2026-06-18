import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import ArtisanCard from '@/components/ArtisanCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedArtisansSection = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterString = "status='Validé' && is_visible=true";
      
      const records = await pb.collection('artisans').getList(1, 3, {
        filter: filterString,
        sort: '-average_overall_rating,-created_date',
        $autoCancel: false
      });
      
      setArtisans(records.items || []);
    } catch (err) {
      console.error('Error fetching recommended artisans:', err);
      setError('Impossible de charger les artisans recommandés.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedArtisans();
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Artisans Recommandés
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez les professionnels les mieux notés de notre réseau, prêts à intervenir sur vos projets avec expertise et fiabilité.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-full">
            <Link to="/artisans">
              Voir tous les artisans
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
                <div className="flex gap-4 mb-6">
                  <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-1 py-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold text-destructive mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchRecommendedArtisans} variant="outline" className="bg-background">
              <RefreshCw className="w-4 h-4 mr-2" /> Réessayer
            </Button>
          </div>
        ) : artisans.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground">Aucun artisan recommandé pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedArtisansSection;