import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateName, validatePhone, validateWhatsApp } from '@/lib/validateArtisanSignup.js';

const Step2Component = ({ formData, onChange, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
      whatsapp: validateWhatsApp(formData.whatsapp),
    };

    const activeErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v !== null));

    if (Object.keys(activeErrors).length > 0) {
      setErrors(activeErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  const handleSameAsPhone = () => {
    if (formData.phone) {
      onChange({ whatsapp: formData.phone });
      if (errors.whatsapp) setErrors(prev => ({ ...prev, whatsapp: null }));
    }
  };

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-sm font-semibold text-muted-foreground mb-3">Étape 2 sur 4</p>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden flex">
          <div className="bg-primary w-2/4 h-full transition-all duration-500"></div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-2 text-foreground">Informations personnelles</h2>
        <p className="text-muted-foreground text-sm md:text-base">Comment vos clients peuvent-ils vous contacter ?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-semibold">Nom complet ou nom de l'entreprise *</Label>
          <Input 
            id="name"
            placeholder="Ex: Jean Dupont"
            className="h-14 text-base px-4 rounded-xl border-2 text-foreground bg-background focus-visible:ring-primary"
            value={formData.name || ''}
            onChange={(e) => {
              onChange({ name: e.target.value });
              if (errors.name) setErrors(prev => ({ ...prev, name: null }));
            }}
          />
          {errors.name && <p className="text-sm text-destructive font-medium">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-semibold">Numéro de Téléphone *</Label>
          <Input 
            id="phone"
            type="tel"
            placeholder="Ex: 061234567 ou +242061234567"
            className="h-14 text-base px-4 rounded-xl border-2 text-foreground bg-background focus-visible:ring-primary"
            value={formData.phone || ''}
            onChange={(e) => {
              onChange({ phone: e.target.value });
              if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
            }}
          />
          {errors.phone && <p className="text-sm text-destructive font-medium">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp" className="text-base font-semibold">Numéro WhatsApp *</Label>
            <button 
              type="button" 
              onClick={handleSameAsPhone}
              className="text-xs text-primary font-medium hover:underline"
            >
              Même que le téléphone
            </button>
          </div>
          <Input 
            id="whatsapp"
            type="tel"
            placeholder="Ex: 061234567 ou +242061234567"
            className="h-14 text-base px-4 rounded-xl border-2 text-foreground bg-background focus-visible:ring-primary"
            value={formData.whatsapp || ''}
            onChange={(e) => {
              onChange({ whatsapp: e.target.value });
              if (errors.whatsapp) setErrors(prev => ({ ...prev, whatsapp: null }));
            }}
          />
          {errors.whatsapp && <p className="text-sm text-destructive font-medium">{errors.whatsapp}</p>}
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

export default Step2Component;