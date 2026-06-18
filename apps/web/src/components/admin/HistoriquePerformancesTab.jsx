import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { validateAdminToken } from '@/lib/adminTokenValidator.js';
import { useAdminApiHandler } from '@/hooks/useAdminApiHandler.js';

const COLORS = ['hsl(150 58% 35%)', 'hsl(45 95% 60%)', '#3b82f6', '#ef4444', '#8b5cf6', '#10b981'];

const HistoriquePerformancesTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { handleUnauthorized, checkResponse } = useAdminApiHandler();

  useEffect(() => {
    const fetchStats = async () => {
      if (!validateAdminToken()) {
        return handleUnauthorized();
      }

      try {
        const token = pb.authStore.token;
        const response = await apiServerClient.fetch('/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        await checkResponse(response);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        if (error.message !== 'Unauthorized') {
          console.error('Error fetching stats:', error);
          toast.error('Erreur lors du chargement des statistiques');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Format data for Recharts
  const artisanStatusData = Object.entries(stats.artisansByStatus || {}).map(([name, value]) => ({ name, value }));
  const leadsStatusData = Object.entries(stats.leadsByStatus || {}).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(stats.artisansByCategory || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Artisans</p>
            <h3 className="text-3xl font-bold text-primary">{stats.totalArtisans || 0}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Demandes (Leads)</p>
            <h3 className="text-3xl font-bold text-secondary-foreground">{stats.totalLeads || 0}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Commissions Générées</p>
            <h3 className="text-3xl font-bold text-green-600">{(stats.totalCommissions || 0).toLocaleString()} FCFA</h3>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Artisans par Statut</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {artisanStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={artisanStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {artisanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Aucune donnée</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demandes par Statut</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {leadsStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {leadsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Aucune donnée</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Catégories (Artisans)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Aucune donnée</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Artisans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Artisans (par demandes assignées)</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Demandes Assignées</th>
                <th>Note Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {stats.topArtisansByLeads?.length > 0 ? (
                stats.topArtisansByLeads.map((artisan, idx) => (
                  <tr key={idx}>
                    <td className="font-medium">{artisan.name}</td>
                    <td>{artisan.category}</td>
                    <td className="font-bold text-primary">{artisan.leadCount}</td>
                    <td>{artisan.rating ? `${artisan.rating.toFixed(1)}/5` : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">Aucune donnée</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoriquePerformancesTab;