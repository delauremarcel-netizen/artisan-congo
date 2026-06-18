import React from 'react';
import { CheckCircle2, Star, Zap, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const VerifiedBadge = ({ className }) => (
  <div className={cn("badge-verified", className)}>
    <CheckCircle2 className="w-3.5 h-3.5" />
    <span>Vérifié</span>
  </div>
);

export const LevelBadge = ({ level = 'standard', className }) => {
  const normalizedLevel = level?.toLowerCase() || 'standard';
  
  if (normalizedLevel === 'expert') {
    return (
      <div className={cn("badge-level-expert", className)}>
        <Star className="w-3.5 h-3.5 fill-current" />
        <span>Expert</span>
      </div>
    );
  }
  
  if (normalizedLevel === 'premium') {
    return (
      <div className={cn("badge-level-premium", className)}>
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Premium</span>
      </div>
    );
  }

  return (
    <div className={cn("badge-level-standard", className)}>
      <span>Standard</span>
    </div>
  );
};

export const ReactiveBadge = ({ className }) => (
  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold tracking-wide", className)}>
    <Zap className="w-3.5 h-3.5" />
    <span>Très réactif</span>
  </div>
);

export const ReliableBadge = ({ className }) => (
  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold tracking-wide", className)}>
    <ShieldCheck className="w-3.5 h-3.5" />
    <span>Fiable</span>
  </div>
);

export const FastBadge = ({ className }) => (
  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold tracking-wide", className)}>
    <Clock className="w-3.5 h-3.5" />
    <span>Intervention rapide</span>
  </div>
);