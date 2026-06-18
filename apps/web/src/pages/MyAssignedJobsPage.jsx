import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import StatusBadge from '@/components/StatusBadge.jsx';

export default function MyAssignedJobsPage() {
  const { currentUser } = useAuth();
  const [chantiers, setChantiers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const records = await pb.collection('chantiers').getFullList({
          filter: `artisan_id = "${currentUser.id}"`,
          expand: 'demande_id',
          sort: '-created',
          $autoCancel: false
        });
        setChantiers(records);
      } catch (err) {
        console.error(err);
      }
    };
    if (currentUser) fetch();
  }, [currentUser]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Mes Chantiers</h1>
      {chantiers.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Aucun chantier assigné pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chantiers.map(c => (
            <Link to={`/artisan/chantier/${c.id}`} key={c.id} className="card-elevated p-6 block">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-mono text-muted-foreground">{c.id}</span>
                <StatusBadge status={c.statut} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Chantier - {c.expand?.demande_id?.titre || 'Détails...'}</h3>
              <p className="text-sm text-muted-foreground">Date début: {c.date_debut || 'Non définie'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}