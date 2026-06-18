import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import StatusTimeline from '@/components/StatusTimeline.jsx';
import StatusBadge from '@/components/StatusBadge.jsx';
import PhotoUploadComponent from '@/components/PhotoUploadComponent.jsx';
import { toast } from 'sonner';

export default function ManageJobSitePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chantier, setChantier] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    pb.collection('chantiers').getOne(id, { expand: 'demande_id', $autoCancel: false })
      .then(res => {
        setChantier(res);
        setStatus(res.statut);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      await pb.collection('chantiers').update(id, { statut: status }, { $autoCancel: false });
      toast.success('Statut mis à jour');
      // Adding navigate if user needs to go back to list, but staying on page is fine.
      // To strictly follow the rules, let's keep it here, but no navigate is forced for state updates.
    } catch (err) {
      toast.error('Erreur');
    }
  };

  if (!chantier) return <div className="p-12 text-center">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="card-elevated p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/artisan/mes-demandes')} className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              ← Retour
            </button>
            <h1 className="text-2xl font-bold">Gestion du Chantier</h1>
          </div>
          <StatusBadge status={chantier.statut} />
        </div>
        <StatusTimeline currentStatus={chantier.statut} steps={['devis_validé', 'en_cours', 'terminé', 'litige']} />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="label-base">Changer le statut</label>
            <select className="input-base" value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="devis_validé">Devis Validé</option>
              <option value="en_cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>
          </div>
          <button 
            onClick={() => {
              handleUpdateStatus();
              navigate('/artisan/mes-demandes');
            }} 
            className="btn-mobile-optimized bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Mettre à jour
          </button>
        </div>
      </div>

      <div className="card-elevated p-8">
        <h2 className="text-xl font-bold mb-4">Photos d'avancement</h2>
        <PhotoUploadComponent maxFiles={5} />
      </div>
    </div>
  );
}