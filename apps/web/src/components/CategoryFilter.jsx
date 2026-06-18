import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wrench, Zap, Hammer, Paintbrush, Wind, Droplets, Key, LayoutGrid } from 'lucide-react';

const CATEGORIES = [
  { id: 'Plomberie', label: 'Plombier', icon: Droplets },
  { id: 'Électricité', label: 'Électricien', icon: Zap },
  { id: 'Menuiserie', label: 'Menuisier', icon: Hammer },
  { id: 'Maçonnerie', label: 'Maçon', icon: LayoutGrid },
  { id: 'Peinture', label: 'Peintre', icon: Paintbrush },
  { id: 'Climatisation', label: 'Climaticien', icon: Wind },
  { id: 'Serrurerie', label: 'Serrurier', icon: Key },
  { id: 'Autre', label: 'Autre', icon: Wrench },
];

const CategoryFilter = ({ selectedCategories, onChange }) => {
  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="filter-section">
      <h3 className="font-semibold text-lg mb-4 text-foreground">Catégorie de services</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={isSelected ? 'badge-category badge-category-active' : 'badge-category badge-category-inactive'}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;