import React, { useState, useEffect } from 'react';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, Check, X, FileText } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

const DevisPage = () => {
  const { currentUser } = useAuth();
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchDevis = async () => {
      if (!currentUser) return;
      try {
        let filterStr = `artisan_id="${currentUser.id}"`;
        if (statusFilter !== 'all') {
          filterStr += ` && statut="${statusFilter}"`;
        }
        
        const res = await pb.collection('artisan_devis').getList(1, 50, {
          filter: filterStr,
          sort: '-created',
          $autoCancel: false
        });
        setDevis(res.items);
      } catch (error) {
        console.error("Error fetching devis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevis();
  }, [currentUser, statusFilter]);

  return (
    <ArtisanDashboardLayout>
      <SEOHead title="Gestion des Devis | ArtisanCongo" />
      
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Devis</h1>
            <p className="text-muted-foreground">Consultez et gérez vos propositions commerciales.</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="dashboard-card">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher un client ou un service..." className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background" />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-muted/50 border-transparent">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="accepte">Accepté</SelectItem>
                  <SelectItem value="refuse">Refusé</SelectItem>
                  <SelectItem value="expire">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
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
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Chargement...</td>
                  </tr>
                ) : devis.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-lg font-medium text-foreground">Aucun devis trouvé</p>
                        <p className="text-muted-foreground">Modifiez vos filtres ou attendez de nouvelles demandes.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  devis.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{d.client_nom}</div>
                        <div className="text-xs text-muted-foreground">{d.client_telephone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{d.service_categorie}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{d.service_description}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground">{d.montant_total} €</td>
                      <td className="px-6 py-4">
                        <span className={`badge-status-${d.statut}`}>
                          {d.statut.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(d.created).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Link to={`/artisan/devis/${d.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          {d.statut === 'en_attente' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-600 hover:bg-green-500/10">
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
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

export default DevisPage;