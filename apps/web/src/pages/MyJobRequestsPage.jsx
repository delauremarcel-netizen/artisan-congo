import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import StatusBadge from '@/components/StatusBadge.jsx';

export default function MyJobRequestsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const records = await pb.collection('demandes').getFullList({
          filter: `client_id = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setDemandes(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchDemandes();
  }, [currentUser]);

  if (loading) return <div className="p-12 text-center">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mes demandes de service</h1>
        <button onClick={() => navigate('/client/nouvelle-demande')} className="btn-mobile-optimized bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
          Créer
        </button>
      </div>

      {demandes.length === 0 ? (
        <div className="text-center py-24 bg-muted/30 rounded-2xl border border-border">
          <h2 className="text-xl font-semibold mb-2">Aucune demande</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore créé de demande de service.</p>
          <button onClick={() => navigate('/client/nouvelle-demande')} className="btn-mobile-optimized bg-primary text-primary-foreground">
            Créer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demandes.map(d => (
            <div 
              key={d.id} 
              onClick={() => navigate(`/client/demande/${d.id}`)}
              className="card-elevated p-6 block hover:border-primary/50 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-muted-foreground">{d.id}</span>
                <StatusBadge status={d.statut} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{d.titre}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{d.description}</p>
              <div className="text-xs font-medium text-muted-foreground">
                Créée le {new Date(d.created).toLocaleDateString()}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/client/demande/${d.id}`); }} 
                className="mt-4 w-full py-2 bg-secondary/10 text-secondary-foreground rounded-lg font-medium text-sm hover:bg-secondary/20 transition-colors"
              >
                Voir les détails
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}