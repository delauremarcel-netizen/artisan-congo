import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const StarRatingInput = ({ label, value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b last:border-0 border-border/50">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
            aria-label={`Noter ${star} étoiles`}
          >
            <Star
              className={`w-6 h-6 sm:w-5 sm:h-5 ${
                star <= (hovered || value)
                  ? 'fill-accent text-accent drop-shadow-sm'
                  : 'text-muted-foreground/30'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const ReviewForm = ({ artisanId, open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 0,
    quality_rating: 0,
    professionalism_rating: 0,
    punctuality_rating: 0,
    value_rating: 0,
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customer_name.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }
    
    if (!formData.rating || !formData.quality_rating || !formData.professionalism_rating || !formData.punctuality_rating || !formData.value_rating) {
      toast.error('Veuillez fournir une note pour toutes les catégories');
      return;
    }

    setLoading(true);
    try {
      await pb.collection('reviews').create({
        artisan_id: artisanId,
        ...formData
      }, { $autoCancel: false });

      toast.success('Avis soumis avec succès');
      setFormData({
        customer_name: '', rating: 0, quality_rating: 0, professionalism_rating: 0, punctuality_rating: 0, value_rating: 0, comment: ''
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Échec de la soumission de l\'avis');
      console.error('Review submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Laisser un avis</DialogTitle>
          <DialogDescription>
            Vos retours détaillés aident les autres à trouver le bon artisan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Votre nom</Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              placeholder="Ex : Jean Dupont"
              required
              className="bg-background text-foreground"
            />
          </div>

          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-3 text-muted-foreground">Notes détaillées</h4>
            <div className="space-y-1">
              <StarRatingInput 
                label="Expérience globale" 
                value={formData.rating} 
                onChange={(v) => setFormData({...formData, rating: v})} 
              />
              <StarRatingInput 
                label="Qualité du travail" 
                value={formData.quality_rating} 
                onChange={(v) => setFormData({...formData, quality_rating: v})} 
              />
              <StarRatingInput 
                label="Professionnalisme" 
                value={formData.professionalism_rating} 
                onChange={(v) => setFormData({...formData, professionalism_rating: v})} 
              />
              <StarRatingInput 
                label="Ponctualité" 
                value={formData.punctuality_rating} 
                onChange={(v) => setFormData({...formData, punctuality_rating: v})} 
              />
              <StarRatingInput 
                label="Rapport qualité/prix" 
                value={formData.value_rating} 
                onChange={(v) => setFormData({...formData, value_rating: v})} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaires (Optionnel)</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Décrivez votre expérience avec cet artisan..."
              rows={4}
              className="resize-none bg-background text-foreground"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Soumission...' : 'Soumettre l\'avis'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;