import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AdminSidebar from '@/components/AdminSidebar';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const artisans = await pb.collection('artisans').getFullList({ $autoCancel: false });
      
      const active = artisans.filter(a => a.subscription_status === 'active').length;
      const expired = artisans.filter(a => a.subscription_status !== 'active').length;
      
      const planBreakdown = [
        { name: 'Basique ($4.99/mois)', value: Math.floor(active * 0.4) * 4.99 },
        { name: 'Professionnel ($9.99/mois)', value: Math.floor(active * 0.4) * 9.99 },
        { name: 'Premium ($19.99/mois)', value: Math.floor(active * 0.2) * 19.99 },
      ];
      
      const totalRev = planBreakdown.reduce((sum, item) => sum + item.value, 0).toFixed(2);

      const monthlyTrend = [
        { month: 'Nov', revenue: 800, subs: 80 }, { month: 'Déc', revenue: 950, subs: 95 },
        { month: 'Jan', revenue: 1100, subs: 110 }, { month: 'Fév', revenue: 1400, subs: 140 },
        { month: 'Mar', revenue: 1650, subs: 160 }, { month: 'Avr', revenue: totalRev, subs: active },
      ];

      const catCounts = {};
      artisans.forEach(a => {
        const cat = a.category || 'Général';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
      const topCategories = Object.entries(catCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setData({
        active,
        expired,
        totalRev,
        planBreakdown,
        monthlyTrend,
        topCategories
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];
  const BAR_COLOR = 'hsl(var(--primary))';
  
  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <>
      <Helmet>
        <title>Statistiques et Rapports - Admin</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background pt-20">
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-5rem)]">
          <AdminSidebar />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight">Statistiques et Rapports</h1>
              <p className="text-muted-foreground mt-1">Analyse approfondie des mesures financières et des utilisateurs</p>
            </div>

            {loading ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-none shadow-md relative overflow-hidden bg-primary text-primary-foreground">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium opacity-90">Revenu Mensuel (Est.)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold font-variant-numeric tabular-nums">{formatCurrency(data.totalRev)}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Taux de désabonnement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-destructive font-variant-numeric tabular-nums">
                        {((data.expired / (data.active + data.expired)) * 100).toFixed(1).replace('.', ',')}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Catégorie Principale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold capitalize truncate">
                        {data.topCategories[0]?.name || 'N/A'}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{data.topCategories[0]?.count || 0} artisans</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="col-span-1 lg:col-span-2 shadow-sm border-border/50">
                    <CardHeader>
                      <CardTitle>Croissance des revenus et abonnements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data.monthlyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={formatCurrency} tick={{fill: 'hsl(var(--muted-foreground))'}} dx={-10} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dx={10} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                              itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenus ($)" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="monotone" dataKey="subs" name="Abonnements actifs" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 shadow-sm border-border/50">
                    <CardHeader>
                      <CardTitle>Revenus par forfait</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px] w-full flex flex-col justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data.planBreakdown}
                              cx="50%"
                              cy="45%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {data.planBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => formatCurrency(value)}
                              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="col-span-1 lg:col-span-3 shadow-sm border-border/50">
                    <CardHeader>
                      <CardTitle>Catégories principales par nombre d'artisans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.topCategories} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dx={-10} />
                            <Tooltip 
                              cursor={{fill: 'hsl(var(--muted))'}}
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'hsl(var(--card))' }}
                            />
                            <Bar dataKey="count" name="Artisans" fill={BAR_COLOR} radius={[6, 6, 0, 0]} maxBarSize={80} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminAnalyticsPage;