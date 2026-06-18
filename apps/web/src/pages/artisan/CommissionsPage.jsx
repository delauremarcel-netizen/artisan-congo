import React, { useState, useEffect } from 'react';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const CommissionsPage = () => {
  const { currentUser } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      if (!currentUser) return;
      try {
        const res = await pb.collection('artisan_commissions').getList(1, 50, {
          filter: `artisan_id="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setCommissions(res.items);
      } catch (error) {
        console.error("Error fetching commissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, [currentUser]);

  const totalPending = commissions.filter(c => c.statut === 'en_attente').reduce((acc, curr) => acc + curr.montant_commission, 0);
  const totalPaid = commissions.filter(c => c.statut === 'payee').reduce((acc, curr) => acc + curr.montant_commission, 0);

  return (
    <ArtisanDashboardLayout>
      <SEOHead title="Commissions | ArtisanCongo" />
      
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Commissions</h1>
          <p className="text-muted-foreground">Suivez vos paiements et commissions dues à la plateforme.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="dashboard-card bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total généré</p>
                  <h3 className="text-2xl font-bold text-foreground">{totalPending + totalPaid} €</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="dashboard-card bg-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-warning">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente de paiement</p>
                  <h3 className="text-2xl font-bold text-foreground">{totalPending} €</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="dashboard-card bg-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commissions payées</p>
                  <h3 className="text-2xl font-bold text-foreground">{totalPaid} €</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="dashboard-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4">Prestation Réf</th>
                  <th className="px-6 py-4">Montant Prestation</th>
                  <th className="px-6 py-4">Commission</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center">Chargement...</td></tr>
                ) : commissions.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Aucune commission trouvée.</td></tr>
                ) : (
                  commissions.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{c.prestation_id}</td>
                      <td className="px-6 py-4">{c.montant_prestation} €</td>
                      <td className="px-6 py-4 font-bold text-foreground">{c.montant_commission} € ({c.pourcentage_commission}%)</td>
                      <td className="px-6 py-4">
                        <span className={`badge-status-${c.statut}`}>{c.statut.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(c.created).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ArtisanDashboardLayout>
  );
};

export default CommissionsPage;