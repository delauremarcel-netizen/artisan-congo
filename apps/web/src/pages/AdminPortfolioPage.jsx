import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Search, MoreVertical, Eye, Trash2, CheckCircle2, Star, XCircle, Image as ImageIcon
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import AdminDashboardLayout from '@/components/AdminDashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const AdminPortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // We expand artisan_id to display artisan names easily
      const records = await pb.collection('portfolio').getList(1, 100, {
        sort: '-created',
        expand: 'artisan_id',
        $autoCancel: false
      });
      setProjects(records.items);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      toast.error('Erreur lors du chargement des portfolios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    try {
      await pb.collection('portfolio').delete(id, { $autoCancel: false });
      toast.success('Projet supprimé');
      setProjects(projects.filter(p => p.id !== id));
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await pb.collection('portfolio').update(id, { featured: !currentFeatured }, { $autoCancel: false });
      toast.success(!currentFeatured ? 'Projet mis en vedette' : 'Retiré des vedettes');
      setProjects(projects.map(p => p.id === id ? { ...p, featured: !currentFeatured } : p));
    } catch (err) {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Supprimer définitivement ${selectedIds.size} projets ?`)) return;
    try {
      setLoading(true);
      await Promise.all(Array.from(selectedIds).map(id => pb.collection('portfolio').delete(id, { $autoCancel: false })));
      toast.success(`${selectedIds.size} projets supprimés`);
      setSelectedIds(new Set());
      fetchProjects();
    } catch (err) {
      toast.error('Erreur lors de la suppression par lot');
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.titre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.expand?.artisan_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelection = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  return (
    <AdminDashboardLayout title="Gestion du Portfolio" breadcrumbs={[{ label: 'Portfolio' }]}>
      <Helmet><title>Portfolio | Admin ArtisanCongo</title></Helmet>

      <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[hsl(var(--admin-border))] flex flex-col sm:flex-row gap-4 justify-between bg-[hsl(var(--admin-bg))]/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou artisan..." 
              className="input-base pl-9 h-10 bg-[hsl(var(--admin-card))]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto items-center">
            {selectedIds.size > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2 mr-2">
                <Trash2 className="w-4 h-4" /> Supprimer
              </Button>
            )}
            <select 
              className="input-base h-10 bg-[hsl(var(--admin-card))]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="public">Public</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>

        <div className="admin-table-container border-0 rounded-none shadow-none">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-10 text-center"><input 
                  type="checkbox" className="rounded" 
                  checked={selectedIds.size === filteredProjects.length && filteredProjects.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(new Set(filteredProjects.map(p => p.id)));
                    else setSelectedIds(new Set());
                  }}
                /></th>
                <th>Image</th>
                <th>Projet</th>
                <th>Artisan</th>
                <th>Statut</th>
                <th>Vues</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="7" className="p-4"><Skeleton className="h-10 w-full" /></td>
                  </tr>
                ))
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-muted-foreground">Aucun projet trouvé.</td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="text-center">
                      <input 
                        type="checkbox" className="rounded border-muted-foreground/30" 
                        checked={selectedIds.has(project.id)}
                        onChange={() => toggleSelection(project.id)}
                      />
                    </td>
                    <td>
                      <div className="w-10 h-10 rounded overflow-hidden bg-muted border border-[hsl(var(--admin-border))]">
                        {project.images && project.images.length > 0 ? (
                          <img src={pb.files.getUrl(project, project.images[0], { thumb: '100x100' })} alt="thumb" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 m-auto mt-2.5 text-muted-foreground/50" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[hsl(var(--admin-text))] truncate max-w-[200px]">{project.titre}</span>
                        <span className="text-xs text-muted-foreground">{project.categorie}</span>
                      </div>
                    </td>
                    <td>
                      <Link to={`/artisan/${project.artisan_id}`} className="text-primary hover:underline text-sm font-medium">
                        {project.expand?.artisan_id?.name || 'Artisan inconnu'}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge variant="outline" className={project.statut === 'public' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>
                          {project.statut === 'public' ? 'Public' : 'Brouillon'}
                        </Badge>
                        {project.featured && <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 py-0 text-[10px]">Vedette</Badge>}
                      </div>
                    </td>
                    <td className="text-sm font-medium">
                      {project.views_count || 0}
                    </td>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 font-medium">
                          <DropdownMenuItem asChild>
                            <a href={`/artisan/${project.artisan_id}/portfolio`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" /> Voir en ligne
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleFeatured(project.id, project.featured)}>
                            <Star className={`w-4 h-4 mr-2 ${project.featured ? 'text-muted-foreground' : 'text-yellow-500'}`} /> 
                            {project.featured ? 'Retirer vedette' : 'Mettre en vedette'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
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
    </AdminDashboardLayout>
  );
};

export default AdminPortfolioPage;