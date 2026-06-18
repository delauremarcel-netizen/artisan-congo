
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient';
import { Search, MapPin, Star, Filter, ArrowLeft } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const PROFESSIONS = [
  'Maçon', 'Plombier', 'Électricien', 'Peintre', 'Carreleur', 'Soudeur', 
  'Menuisier bois', 'Menuisier aluminium', 'Frigoriste', 'Climaticien'
];

export default function ArtisanSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artisans, setArtisans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const metierParam = searchParams.get('metier') || '';
  const locParam = searchParams.get('localisation') || '';

  const [metier, setMetier] = useState(metierParam);
  const [localisation, setLocalisation] = useState(locParam);

  const fetchArtisans = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (metier) params.append('metier', metier);
      if (localisation) params.append('localisation', localisation);
      
      const response = await apiServerClient.fetch(`/artisans/search?${params.toString()}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      const data = await response.json();
      setArtisans(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la liste des artisans.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, [searchParams]);

  const handleFilter = (e) => {
    e.preventDefault();
    setSearchParams({ metier, localisation });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <header className="px-6 py-4 border-b bg-background sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Recherche</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className="w-full md:w-80 bg-card border rounded-2xl p-6 shadow-sm shrink-0">
          <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b">
            <Filter className="w-5 h-5" />
            Filtres
          </div>
          
          <form onSubmit={handleFilter} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Métier</label>
              <select 
                value={metier} 
                onChange={(e) => setMetier(e.target.value)}
                className="input-field bg-background"
              >
                <option value="">Tous les métiers</option>
                {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Localisation</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  placeholder="Ville..."
                  className="input-field pl-9"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-4">Appliquer</button>
          </form>
        </div>

        {/* Results */}
        <div className="flex-1 w-full space-y-4">
          {error && <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">{error}</div>}
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card-container flex flex-col sm:flex-row gap-6 animate-pulse">
                  <div className="w-24 h-24 bg-muted rounded-xl"></div>
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-4 bg-muted rounded w-1/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : artisans.length === 0 ? (
            <div className="card-container text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold mb-2">Aucun artisan trouvé</h3>
              <p className="text-muted-foreground">Essayez de modifier vos filtres de recherche.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {artisans.map(artisan => (
                <Link key={artisan.userId} to={`/artisan/${artisan.userId}`} className="group">
                  <div className="card-container flex flex-col sm:flex-row gap-6 hover:border-primary/50 transition-colors">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-accent overflow-hidden">
                      {artisan.photo ? (
                        <img src={pb.files.getURL(artisan, artisan.photo)} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-accent-foreground font-bold text-2xl">
                          {artisan.metier.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{artisan.metier}</h3>
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          {artisan.avisNote > 0 ? artisan.avisNote.toFixed(1) : 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm gap-4">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {artisan.localisation}</span>
                        <span>{artisan.nombreAvis || 0} avis</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
