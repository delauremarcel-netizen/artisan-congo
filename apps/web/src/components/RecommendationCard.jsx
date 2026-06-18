import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Wrench } from 'lucide-react';
import RatingBadge from './RatingBadge';
import pb from '@/lib/pocketbaseClient';
import ImageWithFallback from '@/components/ImageWithFallback.jsx';

const RecommendationCard = ({ artisan }) => {
  const rating = artisan.average_overall_rating || 4.8;
  const avatarUrl = artisan.photos && artisan.photos.length > 0 
    ? pb.files.getUrl(artisan, artisan.photos[0]) 
    : null;

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {avatarUrl ? (
          <ImageWithFallback
            src={avatarUrl}
            alt={`Réalisation de ${artisan.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            containerClassName="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Wrench className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <RatingBadge averageRating={rating} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <CardContent className="p-5 relative">
        <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {artisan.name}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span className="capitalize font-medium text-foreground/80">{artisan.category || 'Général'}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {artisan.city || 'Congo'}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-bold text-sm">{rating.toString().replace('.', ',')}</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 -mr-2">
            <Link to={`/artisan/${artisan.id}`}>Voir le profil</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;