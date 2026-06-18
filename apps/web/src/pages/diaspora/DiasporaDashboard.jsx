import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Home, 
  Briefcase, 
  DollarSign, 
  Bell, 
  Settings, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  AlertCircle,
  Activity,
  CreditCard,
  LayoutDashboard,
  ArrowUpRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export default function DiasporaDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/client/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch projects for the current user
        const projectsRes = await pb.collection('diaspora_projects').getFullList({
          filter: `diaspora_user_id="${user.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setProjects(projectsRes);

        // If user has projects, fetch related expenses and payments
        if (projectsRes.length > 0) {
          const projectIds = projectsRes.map(p => `"${p.id}"`).join(',');
          
          const [expensesRes, paymentsRes] = await Promise.all([
            pb.collection('project_expenses').getFullList({
              filter: `project_id ?= [${projectIds}]`,
              sort: '-date',
              $autoCancel: false
            }).catch(() => []), // Fallback if collection rules restrict
            pb.collection('project_payments').getFullList({
              filter: `project_id ?= [${projectIds}]`,
              sort: '-payment_date',
              $autoCancel: false
            }).catch(() => [])
          ]);
          
          setExpenses(expensesRes);
          setPayments(paymentsRes);
        }

        // Fetch notifications
        const notifsRes = await pb.collection('project_notifications').getFullList({
          filter: `diaspora_user_id="${user.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setNotifications(notifsRes);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError("Impossible de charger les données du tableau de bord.");
        toast.error("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'CL';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget_initial || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.budget_spent || 0), 0);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 pt-24 pb-16 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 rounded-2xl premium-shadow border-0">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oups !</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="w-full rounded-xl">
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20 pb-16">
      {/* Header Section */}
      <div className="bg-card border-b border-border mb-8">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                <AvatarImage src={user?.avatar ? pb.files.getUrl(user, user.avatar) : ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Bienvenue, {user?.name || 'Client'}
                </h1>
                <p className="text-muted-foreground">
                  Gérez vos projets immobiliers au Congo en toute sérénité.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl bg-background" onClick={() => navigate('/contact')}>
                Contacter le support
              </Button>
              <Button variant="destructive" className="rounded-xl gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto p-1 bg-card border border-border rounded-xl">
            <TabsTrigger value="projects" className="py-3 rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Mes Projets</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="py-3 rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-3 rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadNotifs > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-3 rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          {/* PROJECTS TAB */}
          <TabsContent value="projects" className="space-y-6 focus-visible:outline-none">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Projets Actifs</h2>
              <Button className="rounded-xl gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Plus className="w-4 h-4" />
                Nouveau Projet
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <Card key={i} className="rounded-2xl border-0 premium-shadow">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-2/3 mb-4" />
                      <Skeleton className="h-4 w-1/2 mb-8" />
                      <Skeleton className="h-2 w-full mb-2" />
                      <Skeleton className="h-10 w-full mt-4 rounded-xl" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <Card className="rounded-2xl border-dashed border-2 bg-transparent text-center py-16">
                <CardContent>
                  <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">Aucun projet en cours</h3>
                  <p className="text-muted-foreground mb-6">Commencez votre premier projet de construction ou rénovation.</p>
                  <Button className="rounded-xl">Démarrer un projet</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <Card key={project.id} className="rounded-2xl border-0 premium-shadow overflow-hidden flex flex-col">
                    <CardHeader className="pb-4 border-b border-border/50 bg-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-1">{project.project_name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {project.location_congo}
                          </CardDescription>
                        </div>
                        <Badge variant={project.status === 'Actif' ? 'default' : 'secondary'} className="rounded-full">
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-1">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-muted-foreground">Budget consommé</span>
                            <span>{project.budget_spent?.toLocaleString() || 0} € / {project.budget_initial?.toLocaleString() || 0} €</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(((project.budget_spent || 0) / (project.budget_initial || 1)) * 100, 100)}%` }} 
                            />
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-3">
                          <Activity className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Type de projet</p>
                            <p className="text-sm font-bold">{project.project_type}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 mt-auto">
                      <Button className="w-full rounded-xl gap-2" onClick={() => navigate('/suivi-live')}>
                        <Eye className="w-4 h-4" />
                        Suivi en temps réel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* BUDGET TAB */}
          <TabsContent value="budget" className="space-y-6 focus-visible:outline-none">
            <h2 className="text-2xl font-bold">Aperçu Financier</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="rounded-2xl border-0 premium-shadow bg-card">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Budget Total Alloué</p>
                  <h3 className="text-3xl font-bold">{totalBudget.toLocaleString()} €</h3>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-0 premium-shadow bg-card">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Dépensé</p>
                  <h3 className="text-3xl font-bold text-primary">{totalSpent.toLocaleString()} €</h3>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-0 premium-shadow bg-card">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Reste à financer</p>
                  <h3 className="text-3xl font-bold text-secondary-foreground">{(totalBudget - totalSpent).toLocaleString()} €</h3>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-0 premium-shadow">
              <CardHeader>
                <CardTitle>Dernières Dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune dépense enregistrée pour le moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.slice(0, 5).map(expense => (
                      <div key={expense.id} className="flex justify-between items-center p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <div className="font-bold text-lg">
                          -{expense.amount?.toLocaleString()} €
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-6 focus-visible:outline-none">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Notifications</h2>
              {unreadNotifs > 0 && (
                <Button variant="outline" size="sm" className="rounded-full">
                  Tout marquer comme lu
                </Button>
              )}
            </div>

            <Card className="rounded-2xl border-0 premium-shadow">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-16">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Vous n'avez aucune notification.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-6 flex gap-4 transition-colors ${!notif.read ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                        <div className="mt-1">
                          {!notif.read ? (
                            <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-base ${!notif.read ? 'font-bold' : 'font-medium'}`}>
                              {notif.title}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                              {new Date(notif.created).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6 focus-visible:outline-none">
            <h2 className="text-2xl font-bold">Paramètres du Profil</h2>
            
            <Card className="rounded-2xl border-0 premium-shadow max-w-2xl">
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                    <AvatarImage src={user?.avatar ? pb.files.getUrl(user, user.avatar) : ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="rounded-xl">Modifier la photo</Button>
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                    <div className="p-3 bg-muted rounded-xl font-medium">{user?.name || 'Non renseigné'}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Adresse Email</label>
                    <div className="p-3 bg-muted rounded-xl font-medium">{user?.email}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Type de compte</label>
                    <div className="p-3 bg-muted rounded-xl font-medium capitalize">{user?.account_type || 'Client Diaspora'}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 pt-6">
                <Button className="rounded-xl gap-2">
                  <Edit2 className="w-4 h-4" />
                  Modifier les informations
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}