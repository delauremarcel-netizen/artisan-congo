import React, { useState } from 'react';
import { Star, Loader2, MessageSquare as MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const RatingForm = ({ artisanId, onSuccess }) => {
  const { currentUser } = useAuth();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // These are kept to satisfy the DB schema if it strictly demands them, 
  // but they are hidden/auto-filled to simplify the UX as requested.
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Vous devez être connecté pour laisser un avis');
      return;
    }
    
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note de 1 à 5 étoiles.');
      return;
    }

    if (reviewText.length > 500) {
      toast.error('Le commentaire ne doit pas dépasser 500 caractères.');
      return;
    }

    setLoading(true);
    try {
      // Check for duplicate reviews safely
      const existingReviews = await pb.collection('ratings').getList(1, 1, {
        filter: `artisan_id="${artisanId}" && user_id="${currentUser.id}"`,
        $autoCancel: false
      });

      if (existingReviews.items.length > 0) {
        toast.error('Vous avez déjà noté cet artisan.');
        setLoading(false);
        return;
      }

      await pb.collection('ratings').create({
        artisan_id: artisanId,
        user_id: currentUser.id,
        rating: rating,
        review_text: reviewText,
        // Fill mandatory DB sub-fields identically to main rating to satisfy schema
        quality_rating: rating,
        professionalism_rating: rating,
        punctuality_rating: rating
      }, { $autoCancel: false });

      toast.success('Avis soumis avec succès. Merci !');
      setRating(0);
      setReviewText('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Échec de la soumission de l\'avis. Assurez-vous de ne pas avoir déjà évalué cet artisan.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <Card className="shadow-lg border-border/60 overflow-hidden relative mt-8 bg-card">
      <div className="absolute top-0 left-0 w-1 bg-primary h-full"></div>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-primary" />
          Partager votre expérience
        </CardTitle>
        <CardDescription>
          Évaluez la prestation et aidez la communauté avec un retour constructif.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-start gap-3 p-4 bg-muted/40 rounded-xl border border-border/50">
            <span className="font-medium text-foreground">Votre note globale *</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="star-interactive p-1"
                >
                  <Star
                    className={`w-8 h-8 transition-colors duration-200 ${
                      star <= (hoverRating || rating) ? 'star-filled' : 'star-empty'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-sm font-semibold text-primary mt-1">
                {rating} sur 5 étoiles
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label htmlFor="review_text" className="text-sm font-medium text-foreground">
                Votre commentaire (Optionnel)
              </label>
              <span className={`text-xs ${reviewText.length > 500 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {reviewText.length}/500
              </span>
            </div>
            <Textarea
              id="review_text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Décrivez votre expérience : qualité du travail, respect des délais, communication..."
              rows={4}
              maxLength={500}
              className="resize-none bg-background focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading || rating === 0 || reviewText.length > 500} 
              className="w-full sm:w-auto px-8"
              size="lg"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Publication...' : 'Publier mon avis'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RatingForm;