import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateCategory, validateCity } from '@/lib/validateArtisanSignup.js';

const PROFESSIONS = [
  'Électricien', 'Plombier', 'Maçon', 'Peintre', 'Carreleur', 'Serrurier', 'Vitrier', 
  'Couvreur', 'Chauffagiste', 'Climaticien', 'Menuisier', 'Charpentier', 'Ébéniste', 
  'Décorateur', 'Nettoyeur', "Agent d'entretien piscine", 'Jardinier', 'Paysagiste', 
  'Gardien', 'Chauffeur', 'Mécanicien', 'Soudeur', 'Électroménager', 'Réparateur téléphone', 
  'Coiffeur', 'Barbier', 'Esthéticienne', 'Masseur', 'Cuisinier', 'Boulanger', 'Boucher', 
  'Poissonnier', 'Traiteur', 'Serveur', 'Barman', 'Photographe', 'Vidéographe', 'Graphiste', 
  'Musicien', 'DJ', 'Animateur', 'Événementiel', 'Décorateur événements', 'Informaticien', 
  'Développeur web', 'Consultant', 'Formateur', 'Traducteur', 'Rédacteur', 'Journaliste', 
  'Avocat', 'Notaire', 'Comptable', 'Consultant RH', 'Médecin', 'Infirmier', 'Dentiste', 
  'Pharmacien', 'Vétérinaire', 'Kinésithérapeute', 'Psychologue', 'Coach', 
  'Formateur professionnel', 'Fleuriste', 'Réceptionniste', 'Secrétaire', 'Autre'
];

const CITIES = ['Brazzaville', 'Pointe-Noire', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];

const Step3Component = ({ formData, onChange, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {
      category: validateCategory(formData.category),
      city: validateCity(formData.city),
    };

    const activeErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v !== null));

    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-sm font-semibold text-muted-foreground mb-3">Étape 3 sur 4</p>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden flex">
          <div className="bg-primary w-3/4 h-full transition-all duration-500"></div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-2 text-foreground">Profil professionnel</h2>
        <p className="text-muted-foreground text-sm md:text-base">Détaillez votre expertise pour attirer les bons clients.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-base font-semibold">Votre métier principal *</Label>
          <Select 
            value={formData.category || ''} 
            onValueChange={(val) => {
              onChange({ category: val });
              if (errors.category) setErrors(prev => ({ ...prev, category: null }));
            }}
          >
            <SelectTrigger className="h-14 text-base px-4 rounded-xl border-2 bg-background text-foreground focus:ring-primary">
              <SelectValue placeholder="Sélectionnez un métier" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {PROFESSIONS.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive font-medium">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-base font-semibold">Ville d'intervention *</Label>
          <Select 
            value={formData.city || ''} 
            onValueChange={(val) => {
              onChange({ city: val });
              if (errors.city) setErrors(prev => ({ ...prev, city: null }));
            }}
          >
            <SelectTrigger className="h-14 text-base px-4 rounded-xl border-2 bg-background text-foreground focus:ring-primary">
              <SelectValue placeholder="Sélectionnez une ville" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-sm text-destructive font-medium">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="bio" className="text-base font-semibold">Description (Optionnel)</Label>
            <span className="text-xs text-muted-foreground">{formData.bio?.length || 0}/500</span>
          </div>
          <Textarea 
            id="bio"
            placeholder="Décrivez brièvement votre expérience et vos services..."
            className="min-h-[120px] text-base px-4 py-3 rounded-xl border-2 text-foreground bg-background focus-visible:ring-primary resize-none"
            value={formData.bio || ''}
            maxLength={500}
            onChange={(e) => onChange({ bio: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-10 mb-8 flex gap-4">
        <Button 
          onClick={onBack}
          variant="outline"
          className="w-1/3 h-14 text-lg font-bold rounded-xl active:scale-[0.98] transition-transform border-2"
        >
          RETOUR
        </Button>
        <Button 
          onClick={handleNext}
          className="w-2/3 h-14 text-lg font-bold rounded-xl active:scale-[0.98] transition-transform"
        >
          CONTINUER
        </Button>
      </div>
    </div>
  );
};

export default Step3Component;