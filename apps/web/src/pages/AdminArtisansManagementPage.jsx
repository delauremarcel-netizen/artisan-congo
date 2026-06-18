import React, { useEffect, useState } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import pb from '@/lib/pocketbaseClient.js';
import { Loader2, Search, CheckCircle, XCircle, Ban } from 'lucide-react';
import { toast } from 'sonner';

const AdminArtisansManagementPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchArtisans = async () => {
    try {
      const records = await pb.collection('artisans').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setArtisans(records);
    } catch (error) {
      toast.error('Erreur lors du chargement des artisans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const handleStatusChange = async (id, newStatus, isVisible) => {
    try {
      await pb.collection('artisans').update(id, {
        status: newStatus,
        isVisible: isVisible
      }, { $autoCancel: false });
      toast.success(`Statut mis à jour: ${newStatus}`);
      fetchArtisans();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredArtisans = artisans.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <SEOHead title="Gestion des Artisans | Admin" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Gestion des Artisans</h1>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par nom ou téléphone..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Téléphone</th>
                    <th className="px-6 py-4">Métier</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArtisans.map(artisan => (
                    <tr key={artisan.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium">{artisan.name} {artisan.firstName}</td>
                      <td className="px-6 py-4">{artisan.phone}</td>
                      <td className="px-6 py-4">{artisan.category || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md text-xs font-medium">
                          {artisan.status || 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(artisan.id, 'Validé', true)}>
                          <CheckCircle className="w-4 h-4 mr-1 text-green-600" /> Valider
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(artisan.id, 'Rejeté', false)}>
                          <XCircle className="w-4 h-4 mr-1 text-destructive" /> Rejeter
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(artisan.id, 'Suspendu', false)}>
                          <Ban className="w-4 h-4 mr-1 text-orange-500" /> Suspendre
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArtisansManagementPage;