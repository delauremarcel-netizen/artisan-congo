import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';

const PortfolioForm = ({ open, onOpenChange, onSuccess, initialData = null }) => {
  const { currentArtisan } = useAuth();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    project_title: '',
    description: '',
    completion_date: '',
    testimonial: ''
  });

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        project_title: initialData.project_title || '',
        description: initialData.description || '',
        completion_date: initialData.completion_date ? initialData.completion_date.split('T')[0] : '',
        testimonial: initialData.testimonial || ''
      });
      setFiles([]);
    } else if (!initialData && open) {
      setFormData({
        project_title: '',
        description: '',
        completion_date: '',
        testimonial: ''
      });
      setFiles([]);
    }
  }, [initialData, open]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project_title.trim()) {
      toast.error('Le titre du projet est requis');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('artisan_id', currentArtisan.id);
      data.append('project_title', formData.project_title);
      data.append('description', formData.description);
      if (formData.completion_date) {
        data.append('completion_date', new Date(formData.completion_date).toISOString());
      }
      data.append('testimonial', formData.testimonial);

      files.forEach((file) => {
        data.append('photos', file);
      });

      if (initialData) {
        await pb.collection('portfolio').update(initialData.id, data, { $autoCancel: false });
        toast.success('Portfolio mis à jour avec succès');
      } else {
        await pb.collection('portfolio').create(data, { $autoCancel: false });
        toast.success('Projet ajouté avec succès');
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Portfolio save error:', error);
      toast.error('Échec de l\'enregistrement du projet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Modifier le projet' : 'Ajouter un projet'}</DialogTitle>
          <DialogDescription>Présentez votre meilleur travail aux clients potentiels.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_title">Titre du projet *</Label>
            <Input
              id="project_title"
              value={formData.project_title}
              onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
              placeholder="Ex: Rénovation de cuisine moderne"
              required
              className="bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completion_date">Date d'achèvement</Label>
            <Input
              id="completion_date"
              type="date"
              value={formData.completion_date}
              onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
              className="bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez l'étendue des travaux, les défis et les résultats..."
              rows={4}
              className="resize-none bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial">Témoignage client (Optionnel)</Label>
            <Textarea
              id="testimonial"
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              placeholder="Qu'a dit le client de ce projet ?"
              rows={3}
              className="resize-none bg-background text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Télécharger des photos (Max 10)</Label>
            <Input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-background text-foreground"
            />
            {files.length > 0 && (
              <p className="text-xs text-muted-foreground">{files.length} fichier(s) sélectionné(s)</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Enregistrement...' : 'Enregistrer le projet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioForm;