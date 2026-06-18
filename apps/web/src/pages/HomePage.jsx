
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Wrench, Shield, Zap } from 'lucide-react';
import { fetchArtisans } from '@/lib/api.js';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const PROFESSIONS = [
  'Maçon', 'Plombier', 'Électricien', 'Peintre', 'Carreleur', 'Soudeur', 
  'Menuisier bois', 'Menuisier aluminium', 'Frigoriste', 'Climaticien', 
  'Mécanicien automobile', 'Réparateur électroménager', 'Jardinier', 
  'Femme de ménage', 'Agent de sécurité', 'Informaticien', 'Photographe', 
  'Traiteur', 'Couturier', 'Homme à tout faire'
];

export default function HomePage() {
  const navigate = useNavigate();
  const [metier, setMetier] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [topArtisans, setTopArtisans] = useState([]);
  const [isLoadingArtisans, setIsLoadingArtisans] = useState(true);

  useEffect(() => {
    const loadTopArtisans = async () => {
      try {
        const artisans = await fetchArtisans('', '');
        const sorted = artisans.sort((a, b) => (b.avisNote || 0) - (a.avisNote || 0)).slice(0, 6);
        setTopArtisans(sorted);
      } catch (err) {
        console.error('Error loading top artisans:', err);
      } finally {
        setIsLoadingArtisans(false);
      }
    };
    loadTopArtisans();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (metier) params.append('metier', metier);
    if (localisation) params.append('localisation', localisation);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center border-b bg-background">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">Artisan Congo</Link>
        <div className="flex gap-4">
          <Link to="/login" className="btn-outline hidden sm:inline-flex">Se connecter</Link>
          <Link to="/signup" className="btn-primary">S'inscrire</Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/5 py-20 px-4 md:py-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Trouvez les meilleurs artisans de confiance au Congo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Mise en relation rapide et sécurisée avec des professionnels qualifiés pour tous vos travaux et services.
            </p>

            <form onSubmit={handleSearch} className="bg-card p-2 md:p-3 rounded-2xl shadow-lg flex flex-col md:flex-row gap-3 max-w-3xl mx-auto border">
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <select 
                  value={metier} 
                  onChange={(e) => setMetier(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-transparent border-none focus:ring-0 text-foreground appearance-none outline-none font-medium"
                >
                  <option value="">Quel métier recherchez-vous ?</option>
                  {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="hidden md:block w-px bg-border h-10 my-auto"></div>
              <div className="flex-1 relative flex items-center">
                <MapPin className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  placeholder="Ville ou quartier"
                  className="w-full h-12 pl-12 pr-4 bg-transparent border-none focus:ring-0 text-foreground outline-none font-medium"
                />
              </div>
              <button type="submit" className="btn-primary w-full md:w-auto h-12 px-8">
                Rechercher
              </button>
            </form>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/search" className="btn-primary text-lg px-8 py-4">Je cherche un artisan</Link>
              <Link to="/signup-artisan" className="btn-outline bg-background text-lg px-8 py-4">Je suis artisan</Link>
            </div>
          </div>
        </section>

        {/* Top Rated Artisans */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Artisans les mieux notés</h2>
            <p className="text-muted-foreground">Découvrez nos professionnels recommandés par la communauté</p>
          </div>

          {isLoadingArtisans ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card-container">
                  <Skeleton className="h-48 w-full rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : topArtisans.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topArtisans.map(artisan => (
                  <Link key={artisan.userId} to={`/artisan/${artisan.userId}`} className="group">
                    <div className="card-container hover:border-primary/50 transition-all h-full flex flex-col">
                      <div className="w-full h-48 bg-accent rounded-xl overflow-hidden mb-4">
                        {artisan.photo ? (
                          <img src={pb.files.getURL(artisan, artisan.photo)} alt={artisan.metier} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-accent-foreground font-bold text-4xl">
                            {artisan.metier.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{artisan.metier}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{artisan.localisation}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          {artisan.avisNote > 0 ? artisan.avisNote.toFixed(1) : 'Nouveau'}
                        </div>
                        <span className="text-xs text-muted-foreground">({artisan.nombreAvis || 0} avis)</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/search" className="btn-primary text-lg px-8 py-4">
                  Voir tous les artisans
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12">Aucun artisan disponible pour le moment</p>
          )}
        </section>

        {/* Categories Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos catégories de métiers</h2>
            <p className="text-muted-foreground">Une large sélection de professionnels pour répondre à tous vos besoins.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {PROFESSIONS.map((prof) => (
              <Link key={prof} to={`/search?metier=${prof}`} className="card-container text-center flex flex-col items-center justify-center p-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-3">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">{prof}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Features / Why us */}
        <section className="bg-muted/50 py-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <Shield className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3">Artisans Vérifiés</h3>
              <p className="text-muted-foreground">Nous contrôlons l'identité et les qualifications de chaque professionnel inscrit sur notre plateforme.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <Zap className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3">Mise en relation rapide</h3>
              <p className="text-muted-foreground">Trouvez la bonne personne en quelques clics et contactez-la directement via notre messagerie.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border shadow-sm">
              <Star className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3">Avis authentiques</h3>
              <p className="text-muted-foreground">Consultez les notes et les commentaires laissés par les précédents clients pour faire le bon choix.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4 text-primary">Artisan Congo</h4>
            <p className="text-gray-400 max-w-sm">La plateforme de référence pour trouver des artisans qualifiés et de confiance en République du Congo.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/search" className="hover:text-white">Rechercher un artisan</Link></li>
              <li><Link to="/signup-artisan" className="hover:text-white">Devenir artisan</Link></li>
              <li><Link to="/login" className="hover:text-white">Se connecter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><span className="hover:text-white cursor-pointer">Conditions d'utilisation</span></li>
              <li><span className="hover:text-white cursor-pointer">Politique de confidentialité</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Artisan Congo. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
