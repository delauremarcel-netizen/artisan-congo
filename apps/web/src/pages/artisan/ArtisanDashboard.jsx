import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead.jsx';
import { 
  Euro, FileText, CheckCircle, Star, AlertTriangle, 
  ArrowRight, Clock, Image as ImageIcon, User 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ArtisanDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentDevis, setRecentDevis] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      try {
        // Fetch stats
        const statsRes = await pb.collection('artisan_statistics').getList(1, 1, {
          filter: `artisan_id="${currentUser.id}"`,
          $autoCancel: false
        });
        setStats(statsRes.items[0] || {});

        // Fetch recent devis
        const devisRes = await pb.collection('artisan_devis').getList(1, 5, {
          filter: `artisan_id="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setRecentDevis(devisRes.items);

        // Generate alerts
        const newAlerts = [];
        if (!currentUser.profile_photo || !currentUser.bio) {
          newAlerts.push({ type: 'warning', message: 'Votre profil est incomplet. Ajoutez une photo et une bio pour attirer plus de clients.', link: '/artisan/profil' });
        }
        
        const pendingDevis = await pb.collection('artisan_devis').getList(1, 1, {
          filter: `artisan_id="${currentUser.id}" && statut="en_attente"`,
          $autoCancel: false
        });
        if (pendingDevis.totalItems > 0) {
          newAlerts.push({ type: 'info', message: `Vous avez ${pendingDevis.totalItems} devis en attente de réponse.`, link: '/artisan/devis' });
        }

        setAlerts(newAlerts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Mock chart data
  const revenueData = [
    { name: 'Jan', total: 1200 }, { name: 'Fév', total: 1900 }, { name: 'Mar', total: 1500 },
    { name: 'Avr', total: 2200 }, { name: 'Mai', total: 2800 }, { name: 'Juin', total: 2400 },
  ];

  return (
    <ArtisanDashboardLayout>
      <SEOHead title="Tableau de bord | ArtisanCongo" />
      
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 ${
                alert.type === 'warning' ? 'bg-warning/10 border-warning/20 text-warning-foreground' : 'bg-info/10 border-info/20 text-info-foreground'
              }`}>
                <AlertTriangle className={`w-5 h-5 shrink-0 ${alert.type === 'warning' ? 'text-warning' : 'text-info'}`} />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  {alert.link && (
                    <Link to={alert.link} className="text-sm font-bold hover:underline whitespace-nowrap">
                      Agir maintenant &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Euro className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-success">+12%</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Revenus ce mois</p>
              <h3 className="text-3xl font-bold text-foreground">{stats?.revenus_ce_mois || 0} €</h3>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Devis en attente</p>
              <h3 className="text-3xl font-bold text-foreground">{stats?.nombre_devis_envoyes || 0}</h3>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center text-info">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-success">+5%</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Taux d'acceptation</p>
              <h3 className="text-3xl font-bold text-foreground">{stats?.taux_acceptation_devis || 0}%</h3>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-premium/10 flex items-center justify-center text-premium">
                  <Star className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Notation moyenne</p>
              <h3 className="text-3xl font-bold text-foreground">{currentUser?.average_overall_rating || '0.0'}/5</h3>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="dashboard-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Évolution des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `${value}€`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl">
                  <Link to="/artisan/devis">
                    <FileText className="w-5 h-5 mr-3 text-muted-foreground" />
                    Gérer les devis
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl">
                  <Link to="/artisan/portfolio">
                    <ImageIcon className="w-5 h-5 mr-3 text-muted-foreground" />
                    Ajouter des photos
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl">
                  <Link to="/artisan/profil">
                    <User className="w-5 h-5 mr-3 text-muted-foreground" />
                    Modifier le profil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Devis */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Devis récents</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/artisan/devis" className="flex items-center">
                Voir tout <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Client</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Montant</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 rounded-r-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDevis.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                        Aucun devis récent.
                      </td>
                    </tr>
                  ) : (
                    recentDevis.map((devis) => (
                      <tr key={devis.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-4 font-medium text-foreground">{devis.client_nom}</td>
                        <td className="px-4 py-4 text-muted-foreground">{devis.service_categorie}</td>
                        <td className="px-4 py-4 font-bold">{devis.montant_total} €</td>
                        <td className="px-4 py-4">
                          <span className={`badge-status-${devis.statut}`}>
                            {devis.statut.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {new Date(devis.created).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </ArtisanDashboardLayout>
  );
};

export default ArtisanDashboard;