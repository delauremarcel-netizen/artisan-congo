import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#3b82f6', '#eab308', '#a855f7', '#22c55e', '#64748b', '#ef4444'];

const LeadsStatistics = ({ leads, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        <Skeleton className="h-[300px] w-full rounded-2xl" />
      </div>
    );
  }

  // Process data for Status Pie Chart
  const statusCounts = leads.reduce((acc, lead) => {
    const status = lead.status || 'inconnu';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(key => ({
    name: key.replace('_', ' ').toUpperCase(),
    value: statusCounts[key]
  }));

  // Process data for Top Artisans Bar Chart
  const artisanCounts = leads.reduce((acc, lead) => {
    const name = lead.expand?.artisan_id?.name || 'Inconnu';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const artisanData = Object.keys(artisanCounts)
    .map(key => ({ name: key, leads: artisanCounts[key] }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 5); // Top 5

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Répartition par Statut</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} leads`, 'Total']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">Aucune donnée</div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Top 5 Artisans (Leads assignés)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          {artisanData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={artisanData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="leads" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">Aucune donnée</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsStatistics;