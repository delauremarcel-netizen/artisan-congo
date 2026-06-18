import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import StatusTimeline from '@/components/StatusTimeline.jsx';
import StatusBadge from '@/components/StatusBadge.jsx';
import { toast } from 'sonner';

export default function JobRequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [devis, setDevis] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await pb.collection('demandes').getOne(id, { $autoCancel: false });
        setDemande(d);
        const quotes = await pb.collection('devis').getFullList({ filter: `demande_id = "${id}"`, $autoCancel: false });
        if (quotes.length > 0) setDevis(quotes[0]);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const handleValidateDevis = async () => {
    try {
      await pb.collection('devis').update(devis.id, { statut: 'validé', validated_at: new Date().toISOString() }, { $autoCancel: false });
      await pb.collection('demandes').update(demande.id, { statut: 'devis_validé' }, { $autoCancel: false });
      await pb.collection('chantiers').create({
        demande_id: demande.id,
        devis_id: devis.id,
        artisan_id: devis.artisan_id,
        client_id: demande.client_id,
        statut: 'devis_validé'
      }, { $autoCancel: false });
      toast.success('Devis validé ! Chantier créé.');
      navigate('/client/mes-demandes');
    } catch (err) {
      toast.error('Erreur lors de la validation.');
    }
  };

  const handleRejectDevis = async () => {
    try {
      await pb.collection('devis').update(devis.id, { statut: 'rejeté' }, { $autoCancel: false });
      toast.success('Devis refusé.');
      navigate('/client/mes-demandes');
    } catch (err) {
      toast.error('Erreur lors du refus.');
    }
  };

  if (!demande) return <div className="p-12 text-center">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="card-elevated p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/client/mes-demandes')} className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              ← Retour
            </button>
            <h1 className="text-2xl font-bold">{demande.titre}</h1>
          </div>
          <StatusBadge status={demande.statut} />
        </div>
        <div className="py-6">
          <StatusTimeline currentStatus={demande.statut} />
        </div>
        <p className="text-foreground mt-4">{demande.description}</p>
      </div>

      {devis && (
        <div className="card-elevated p-8 bg-secondary/5 border-secondary/20">
          <h2 className="text-xl font-bold mb-4">Devis reçu</h2>
          <div className="space-y-2 mb-6">
            <p><strong>Prix Total:</strong> {devis.prix_total} FCFA</p>
            <p><strong>Délai:</strong> {devis.delai_execution}</p>
            <p><strong>Conditions:</strong> {devis.conditions_paiement}</p>
            <p><strong>Description:</strong> {devis.description_travail}</p>
          </div>
          {devis.statut !== 'validé' && devis.statut !== 'rejeté' && (
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  handleValidateDevis();
                  navigate('/client/mes-demandes');
                }} 
                className="btn-mobile-optimized bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Valider le devis
              </button>
              <button 
                onClick={() => {
                  handleRejectDevis();
                  navigate('/client/mes-demandes');
                }} 
                className="btn-mobile-optimized bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Refuser
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}