import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, XCircle, Eye, MessageSquare, Star, Loader2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  'en_attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  'acceptee': { label: 'Acceptée', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
  'en_cours': { label: 'En cours', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertCircle },
  'terminee': { label: 'Terminée', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  'annulee': { label: 'Annulée', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle },
};

const ClientMissionsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchMissions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiServerClient.fetch('/missions/client');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération des missions');
        }

        setMissions(Array.isArray(data) ? data : (data.missions || []));
      } catch (err) {
        console.error('Fetch missions error:', err);
        setError(err.message || 'Impossible de charger vos missions.');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [currentUser, navigate]);

  const handleCancel = async (missionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette mission ?')) return;
    
    try {
      const response = await apiServerClient.fetch(`/missions/${missionId}/cancel`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'annulation');
      }
      
      toast.success('Mission annulée avec succès');
      setMissions(missions.map(m => m.id === missionId ? { ...m, statut: 'annulee', status: 'annulee' } : m));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getStatusConfig = (statusStr) => {
    const normalized = (statusStr || 'en_attente').toLowerCase();
    return STATUS_CONFIG[normalized] || STATUS_CONFIG['en_attente'];
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SEOHead title="Mes Missions | ArtisanCongo" />
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Mes Missions</h1>
          <p className="text-muted-foreground">Suivez l'état d'avancement de vos demandes et chantiers.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Chargement de vos missions...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive font-medium text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">
              Réessayer
            </Button>
          </div>
        ) : missions.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Vous n'avez pas encore de missions</h3>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
              Trouvez l'artisan idéal pour votre projet et envoyez-lui une demande de mission dès maintenant.
            </p>
            <Button asChild className="rounded-xl h-12 px-8 text-base">
              <Link to="/artisans">
                Trouver un artisan
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {missions.map((mission) => {
              const status = getStatusConfig(mission.statut || mission.status);
              const StatusIcon = status.icon;
              const artisanName = mission.artisan?.nom || mission.artisan?.name || 'Artisan non assigné';
              
              return (
                <div key={mission.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{mission.titre || mission.title}</h3>
                          <Badge variant="outline" className={`${status.color} border px-2.5 py-0.5 flex items-center gap-1.5`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Créée le {new Date(mission.created || mission.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-sm text-muted-foreground mb-1">Budget estimé</div>
                        <div className="text-xl font-bold text-foreground">
                          {mission.budget ? `${mission.budget.toLocaleString('fr-FR')} FCFA` : 'Non défini'}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 mb-6">
                      {mission.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <span className="font-bold text-muted-foreground">{artisanName.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Artisan</div>
                          <div className="font-medium text-foreground">{artisanName}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {(mission.statut === 'en_attente' || mission.status === 'en_attente') && (
                          <Button 
                            variant="outline" 
                            className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                            onClick={() => handleCancel(mission.id)}
                          >
                            Annuler
                          </Button>
                        )}
                        
                        {(mission.statut === 'acceptee' || mission.statut === 'en_cours' || mission.status === 'acceptee' || mission.status === 'en_cours') && (
                          <Button variant="outline" className="rounded-xl" asChild>
                            <a href={`tel:${mission.artisan?.telephone || ''}`}>
                              <MessageSquare className="w-4 h-4 mr-2" /> Contacter
                            </a>
                          </Button>
                        )}

                        {(mission.statut === 'terminee' || mission.status === 'terminee') && !mission.avis_laisse && (
                          <Button className="rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white" asChild>
                            <Link to={`/artisans/${mission.artisan_id || mission.artisan?.id}`}>
                              <Star className="w-4 h-4 mr-2 fill-current" /> Évaluer
                            </Link>
                          </Button>
                        )}

                        <Button variant="secondary" className="rounded-xl" asChild>
                          <Link to={`/missions/${mission.id}`}>
                            <Eye className="w-4 h-4 mr-2" /> Détails
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClientMissionsPage;