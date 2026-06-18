import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DollarSign, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const CommissionsPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [commRes, statsRes] = await Promise.all([
          apiServerClient.fetch('/admin/commissions?limit=50'),
          apiServerClient.fetch('/admin/stats')
        ]);
        const commData = await commRes.json();
        const statsData = await statsRes.json();
        
        if (commData.success) setCommissions(commData.data);
        if (statsData.success) setStats(statsData.data);
      } catch (error) {
        console.error("Failed to fetch commissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SEOHead title="Commissions | Admin" />
      
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commissions (20%)</h1>
        <p className="text-muted-foreground">Suivez les paiements dus par les artisans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="admin-card bg-primary text-primary-foreground border-transparent">
          <CardContent className="p-6">
            <p className="text-primary-foreground/80 font-medium mb-1">Total Généré</p>
            <h3 className="text-3xl font-extrabold flex items-center"><DollarSign className="w-6 h-6 mr-1"/> {stats?.totalCommissions || 0}</h3>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground font-medium mb-1">En attente de paiement</p>
            <h3 className="text-3xl font-bold text-foreground flex items-center text-warning"><AlertCircle className="w-6 h-6 mr-2"/> ---</h3>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground font-medium mb-1">Encaissées</p>
            <h3 className="text-3xl font-bold text-foreground flex items-center text-success"><CheckCircle className="w-6 h-6 mr-2"/> ---</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="admin-card">
        <Tabs defaultValue="artisans" className="w-full">
          <div className="p-4 border-b border-border bg-muted/10">
            <TabsList>
              <TabsTrigger value="artisans">Par Artisan</TabsTrigger>
              <TabsTrigger value="metiers">Par Métier</TabsTrigger>
              <TabsTrigger value="villes">Par Ville</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="artisans" className="m-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="admin-table-header">Artisan</th>
                    <th className="admin-table-header">ID Demande</th>
                    <th className="admin-table-header">Montant Devis</th>
                    <th className="admin-table-header text-primary font-bold">Commission (20%)</th>
                    <th className="admin-table-header">Statut</th>
                    <th className="admin-table-header text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">Chargement...</td></tr>
                  ) : commissions.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">Aucune commission trouvée.</td></tr>
                  ) : (
                    commissions.map(comm => (
                      <tr key={comm.id} className="hover:bg-muted/30 transition-colors">
                        <td className="admin-table-cell font-semibold">{comm.artisan_nom}</td>
                        <td className="admin-table-cell font-mono text-xs">{comm.demande_id?.substring(0,8)}</td>
                        <td className="admin-table-cell text-muted-foreground">{comm.montant_devis} €</td>
                        <td className="admin-table-cell font-bold text-primary">{comm.montant} €</td>
                        <td className="admin-table-cell">
                          <span className={`admin-badge ${comm.statut === 'encaissee' ? 'badge-success' : 'badge-warning'}`}>
                            {comm.statut}
                          </span>
                        </td>
                        <td className="admin-table-cell text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Eye className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="metiers" className="p-12 text-center text-muted-foreground">
            Vue agrégée par métier en cours de développement.
          </TabsContent>
          <TabsContent value="villes" className="p-12 text-center text-muted-foreground">
            Vue agrégée par ville en cours de développement.
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CommissionsPage;