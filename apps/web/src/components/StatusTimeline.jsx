import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export default function StatusTimeline({ currentStatus, steps = ['demande_reçue', 'devis_envoyé', 'devis_validé', 'en_cours', 'terminé'] }) {
  const currentIndex = steps.indexOf(currentStatus) !== -1 ? steps.indexOf(currentStatus) : 0;

  return (
    <div className="flex items-center justify-between w-full relative">
      <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full"></div>
      <div 
        className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      ></div>
      
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;
        
        return (
          <div key={step} className="flex flex-col items-center gap-2 bg-background p-1">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-primary fill-primary/20" />
            ) : isActive ? (
              <Clock className="w-6 h-6 text-secondary fill-secondary/20" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
            <span className="text-xs font-medium text-muted-foreground hidden sm:block uppercase tracking-wider">
              {step.replace('_', ' ')}
            </span>
          </div>
        );
      })}
    </div>
  );
}