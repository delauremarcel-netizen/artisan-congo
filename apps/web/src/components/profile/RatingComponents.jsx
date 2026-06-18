import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const RatingStars = ({ rating = 0, count = 0, showCount = true, className }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-[hsl(var(--premium))] text-[hsl(var(--premium))]" />
        ))}
        {hasHalfStar && (
          <StarHalf className="w-4 h-4 fill-[hsl(var(--premium))] text-[hsl(var(--premium))]" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground/30" />
        ))}
      </div>
      {showCount && (
        <span className="text-sm font-medium text-muted-foreground">
          <span className="text-foreground font-bold">{rating.toFixed(1)}</span>/5 ({count} avis)
        </span>
      )}
    </div>
  );
};

export const RatingDistribution = ({ distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, total = 0 }) => {
  return (
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 w-12 shrink-0 font-medium text-muted-foreground">
              {star} <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <Progress value={percentage} className="h-2.5 bg-muted" indicatorClassName="bg-[hsl(var(--premium))]" />
            <div className="w-10 text-right text-muted-foreground text-xs font-medium tabular-nums">
              {percentage.toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const RatingByCategory = ({ ratings = {} }) => {
  const categories = [
    { key: 'qualite', label: 'Qualité du travail' },
    { key: 'professionnalisme', label: 'Professionnalisme' },
    { key: 'ponctualite', label: 'Ponctualité' },
    { key: 'communication', label: 'Communication' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {categories.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-foreground">{label}</span>
            <span className="text-muted-foreground">{ratings[key]?.toFixed(1) || '0.0'}</span>
          </div>
          <Progress value={(ratings[key] || 0) * 20} className="h-2 bg-muted" indicatorClassName="bg-primary" />
        </div>
      ))}
    </div>
  );
};