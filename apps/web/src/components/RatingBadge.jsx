import React from 'react';
import { Award, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RatingBadge = ({ averageRating }) => {
  const rating = parseFloat(averageRating);

  if (isNaN(rating) || rating < 4.0) return null;

  if (rating >= 4.8) {
    return (
      <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 border-none px-3 py-1 text-sm font-semibold flex items-center gap-1.5 shadow-md">
        <Award className="w-4 h-4" />
        Artisan d'Élite
      </Badge>
    );
  }

  if (rating >= 4.5) {
    return (
      <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 border-none px-3 py-1 text-sm font-semibold flex items-center gap-1.5 shadow-sm">
        <Star className="w-4 h-4 fill-current" />
        Très Apprécié
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold flex items-center gap-1.5">
      <Star className="w-4 h-4" />
      De Confiance
    </Badge>
  );
};

export default RatingBadge;