import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { IDGenerator } from '@/lib/jobSystem.js';
import PhotoUploadComponent from '@/components/PhotoUploadComponent.jsx';
import { toast } from 'sonner';

export default function CreateJobRequestPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'Plomberie',
    localisation: 'Brazzaville',
    budget_client: '',
    date_souhaitee: ''
  });
  const [photos, setPhotos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('id', IDGenerator.generateDemandeId());
      if(currentUser?.id) {
        data.append('client_id', currentUser.id);
      }
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      photos.forEach(p => data.append('photos_initiales', p));
      data.append('statut', 'demande_reçue');

      await pb.collection('demandes').create(data, { $autoCancel: false });
      toast.success('Demande envoyée avec succès !');
      navigate('/client/mes-demandes');
    } catch (err) {
      toast.error('Erreur lors de la création de la demande.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Nouvelle demande de service</h1>
        <button onClick={() => navigate('/client/mes-demandes')} className="btn-mobile-optimized bg-secondary text-secondary-foreground">
          Annuler
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 card-elevated p-6">
        <div>
          <label className="label-base">Titre de la demande</label>
          <input required type="text" className="input-base" value={formData.titre} onChange={e=>setFormData({...formData, titre: e.target.value})} placeholder="Ex: Fuite d'eau sous l'évier" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-base">Catégorie</label>
            <select className="input-base" value={formData.categorie} onChange={e=>setFormData({...formData, categorie: e.target.value})}>
              <option value="Plomberie">Plomberie</option>
              <option value="Électricité">Électricité</option>
              <option value="Menuiserie">Menuiserie</option>
              <option value="Maçonnerie">Maçonnerie</option>
              <option value="Peinture">Peinture</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="label-base">Localisation</label>
            <input required type="text" className="input-base" value={formData.localisation} onChange={e=>setFormData({...formData, localisation: e.target.value})} placeholder="Ville, Quartier" />
          </div>
        </div>

        <div>
          <label className="label-base">Description détaillée</label>
          <textarea required rows={4} className="input-base h-auto" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Décrivez votre problème en détail..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-base">Budget estimé (Optionnel)</label>
            <input type="number" className="input-base" value={formData.budget_client} onChange={e=>setFormData({...formData, budget_client: e.target.value})} placeholder="FCFA" />
          </div>
          <div>
            <label className="label-base">Date souhaitée (Optionnel)</label>
            <input type="date" className="input-base" value={formData.date_souhaitee} onChange={e=>setFormData({...formData, date_souhaitee: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="label-base">Photos de la situation (Max 5)</label>
          <PhotoUploadComponent maxFiles={5} onFilesChange={setPhotos} />
        </div>

        <button type="submit" disabled={loading} onClick={() => {}} className="btn-mobile-optimized bg-primary text-primary-foreground hover:bg-primary/90 mt-8">
          {loading ? 'Envoi...' : 'Soumettre la demande'}
        </button>
      </form>
    </div>
  );
}