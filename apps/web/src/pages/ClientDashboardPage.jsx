
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { LogOut, ClipboardList, PlusCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboardPage() {
  const { currentUser, logout } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const dems = await pb.collection('demandes').getFullList({
          filter: `clientId="${currentUser.id}"`,
          sort: '-created',
          expand: 'artisanId,artisanId.userId',
          $autoCancel: false
        });
        setDemandes(dems);
      } catch (err) {
        console.error("Error loading requests", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser) fetchDemandes();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en attente': return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">En attente</span>;
      case 'acceptée': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">Acceptée</span>;
      case 'en cours': return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold">En cours</span>;
      case 'terminée': return <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold">Terminée (À Payer)</span>;
      case 'payée': return <span className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold">Payée</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted/20 flex flex-col">
      <header className="bg-background border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Espace Client</h1>
        <button onClick={logout} className="inline-flex items-center text-sm font-medium text-destructive hover:opacity-80">
          <LogOut className="w-4 h-4 mr-2" /> Déconnexion
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Bonjour, {currentUser?.nom}</h2>
            <p className="text-muted-foreground">Suivez l'évolution de vos travaux.</p>
          </div>
          <Link to="/search" className="btn-primary shrink-0">
            <PlusCircle className="w-4 h-4 mr-2" /> Nouvelle demande
          </Link>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
            <ClipboardList className="w-5 h-5 text-primary" /> Mes requêtes
          </h3>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map(i => <div key={i} className="h-24 bg-muted/50 rounded-xl"></div>)}
            </div>
          ) : demandes.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Aucune demande en cours.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {demandes.map(demande => {
                const artisanName = demande.expand?.artisanId?.expand?.userId?.nom || 'Artisan non assigné';
                return (
                  <div key={demande.id} className="border rounded-xl p-5 hover:border-primary/30 transition-colors flex flex-col sm:flex-row gap-4 justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold">{demande.metier}</span>
                        {getStatusBadge(demande.statut)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{demande.description}</p>
                      <div className="text-sm font-medium text-primary">
                        Avec: {artisanName}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center sm:items-end">
                      {demande.statut === 'terminée' && (
                        <button className="btn bg-slate-900 text-white hover:bg-slate-800 text-sm py-2 px-4 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" /> Payer {demande.montantEstime} F
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
