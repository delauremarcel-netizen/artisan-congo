import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2 } from 'lucide-react';

const Step4Component = ({ formData, onSubmit, onBack, isSubmitting }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions d'utilisation pour continuer.");
      return;
    }
    setError('');
    onSubmit();
  };

  return (
    <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-sm font-semibold text-muted-foreground mb-3">Étape 4 sur 4</p>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden flex">
          <div className="bg-primary w-full h-full transition-all duration-500"></div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-2 text-foreground">Vérification</h2>
        <p className="text-muted-foreground text-sm md:text-base">Vérifiez vos informations avant de finaliser l'inscription.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Nom complet</p>
            <p className="text-base font-semibold text-foreground">{formData.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Email</p>
            <p className="text-base font-semibold text-foreground">{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Téléphone</p>
            <p className="text-base font-semibold text-foreground">{formData.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">WhatsApp</p>
            <p className="text-base font-semibold text-foreground">{formData.whatsapp}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Métier</p>
            <p className="text-base font-semibold text-foreground">{formData.category}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Ville</p>
            <p className="text-base font-semibold text-foreground">{formData.city}</p>
          </div>
        </div>
        
        {formData.bio && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground font-medium mb-1">Description</p>
            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">{formData.bio}</p>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => {
              setAcceptedTerms(checked);
              if (checked) setError('');
            }}
            className="mt-1"
          />
          <label 
            htmlFor="terms" 
            className="text-sm font-medium leading-relaxed text-foreground cursor-pointer"
          >
            J'accepte les conditions générales d'utilisation et je certifie que les informations fournies sont exactes.
          </label>
        </div>
        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      </div>

      <div className="mt-auto flex gap-4">
        <Button 
          onClick={onBack}
          variant="outline"
          disabled={isSubmitting}
          className="w-1/3 h-14 text-lg font-bold rounded-xl active:scale-[0.98] transition-transform border-2"
        >
          RETOUR
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-2/3 h-14 text-lg font-bold rounded-xl active:scale-[0.98] transition-transform"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              CRÉATION...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              S'INSCRIRE
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step4Component;