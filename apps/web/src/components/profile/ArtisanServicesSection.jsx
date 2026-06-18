import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ArtisanServicesSection = ({ services = '' }) => {
  // Parse services if it's a comma-separated string or JSON array
  let servicesList = [];
  try {
    if (typeof services === 'string') {
      if (services.startsWith('[')) {
        servicesList = JSON.parse(services);
      } else {
        servicesList = services.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(services)) {
      servicesList = services;
    }
  } catch (e) {
    servicesList = [services];
  }

  if (!servicesList.length) {
    return <p className="text-muted-foreground italic">Aucun service détaillé.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {servicesList.map((service, idx) => (
        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <span className="text-foreground font-medium">{service}</span>
        </div>
      ))}
    </div>
  );
};