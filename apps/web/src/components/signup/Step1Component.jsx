import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail, validatePassword, validateConfirmPassword } from '@/lib/validateArtisanSignup.js';

const Step1Component = ({ formData, onChange, onNext }) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
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
        <p className="text-sm font-semibold text-muted-foreground mb-3">Étape 1 sur 4</p>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden flex">
          <div className="bg-primary w-1/4 h-full transition-all duration-500"></div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-2 text-foreground">Informations de connexion</h2>
        <p className="text-muted-foreground text-sm md:text-base">Créez vos identifiants pour accéder à votre espace artisan.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-semibold">Adresse Email *</Label>
          <Input 
            id="email"
            type="email"
            placeholder="votre@email.com"
            className="h-14 text-base px-4 rounded-xl border-2 text-foreground bg-background focus-visible:ring-primary"
            value={formData.email || ''}
            onChange={(e) => {
              onChange({ email: e.target.value });
              if (errors.email) setErrors(prev => ({ ...prev, email: null }));
            }}
          />
          {errors.email && <p className="text-sm text-destructive font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-semibold">Mot de passe *</Label>
          <Input 
            id="password"
            type="password"
            placeholder="Min 8 caractères"
            className="h-14 text-base px-4 rounded-xl border-2 text-foreground bg-background focus-visible:ring-primary"
            value={formData.password || ''}
            onChange={(e) => {
              onChange({ password: e.target.value });
              if (errors.password) setErrors(prev => ({ ...prev, password: null }));
            }}
          />
          {errors.password && <p className="text-sm text-destructive font-medium">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-base font-semibold">Confirmer le mot de passe *</Label>
          <Input 
            id="confirmPassword"
            type="password"
            placeholder="Retapez votre mot de passe"
            className="h-14 text-base px-4 rounded-xl border-2 text-foreground bg-background focus-visible:ring-primary"
            value={formData.confirmPassword || ''}
            onChange={(e) => {
              onChange({ confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
            }}
          />
          {errors.confirmPassword && <p className="text-sm text-destructive font-medium">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="mt-10 mb-8">
        <Button 
          onClick={handleNext}
          className="w-full h-14 text-lg font-bold rounded-xl active:scale-[0.98] transition-transform"
        >
          CONTINUER
        </Button>
      </div>
    </div>
  );
};

export default Step1Component;