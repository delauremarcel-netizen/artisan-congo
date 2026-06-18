import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Trash2, Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import DetailModal from './DetailModal.jsx';
import RejectModal from './RejectModal.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { validateAdminToken } from '@/lib/adminTokenValidator.js';
import { useAdminApiHandler } from '@/hooks/useAdminApiHandler.js';

const ValidationArtisansTab = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { handleUnauthorized, checkResponse } = useAdminApiHandler();
  
  // Modals state
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchPendingArtisans = async () => {
    if (!validateAdminToken()) return handleUnauthorized();

    setLoading(true);
    try {
      const records = await pb.collection('artisans').getFullList({
        filter: "status = 'En attente'",
        sort: '-created_date',
        $autoCancel: false
      });
      setArtisans(records);
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Error fetching pending artisans:', error);
        toast.error('Erreur lors du chargement des artisans en attente');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtisans();
  }, []);

  const handleValidate = async (id) => {
    if (!validateAdminToken()) return handleUnauthorized();
    setActionLoading(true);
    try {
      const token = pb.authStore.token;
      const response = await apiServerClient.fetch(`/admin/artisan/${id}/validate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      await checkResponse(response);
      
      toast.success('Artisan validé avec succès');
      fetchPendingArtisans();
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error(error);
        toast.error('Erreur lors de la validation');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    if (!selectedArtisan) return;
    if (!validateAdminToken()) return handleUnauthorized();

    setActionLoading(true);
    try {
      const token = pb.authStore.token;
      const response = await apiServerClient.fetch(`/admin/artisan/${selectedArtisan.id}/reject`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      await checkResponse(response);
      
      toast.success('Artisan refusé');
      setIsRejectOpen(false);
      fetchPendingArtisans();
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error(error);
        toast.error('Erreur lors du refus');
      }
    } finally {
      setActionLoading(false);
      setSelectedArtisan(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedArtisan) return;
    if (!validateAdminToken()) return handleUnauthorized();

    setActionLoading(true);
    try {
      await pb.collection('artisans').delete(selectedArtisan.id, { $autoCancel: false });
      toast.success('Artisan supprimé');
      setIsDeleteOpen(false);
      fetchPendingArtisans();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        console.error(error);
        toast.error('Erreur lors de la suppression');
      }
    } finally {
      setActionLoading(false);
      setSelectedArtisan(null);
    }
  };

  const filteredArtisans = artisans.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(artisans.map(a => a.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un artisan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Ville</th>
              <th>Téléphone</th>
              <th>Date d'inscription</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6}><Skeleton className="h-10 w-full" /></td>
                </tr>
              ))
            ) : filteredArtisans.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun artisan en attente de validation.
                </td>
              </tr>
            ) : (
              filteredArtisans.map(artisan => (
                <tr key={artisan.id}>
                  <td className="font-medium">{artisan.name}</td>
                  <td>{artisan.category || '-'}</td>
                  <td>{artisan.city || '-'}</td>
                  <td>{artisan.phone || '-'}</td>
                  <td>{format(new Date(artisan.created_date || artisan.created || new Date()), 'dd/MM/yyyy', { locale: fr })}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Voir détails"
                        onClick={() => { setSelectedArtisan(artisan); setIsDetailOpen(true); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleValidate(artisan.id)}
                        disabled={actionLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Valider
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => { setSelectedArtisan(artisan); setIsRejectOpen(true); }}
                        disabled={actionLoading}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Refuser
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => { setSelectedArtisan(artisan); setIsDeleteOpen(true); }}
                        disabled={actionLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        data={selectedArtisan} 
        type="artisan" 
      />
      
      <RejectModal 
        isOpen={isRejectOpen} 
        onClose={() => setIsRejectOpen(false)} 
        onConfirm={handleReject} 
        artisanName={selectedArtisan?.name}
        loading={actionLoading}
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleDelete} 
        title="Supprimer l'artisan"
        description={`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${selectedArtisan?.name} ?`}
        loading={actionLoading}
      />
    </div>
  );
};

export default ValidationArtisansTab;