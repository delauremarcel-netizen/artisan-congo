import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import AdminDashboardLayout from '@/components/AdminDashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, BarChart3, Users, Briefcase, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

const AdminReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  
  // Data States
  const [artisans, setArtisans] = useState([]);
  const [missions, setMissions] = useState([]);
  const [leads, setLeads] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // We use autoCancel: false since multiple requests go out
        const [artisansRes, missionsRes, leadsRes, reviewsRes] = await Promise.all([
          pb.collection('artisan_profiles').getFullList({ $autoCancel: false }),
          pb.collection('missions').getFullList({ $autoCancel: false }),
          pb.collection('leads').getFullList({ expand: 'artisan_id', $autoCancel: false }),
          pb.collection('ratings').getFullList({ $autoCancel: false })
        ]);
        
        setArtisans(artisansRes);
        setMissions(missionsRes);
        setLeads(leadsRes);
        setReviews(reviewsRes);
      } catch (err) {
        console.error('Error fetching report data:', err);
        toast.error('Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [dateRange]);

  const handleExport = (type) => {
    toast.success(`Export ${type.toUpperCase()} généré avec succès.`);
    // Stub functionality for export
  };

  // Pre-process data for charts
  const artisanStatusData = [
    { name: 'Informel', value: artisans.filter(a => a.statut_artisan === 'informel').length },
    { name: 'Vérifié', value: artisans.filter(a => a.statut_artisan === 'verifie').length },
    { name: 'Certifié', value: artisans.filter(a => a.statut_artisan === 'certifie').length },
  ].filter(d => d.value > 0);

  const missionStatusData = [
    { name: 'Ouvertes', value: missions.filter(m => m.status === 'open').length },
    { name: 'Fermées', value: missions.filter(m => m.status === 'closed').length },
    { name: 'Terminées', value: missions.filter(m => m.status === 'completed').length },
  ].filter(d => d.value > 0);

  const leadsRevenueData = leads.slice(0, 10).map((l, i) => ({
    name: `Lead ${i+1}`,
    commission: l.commission_amount || 0,
    artisan: l.artisan_amount || 0
  }));

  const ChartSkeleton = () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-xl">
      <Skeleton className="w-full h-full" />
    </div>
  );

  return (
    <AdminDashboardLayout title="Rapports d'Activité" breadcrumbs={[{ label: 'Rapports' }]}>
      <Helmet><title>Rapports | Admin ArtisanCongo</title></Helmet>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">3 derniers mois</SelectItem>
              <SelectItem value="all">Historique complet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')} className="bg-card">
            <FileText className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={() => handleExport('pdf')} className="bg-primary text-primary-foreground">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="bg-card border border-border w-full flex flex-wrap h-auto justify-start p-1 gap-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><BarChart3 className="w-4 h-4 mr-2" /> Général</TabsTrigger>
          <TabsTrigger value="artisans" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Users className="w-4 h-4 mr-2" /> Artisans</TabsTrigger>
          <TabsTrigger value="missions" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Briefcase className="w-4 h-4 mr-2" /> Missions</TabsTrigger>
          <TabsTrigger value="leads" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><MessageSquare className="w-4 h-4 mr-2" /> Leads & Revenus</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? <Skeleton className="h-9 w-20" /> : artisans.length}</div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Missions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? <Skeleton className="h-9 w-20" /> : missions.length}</div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? <Skeleton className="h-9 w-20" /> : leads.length}</div>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenus (Commissions)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {loading ? <Skeleton className="h-9 w-32" /> : `${leads.reduce((s, l) => s + (l.commission_amount || 0), 0).toLocaleString()} F`}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Croissance des Leads</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <ChartSkeleton /> : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadsRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="commission" name="Commission FCFA" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="artisan" name="Artisan Net FCFA" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Statut des Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <ChartSkeleton /> : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={artisanStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {artisanStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="artisans" className="space-y-6 outline-none">
           <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Performance des Artisans</CardTitle>
                <CardDescription>Top 5 des artisans les mieux notés</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <ChartSkeleton /> : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={artisans.sort((a,b) => b.score_global - a.score_global).slice(0, 5)} 
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                        <Tooltip />
                        <Bar dataKey="score_global" name="Score" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="missions" className="space-y-6 outline-none">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Répartition des Missions par Statut</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <ChartSkeleton /> : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={missionStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {missionStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6 outline-none">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Analyse des Revenus</CardTitle>
              <CardDescription>Commissions vs Montants Artisans</CardDescription>
            </CardHeader>
            <CardContent>
               {loading ? <ChartSkeleton /> : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={leadsRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="commission" name="Commission" stroke="#3b82f6" strokeWidth={3} />
                        <Line type="monotone" dataKey="artisan" name="Artisan" stroke="#10b981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};

export default AdminReportsPage;