import React, { useState, useEffect } from 'react';
import { Star, MessageSquare as MessageSquareOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';

const RatingsList = ({ artisanId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!artisanId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const limit = showAll ? 50 : 3;
        const records = await pb.collection('ratings').getList(1, limit, {
          filter: `artisan_id="${artisanId}"`,
          sort: '-created_date',
          expand: 'user_id',
          $autoCancel: false
        });
        setReviews(records.items);
        setTotalCount(records.totalItems);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [artisanId, showAll]);

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4 mt-8">
        <Skeleton className="h-8 w-48 mb-6" />
        {[1, 2].map(i => (
          <div key={i} className="p-6 border border-border/60 rounded-2xl bg-card">
            <div className="flex justify-between mb-4">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed mt-8">
        <MessageSquareOff className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Aucun avis pour le moment</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Cet artisan n'a pas encore reçu d'avis. Soyez le premier à partager votre expérience après une prestation !
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
        Avis clients 
        <span className="text-base font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {totalCount}
        </span>
      </h3>
      
      <div className="space-y-5">
        {reviews.map((review) => (
          <article key={review.id} className="p-5 sm:p-6 bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                  {review.expand?.user_id?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {review.expand?.user_id?.name || 'Utilisateur Anonyme'}
                  </p>
                  <time className="text-sm text-muted-foreground" dateTime={review.created_date || review.created}>
                    {new Date(review.created_date || review.created).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
              
              <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'star-filled' : 'star-empty opacity-40'}`}
                  />
                ))}
              </div>
            </div>

            {review.review_text ? (
              <p className="review-text italic">"{review.review_text}"</p>
            ) : (
              <p className="text-muted-foreground text-sm italic">Aucun commentaire laissé.</p>
            )}
          </article>
        ))}
      </div>

      {!showAll && totalCount > 3 && (
        <div className="text-center pt-4">
          <Button variant="outline" size="lg" onClick={() => setShowAll(true)} className="w-full sm:w-auto font-medium">
            Voir les {totalCount - 3} autres avis
          </Button>
        </div>
      )}
    </div>
  );
};

export default RatingsList;