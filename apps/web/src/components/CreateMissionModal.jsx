import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { validateMissionForm } from '@/lib/clientUtils.js';
import { UploadCloud, Calendar, MapPin } from 'lucide-react';

const CreateMissionModal = ({ isOpen, onClose, artisanId, prefillCategory, onMissionCreated }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: prefillCategory || '',
    budget: '',
    start_date: '',
    end_date: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Vous devez être connecté pour créer une mission');
      return;
    }

    const validation = validateMissionForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // The schema for missions: company_id, title, description, category, budget, deadline, status
      // We encode extra location and start_date into the description to conform to schema safely
      const enrichedDescription = `${formData.description}\n\n---\nLocalisation: ${formData.location}\nDate de début: ${formData.start_date}`;

      const missionPayload = {
        company_id: currentUser.id,
        title: formData.title.trim(),
        description: enrichedDescription,
        category: formData.category,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        deadline: formData.end_date || formData.start_date, // Fallback to start if end not provided
        status: 'open', // Map to open for new pending missions
      };

      // Note: "Fichiers" input exists in UI per prompt requirements, but files are omitted 
      // from API payload to prevent crashing against non-existent schema field.
      
      await pb.collection('missions').create(missionPayload, { $autoCancel: false });

      toast.success('Votre mission a été créée!');
      if (onMissionCreated) onMissionCreated();
      handleClose();
    } catch (err) {
      console.error('Error creating mission:', err);
      toast.error('Erreur lors de la création de la mission');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: prefillCategory || '',
      budget: '',
      start_date: '',
      end_date: '',
      location: ''
    });
    setErrors({});
    onClose();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card max-h-[90vh] flex flex-col text-card-foreground">
        <div className="p-6 border-b border-border shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl">Créer une mission</DialogTitle>
            <DialogDescription>
              Détaillez votre projet pour recevoir une proposition adaptée.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form id="mission-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="label-base">Titre de la mission <span className="text-destructive">*</span></label>
              <input
                type="text"
                id="title"
                name="title"
                className="input-base"
                placeholder="Ex: Rénovation salle de bain"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="category" className="label-base">Catégorie <span className="text-destructive">*</span></label>
                <select
                  id="category"
                  name="category"
                  className="input-base"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Plomberie">Plomberie</option>
                  <option value="Menuiserie">Menuiserie</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Maçonnerie">Maçonnerie</option>
                  <option value="Peinture">Peinture</option>
                  <option value="Construction">Construction</option>
                  <option value="Paysagisme">Paysagisme</option>
                </select>
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
              </div>
              
              <div>
                <label htmlFor="budget" className="label-base">Budget estimé (FCFA)</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  className="input-base"
                  placeholder="Ex: 50000"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                />
                {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="label-base">Localisation <span className="text-destructive">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="input-base pl-10"
                  placeholder="Quartier, Ville"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="start_date" className="label-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date souhaitée <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  className="input-base"
                  min={todayStr}
                  value={formData.start_date}
                  onChange={handleChange}
                />
                {errors.start_date && <p className="text-sm text-destructive mt-1">{errors.start_date}</p>}
              </div>
              
              <div>
                <label htmlFor="end_date" className="label-base flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date limite (Optionnel)
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  className="input-base"
                  min={formData.start_date || todayStr}
                  value={formData.end_date}
                  onChange={handleChange}
                />
                {errors.end_date && <p className="text-sm text-destructive mt-1">{errors.end_date}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label-base flex justify-between">
                Description <span className="text-muted-foreground font-normal">{formData.description.length}/1000</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className="input-base min-h-[120px] resize-none"
                placeholder="Détaillez le travail à effectuer, les contraintes, le matériel nécessaire..."
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="label-base">Fichiers (Optionnel)</label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Glissez vos fichiers ici ou cliquez</p>
                <p className="text-xs text-muted-foreground mt-1">Max 5 fichiers (5MB/fichier). Images ou PDF.</p>
                <input type="file" multiple accept="image/*,.pdf" className="hidden" id="file-upload" />
                <Button type="button" variant="secondary" size="sm" className="mt-4" onClick={() => document.getElementById('file-upload').click()}>
                  Sélectionner des fichiers
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">Note: Le téléchargement de fichiers n'est pas encore pris en charge par le serveur.</p>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border shrink-0 flex justify-end gap-3 bg-muted/30">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" form="mission-form" disabled={loading}>
            {loading ? 'Création...' : 'Créer la mission'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMissionModal;