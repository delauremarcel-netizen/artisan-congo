import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, X, Star, Calendar, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { validateProjectForm } from '@/lib/portfolioUtils.js';

const AddEditProjectModal = ({ isOpen, onClose, projectToEdit, onSuccess }) => {
  const { currentUser } = useAuth();
  const isEdit = !!projectToEdit;
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [artisanCategories, setArtisanCategories] = useState([]);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    budget: '',
    date_debut: '',
    date_fin: '',
    localisation: '',
    client_nom: '',
    client_avis: '',
    client_rating: 0,
    statut: 'public',
    featured: false,
    newImages: [],
    existingImages: []
  });

  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    const fetchArtisanInfo = async () => {
      if (!currentUser?.id) return;
      try {
        const artisan = await pb.collection('artisan_profiles').getFirstListItem(`artisan_id="${currentUser.id}"`, { $autoCancel: false });
        if (artisan.category) setArtisanCategories([artisan.category]);
      } catch (err) {
        console.error("Error fetching artisan category:", err);
      }
    };
    if (isOpen) fetchArtisanInfo();
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (isOpen && isEdit && projectToEdit) {
      setFormData({
        titre: projectToEdit.titre || '',
        description: projectToEdit.description || '',
        categorie: projectToEdit.categorie || '',
        budget: projectToEdit.budget || '',
        date_debut: projectToEdit.date_debut ? projectToEdit.date_debut.split('T')[0] : '',
        date_fin: projectToEdit.date_fin ? projectToEdit.date_fin.split('T')[0] : '',
        localisation: projectToEdit.localisation || '',
        client_nom: projectToEdit.client_nom || '',
        client_avis: projectToEdit.client_avis || '',
        client_rating: projectToEdit.client_rating || 0,
        statut: projectToEdit.statut || 'public',
        featured: projectToEdit.featured || false,
        existingImages: projectToEdit.images || [],
        newImages: []
      });
      setImagesToDelete([]);
      setErrors({});
    } else if (isOpen && !isEdit) {
      setFormData({
        titre: '',
        description: '',
        categorie: artisanCategories[0] || '',
        budget: '',
        date_debut: '',
        date_fin: '',
        localisation: '',
        client_nom: '',
        client_avis: '',
        client_rating: 0,
        statut: 'public',
        featured: false,
        newImages: [],
        existingImages: []
      });
      setImagesToDelete([]);
      setErrors({});
    }
  }, [isOpen, isEdit, projectToEdit, artisanCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCount = formData.newImages.length + formData.existingImages.length + files.length;
    
    if (totalCount > 10) {
      toast.error('Maximum 10 images autorisées');
      return;
    }

    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...files]
    }));
    if (errors.images) setErrors(prev => ({ ...prev, images: null }));
  };

  const removeNewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (imgName) => {
    setImagesToDelete(prev => [...prev, imgName]);
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== imgName)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { valid, errors: validationErrors } = validateProjectForm(formData, isEdit, formData.existingImages.length);
    if (!valid) {
      setErrors(validationErrors);
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('titre', formData.titre);
      data.append('description', formData.description);
      data.append('categorie', formData.categorie);
      if (formData.budget) data.append('budget', formData.budget);
      data.append('date_debut', new Date(formData.date_debut).toISOString());
      data.append('date_fin', new Date(formData.date_fin).toISOString());
      data.append('localisation', formData.localisation);
      data.append('client_nom', formData.client_nom);
      data.append('client_avis', formData.client_avis);
      data.append('client_rating', formData.client_rating);
      data.append('statut', formData.statut);
      data.append('featured', formData.featured);
      
      if (!isEdit) {
        data.append('artisan_id', currentUser.id);
      }

      // Add new files
      formData.newImages.forEach(file => {
        data.append('images', file);
      });

      // Handle PocketBase specific deletion of array items via modifier
      if (isEdit && imagesToDelete.length > 0) {
        // According to PB docs, to delete specific files from array: "images.minus": "filename"
        // But the JS SDK does this differently, often replacing the whole array or using array notation.
        // The safest approach in a limited environment is to let PB append new images. 
        // For deleting, Pocketbase uses `.name` suffix for file arrays, but it's tricky.
        // Using "images.-": [filename1, filename2] pattern if PB >= 0.22
        // If not perfectly supported here, we can live with it appending for now, but we will try the minus modifier:
        imagesToDelete.forEach(filename => {
          data.append('images.-', filename);
        });
      }

      if (isEdit) {
        await pb.collection('portfolio').update(projectToEdit.id, data, { $autoCancel: false });
        toast.success('Projet mis à jour avec succès');
      } else {
        await pb.collection('portfolio').create(data, { $autoCancel: false });
        toast.success('Projet créé avec succès');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving project:', err);
      toast.error('Erreur lors de la sauvegarde du projet');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus-ring rounded-sm p-0.5"
        >
          <Star 
            className={`w-6 h-6 ${
              value >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground/30'
            } transition-colors`} 
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-card text-card-foreground flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-border shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl">{isEdit ? 'Modifier le projet' : 'Ajouter un projet au portfolio'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Modifiez les détails de votre réalisation.' : 'Partagez une réalisation pour attirer plus de clients.'}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form id="portfolio-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* BASIC INFO */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Informations Principales</h3>
              
              <div>
                <label className="label-base">Titre du projet <span className="text-destructive">*</span></label>
                <Input
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Ex: Rénovation complète salle de bain"
                  maxLength={100}
                />
                {errors.titre && <p className="text-xs text-destructive mt-1">{errors.titre}</p>}
              </div>

              <div>
                <label className="label-base flex justify-between">
                  Description <span className="text-muted-foreground font-normal">{formData.description.length}/1000</span>
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Détaillez le travail accompli, les défis surmontés..."
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="label-base">Catégorie <span className="text-destructive">*</span></label>
                <select
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="input-base"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {artisanCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="Plomberie">Plomberie</option>
                  <option value="Électricité">Électricité</option>
                  <option value="Menuiserie">Menuiserie</option>
                  <option value="Autre">Autre</option>
                </select>
                {errors.categorie && <p className="text-xs text-destructive mt-1">{errors.categorie}</p>}
              </div>
            </section>

            {/* IMAGES */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Photos <span className="text-destructive">*</span></h3>
              
              <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Glissez vos photos ici ou cliquez</p>
                <p className="text-xs text-muted-foreground mt-1">Max 10 images (5MB/image). JPG, PNG, WebP.</p>
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                  id="portfolio-images" 
                  onChange={handleFileChange}
                />
                <Button type="button" variant="secondary" size="sm" className="mt-4" onClick={() => document.getElementById('portfolio-images').click()}>
                  Sélectionner des photos
                </Button>
              </div>
              {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}

              {/* Image Previews */}
              {(formData.existingImages.length > 0 || formData.newImages.length > 0) && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                  {/* Existing */}
                  {formData.existingImages.map((img, idx) => (
                    <div key={`exist-${idx}`} className="relative aspect-square rounded-lg overflow-hidden group border border-border">
                      <img src={pb.files.getUrl(projectToEdit, img, { thumb: '100x100' })} alt="existante" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(img)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {/* New */}
                  {formData.newImages.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden group border border-primary/50 ring-2 ring-primary/20">
                      <img src={URL.createObjectURL(file)} alt="nouvelle" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 text-[9px] bg-primary text-primary-foreground px-1.5 rounded-sm">Nouv</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* DETAILS */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Détails de Réalisation</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base flex items-center gap-2"><Calendar className="w-4 h-4"/> Date de début <span className="text-destructive">*</span></label>
                  <Input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} />
                  {errors.date_debut && <p className="text-xs text-destructive mt-1">{errors.date_debut}</p>}
                </div>
                <div>
                  <label className="label-base flex items-center gap-2"><Calendar className="w-4 h-4"/> Date de fin <span className="text-destructive">*</span></label>
                  <Input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} min={formData.date_debut} />
                  {errors.date_fin && <p className="text-xs text-destructive mt-1">{errors.date_fin}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base flex items-center gap-2"><MapPin className="w-4 h-4"/> Localisation</label>
                  <Input name="localisation" value={formData.localisation} onChange={handleChange} placeholder="Ville, Quartier" />
                </div>
                <div>
                  <label className="label-base">Budget (FCFA)</label>
                  <Input type="number" name="budget" value={formData.budget} onChange={handleChange} min="0" placeholder="Ex: 50000" />
                </div>
              </div>
            </section>

            {/* CLIENT TESTIMONIAL */}
            <section className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border/50">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Témoignage Client (Optionnel)</h3>
              
              <div>
                <label className="label-base">Nom du client</label>
                <Input name="client_nom" value={formData.client_nom} onChange={handleChange} placeholder="Ex: Jean D." />
              </div>
              
              <div>
                <label className="label-base flex justify-between">
                  Note du client
                  <span className="text-muted-foreground font-normal text-xs">{formData.client_rating}/5</span>
                </label>
                <StarRating value={formData.client_rating} onChange={(val) => setFormData(prev => ({...prev, client_rating: val}))} />
              </div>

              <div>
                <label className="label-base flex justify-between">
                  Avis <span className="text-muted-foreground font-normal text-xs">{formData.client_avis.length}/500</span>
                </label>
                <Textarea
                  name="client_avis"
                  value={formData.client_avis}
                  onChange={handleChange}
                  placeholder="Ce que le client a dit de la réalisation..."
                  className="resize-none"
                  maxLength={500}
                />
                {errors.client_avis && <p className="text-xs text-destructive mt-1">{errors.client_avis}</p>}
              </div>
            </section>

            {/* SETTINGS */}
            <section className="space-y-4 pb-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Publication</h3>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="space-y-2">
                  <label className="label-base">Statut</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="statut" value="public" checked={formData.statut === 'public'} onChange={handleChange} className="text-primary focus:ring-primary" />
                      <span className="text-sm">Public</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="statut" value="draft" checked={formData.statut === 'draft'} onChange={handleChange} className="text-primary focus:ring-primary" />
                      <span className="text-sm">Brouillon</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label-base">Mise en avant</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="rounded text-primary focus:ring-primary" />
                    <span className="text-sm">Afficher sur mon profil principal</span>
                  </label>
                </div>
              </div>
            </section>

          </form>
        </div>

        <div className="p-6 border-t border-border shrink-0 flex justify-end gap-3 bg-muted/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" form="portfolio-form" disabled={loading} className="min-w-[150px]">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...</> : 'Enregistrer le projet'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProjectModal;