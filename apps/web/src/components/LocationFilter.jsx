import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

const CITIES = [
  { id: 'Brazzaville', label: 'Brazzaville' },
  { id: 'Pointe-Noire', label: 'Pointe-Noire' },
  { id: 'Kinshasa', label: 'Kinshasa' },
  { id: 'Lubumbashi', label: 'Lubumbashi' },
  { id: 'Kolwezi', label: 'Kolwezi' },
  { id: 'Dolisie', label: 'Dolisie' },
  { id: 'Ouesso', label: 'Ouesso' },
  { id: 'Impfondo', label: 'Impfondo' },
];

const LocationFilter = ({ selectedCity, onChange }) => {
  return (
    <div className="filter-section">
      <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
        <MapPin className="w-5 h-5 text-secondary" />
        Localisation
      </h3>
      <Select value={selectedCity} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-background border-border h-12 rounded-xl focus:ring-primary">
          <SelectValue placeholder="Toutes les villes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-medium">Toutes les villes</SelectItem>
          {CITIES.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilter;