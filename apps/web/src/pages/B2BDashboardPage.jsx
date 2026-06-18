import React, { useEffect, useState } from 'react';
import { useB2BAuth } from '@/contexts/B2BAuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Wrench, FileText, Settings, Clock, PlusCircle, LogOut } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead.jsx';

const B2BDashboardPage = () => {
  const { currentEnterprise, logout } = useB2BAuth();
  const [stats, setStats] = useState({ interventions: 0, devis: 0, sites: 0 });
  const [recentInterventions, setRecentInterventions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentEnterprise) return;
      
      try {
        setIsLoading(true);
        // Fetch stats
        const interventionsReq = pb.collection('interventions_entreprise').getList(1, 5, {
          filter: `entreprise_id = "${currentEnterprise.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        
        const devisReq = pb.collection('devis_entreprise').getList(1, 1, {
          filter: `entreprise_id = "${currentEnterprise.id}" && statut = "en_attente"`,
          $autoCancel: false
        });

        const sitesReq = pb.collection('sites_entreprise').getList(1, 1, {
          filter: `entreprise_id = "${currentEnterprise.id}"`,
          $autoCancel: false
        });

        const [interventionsRes, devisRes, sitesRes] = await Promise.all([interventionsReq, devisReq, sitesReq]);

        setStats({
          interventions: interventionsRes.totalItems,
          devis: devisRes.totalItems,
          sites: sitesRes.totalItems
        });
        
        setRecentInterventions(interventionsRes.items);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentEnterprise]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'terminee': return 'bg-emerald-100 text-emerald-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'demandee': return 'bg-amber-100 text-amber-800';
      case 'annulee': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'terminee': return 'Terminée';
      case 'en_cours': return 'En cours';
      case 'demandee': return 'Demandée';
      case 'acceptee': return 'Acceptée';
      case 'annulee': return 'Annulée';
      default: return status || 'Nouveau';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <SEOHead title="Tableau de bord B2B | Artisan Congo" />
      
      {/* Top Header */}
      <header className="bg-white border-b sticky top-[72px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              {currentEnterprise?.nom_entreprise?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{currentEnterprise?.nom_entreprise}</h1>
              <p className="text-xs text-muted-foreground">Espace Entreprise</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Interventions</CardTitle>
              <Wrench className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.interventions}</div>
              <p className="text-xs text-muted-foreground mt-1">Historique complet</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Devis en attente</CardTitle>
              <FileText className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.devis}</div>
              <p className="text-xs text-muted-foreground mt-1">Nécessitent votre validation</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sites gérés</CardTitle>
              <Building2 className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.sites}</div>
              <p className="text-xs text-muted-foreground mt-1">Bâtiments enregistrés</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Recent Interventions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Interventions récentes</h2>
              <Button variant="outline" size="sm">Voir tout</Button>
            </div>
            
            <Card className="border-none shadow-sm">
              <div className="divide-y">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Chargement...</div>
                ) : recentInterventions.length > 0 ? (
                  recentInterventions.map((intervention) => (
                    <div key={intervention.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-100 rounded-md mt-1">
                          <Wrench className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{intervention.titre}</h4>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span>{intervention.type_intervention}</span>
                            <span>•</span>
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(intervention.created).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`border-none ${getStatusColor(intervention.statut)}`}>
                        {getStatusLabel(intervention.statut)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-muted-foreground font-medium">Aucune intervention récente</p>
                    <Button variant="link" className="mt-2 text-primary">Créer votre première demande</Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Quick Actions & Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Actions rapides</h2>
            <div className="grid grid-cols-1 gap-3">
              <Button className="w-full justify-start h-12 bg-slate-900 hover:bg-slate-800 text-white" disabled>
                <PlusCircle className="w-5 h-5 mr-3 text-slate-400" />
                Nouvelle intervention
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 bg-white" disabled>
                <Building2 className="w-5 h-5 mr-3 text-slate-500" />
                Gérer les sites
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 bg-white" disabled>
                <Settings className="w-5 h-5 mr-3 text-slate-500" />
                Contrats de maintenance
              </Button>
            </div>

            <Card className="border-none shadow-sm bg-primary/5 mt-8">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">Besoin d'assistance ?</h3>
                <p className="text-sm text-muted-foreground mb-4">Votre chargé de compte est disponible pour vous accompagner.</p>
                <Button variant="outline" className="w-full bg-white">Contacter le support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default B2BDashboardPage;