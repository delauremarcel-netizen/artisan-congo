import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, FileText } from 'lucide-react';
import { VerifiedBadge, LevelBadge, ReactiveBadge, FastBadge } from './Badges.jsx';
import { RatingStars } from './RatingComponents.jsx';
import pb from '@/lib/pocketbaseClient';

export const ArtisanProfileHeader = ({ artisan, profile, ratings, stats }) => {
  const coverUrl = profile?.photo_couverture 
    ? pb.files.getUrl(profile, profile.photo_couverture) 
    : 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2070&auto=format&fit=crop';
    
  const avatarUrl = profile?.photo_professionnel 
    ? pb.files.getUrl(profile, profile.photo_professionnel)
    : artisan?.profile_photo 
      ? pb.files.getUrl(artisan, artisan.profile_photo)
      : '';

  const isVerified = profile?.is_verified || artisan?.verified;
  const level = profile?.niveau_artisan || 'standard';
  const rating = ratings?.rating_global || artisan?.average_overall_rating || 0;
  const reviewCount = ratings?.nombre_avis || artisan?.number_of_reviews || 0;

  return (
    <div className="bg-card border-b border-border">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 lg:h-80 w-full relative overflow-hidden">
        <img 
          src={coverUrl} 
          alt="Couverture" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col md:flex-row gap-6 pb-8">
          
          {/* Avatar - Pulled up over cover */}
          <div className="-mt-16 md:-mt-24 shrink-0 relative z-10 flex justify-center md:justify-start">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
              <AvatarImage src={avatarUrl} className="object-cover" />
              <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                {artisan?.name?.substring(0, 2).toUpperCase() || 'AR'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info & Actions */}
          <div className="flex-1 pt-2 md:pt-4 flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                {isVerified && <VerifiedBadge />}
                <LevelBadge level={level} />
                {stats?.taux_reponse > 90 && <ReactiveBadge />}
                {stats?.temps_moyen_intervention < 24 && <FastBadge />}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                {artisan?.name}
              </h1>
              
              <p className="text-lg text-muted-foreground font-medium">
                {artisan?.category || profile?.services_offerts || 'Artisan professionnel'}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
                <RatingStars rating={rating} count={reviewCount} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0 justify-center md:justify-start pt-2">
              <Button size="lg" className="h-12 px-8 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-transform">
                <FileText className="w-5 h-5 mr-2" />
                Demander un devis
              </Button>
              <div className="flex gap-3">
                <Button size="lg" variant="outline" className="flex-1 h-12 rounded-xl border-2 hover:bg-muted">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="flex-1 h-12 rounded-xl border-2 hover:bg-muted">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};