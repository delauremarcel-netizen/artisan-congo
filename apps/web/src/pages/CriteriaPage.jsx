import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, Star, CheckCircle2, Award, ArrowRight, User } from 'lucide-react';

const CriteriaPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArtisans = async () => {
      try {
        const records = await pb.collection('artisans').getList(1, 3, {
          filter: "status='Validé'",
          sort: '-average_overall_rating',
          $autoCancel: false
        });
        setArtisans(records.items);
      } catch (error) {
        console.error('Error fetching artisans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtisans();
  }, []);

  return (
    <>
      <Helmet>
        <title>Découvrir nos critères | ArtisanCongo</title>
        <meta name="description" content="Une collection exclusive de professionnels évalués et approuvés pour la qualité irréprochable de leurs prestations." />
      </Helmet>

      <div className="min-h-screen flex flex-col pt-20">
        
        {/* Hero Section */}
        <section className="bg-background py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none mb-6 px-4 py-1.5 text-sm font-medium">
              Excellence Garantie
            </Badge>
            <h1 className="mb-6">
              Découvrir nos critères
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-balance">
              Une collection exclusive de professionnels évalués et approuvés pour la qualité irréprochable de leurs prestations.
            </p>
          </div>
        </section>

        {/* Criteria Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="mb-4">Notre processus de sélection</h2>
              <p className="text-muted-foreground text-lg">
                Chaque artisan présent sur notre plateforme passe par un processus de validation rigoureux pour vous garantir un service d'excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="premium-card">
                <CardContent className="p-8 flex flex-col sm:flex-row gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Vérification Professionnelle</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Nous contrôlons systématiquement l'identité, les qualifications et l'existence légale de chaque entreprise ou artisan indépendant avant toute validation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-8 flex flex-col sm:flex-row gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Standards de Qualité</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les artisans doivent démontrer un savoir-faire avéré à travers un portfolio de réalisations passées, évalué par nos experts métiers.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-8 flex flex-col sm:flex-row gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Star className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Satisfaction Client</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Nous exigeons des références vérifiables. Les artisans s'engagent à maintenir un haut niveau de satisfaction et de professionnalisme.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="p-8 flex flex-col sm:flex-row gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3">Évaluation Continue</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      La qualité est surveillée en permanence grâce aux avis certifiés des clients après chaque intervention réalisée via la plateforme.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Artisans */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h2 className="mb-4">Artisans Certifiés</h2>
                <p className="text-muted-foreground text-lg">Découvrez quelques-uns de nos meilleurs professionnels validés.</p>
              </div>
              <Button asChild size="lg">
                <Link to="/artisans">Voir tous les artisans <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="border-none shadow-md">
                    <Skeleton className="h-48 rounded-t-xl rounded-b-none" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-2/3 mb-4" />
                      <Skeleton className="h-4 w-1/2 mb-6" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : artisans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {artisans.map(artisan => (
                  <Link key={artisan.id} to={`/artisan/${artisan.id}`} className="group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl block h-full">
                    <Card className="premium-card h-full flex flex-col">
                      <div className="h-48 bg-muted relative overflow-hidden">
                        {artisan.photos && artisan.photos.length > 0 ? (
                          <img 
                            src={pb.files.getUrl(artisan, artisan.photos[0])} 
                            alt={artisan.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary">
                            <User className="w-12 h-12 opacity-40" />
                          </div>
                        )}
                        <Badge className="absolute top-4 right-4 bg-background/95 text-foreground backdrop-blur-sm border-none shadow-sm">
                          {artisan.category || 'Général'}
                        </Badge>
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{artisan.name}</h3>
                          <div className="flex items-center gap-1 bg-accent/10 text-accent-foreground px-2 py-1 rounded-md shrink-0">
                            <Star className="w-3.5 h-3.5 fill-current text-accent" />
                            <span className="text-xs font-bold">
                              {artisan.average_overall_rating ? artisan.average_overall_rating.toFixed(1) : 'Nouveau'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">
                          {artisan.bio || 'Artisan qualifié et vérifié par nos équipes.'}
                        </p>
                        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-sm font-semibold text-primary">
                          Voir le profil
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-2xl border border-border">
                <p className="text-muted-foreground">Aucun artisan à afficher pour le moment.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
};

export default CriteriaPage;