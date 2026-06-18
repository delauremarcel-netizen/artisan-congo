import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Clock, CheckCircle, Users, MessageSquare } from 'lucide-react';

const TrendIndicator = ({ trend }) => {
  if (trend === 'hausse') return <TrendingUp className="w-4 h-4 text-[hsl(var(--success))]" />;
  if (trend === 'baisse') return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

export const ArtisanStatisticsCard = ({ stats }) => {
  if (!stats) return null;

  const metrics = [
    {
      label: 'Taux de réponse',
      value: `${stats.taux_reponse || 0}%`,
      icon: MessageSquare,
      trend: 'hausse'
    },
    {
      label: 'Temps moyen',
      value: `${stats.temps_moyen_intervention || 0}h`,
      icon: Clock,
      trend: 'stable'
    },
    {
      label: 'Prestations',
      value: stats.nombre_prestations_completees || 0,
      icon: CheckCircle,
      trend: 'hausse'
    },
    {
      label: 'Clients satisfaits',
      value: stats.nombre_clients_satisfaits || 0,
      icon: Users,
      trend: 'hausse'
    }
  ];

  return (
    <Card className="card-premium overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
        <CardTitle className="text-lg">Statistiques d'activité</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/50">
          {metrics.map((metric, idx) => (
            <div key={idx} className="p-6 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <metric.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {metric.value}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {metric.label}
              </div>
              <div className="mt-1">
                <TrendIndicator trend={metric.trend} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};