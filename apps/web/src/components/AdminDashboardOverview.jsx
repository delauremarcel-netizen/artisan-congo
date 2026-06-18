import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle, Clock, CheckCircle, DollarSign } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboardOverview = () => {
  const { token, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      if (!token) {
        console.log("[AdminDashboardOverview] No token available, skipping stats fetch.");
        return;
      }

      try {
        console.log("[AdminDashboardOverview] Fetching stats. Token present:", !!token);
        const response = await apiServerClient.fetch('/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("[AdminDashboardOverview] Stats response status:", response.status);

        if (response.status === 401) {
          console.error("[AdminDashboardOverview] Unauthorized access (401). Token invalid. Logging out.");
          logout();
          navigate('/admin/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

        const json = await response.json();
        console.log("[AdminDashboardOverview] Stats data received:", json.success);
        
        if (json.success && json.data) {
          const { demandes, commissions } = json.data;
          
          setStats({
            total: demandes.total || 0,
            pending: (demandes.byStatus['nouvelle'] || 0) + (demandes.byStatus['demande_reçue'] || 0),
            inProgress: (demandes.byStatus['assignee'] || 0) + (demandes.byStatus['en_cours'] || 0),
            completed: (demandes.byStatus['terminee'] || 0) + (demandes.byStatus['terminé'] || 0),
            totalCommissions: commissions.total || 0
          });
        } else {
          throw new Error("Format de données invalide reçu du serveur.");
        }
      } catch (err) {
        console.error('[AdminDashboardOverview] Error fetching overview stats:', err);
        setError("Erreur lors du chargement des statistiques. Veuillez vérifier votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewStats();
  }, [token, logout, navigate]);

  if (error) {
    return (
      <div className="p-4 mb-8 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl bg-muted/60" />)}
      </div>
    );
  }

  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="bg-card border-border/50 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3.5 bg-primary/10 rounded-xl text-primary shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Total Demandes</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{stats.total}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-border/50 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">En attente</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{stats.pending}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/10 rounded-xl text-blue-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">En cours</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{stats.inProgress}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3.5 bg-green-500/10 rounded-xl text-green-600 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Terminées</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{stats.completed}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Commissions</p>
            <h3 className="text-xl font-bold tracking-tight text-foreground">{formatCurrency(stats.totalCommissions)}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;