import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, CheckCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminCommissionsPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [artisanMap, setArtisanMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch artisans to map names
      const artisanRecords = await pb.collection('artisans').getFullList({ $autoCancel: false });
      const aMap = {};
      artisanRecords.forEach(a => aMap[a.id] = a.name);
      setArtisanMap(aMap);

      // Fetch commissions
      const records = await pb.collection('commissions').getList(1, 100, {
        sort: '-created',
        $autoCancel: false
      });
      setCommissions(records.items);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm("Confirmer le paiement de cette commission ?")) return;

    try {
      await pb.collection('commissions').update(id, {
        commission_status: 'paid',
        payment_date: new Date().toISOString()
      }, { $autoCancel: false });
      toast.success('Commission marquée comme payée');
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error(error);
    }
  };

  const filteredCommissions = commissions.filter(c => 
    statusFilter ? c.commission_status === statusFilter : true
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 pt-20">
      <Helmet><title>Commissions | Admin</title></Helmet>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Commissions</h1>
            <p className="text-muted-foreground text-sm">Suivi des commissions (5%) sur les projets terminés.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
            </select>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">ID Demande</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Artisan</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Montant Projet</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Commission (5%)</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Statut</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Chargement des commissions...
                    </td>
                  </tr>
                ) : filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-muted-foreground">
                      <DollarSign className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      Aucune commission trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map(comm => (
                    <tr key={comm.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-mono text-muted-foreground">{comm.request_id}</td>
                      <td className="px-4 py-4 font-medium">{artisanMap[comm.artisan_id] || 'Artisan Inconnu'}</td>
                      <td className="px-4 py-4 text-right">{comm.project_amount?.toLocaleString()} FCFA</td>
                      <td className="px-4 py-4 text-right font-bold text-primary">{comm.commission_amount?.toLocaleString()} FCFA</td>
                      <td className="px-4 py-4 text-center">
                        {comm.commission_status === 'paid' ? (
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Payée</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">En attente</Badge>
                        )}
                        {comm.payment_date && (
                          <div className="text-[10px] text-muted-foreground mt-1">
                            le {new Date(comm.payment_date).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {comm.commission_status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8"
                            onClick={() => handleMarkAsPaid(comm.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Marquer payée
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCommissionsPage;