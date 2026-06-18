import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend, trendDirection, gradientClass }) => {
  const isPositive = trendDirection === 'up';

  return (
    <Card className="relative overflow-hidden border-none shadow-md group">
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradientClass}`}></div>
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-20 bg-gradient-to-br ${gradientClass} blur-2xl group-hover:scale-110 transition-transform duration-500`}></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl bg-background shadow-sm border`}>
            <Icon className="w-6 h-6 text-foreground/80" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
              isPositive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold tracking-tight font-variant-numeric tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;