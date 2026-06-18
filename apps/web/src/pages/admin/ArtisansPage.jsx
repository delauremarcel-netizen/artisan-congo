import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, CheckCircle, PauseCircle, Trash2, Edit, Plus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import pb from '@/lib/pocketbaseClient.js';

const ArtisansPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'all', city: 'all', trade: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchArtisans();
  }, [filters]);

  const fetchArtisans = async () => {
    setLoading(true);
    try {
      let filterQuery = '';
      
      // Build filter query based on selected filters
      if (filters.status !== 'all') {
        filterQuery += `statut = "${filters.status}"`;
      }
      if (filters.city !== 'all') {
        filterQuery += filterQuery ? ` && city = "${filters.city}"` : `city = "${filters.city}"`;
      }
      if (filters.trade !== 'all') {
        filterQuery += filterQuery ? ` && category = "${filters.trade}"` : `category = "${filters.trade}"`;
      }

      const allArtisans = await pb.collection('artisans').getFullList({
        filter: filterQuery || undefined,
        $autoCancel: false
      });

      // Apply search filter on client side
      let filtered = allArtisans;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = allArtisans.filter(artisan =>
          artisan.name?.toLowerCase().includes(searchLower) ||
          artisan.email?.toLowerCase().includes(searchLower) ||
          artisan.phone?.includes(filters.search)
        );
      }

      setArtisans(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      console.error("Failed to fetch artisans", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArtisans();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ search: '', status: 'all', city: 'all', trade: 'all' });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="admin-badge badge-success">Actif</span>;
      case 'pending':
        return <span className="admin-badge badge-warning">En Attente</span>;
      case 'suspended':
        return <span className="admin-badge badge-danger">Suspendu</span>;
      default:
        return <span className="admin-badge badge-neutral">{status || 'Inconnu'}</span>;
    }
  };

  // Calculate pagination values
  const filteredArtisans = artisans;
  const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArtisans = filteredArtisans.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SEOHead title="Gestion des Artisans | Admin" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Artisans</h1>
          <p className="text-muted-foreground">Gérez la base de données des artisans. Total: {filteredArtisans.length}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Ajouter un Artisan
        </Button>
      </div>

      <Card className="admin-card overflow-visible">
        <CardContent className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 bg-muted/20">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par nom, email, tél..." 
              className="pl-9 bg-white"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </form>
          <div className="flex gap-4 flex-wrap">
            <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
              <SelectTrigger className="w-[160px] bg-white">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.city} onValueChange={(val) => handleFilterChange('city', val)}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                <SelectItem value="Brazzaville">Brazzaville</SelectItem>
                <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
                <SelectItem value="Kinshasa">Kinshasa</SelectItem>
                <SelectItem value="Lubumbashi">Lubumbashi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.trade} onValueChange={(val) => handleFilterChange('trade', val)}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Métier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les métiers</SelectItem>
                <SelectItem value="Plomberie">Plomberie</SelectItem>
                <SelectItem value="Électricité">Électricité</SelectItem>
                <SelectItem value="Menuiserie">Menuiserie</SelectItem>
                <SelectItem value="Maçonnerie">Maçonnerie</SelectItem>
                <SelectItem value="Peinture">Peinture</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetFilters}
              className="bg-white"
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="admin-table-header">Artisan</th>
                <th className="admin-table-header">Métier</th>
                <th className="admin-table-header">Localisation</th>
                <th className="admin-table-header">Score</th>
                <th className="admin-table-header">Statut</th>
                <th className="admin-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Chargement...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedArtisans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground">
                    Aucun artisan trouvé.
                  </td>
                </tr>
              ) : (
                paginatedArtisans.map(artisan => (
                  <tr key={artisan.id} className="hover:bg-muted/30 transition-colors">
                    <td className="admin-table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {artisan.name?.substring(0, 2).toUpperCase() || 'AR'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{artisan.name}</p>
                          <p className="text-xs text-muted-foreground">{artisan.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-cell font-medium">{artisan.category || 'Non défini'}</td>
                    <td className="admin-table-cell text-muted-foreground">{artisan.city || 'Non défini'}</td>
                    <td className="admin-table-cell">
                      <div className="flex items-center gap-1 font-semibold">
                        <span className="text-yellow-500">★</span> {artisan.average_overall_rating?.toFixed(1) || 'N/A'}
                      </div>
                    </td>
                    <td className="admin-table-cell">
                      {getStatusBadge(artisan.status)}
                    </td>
                    <td className="admin-table-cell text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de l'artisan: {artisan.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                                  <p className="font-semibold text-foreground">{artisan.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                                  <p className="font-semibold text-foreground">{artisan.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Métier</p>
                                  <p className="font-semibold text-foreground">{artisan.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                                  <p className="font-semibold text-foreground">{artisan.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Ville</p>
                                  <p className="font-semibold text-foreground">{artisan.city}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                                  <p className="font-semibold text-foreground">{artisan.status}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Score Global</p>
                                  <p className="font-semibold text-foreground">{artisan.average_overall_rating?.toFixed(1) || 'N/A'}/5</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Nombre d'avis</p>
                                  <p className="font-semibold text-foreground">{artisan.total_ratings || 0}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Bio</p>
                                <p className="text-foreground">{artisan.bio || 'Aucune bio'}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" title="Valider">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-600 hover:bg-yellow-50" title="Suspendre">
                          <PauseCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" title="Supprimer">
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex justify-center items-center gap-4">
            <Button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
              variant="outline" 
              size="sm"
              className="bg-white"
            >
              Précédent
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Page</span>
              <span className="font-semibold text-foreground">{currentPage}</span>
              <span className="text-sm text-muted-foreground">sur</span>
              <span className="font-semibold text-foreground">{totalPages}</span>
            </div>
            <Button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
              variant="outline" 
              size="sm"
              className="bg-white"
            >
              Suivant
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ArtisansPage;