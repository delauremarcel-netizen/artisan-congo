import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Briefcase, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead.jsx';
import { PROFESSIONS } from '@/lib/professions.js';
import ArtisanCard from '@/components/ArtisanCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';

const escapeFilterValue = (value) => {
  if (typeof value !== 'string') return value;
  // Escape double quotes so we can safely wrap the string in double quotes in the PocketBase filter
  return value.replace(/"/g, '\\"');
};

const ArtisanSearch = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = ["status='Validé'", "is_visible=true"];
      
      if (searchTerm) {
        const safeSearch = escapeFilterValue(searchTerm);
        filters.push(`(name~"${safeSearch}" || bio~"${safeSearch}")`);
      }
      if (categoryFilter !== 'all') {
        filters.push(`category="${escapeFilterValue(categoryFilter)}"`);
      }
      if (cityFilter !== 'all') {
        filters.push(`city="${escapeFilterValue(cityFilter)}"`);
      }

      const filterString = filters.join(' && ');
      
      console.log('ARTISAN_FILTER:', filterString);

      const records = await pb.collection('artisans').getFullList({
        filter: filterString,
        sort: '-average_overall_rating,-created_date',
        $autoCancel: false
      });

      console.log('ARTISAN_RESPONSE:', records);
      console.log('ARTISAN_COUNT:', records.length);

      setArtisans(records);
    } catch (err) {
      console.error('ARTISAN_ERROR:', err);
      setError(err.message || 'Impossible de charger les artisans. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArtisans();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, cityFilter]);

  const cities = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];

  return (
    <>
      <SEOHead 
        title="Trouver un Artisan | ArtisanCongo" 
        description="Recherchez et trouvez les meilleurs artisans qualifiés au Congo pour vos travaux de plomberie, électricité, menuiserie, etc."
      />
      
      <div className="min-h-screen flex flex-col bg-muted/20 pt-20">
        <main className="flex-1">
          
          <section className="bg-background py-16 border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground text-balance">
                Trouvez le professionnel idéal
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
                Parcourez notre réseau d'artisans qualifiés et validés par nos équipes pour tous vos travaux et réparations.
              </p>
              
              <div className="bg-card p-4 rounded-2xl shadow-md border border-border flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Que recherchez-vous ? (ex: Plombier)" 
                    className="pl-12 h-14 text-base bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-colors text-foreground rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-56 h-14 bg-muted/50 border-transparent focus:bg-background text-foreground rounded-xl">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Métier" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les métiers</SelectItem>
                    {PROFESSIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-full md:w-56 h-14 bg-muted/50 border-transparent focus:bg-background text-foreground rounded-xl">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="Ville" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
              <h2 className="text-xl font-bold text-foreground">
                {loading ? 'Recherche en cours...' : error ? 'Erreur' : `${artisans.length} artisan${artisans.length !== 1 ? 's' : ''} trouvé${artisans.length !== 1 ? 's' : ''}`}
              </h2>
            </div>

            {error ? (
              <div className="text-center py-20 bg-destructive/10 rounded-2xl border border-destructive/20 max-w-2xl mx-auto">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-2 text-destructive">Oups ! Une erreur est survenue</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {error}
                </p>
                <Button onClick={fetchArtisans} variant="outline" className="bg-background">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
            ) : artisans.length === 0 ? (
              <div className="text-center py-24 bg-background rounded-3xl border border-dashed border-border shadow-sm max-w-3xl mx-auto">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-semibold mb-2">Aucun artisan disponible</h3>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                  Nous n'avons trouvé aucun artisan correspondant à vos critères. Essayez d'élargir votre recherche.
                </p>
                <Button variant="outline" className="mt-8 border-primary text-primary hover:bg-primary/10 h-12 px-6 rounded-xl" onClick={() => {
                  setSearchTerm(''); setCategoryFilter('all'); setCityFilter('all');
                }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artisans.map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default ArtisanSearch;