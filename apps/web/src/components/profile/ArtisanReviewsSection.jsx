import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RatingStars } from './RatingComponents.jsx';
import { MessageSquare as MessageSquareQuote, ChevronLeft, ChevronRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

export const ArtisanReviewsSection = ({ reviews = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
        <MessageSquareQuote className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Aucun avis pour le moment</h3>
        <p className="text-muted-foreground text-sm max-w-sm mt-1">
          Soyez le premier à laisser un avis après avoir travaillé avec cet artisan.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {currentReviews.map((review) => (
          <div key={review.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border border-border">
                  <AvatarImage src={review.client_photo ? pb.files.getUrl(review, review.client_photo) : ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {review.client_nom?.substring(0, 2).toUpperCase() || 'CL'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground">{review.client_nom}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <RatingStars rating={review.note} showCount={false} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <h5 className="font-semibold text-foreground mb-2">{review.titre}</h5>
            <p className="text-muted-foreground text-sm leading-relaxed">{review.texte}</p>

            {review.reponse_artisan && (
              <div className="mt-6 bg-muted/50 rounded-xl p-4 border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-sm text-foreground">Réponse de l'artisan</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.date_reponse || review.updated).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{review.reponse_artisan}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground px-4">
            Page {currentPage} sur {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};