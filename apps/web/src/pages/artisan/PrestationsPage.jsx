import React, { useState, useEffect } from 'react';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Briefcase } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

const PrestationsPage = () => {
  const { currentUser } = useAuth();
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrestations = async () => {
      if (!currentUser) return;
      try {
        const res = await pb.collection('artisan_prestations').getList(1, 50, {
          filter: `artisan_id="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setPrestations(res.items);
      } catch (error) {
        console.error("Error fetching prestations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrestations();
  }, [currentUser]);

  return (
    <ArtisanDashboardLayout>
      <SEOHead title="Prestations | ArtisanCongo" />
      
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historique des Prestations</h1>
          <p className="text-muted-foreground">Consultez vos chantiers en cours et terminés.</p>
        </div>

        <Card className="dashboard-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center">Chargement...</td></tr>
                ) : prestations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-lg font-medium text-foreground">Aucune prestation</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  prestations.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{p.client_nom}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.service_categorie}</td>
                      <td className="px-6 py-4 font-bold text-foreground">{p.montant} €</td>
                      <td className="px-6 py-4">
                        <span className={`badge-status-${p.statut}`}>{p.statut.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(p.created).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
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

export default PrestationsPage;