import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Star, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  'Plomberie', 'Menuiserie', 'Électricité', 'Maçonnerie', 'Peinture', 
  'Soudure', 'Construction', 'Paysagisme', 'Carrelage', 'Couverture', 
  'Serrurerie', 'Climatisation'
];

const CITIES = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];
const BADGES = [{ id: 'verifie', label: 'Vérifié' }, { id: 'premium', label: 'Premium' }, { id: 'top', label: 'Top Artisan' }];

const SearchFilters = ({ filters, setFilters, onReset }) => {
  
  const handleBadgeToggle = (badgeId) => {
    setFilters(prev => {
      const current = prev.badges || [];
      const updated = current.includes(badgeId) 
        ? current.filter(b => b !== badgeId)
        : [...current, badgeId];
      return { ...prev, badges: updated };
    });
  };

  return (
    <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm sticky top-24">
      <CardContent className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Filtres</h2>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-primary h-8 px-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground/80">Catégorie</Label>
          <Select 
            value={filters.category} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, category: v }))}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground/80">Ville</Label>
          <Select 
            value={filters.city} 
            onValueChange={(v) => setFilters(prev => ({ ...prev, city: v }))}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {CITIES.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Rating */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label className="text-sm font-semibold text-foreground/80">Note minimale</Label>
            <span className="text-sm font-medium text-primary">{filters.minRating} / 5</span>
          </div>
          <Slider 
            value={[filters.minRating]} 
            min={0} max={5} step={1}
            onValueChange={([v]) => setFilters(prev => ({ ...prev, minRating: v }))}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current"/></div>
          </div>
        </div>

        {/* Minimum Score */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label className="text-sm font-semibold text-foreground/80">Score de confiance</Label>
            <span className="text-sm font-medium text-primary">{filters.minScore}+</span>
          </div>
          <Slider 
            value={[filters.minScore]} 
            min={0} max={100} step={10}
            onValueChange={([v]) => setFilters(prev => ({ ...prev, minScore: v }))}
            className="py-2"
          />
        </div>

        {/* Badges */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground/80">Badges et Certifications</Label>
          <div className="space-y-2.5 pt-1">
            {BADGES.map(badge => (
              <div key={badge.id} className="flex items-center space-x-3">
                <Checkbox 
                  id={`badge-${badge.id}`} 
                  checked={(filters.badges || []).includes(badge.id)}
                  onCheckedChange={() => handleBadgeToggle(badge.id)}
                />
                <label 
                  htmlFor={`badge-${badge.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {badge.label}
                </label>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SearchFilters;