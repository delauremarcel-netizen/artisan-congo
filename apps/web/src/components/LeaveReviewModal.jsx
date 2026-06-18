import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { validateReviewForm } from '@/lib/clientUtils.js';

const StarRatingInput = ({ value, onChange, label, required = false }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground flex justify-between">
        <span>{label} {required && <span className="text-destructive">*</span>}</span>
        <span className="text-muted-foreground">{value > 0 ? `${value}/5` : '-/5'}</span>
      </label>
      <div className="flex items-center gap-1" onMouseLeave={() => setHoverValue(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus-ring rounded-sm p-0.5 interactive-element"
            onMouseEnter={() => setHoverValue(star)}
            onClick={() => onChange(star)}
          >
            <Star 
              className={`w-8 h-8 ${
                (hoverValue || value) >= star 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-muted text-muted-foreground/30'
              } transition-colors`} 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const LeaveReviewModal = ({ isOpen, onClose, artisanId, artisanName, onReviewSubmitted }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    quality_rating: 0,
    professionalism_rating: 0,
    punctuality_rating: 0,
    review_text: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Vous devez être connecté pour laisser un avis');
      return;
    }

    const validation = validateReviewForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await pb.collection('ratings').create({
        artisan_id: artisanId,
        user_id: currentUser.id,
        rating: formData.rating,
        quality_rating: formData.quality_rating || formData.rating,
        professionalism_rating: formData.professionalism_rating || formData.rating,
        punctuality_rating: formData.punctuality_rating || formData.rating,
        review_text: formData.review_text.trim(),
      }, { $autoCancel: false });

      toast.success('Votre avis a été publié!');
      if (onReviewSubmitted) onReviewSubmitted();
      handleClose();
    } catch (err) {
      console.error('Error creating review:', err);
      toast.error('Erreur lors de la publication de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      rating: 0,
      quality_rating: 0,
      professionalism_rating: 0,
      punctuality_rating: 0,
      review_text: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card text-card-foreground">
        <div className="p-6 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-xl">Évaluer {artisanName}</DialogTitle>
            <DialogDescription>
              Partagez votre expérience pour aider la communauté.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <StarRatingInput 
              label="Note globale" 
              value={formData.rating} 
              onChange={(val) => {
                setFormData({...formData, rating: val});
                if (errors.rating) setErrors({...errors, rating: null});
              }}
              required
            />
            {errors.rating && <p className="text-sm text-destructive mt-2">{errors.rating}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StarRatingInput 
              label="Qualité du travail" 
              value={formData.quality_rating} 
              onChange={(val) => setFormData({...formData, quality_rating: val})}
            />
            <StarRatingInput 
              label="Professionnalisme" 
              value={formData.professionalism_rating} 
              onChange={(val) => setFormData({...formData, professionalism_rating: val})}
            />
            <StarRatingInput 
              label="Ponctualité" 
              value={formData.punctuality_rating} 
              onChange={(val) => setFormData({...formData, punctuality_rating: val})}
            />
          </div>

          <div>
            <label htmlFor="review_text" className="label-base flex justify-between">
              Commentaire <span className="text-muted-foreground font-normal">{formData.review_text.length}/500</span>
            </label>
            <textarea
              id="review_text"
              rows={4}
              className="input-base min-h-[100px] resize-none"
              placeholder="Décrivez votre expérience avec cet artisan..."
              value={formData.review_text}
              onChange={(e) => setFormData({...formData, review_text: e.target.value})}
              maxLength={500}
            />
            {errors.review_text && <p className="text-sm text-destructive mt-1">{errors.review_text}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || formData.rating === 0}>
              {loading ? 'Publication...' : 'Soumettre l\'avis'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveReviewModal;