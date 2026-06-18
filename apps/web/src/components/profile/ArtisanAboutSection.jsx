import React from 'react';
import { MapPin, Briefcase, Languages, Calendar } from 'lucide-react';

export const ArtisanAboutSection = ({ profile, artisan }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">À propos</h3>
        <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground">
          {profile?.bio_professionnelle || artisan?.bio || "Cet artisan n'a pas encore rédigé de description professionnelle."}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Zone d'intervention</p>
            <p className="font-semibold text-foreground">{artisan?.city || 'Non renseigné'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Expérience</p>
            <p className="font-semibold text-foreground">
              {profile?.experience_years || artisan?.experience_years || 0} années
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Membre depuis</p>
            <p className="font-semibold text-foreground">
              {new Date(artisan?.created).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Langues</p>
            <p className="font-semibold text-foreground">Français, Lingala</p>
          </div>
        </div>
      </div>
    </div>
  );
};