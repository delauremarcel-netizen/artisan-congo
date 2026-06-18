import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, ShieldAlert, Ban, CheckCircle, Trash2, ExternalLink, Star, Briefcase, FileImage as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import AdminDashboardLayout from '@/components/AdminDashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getStatusBadgeColor } from '@/lib/artisanUtils.js';

const AdminArtisansPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('artisan_profiles').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setArtisans(records.items);
    } catch (err) {
      console.error('Error fetching artisans:', err);
      toast.error('Erreur lors du chargement des artisans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await pb.collection('artisan_profiles').update(id, { statut_artisan: newStatus }, { $autoCancel: false });
      toast.success(`Statut mis à jour: ${newStatus}`);
      setArtisans(artisans.map(a => a.id === id ? { ...a, statut_artisan: newStatus } : a));
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet artisan ? Cette action est irréversible.')) return;
    try {
      await pb.collection('artisan_profiles').delete(id, { $autoCancel: false });
      toast.success('Artisan supprimé');
      setArtisans(artisans.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredArtisans = artisans.filter(a => {
    const matchSearch = a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        a.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.statut_artisan === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadgeStyle = (status) => {
    const map = {
      'informel': 'bg-gray-100 text-gray-700 border-gray-200',
      'verifie': 'bg-blue-100 text-blue-700 border-blue-200',
      'certifie': 'bg-green-100 text-green-700 border-green-200',
      'suspendu': 'bg-red-100 text-red-700 border-red-200'
    };
    return map[status] || map['informel'];
  };

  return (
    <AdminDashboardLayout title="Gestion des Artisans" breadcrumbs={[{ label: 'Artisans' }]}>
      <Helmet><title>Artisans | Admin ArtisanCongo</title></Helmet>

      <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-[hsl(var(--admin-border))] flex flex-col sm:flex-row gap-4 justify-between bg-[hsl(var(--admin-bg))]/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email..." 
              className="input-base pl-9 h-10 bg-[hsl(var(--admin-card))]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="input-base h-10 bg-[hsl(var(--admin-card))]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="informel">Informel</option>
              <option value="verifie">Vérifié</option>
              <option value="certifie">Certifié</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container border-0 rounded-none shadow-none">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-10 text-center"><input type="checkbox" className="rounded" /></th>
                <th>Artisan</th>
                <th>Contact</th>
                <th>Statut</th>
                <th>Score</th>
                <th>Activité</th>
                <th>Portfolio</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="8" className="p-4"><Skeleton className="h-10 w-full" /></td>
                  </tr>
                ))
              ) : filteredArtisans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-muted-foreground">Aucun artisan trouvé.</td>
                </tr>
              ) : (
                filteredArtisans.map((artisan) => (
                  <tr key={artisan.id}>
                    <td className="text-center"><input type="checkbox" className="rounded border-muted-foreground/30" /></td>
                    <td>
                      <div className="flex flex-col max-w-[150px]">
                        <span className="font-semibold text-[hsl(var(--admin-text))] truncate">{artisan.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{artisan.category || 'Non spécifié'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col text-sm max-w-[150px]">
                        <span className="truncate">{artisan.email || 'N/A'}</span>
                        <span className="text-xs">{artisan.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant="outline" className={`capitalize ${getStatusBadgeStyle(artisan.statut_artisan)}`}>
                        {artisan.statut_artisan || 'Informel'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 font-bold">
                        <span className={artisan.score_global >= 70 ? 'text-green-600' : artisan.score_global >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                          {artisan.score_global || 0}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col text-xs gap-1">
                        <span className="flex items-center"><Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" /> {artisan.rating_average || 0} ({artisan.reviews_count || 0})</span>
                        <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1 text-muted-foreground" /> {artisan.missions_count || 0} miss.</span>
                      </div>
                    </td>
                    <td>
                      <Link to={`/admin/portfolio?artisan=${artisan.id}`} className="flex items-center gap-1.5 text-[hsl(var(--admin-primary))] hover:underline text-sm font-medium">
                        <ImageIcon className="w-4 h-4" />
                        {artisan.portfolio_count || 0}
                      </Link>
                    </td>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 font-medium">
                          <DropdownMenuItem onClick={() => window.open(`/artisan/${artisan.id}`, '_blank')}>
                            <ExternalLink className="w-4 h-4 mr-2" /> Voir profil public
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {artisan.statut_artisan !== 'verifie' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(artisan.id, 'verifie')}>
                              <CheckCircle className="w-4 h-4 mr-2 text-blue-600" /> Marquer Vérifié
                            </DropdownMenuItem>
                          )}
                          {artisan.statut_artisan !== 'certifie' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(artisan.id, 'certifie')}>
                              <ShieldAlert className="w-4 h-4 mr-2 text-green-600" /> Certifier l'artisan
                            </DropdownMenuItem>
                          )}
                          {artisan.statut_artisan !== 'suspendu' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(artisan.id, 'suspendu')} className="text-orange-600 focus:text-orange-600">
                              <Ban className="w-4 h-4 mr-2" /> Suspendre
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(artisan.id)} className="text-destructive focus:text-destructive">
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
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg))]/50 flex justify-between items-center text-sm text-muted-foreground">
          <span>Affichage 1-50 sur {filteredArtisans.length}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Précédent</Button>
            <Button variant="outline" size="sm" disabled>Suivant</Button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminArtisansPage;