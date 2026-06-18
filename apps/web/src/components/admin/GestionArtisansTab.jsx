import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Ban, Trash2, Search, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { validateAdminToken } from '@/lib/adminTokenValidator.js';
import { useAdminApiHandler } from '@/hooks/useAdminApiHandler.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PROFESSIONS } from '@/lib/professions.js';

const CITIES = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];

const GestionArtisansTab = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { handleUnauthorized } = useAdminApiHandler();
  
  // Modals state
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit Form State
  const [editData, setEditData] = useState({});

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const fetchArtisans = async () => {
    if (!validateAdminToken()) return handleUnauthorized();
    
    setLoading(true);
    try {
      const records = await pb.collection('artisans').getFullList({
        sort: '-created_date',
        $autoCancel: false
      });
      setArtisans(records);
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Error fetching artisans:', error);
        toast.error('Erreur lors du chargement des artisans');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const handleStatusChange = async (artisan, newStatus, isVisible) => {
    if (!validateAdminToken()) return handleUnauthorized();
    setActionLoading(true);
    try {
      await pb.collection('artisans').update(artisan.id, {
        status: newStatus === 'Validé' ? 'active' : 'pending',
        validation_status: newStatus,
        is_visible: isVisible
      }, { $autoCancel: false });
      
      toast.success(`Statut mis à jour : ${newStatus}`);
      fetchArtisans();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        console.error(error);
        toast.error('Erreur lors de la modification du statut');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArtisan) return;
    if (!validateAdminToken()) return handleUnauthorized();
    
    setActionLoading(true);
    try {
      await pb.collection('artisans').delete(selectedArtisan.id, { $autoCancel: false });
      toast.success('Artisan supprimé avec succès');
      setIsDeleteOpen(false);
      fetchArtisans();
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtisan) return;
    if (!validateAdminToken()) return handleUnauthorized();

    setActionLoading(true);
    try {
      await pb.collection('artisans').update(selectedArtisan.id, editData, { $autoCancel: false });
      toast.success('Profil artisan mis à jour');
      setIsEditOpen(false);
      fetchArtisans();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        console.error(error);
        toast.error('Erreur lors de la mise à jour');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (artisan) => {
    setSelectedArtisan(artisan);
    setEditData({
      name: artisan.name || '',
      email: artisan.email || '',
      phone: artisan.phone || '',
      whatsapp: artisan.whatsapp || '',
      category: artisan.category || '',
      city: artisan.city || '',
      bio: artisan.bio || ''
    });
    setIsEditOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setLocationFilter('all');
  };

  const filteredArtisans = artisans.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.validation_status === statusFilter || (statusFilter === 'En attente' && !a.validation_status);
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || a.city === locationFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  const pendingCount = artisans.filter(a => a.validation_status === 'En attente' || !a.validation_status).length;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Validé': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">Validé</span>;
      case 'En attente': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">En attente</span>;
      case 'Refusé': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20">Refusé</span>;
      case 'Suspendu': return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 border border-orange-500/20">Suspendu</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">En attente</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestion des Artisans</h2>
          <p className="text-sm text-muted-foreground">Gérez les inscriptions et les profils</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 px-4 py-2 rounded-xl border border-yellow-500/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <span className="font-bold">{pendingCount} artisan(s) en attente</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom ou email..." 
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
            <SelectItem value="Validé">Validé</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Refusé">Refusé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {PROFESSIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground">
          Réinitialiser
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Artisan</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Spécialité & Ville</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full" /></td>
                  </tr>
                ))
              ) : filteredArtisans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Aucun artisan trouvé.
                  </td>
                </tr>
              ) : (
                filteredArtisans.map(artisan => (
                  <tr key={artisan.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{artisan.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Inscrit le {new Date(artisan.created).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{artisan.email}</div>
                      <div className="text-xs text-muted-foreground">{artisan.whatsapp || artisan.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{artisan.category || '-'}</div>
                      <div className="text-xs text-muted-foreground">{artisan.city || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(artisan.validation_status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {artisan.validation_status !== 'Validé' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleStatusChange(artisan, 'Validé', true)}
                            disabled={actionLoading}
                          >
                            <Check className="w-4 h-4 mr-1" /> Valider
                          </Button>
                        )}
                        {artisan.validation_status !== 'Refusé' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusChange(artisan, 'Refusé', false)}
                            disabled={actionLoading}
                          >
                            <X className="w-4 h-4 mr-1" /> Refuser
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Modifier"
                          onClick={() => openEditModal(artisan)}
                          disabled={actionLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          title="Supprimer"
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
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier l'artisan</DialogTitle>
            <DialogDescription>
              Modifiez les informations du profil de {selectedArtisan?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input 
                  value={editData.name} 
                  onChange={e => setEditData({...editData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  value={editData.email} 
                  onChange={e => setEditData({...editData, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input 
                  value={editData.whatsapp} 
                  onChange={e => setEditData({...editData, whatsapp: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input 
                  value={editData.phone} 
                  onChange={e => setEditData({...editData, phone: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Métier</Label>
                <Select value={editData.category} onValueChange={val => setEditData({...editData, category: val})}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Select value={editData.city} onValueChange={val => setEditData({...editData, city: val})}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Biographie</Label>
              <Textarea 
                value={editData.bio} 
                onChange={e => setEditData({...editData, bio: e.target.value})} 
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={actionLoading}>Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement l'artisan <strong>{selectedArtisan?.name}</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              Oui, supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default GestionArtisansTab;