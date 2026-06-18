import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Search, MoreVertical, Eye, Trash2, CheckCircle2, XCircle
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import AdminDashboardLayout from '@/components/AdminDashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const AdminMissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedMission, setSelectedMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      // Ensure relations are expanded if possible, but schema doesn't show standard relations for artisan_id inside missions.
      // So we just fetch standard missions list
      const records = await pb.collection('missions').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setMissions(records.items);
    } catch (err) {
      console.error('Error fetching missions:', err);
      toast.error('Erreur lors du chargement des missions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await pb.collection('missions').update(id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Statut mis à jour`);
      setMissions(missions.map(m => m.id === id ? { ...m, status: newStatus } : m));
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredMissions = missions.filter(m => {
    const matchSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        m.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'closed': return 'Annulée';
      default: return status;
    }
  };

  return (
    <AdminDashboardLayout title="Gestion des Missions" breadcrumbs={[{ label: 'Missions' }]}>
      <Helmet><title>Missions | Admin ArtisanCongo</title></Helmet>

      <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[hsl(var(--admin-border))] flex flex-col sm:flex-row gap-4 justify-between bg-[hsl(var(--admin-bg))]/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou catégorie..." 
              className="input-base pl-9 h-10 bg-[hsl(var(--admin-card))]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container border-0 rounded-none shadow-none">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre & Catégorie</th>
                <th>Client ID</th>
                <th>Statut</th>
                <th>Budget</th>
                <th>Date limite</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="p-4"><Skeleton className="h-10 w-full" /></td>
                  </tr>
                ))
              ) : filteredMissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground">Aucune mission trouvée.</td>
                </tr>
              ) : (
                filteredMissions.map((mission) => (
                  <tr key={mission.id}>
                    <td>
                      <div className="flex flex-col max-w-xs">
                        <span className="font-semibold text-[hsl(var(--admin-text))] truncate">{mission.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{mission.category}</span>
                      </div>
                    </td>
                    <td className="text-xs font-mono">{mission.company_id}</td>
                    <td>
                      <Badge variant="outline" className={`${getStatusBadge(mission.status)}`}>
                        {getStatusText(mission.status)}
                      </Badge>
                    </td>
                    <td className="font-semibold">
                      {mission.budget ? `${mission.budget} FCFA` : '-'}
                    </td>
                    <td className="text-sm">
                      {mission.deadline ? new Date(mission.deadline).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 font-medium">
                          <DropdownMenuItem onClick={() => { setSelectedMission(mission); setIsModalOpen(true); }}>
                            <Eye className="w-4 h-4 mr-2" /> Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {mission.status !== 'completed' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(mission.id, 'completed')}>
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Marquer terminée
                            </DropdownMenuItem>
                          )}
                          {mission.status !== 'closed' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(mission.id, 'closed')}>
                              <XCircle className="w-4 h-4 mr-2 text-orange-600" /> Annuler mission
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card text-card-foreground">
          {selectedMission && (
            <>
              <div className="p-6 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg))]/50">
                <DialogHeader>
                  <div className="flex justify-between items-start gap-4">
                    <DialogTitle className="text-xl">{selectedMission.title}</DialogTitle>
                    <Badge variant="outline" className={`${getStatusBadge(selectedMission.status)}`}>
                      {getStatusText(selectedMission.status)}
                    </Badge>
                  </div>
                </DialogHeader>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/40 p-4 rounded-xl border border-border/50">
                    {selectedMission.description || 'Aucune description fournie.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Catégorie</h4>
                    <p className="font-semibold text-sm">{selectedMission.category}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Budget</h4>
                    <p className="font-semibold text-sm">{selectedMission.budget ? `${selectedMission.budget} FCFA` : 'Non défini'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Créée le</h4>
                    <p className="font-semibold text-sm">{new Date(selectedMission.created).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Client ID</h4>
                    <p className="font-mono text-xs">{selectedMission.company_id}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-[hsl(var(--admin-border))] flex justify-end bg-[hsl(var(--admin-bg))]/50">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Fermer</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AdminMissionsPage;