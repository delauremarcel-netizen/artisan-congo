import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PricingCard = ({ plan, isAnnual, onSubscribe, isProcessing, isPopular = false }) => {
  // Replace dot with comma for French locale manually if needed, or use Intl
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(price);
  };

  const isPremium = plan.plan_name.toLowerCase().includes('premium');
  
  const planName = plan.plan_name.replace('Annual', '').trim();
  const translatedPlanName = planName === 'Basic' ? 'Basique' : planName === 'Professional' ? 'Professionnel' : planName;

  return (
    <Card 
      className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-xl ${
        isPopular ? 'scale-105 ring-2 ring-primary z-10' : ''
      } ${isPremium ? 'bg-slate-950 text-slate-50 border-slate-800' : 'bg-card text-card-foreground'}`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-primary text-primary-foreground font-bold tracking-wide uppercase px-3 py-1 text-xs">
            Le plus populaire
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className={`text-2xl font-bold ${isPremium ? 'text-white' : ''}`}>
          {translatedPlanName}
        </CardTitle>
        <CardDescription className={`mt-2 ${isPremium ? 'text-slate-400' : ''}`}>
          {plan.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center">
        <div className="flex items-baseline gap-1 mb-6">
          <span className={`text-5xl font-extrabold font-variant-numeric tabular-nums ${isPremium ? 'text-white' : ''}`}>
            {formatPrice(plan.price)}
          </span>
          <span className={isPremium ? 'text-slate-400 font-medium' : 'text-muted-foreground font-medium'}>
            /{isAnnual ? 'an' : 'mois'}
          </span>
        </div>

        {isAnnual && (
          <div className="mb-6 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full border border-green-500/20">
            Économisez 17 % par an
          </div>
        )}

        <ul className="w-full space-y-4 mt-2">
          <li className="flex items-start gap-3 text-sm">
            <Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-blue-400' : 'text-primary'}`} />
            <span className={isPremium ? 'text-slate-300' : 'text-foreground/80'}>
              Profil visible dans la recherche
            </span>
          </li>
          
          <li className="flex items-start gap-3 text-sm">
            <Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-blue-400' : 'text-primary'}`} />
            <span className={isPremium ? 'text-slate-300' : 'text-foreground/80'}>
              Messagerie directe avec les clients
            </span>
          </li>

          {(plan.plan_name.includes('Professional') || isPremium) ? (
            <>
              <li className="flex items-start gap-3 text-sm">
                <Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-blue-400' : 'text-primary'}`} />
                <span className={isPremium ? 'text-slate-300' : 'text-foreground/80'}>
                  Portfolio avancé (jusqu'à 20 projets)
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-blue-400' : 'text-primary'}`} />
                <span className={isPremium ? 'text-slate-300' : 'text-foreground/80'}>
                  Placement prioritaire dans la recherche
                </span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Check className={`w-5 h-5 shrink-0 ${isPremium ? 'text-blue-400' : 'text-primary'}`} />
                <span className={isPremium ? 'text-slate-300' : 'text-foreground/80'}>
                  Analyses détaillées des avis
                </span>
              </li>
            </>
          ) : (
            <li className="flex items-start gap-3 text-sm opacity-50">
              <Info className="w-5 h-5 shrink-0" />
              <span>Portfolio de base (3 projets)</span>
            </li>
          )}

          {isPremium && (
            <>
              <li className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 shrink-0 text-blue-400" />
                <span className="text-slate-300">Badge "En vedette" sur le profil</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 shrink-0 text-blue-400" />
                <span className="text-slate-300">Tableau de bord analytique avancé</span>
              </li>
            </>
          )}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto pt-6">
        <Button 
          className={`w-full py-6 text-base font-semibold transition-all ${
            isPremium 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : isPopular 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80 text-foreground'
          }`}
          onClick={() => onSubscribe(plan)}
          disabled={isProcessing}
        >
          {isProcessing ? 'Traitement...' : "S'abonner"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;