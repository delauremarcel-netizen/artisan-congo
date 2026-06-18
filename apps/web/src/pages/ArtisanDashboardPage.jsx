
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { LogOut, ClipboardList, User, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ArtisanDashboardPage() {
  const { currentUser, logout } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artisanRecord, setArtisanRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const art = await pb.collection('artisans').getFirstListItem(`userId="${currentUser.id}"`, { $autoCancel: false });
        setArtisanRecord(art);

        const dems = await pb.collection('demandes').getFullList({
          filter: `artisanId="${art.id}"`,
          sort: '-created',
          expand: 'clientId',
          $autoCancel: false
        });
        setDemandes(dems);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const updateStatus = async (demandeId, newStatus) => {
    try {
      await pb.collection('demandes').update(demandeId, { statut: newStatus }, { $autoCancel: false });
      setDemandes(demandes.map(d => d.id === demandeId ? { ...d, statut: newStatus } : d));
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en attente': return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">En attente</span>;
      case 'acceptée': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">Acceptée</span>;
      case 'en cours': return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold">En cours</span>;
      case 'terminée': return <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold">Terminée</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted/20 flex flex-col">
      <header className="bg-background border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Espace Artisan</h1>
        <button onClick={logout} className="inline-flex items-center text-sm font-medium text-destructive hover:opacity-80">
          <LogOut className="w-4 h-4 mr-2" /> Déconnexion
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-card rounded-2xl border shadow-sm p-6 text-center">
            <div className="w-20 h-20 bg-accent text-accent-foreground rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-bold">
              {currentUser?.nom?.charAt(0)}
            </div>
            <h2 className="font-bold text-lg">{currentUser?.nom}</h2>
            <p className="text-primary text-sm font-medium mb-4">{artisanRecord?.metier}</p>
            <Link to={`/artisan/${currentUser?.id}`} className="btn-outline w-full text-xs py-2">Voir mon profil public</Link>
          </div>
        </aside>

        <section className="md:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" /> Mes Demandes
          </h2>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-card rounded-2xl border"></div>)}
            </div>
          ) : demandes.length === 0 ? (
            <div className="bg-card border rounded-2xl p-12 text-center text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Vous n'avez pas encore de demandes.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {demandes.map(demande => (
                <div key={demande.id} className="bg-card border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg">{demande.expand?.clientId?.nom || 'Client'}</span>
                      {getStatusBadge(demande.statut)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{demande.description}</p>
                    <div className="flex gap-4 text-sm font-medium">
                      <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md">{demande.localisation}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">{demande.montantEstime} FCFA</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2 shrink-0 md:justify-center">
                    {demande.statut === 'en attente' && (
                      <button onClick={() => updateStatus(demande.id, 'acceptée')} className="btn-primary text-xs py-2">Accepter</button>
                    )}
                    {demande.statut === 'acceptée' && (
                      <button onClick={() => updateStatus(demande.id, 'en cours')} className="btn-outline text-xs py-2">Démarrer</button>
                    )}
                    {demande.statut === 'en cours' && (
                      <button onClick={() => updateStatus(demande.id, 'terminée')} className="btn bg-green-600 text-white text-xs py-2 hover:bg-green-700">Terminer</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
