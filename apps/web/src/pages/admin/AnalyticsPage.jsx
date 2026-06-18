import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import apiServerClient from '@/lib/apiServerClient';

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('year');

  const growthData = [
    { name: 'Jan', artisans: 40, clients: 120 },
    { name: 'Fév', artisans: 45, clients: 135 },
    { name: 'Mar', artisans: 55, clients: 180 },
    { name: 'Avr', artisans: 70, clients: 220 },
    { name: 'Mai', artisans: 85, clients: 290 },
    { name: 'Juin', artisans: 110, clients: 350 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SEOHead title="Analytics | Admin" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Analyses détaillées de la croissance de la plateforme.</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Croissance Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorArtisans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Area type="monotone" dataKey="clients" name="Nouveaux Clients" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorClients)" />
                  <Area type="monotone" dataKey="artisans" name="Nouveaux Artisans" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorArtisans)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Performances Clés</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-muted/30 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Taux de Conversion (Devis &rarr; Chantier)</p>
              <p className="text-3xl font-bold text-foreground">42%</p>
            </div>
            <div className="p-6 bg-muted/30 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Taux de Satisfaction</p>
              <p className="text-3xl font-bold text-foreground">94%</p>
            </div>
            <div className="p-6 bg-muted/30 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Rétention Artisans</p>
              <p className="text-3xl font-bold text-foreground">88%</p>
            </div>
            <div className="p-6 bg-muted/30 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Temps moyen de réponse</p>
              <p className="text-3xl font-bold text-foreground">1h 15m</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;