import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Search, MoreVertical, Eye, Trash2, Star, ShieldAlert
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import AdminDashboardLayout from '@/components/AdminDashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('ratings').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setReviews(records.items);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet avis ?')) return;
    try {
      await pb.collection('ratings').delete(id, { $autoCancel: false });
      toast.success('Avis supprimé');
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.review_text?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {rating} <Star className="w-3 h-3 ml-1 fill-yellow-500 text-yellow-500" />
    </div>
  );

  return (
    <AdminDashboardLayout title="Modération des Avis" breadcrumbs={[{ label: 'Avis' }]}>
      <Helmet><title>Avis | Admin ArtisanCongo</title></Helmet>

      <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[hsl(var(--admin-border))] flex flex-col sm:flex-row gap-4 justify-between bg-[hsl(var(--admin-bg))]/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher dans les commentaires..." 
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
                <th>Note Globale</th>
                <th>Commentaire</th>
                <th>Artisan ID</th>
                <th>User ID</th>
                <th>Date</th>
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
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted-foreground">Aucun avis trouvé.</td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-700">
                        {renderStars(review.rating)}
                      </Badge>
                    </td>
                    <td className="max-w-[300px]">
                      <p className="text-sm truncate text-[hsl(var(--admin-text))]">
                        {review.review_text || <span className="text-muted-foreground italic">Aucun texte</span>}
                      </p>
                    </td>
                    <td className="text-xs font-mono">{review.artisan_id}</td>
                    <td className="text-xs font-mono">{review.user_id}</td>
                    <td className="text-xs">{new Date(review.created).toLocaleDateString('fr-FR')}</td>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 font-medium">
                          <DropdownMenuItem onClick={() => { setSelectedReview(review); setIsModalOpen(true); }}>
                            <Eye className="w-4 h-4 mr-2" /> Lire l'avis complet
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(review.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer l'avis
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card text-card-foreground">
          {selectedReview && (
            <>
              <div className="p-6 border-b border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-bg))]/50">
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-xl">Détail de l'avis</DialogTitle>
                    <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-700 text-lg px-3 py-1">
                      {renderStars(selectedReview.rating)}
                    </Badge>
                  </div>
                </DialogHeader>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Commentaire</h4>
                  <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/40 p-4 rounded-xl border border-border/50 italic">
                    "{selectedReview.review_text || 'Aucun commentaire écrit.'}"
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[hsl(var(--admin-bg))] p-3 rounded-lg border border-[hsl(var(--admin-border))]">
                    <p className="text-xs text-muted-foreground mb-1">Qualité</p>
                    <p className="font-semibold text-sm">{selectedReview.quality_rating}/5</p>
                  </div>
                  <div className="bg-[hsl(var(--admin-bg))] p-3 rounded-lg border border-[hsl(var(--admin-border))]">
                    <p className="text-xs text-muted-foreground mb-1">Professionnalisme</p>
                    <p className="font-semibold text-sm">{selectedReview.professionalism_rating}/5</p>
                  </div>
                  <div className="bg-[hsl(var(--admin-bg))] p-3 rounded-lg border border-[hsl(var(--admin-border))]">
                    <p className="text-xs text-muted-foreground mb-1">Ponctualité</p>
                    <p className="font-semibold text-sm">{selectedReview.punctuality_rating}/5</p>
                  </div>
                  <div className="bg-[hsl(var(--admin-bg))] p-3 rounded-lg border border-[hsl(var(--admin-border))]">
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold text-sm">{new Date(selectedReview.created).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-[hsl(var(--admin-border))] flex justify-between bg-[hsl(var(--admin-bg))]/50">
                <Button variant="destructive" onClick={() => { handleDelete(selectedReview.id); setIsModalOpen(false); }}>
                  Supprimer
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Fermer</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AdminReviewsPage;