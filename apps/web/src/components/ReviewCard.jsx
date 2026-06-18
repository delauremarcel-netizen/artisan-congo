import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeDate, truncateText } from '@/lib/artisanUtils.js';

const ReviewCard = ({ review, truncate = false, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const shouldTruncate = truncate && review.review_text && review.review_text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? truncateText(review.review_text, maxLength)
    : review.review_text;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-foreground">
              {review.customer_name || 'Client anonyme'}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatRelativeDate(review.created_date || review.created)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
        </div>

        {review.review_text && (
          <div className="space-y-2">
            <p className="text-foreground leading-relaxed">
              {displayText}
            </p>
            {shouldTruncate && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                {isExpanded ? 'Voir moins' : 'Lire plus'}
              </Button>
            )}
          </div>
        )}

        {(review.quality_rating || review.professionalism_rating || review.punctuality_rating) && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
            {review.quality_rating && (
              <Badge variant="outline" className="text-xs">
                Qualité: {review.quality_rating}/5
              </Badge>
            )}
            {review.professionalism_rating && (
              <Badge variant="outline" className="text-xs">
                Professionnalisme: {review.professionalism_rating}/5
              </Badge>
            )}
            {review.punctuality_rating && (
              <Badge variant="outline" className="text-xs">
                Ponctualité: {review.punctuality_rating}/5
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;