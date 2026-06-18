import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Star, Briefcase, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import apiServerClient from '@/lib/apiServerClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';

const CATEGORIES = [
  'Électricien', 'Plombier', 'Menuisier', 'Maçon', 'Peintre', 
  'Carreleur', 'Serrurier', 'Charpentier', 'Couvreur', 'Vitrier'
];

const CITIES = ['Brazzaville', 'Pointe-Noire'];

const ArtisansListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local state for inputs to handle debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  const categoryParam = searchParams.get('category') || 'all';
  const cityParam = searchParams.get('city') || 'all';

  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) newParams.set('search', searchTerm);
      else newParams.delete('search');
      setSearchParams(newParams, { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams, searchParams]);

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      setError('');
      try {
        const query = new URLSearchParams({ is_visible: 'true' });
        
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        
        if (search) query.append('search', search);
        if (category && category !== 'all') query.append('category', category);
        if (city && city !== 'all') query.append('city', city);

        const response = await apiServerClient.fetch(`/artisans?${query.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération des artisans');
        }

        setArtisans(Array.isArray(data) ? data : (data.artisans || []));
      } catch (err) {
        console.error('Fetch artisans error:', err);
        setError(err.message || 'Impossible de charger la liste des artisans.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [searchParams]);

  const handleCategoryChange = (val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'all') newParams.set('category', val);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const handleCityChange = (val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'all') newParams.set('city', val);
    else newParams.delete('city');
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SEOHead title="Trouver un artisan | ArtisanCongo" />
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Search & Filters Section */}
        <div className="card p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 input-field"
              />
            </div>
            
            <div className="w-full md:w-64 shrink-0">
              <Select value={categoryParam} onValueChange={handleCategoryChange}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-64 shrink-0">
              <Select value={cityParam} onValueChange={handleCityChange}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="h-12 px-4 rounded-xl shrink-0 hover:bg-muted"
              aria-label="Réinitialiser les filtres"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Artisans disponibles
          </h1>
          {!loading && !error && (
            <span className="text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full text-sm">
              {artisans.length} résultat{artisans.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 flex flex-col items-center border-border/50">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="w-full flex justify-between gap-4 mt-auto">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-12 w-full mt-6 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center flex flex-col items-center animate-fade-in">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="error-message text-lg mb-4">{error}</p>
            <Button onClick={() => setSearchParams(searchParams)} variant="outline" className="rounded-xl h-12 px-8">
              Réessayer
            </Button>
          </div>
        ) : artisans.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Aucun artisan trouvé</h3>
            <p className="text-muted-foreground mb-8 max-w-md">
              Nous n'avons trouvé aucun artisan correspondant à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <Button onClick={resetFilters} className="btn-primary">
              Réinitialiser la recherche
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {artisans.map((artisan) => (
              <div 
                key={artisan.id} 
                className="card overflow-hidden group flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 flex flex-col items-center text-center relative border-b border-border/50">
                  <div className="w-24 h-24 rounded-full bg-muted overflow-hidden mb-4 border-4 border-background shadow-sm">
                    {artisan.photo ? (
                      <img 
                        src={artisan.photo} 
                        alt={`Photo de ${artisan.nom || artisan.name}`} 
                        loading="lazy"
                        className="w-full h-full object-cover image-placeholder"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground/30 bg-primary/5">
                        {(artisan.nom || artisan.name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {artisan.nom || artisan.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-primary font-medium mb-4">
                    <Briefcase className="w-4 h-4" />
                    <span>{artisan.categorie || artisan.category}</span>
                  </div>
                  
                  <div className="w-full flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium text-foreground">{artisan.ville || artisan.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-foreground">{artisan.note || artisan.rating_average || 'N/A'}</span>
                      <span>({artisan.nombre_avis || artisan.reviews_count || 0})</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/20 mt-auto">
                  <Button asChild className="btn-primary w-full">
                    <Link to={`/artisans/${artisan.id}`}>
                      Voir le profil
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArtisansListPage;