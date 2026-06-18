import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  PlusCircle, Search, Edit, Trash2, Eye, Star, MapPin, Briefcase, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import ArtisanSidebar from '@/components/ArtisanSidebar.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { getProjectStats } from '@/lib/portfolioUtils.js';
import AddEditProjectModal from '@/components/AddEditProjectModal.jsx';
import { Link } from 'react-router-dom';

const PortfolioManagementPage = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchProjects = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const records = await pb.collection('portfolio').getFullList({
        filter: `artisan_id = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setProjects(records);
      setStats(getProjectStats(records));
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      toast.error('Erreur lors du chargement de votre portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    try {
      await pb.collection('portfolio').delete(id, { $autoCancel: false });
      toast.success('Projet supprimé');
      fetchProjects();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'public' ? 'draft' : 'public';
    try {
      await pb.collection('portfolio').update(id, { statut: newStatus }, { $autoCancel: false });
      toast.success(`Statut modifié: ${newStatus}`);
      fetchProjects();
    } catch (err) {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await pb.collection('portfolio').update(id, { featured: !currentFeatured }, { $autoCancel: false });
      toast.success(!currentFeatured ? 'Projet mis en vedette' : 'Retiré des vedettes');
      fetchProjects();
    } catch (err) {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Supprimer ${selectedIds.size} projets ?`)) return;
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

  const toggleSelection = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ArtisanSidebar />
      <div className="flex-1 p-4 md:p-8 lg:ml-0">
        <Helmet><title>Mon Portfolio | ArtisanCongo</title></Helmet>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mon Portfolio</h1>
              <p className="text-muted-foreground mt-1">Gérez vos réalisations pour attirer plus de clients</p>
            </div>
            <Button onClick={() => { setProjectToEdit(null); setIsModalOpen(true); }} className="gap-2 rounded-xl">
              <PlusCircle className="w-4 h-4" /> Ajouter un projet
            </Button>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="card-subtle bg-card border border-border shadow-sm p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Projets</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.totalProjects}</p>
              </Card>
              <Card className="card-subtle bg-card border border-border shadow-sm p-4">
                <p className="text-sm font-medium text-muted-foreground">Publics</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.publicProjects}</p>
              </Card>
              <Card className="card-subtle bg-card border border-border shadow-sm p-4">
                <p className="text-sm font-medium text-muted-foreground">Brouillons</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.draftProjects}</p>
              </Card>
              <Card className="card-subtle bg-card border border-border shadow-sm p-4">
                <p className="text-sm font-medium text-muted-foreground">Vues cumulées</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.totalViews}</p>
              </Card>
            </div>
          )}

          {/* Actions Bar */}
          {selectedIds.size > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <span className="font-medium text-primary">{selectedIds.size} sélectionné(s)</span>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2 rounded-lg">
                <Trash2 className="w-4 h-4" /> Supprimer
              </Button>
            </div>
          )}

          {/* Projects List */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Vous n'avez pas encore de projets</h3>
                <p className="text-muted-foreground mb-6 max-w-md">Ajoutez des photos de vos meilleures réalisations pour donner confiance aux futurs clients.</p>
                <Button onClick={() => { setProjectToEdit(null); setIsModalOpen(true); }} className="rounded-xl">
                  Ajouter mon premier projet
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-4 py-3 w-10 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
                          checked={selectedIds.size === projects.length && projects.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedIds(new Set(projects.map(p => p.id)));
                            else setSelectedIds(new Set());
                          }}
                        />
                      </th>
                      <th className="px-4 py-3">Projet</th>
                      <th className="px-4 py-3">Catégorie</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Performance</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-muted-foreground/30 text-primary focus:ring-primary"
                            checked={selectedIds.has(project.id)}
                            onChange={() => toggleSelection(project.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                              {project.images && project.images.length > 0 ? (
                                <img src={pb.files.getUrl(project, project.images[0], { thumb: '100x100' })} alt="thumbnail" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 m-auto mt-3 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-[150px]">
                              <span className="font-semibold text-foreground truncate max-w-[200px]">{project.titre}</span>
                              <span className="text-xs text-muted-foreground">{new Date(project.created).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="font-normal bg-muted/50">{project.categorie}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 items-start">
                            <Badge className={project.statut === 'public' ? 'badge-success' : 'badge-warning'}>
                              {project.statut === 'public' ? 'Public' : 'Brouillon'}
                            </Badge>
                            {project.featured && <Badge className="badge-primary bg-primary/5 border-primary/20 text-primary text-[10px] py-0">Vedette</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1" title="Vues"><Eye className="w-3 h-3"/> {project.views_count || 0}</span>
                            {project.client_rating > 0 && <span className="flex items-center gap-1 text-yellow-600"><Star className="w-3 h-3 fill-yellow-500"/> {project.client_rating}/5</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 font-medium">
                              <DropdownMenuItem asChild>
                                <Link to={`/artisan/${currentUser.id}/portfolio`} className="cursor-pointer">
                                  <Eye className="w-4 h-4 mr-2" /> Voir en ligne
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setProjectToEdit(project); setIsModalOpen(true); }}>
                                <Edit className="w-4 h-4 mr-2" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleFeatured(project.id, project.featured)}>
                                <Star className={`w-4 h-4 mr-2 ${project.featured ? 'text-muted-foreground' : 'text-yellow-500'}`} /> 
                                {project.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(project.id, project.statut)}>
                                <Briefcase className="w-4 h-4 mr-2" /> 
                                {project.statut === 'public' ? 'Passer en brouillon' : 'Publier'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <AddEditProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projectToEdit={projectToEdit}
        onSuccess={fetchProjects}
      />
    </div>
  );
};

export default PortfolioManagementPage;