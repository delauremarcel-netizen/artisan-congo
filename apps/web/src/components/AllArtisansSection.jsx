import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, AlertCircle, RefreshCw, User, FilterX } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ArtisanCard from '@/components/ArtisanCard.jsx';
import { PROFESSIONS } from '@/lib/professions.js';

const escapeFilterValue = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/"/g, '\\"');
};

const AllArtisansSection = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Strict filter for active and visible artisans only
      const filters = ["status='active'", "is_visible=true"];
      
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
      if (availabilityFilter !== 'all') {
        filters.push(`availability="${escapeFilterValue(availabilityFilter)}"`);
      }

      const filterString = filters.join(' && ');

      const records = await pb.collection('artisans').getFullList({
        filter: filterString,
        sort: '-average_overall_rating,-created_date',
        $autoCancel: false
      });
      
      setArtisans(records || []);
    } catch (err) {
      console.error("Error fetching all artisans:", err);
      setError("Impossible de charger la liste des artisans. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates subscription to reflect new validated artisans immediately
  useEffect(() => {
    fetchArtisans();
    
    pb.collection('artisans').subscribe('*', function (e) {
      if (e.action === 'update' || e.action === 'create') {
        fetchArtisans();
      }
    });

    return () => {
      pb.collection('artisans').unsubscribe('*');
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArtisans();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, cityFilter, availabilityFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setCityFilter('all');
    setAvailabilityFilter('all');
  };

  const cities = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];

  return (
    <section className="py-20 bg-muted/10 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Annuaire des Artisans
          </h2>
          <p className="text-lg text-muted-foreground">
            Découvrez tous les artisans qualifiés inscrits sur notre plateforme. Utilisez les filtres pour trouver le professionnel idéal pour votre projet.
          </p>
        </div>

        <div className="bg-card p-4 rounded-2xl shadow-sm mb-6 border border-border flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un nom ou mot-clé..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background rounded-xl text-base"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-56 h-14 bg-muted/50 border-transparent focus:bg-background rounded-xl">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Catégorie" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {PROFESSIONS.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full lg:w-56 h-14 bg-muted/50 border-transparent focus:bg-background rounded-xl">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Ville" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-full lg:w-56 h-14 bg-muted/50 border-transparent focus:bg-background rounded-xl">
              <SelectValue placeholder="Disponibilité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes disponibilités</SelectItem>
              <SelectItem value="Available">Disponible</SelectItem>
              <SelectItem value="Busy">Indisponible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center mb-10">
          <div className="text-sm font-medium text-muted-foreground">
            {loading ? 'Recherche en cours...' : `${artisans.length} artisan${artisans.length !== 1 ? 's' : ''} trouvé${artisans.length !== 1 ? 's' : ''}`}
          </div>
          {(searchTerm || categoryFilter !== 'all' || cityFilter !== 'all' || availabilityFilter !== 'all') && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
              <FilterX className="w-4 h-4 mr-2" /> Réinitialiser les filtres
            </Button>
          )}
        </div>

        {error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold text-destructive mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchArtisans} variant="outline" className="bg-background">
              <RefreshCw className="w-4 h-4 mr-2" /> Réessayer
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
          <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm">
            <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Aucun artisan trouvé</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Nous n'avons trouvé aucun artisan correspondant à vos critères actuels.
            </p>
            <Button 
              onClick={resetFilters} 
              variant="outline"
              className="rounded-xl h-12 px-6"
            >
              Réinitialiser tous les filtres
            </Button>
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

export default AllArtisansSection;