import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { CommissionCalculator } from '@/lib/jobSystem.js';
import { toast } from 'sonner';

export default function CreateQuotePage() {
  const { demande_id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description_travail: '',
    prix_total: '',
    delai_execution: '',
    conditions_paiement: ''
  });

  const { commission_20_pourcent, prix_artisan } = CommissionCalculator.calculate(formData.prix_total);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pb.collection('devis').create({
        demande_id,
        artisan_id: currentUser.id,
        description_travail: formData.description_travail,
        prix_total: parseFloat(formData.prix_total),
        commission_20_pourcent,
        prix_artisan,
        delai_execution: formData.delai_execution,
        conditions_paiement: formData.conditions_paiement,
        statut: 'envoyé'
      }, { $autoCancel: false });
      await pb.collection('demandes').update(demande_id, { statut: 'devis_envoyé' }, { $autoCancel: false });
      toast.success('Devis envoyé !');
      navigate('/artisan/mes-demandes');
    } catch (err) {
      toast.error('Erreur lors de la création du devis');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Créer un Devis</h1>
        <button onClick={() => navigate('/artisan/mes-demandes')} className="btn-mobile-optimized bg-secondary text-secondary-foreground">
          Annuler
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 card-elevated p-6">
        <div>
          <label className="label-base">Description du travail</label>
          <textarea required rows={4} className="input-base h-auto" value={formData.description_travail} onChange={e=>setFormData({...formData, description_travail: e.target.value})}></textarea>
        </div>
        <div>
          <label className="label-base">Prix Total Client (FCFA)</label>
          <input required type="number" className="input-base" value={formData.prix_total} onChange={e=>setFormData({...formData, prix_total: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-xl border border-border text-sm">
          <div><span className="text-muted-foreground block">Commission plateforme (20%)</span><span className="font-semibold text-danger">{commission_20_pourcent} FCFA</span></div>
          <div><span className="text-muted-foreground block">Votre gain net</span><span className="font-semibold text-primary">{prix_artisan} FCFA</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-base">Délai d'exécution</label>
            <input required type="text" className="input-base" value={formData.delai_execution} onChange={e=>setFormData({...formData, delai_execution: e.target.value})} placeholder="Ex: 3 jours" />
          </div>
          <div>
            <label className="label-base">Conditions de paiement</label>
            <input required type="text" className="input-base" value={formData.conditions_paiement} onChange={e=>setFormData({...formData, conditions_paiement: e.target.value})} placeholder="Ex: 50% avance" />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" onClick={() => {}} className="btn-mobile-optimized bg-primary text-white flex-1">Envoyer le devis</button>
          <button type="button" onClick={() => navigate('/artisan/mes-demandes')} className="btn-mobile-optimized bg-muted text-foreground flex-1">Retour</button>
        </div>
      </form>
    </div>
  );
}