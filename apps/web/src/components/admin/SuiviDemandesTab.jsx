import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import DetailModal from './DetailModal.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { validateAdminToken } from '@/lib/adminTokenValidator.js';
import { useAdminApiHandler } from '@/hooks/useAdminApiHandler.js';

const SuiviDemandesTab = () => {
  const [leads, setLeads] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { handleUnauthorized, checkResponse } = useAdminApiHandler();
  
  // Modals state
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    if (!validateAdminToken()) return handleUnauthorized();

    setLoading(true);
    try {
      const [leadsRes, artisansRes] = await Promise.all([
        pb.collection('leads').getFullList({
          sort: '-created_date',
          expand: 'assigned_artisan',
          $autoCancel: false
        }),
        pb.collection('artisans').getFullList({
          filter: "status = 'Validé'",
          $autoCancel: false
        })
      ]);
      setLeads(leadsRes);
      setArtisans(artisansRes);
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des demandes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    if (!validateAdminToken()) return handleUnauthorized();
    setActionLoading(true);
    try {
      const token = pb.authStore.token;
      const response = await apiServerClient.fetch(`/admin/lead/${leadId}/status`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      await checkResponse(response);
      
      toast.success('Statut mis à jour');
      fetchData();
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error(error);
        toast.error('Erreur lors de la mise à jour');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignArtisan = async (leadId, artisanId) => {
    if (!validateAdminToken()) return handleUnauthorized();
    setActionLoading(true);
    try {
      const token = pb.authStore.token;
      const response = await apiServerClient.fetch(`/admin/lead/${leadId}/assign`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ artisanId })
      });
      
      await checkResponse(response);
      
      toast.success('Artisan assigné avec succès');
      fetchData();
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error(error);
        toast.error('Erreur lors de l\'assignation');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    if (!validateAdminToken()) return handleUnauthorized();

    setActionLoading(true);
    try {
      await pb.collection('leads').delete(selectedLead.id, { $autoCancel: false });
      toast.success('Demande supprimée');
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        console.error(error);
        toast.error('Erreur lors de la suppression');
      }
    } finally {
      setActionLoading(false);
      setSelectedLead(null);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.client_phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Nouveau': return 'bg-blue-500/15 text-blue-600 dark:text-blue-400';
      case 'En cours': return 'admin-badge-pending';
      case 'Terminé': return 'admin-badge-validated';
      case 'Annulé': return 'admin-badge-rejected';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher (ID, Client, Tél)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Nouveau">Nouveau</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
            <SelectItem value="Annulé">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Catégorie</th>
              <th>Artisan Assigné</th>
              <th>Statut</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7}><Skeleton className="h-10 w-full" /></td>
                </tr>
              ))
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucune demande trouvée.
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td className="font-mono text-xs">{lead.id}</td>
                  <td>
                    <div className="font-medium">{lead.client_name}</div>
                    <div className="text-xs text-muted-foreground">{lead.client_phone}</div>
                  </td>
                  <td>{lead.category}</td>
                  <td>
                    <Select 
                      value={lead.assigned_artisan || "none"} 
                      onValueChange={(val) => handleAssignArtisan(lead.id, val)}
                      disabled={actionLoading}
                    >
                      <SelectTrigger className="h-8 text-xs w-[160px]">
                        <SelectValue placeholder="Assigner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Non assigné</SelectItem>
                        {artisans.filter(a => a.category === lead.category || !lead.category).map(a => (
                          <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td>
                    <Select 
                      value={lead.status} 
                      onValueChange={(val) => handleStatusChange(lead.id, val)}
                      disabled={actionLoading}
                    >
                      <SelectTrigger className={`h-8 text-xs w-[120px] border-none ${getStatusBadgeClass(lead.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nouveau">Nouveau</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                        <SelectItem value="Annulé">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td>{format(new Date(lead.created_date || lead.created || new Date()), 'dd/MM/yyyy', { locale: fr })}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Voir détails"
                        onClick={() => { setSelectedLead(lead); setIsDetailOpen(true); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive"
                        title="Supprimer"
                        onClick={() => { setSelectedLead(lead); setIsDeleteOpen(true); }}
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
        data={selectedLead} 
        type="lead" 
      />

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleDelete} 
        title="Supprimer la demande"
        description={`Êtes-vous sûr de vouloir supprimer la demande de ${selectedLead?.client_name} ?`}
        loading={actionLoading}
      />
    </div>
  );
};

export default SuiviDemandesTab;