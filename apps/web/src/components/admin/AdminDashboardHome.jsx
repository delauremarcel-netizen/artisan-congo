import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, CheckCircle, XCircle, Activity, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import pb from '@/lib/pocketbaseClient.js';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';

const AdminDashboardHome = () => {
  const { currentAdmin, token, logout } = useAdminAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [specialtyData, setSpecialtyData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch artisans for stats
        const artisans = await pb.collection('artisans').getFullList({ $autoCancel: false });
        
        const total = artisans.length;
        const pending = artisans.filter(a => a.status === 'En attente' || a.status === 'pending').length;
        const approved = artisans.filter(a => a.status === 'Validé' || a.status === 'active').length;
        const rejected = artisans.filter(a => a.status === 'Suspendu' || a.status === 'Rejeté').length;
        
        setStats({ total, pending, approved, rejected });

        // Calculate specialty distribution
        const specialties = {};
        artisans.forEach(a => {
          const cat = a.category || 'Autre';
          specialties[cat] = (specialties[cat] || 0) + 1;
        });
        
        setSpecialtyData(Object.entries(specialties).map(([name, value]) => ({ name, value })));

        // Fetch recent activity logs from PocketBase
        try {
          const logs = await pb.collection('admin_action_logs').getList(1, 5, { sort: '-created', $autoCancel: false });
          setRecentActivity(logs.items);
        } catch (e) {
          setRecentActivity([
            { id: 1, action: 'Système', details: 'Initialisation du tableau de bord', created: new Date().toISOString() }
          ]);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      if (!token) return;
      try {
        setNotifLoading(true);
        setNotifError(null);
        
        const response = await apiServerClient.fetch('/admin/notifications?read=false&limit=1', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          console.error("Token expired or invalid.");
          logout();
          navigate('/admin/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load notifications: ${response.statusText}`);
        }

        const json = await response.json();
        if (json.success && json.pagination) {
          setUnreadNotifsCount(json.pagination.totalItems || 0);
        }
      } catch (error) {
        console.error("Error fetching admin notifications:", error);
        setNotifError(error.message);
      } finally {
        setNotifLoading(false);
      }
    };

    fetchDashboardData();
    fetchNotifications();
  }, [token, navigate, logout]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[hsl(var(--admin-foreground))]">Bonjour, {currentAdmin?.email?.split('@')[0] || 'Admin'}</h2>
          <p className="text-[hsl(var(--admin-muted-foreground))]">Voici un résumé de l'activité de la plateforme aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[hsl(var(--admin-card))] px-4 py-2 rounded-lg border border-[hsl(var(--admin-border))] shadow-sm">
            <Bell className="w-4 h-4 text-[hsl(var(--admin-primary))]" />
            <span className="text-sm font-medium text-[hsl(var(--admin-foreground))]">
              {notifLoading ? "..." : `${unreadNotifsCount} nouvelle(s)`}
            </span>
          </div>
          <div className="text-sm font-medium text-[hsl(var(--admin-muted-foreground))] bg-[hsl(var(--admin-muted))] px-4 py-2 rounded-lg hidden sm:block">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {notifError && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertDescription>
            Erreur lors de la récupération des notifications système : {notifError}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Artisans" value={stats.total} icon={Users} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard title="En Attente" value={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
        <StatCard title="Approuvés" value={stats.approved} icon={CheckCircle} color="text-green-500" bg="bg-green-500/10" />
        <StatCard title="Rejetés/Suspendus" value={stats.rejected} icon={XCircle} color="text-red-500" bg="bg-red-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-[hsl(var(--admin-card))] p-6 rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-[hsl(var(--admin-foreground))]">Répartition par Spécialité</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={specialtyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--admin-border))" />
                <XAxis dataKey="name" stroke="hsl(var(--admin-muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--admin-muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--admin-card))', borderColor: 'hsl(var(--admin-border))', color: 'hsl(var(--admin-foreground))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--admin-primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[hsl(var(--admin-card))] p-6 rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-[hsl(var(--admin-primary))]" />
            <h3 className="text-lg font-bold text-[hsl(var(--admin-foreground))]">Activité Récente</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((log, i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-[hsl(var(--admin-border))] last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-[hsl(var(--admin-primary))]" />
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--admin-foreground))]">{log.action}</p>
                  <p className="text-xs text-[hsl(var(--admin-muted-foreground))]">{log.details || log.notes || 'Aucun détail'}</p>
                  <p className="text-xs text-[hsl(var(--admin-muted-foreground))]/70 mt-1">
                    {new Date(log.created).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[hsl(var(--admin-muted-foreground))]">Aucune activité récente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-[hsl(var(--admin-card))] p-6 rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-[hsl(var(--admin-muted-foreground))]">{title}</p>
      <h4 className="text-2xl font-bold text-[hsl(var(--admin-foreground))]">{value}</h4>
    </div>
  </div>
);

export default AdminDashboardHome;