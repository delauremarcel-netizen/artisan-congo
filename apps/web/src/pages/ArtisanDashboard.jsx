import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Star, 
  CheckCircle, 
  MessageSquare,
  Edit,
  Eye,
  Briefcase,
  AlertCircle,
  Image as ImageIcon,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  GripVertical,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import ArtisanSidebar from '@/components/ArtisanSidebar.jsx';
import ReviewCard from '@/components/ReviewCard.jsx';
import MissionCard from '@/components/MissionCard.jsx';
import MultiPhotoUpload from '@/components/MultiPhotoUpload.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { 
  getScoreColor, 
  getScoreBgColor, 
  getBadgeColor, 
  getBadgeDisplayText,
  getStatusBadgeColor,
  getStatusDisplayText,
  calculateProfileCompletion 
} from '@/lib/artisanUtils.js';
import { getProjectStats } from '@/lib/portfolioUtils.js';
import { toast } from 'sonner';

const ArtisanDashboard = () => {
  const { currentUser } = useAuth();
  const [artisanProfile, setArtisanProfile] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [activeMissions, setActiveMissions] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Portfolio Photos State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newPhotos, setNewPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const fetchDashboardData = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      setError(null);

      const profiles = await pb.collection('artisan_profiles').getFullList({
        filter: `artisan_id = "${currentUser.id}"`,
        $autoCancel: false,
      });

      if (profiles.length > 0) {
        setArtisanProfile(profiles[0]);
      }

      const reviews = await pb.collection('ratings').getList(1, 5, {
        filter: `artisan_id = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false,
      }).catch(() => ({items:[]}));
      setRecentReviews(reviews.items);

      const missions = await pb.collection('missions').getFullList({
        filter: `status = "En cours" || status = "in_progress"`,
        sort: '-created',
        $autoCancel: false,
      }).catch(() => []);
      setActiveMissions(missions);

      const projects = await pb.collection('portfolio').getFullList({
        filter: `artisan_id = "${currentUser.id}"`,
        $autoCancel: false,
      }).catch(() => []);
      
      setPortfolioStats(getProjectStats(projects));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Erreur lors du chargement des données');
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const profileCompletion = artisanProfile ? calculateProfileCompletion(artisanProfile) : 0;

  const getProfileCompletionItems = () => {
    if (!artisanProfile) return [];
    return [
      { label: 'Photo de profil', completed: !!artisanProfile.name },
      { label: 'Biographie', completed: !!artisanProfile.bio },
      { label: 'Catégories', completed: !!artisanProfile.category },
      { label: 'Localisation', completed: !!artisanProfile.city },
      { label: 'Charte acceptée', completed: !!artisanProfile.charte_acceptee },
      { label: 'Téléphone', completed: !!artisanProfile.phone },
      { label: 'Années d\'expérience', completed: artisanProfile.experience_years !== null },
    ];
  };

  // --- Portfolio Photos Management Functions ---

  const handleUploadPhotos = async () => {
    if (newPhotos.length === 0) {
       setIsUploadModalOpen(false);
       return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // Preserve existing photos
      const existingPhotos = artisanProfile?.portfolio_photos || [];
      existingPhotos.forEach(filename => {
        formData.append('portfolio_photos', filename);
      });
      
      // Add new files
      newPhotos.forEach(file => {
        formData.append('portfolio_photos', file);
      });

      const updatedProfile = await pb.collection('artisan_profiles').update(artisanProfile.id, formData, { $autoCancel: false });
      setArtisanProfile(updatedProfile);
      toast.success('Photos ajoutées avec succès');
      setNewPhotos([]);
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error('Error uploading photos:', err);
      toast.error('Erreur lors de l\'ajout des photos');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete || !artisanProfile) return;
    
    try {
      const newPhotosList = artisanProfile.portfolio_photos.filter(f => f !== photoToDelete);
      const formData = new FormData();
      
      if (newPhotosList.length === 0) {
        formData.append('portfolio_photos', ''); // PocketBase way to clear file field
      } else {
        newPhotosList.forEach(filename => {
          formData.append('portfolio_photos', filename);
        });
      }

      const updatedProfile = await pb.collection('artisan_profiles').update(artisanProfile.id, formData, { $autoCancel: false });
      setArtisanProfile(updatedProfile);
      toast.success('Photo supprimée');
      setPhotoToDelete(null);
    } catch (err) {
      console.error('Error deleting photo:', err);
      toast.error('Erreur lors de la suppression de la photo');
    }
  };

  const handleSetFeatured = async (filename) => {
    if (!artisanProfile) return;
    try {
      const remaining = artisanProfile.portfolio_photos.filter(f => f !== filename);
      const newOrder = [filename, ...remaining]; // Move to index 0
      
      const formData = new FormData();
      newOrder.forEach(f => formData.append('portfolio_photos', f));
      
      // Optimistic update
      setArtisanProfile(prev => ({...prev, portfolio_photos: newOrder}));
      
      await pb.collection('artisan_profiles').update(artisanProfile.id, formData, { $autoCancel: false });
      toast.success('Photo mise en avant !');
    } catch (err) {
      toast.error('Erreur de mise à jour');
      fetchDashboardData(); // revert
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newOrder = [...artisanProfile.portfolio_photos];
    const [movedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, movedItem);

    // Optimistic UI update
    setArtisanProfile(prev => ({...prev, portfolio_photos: newOrder}));
    setDraggedIndex(null);

    try {
      const formData = new FormData();
      newOrder.forEach(f => formData.append('portfolio_photos', f));
      await pb.collection('artisan_profiles').update(artisanProfile.id, formData, { $autoCancel: false });
      toast.success("Ordre mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'ordre");
      fetchDashboardData(); // revert
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <ArtisanSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <ArtisanSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-destructive">
              <CardContent className="p-6 flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <div>
                  <h3 className="font-semibold text-destructive">Erreur</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const portfolioPhotosList = artisanProfile?.portfolio_photos || [];

  return (
    <div className="flex min-h-screen bg-background">
      <ArtisanSidebar />
      
      <div className="flex-1 p-4 md:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Bienvenue, {artisanProfile?.name || currentUser?.name || 'Artisan'}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {artisanProfile?.statut_artisan && (
                  <Badge className={getStatusBadgeColor(artisanProfile.statut_artisan)}>
                    {getStatusDisplayText(artisanProfile.statut_artisan)}
                  </Badge>
                )}
                {artisanProfile?.badge && (
                  <Badge className={getBadgeColor(artisanProfile.badge)}>
                    {getBadgeDisplayText(artisanProfile.badge)}
                  </Badge>
                )}
              </div>
            </div>
            <Button asChild className="gap-2 rounded-xl">
              <Link to="/artisan/profile/edit"><Edit className="w-4 h-4" /> Modifier profil</Link>
            </Button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-elevated border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(artisanProfile?.score_global || 0)}`}>
                    <span className={getScoreColor(artisanProfile?.score_global || 0)}>
                      {artisanProfile?.score_global || 0}/100
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Score Global</h3>
                <p className="text-2xl font-bold text-foreground">
                  {artisanProfile?.score_global || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Rating Moyen</h3>
                <p className="text-2xl font-bold text-foreground">
                  {artisanProfile?.rating_average?.toFixed(1) || '0.0'}/5.0
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {artisanProfile?.reviews_count || 0} avis
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <ImageIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Photos Portfolio</h3>
                <p className="text-2xl font-bold text-foreground">
                  {portfolioPhotosList.length} / 5
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  <div className={`w-3 h-3 rounded-full ${
                    (artisanProfile?.response_rate || 0) >= 80 ? 'bg-primary' : 'bg-primary/50'
                  }`} />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Taux de Réponse</h3>
                <p className="text-2xl font-bold text-foreground">
                  {artisanProfile?.response_rate || 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Contact Information & Privacy Notice */}
            <Card className="card-elevated border-none shadow-sm h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Vos Coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 flex-grow">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Numéro de téléphone</span>
                  <span className="text-xl font-bold text-foreground">
                    {artisanProfile?.phone || 'Non renseigné'}
                  </span>
                  <div className="flex items-start gap-2 mt-2 bg-primary/5 p-3 rounded-xl border border-primary/10">
                    <CheckCircle className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                    <span className="text-sm text-primary/90 font-medium">
                      Votre numéro n'est pas affiché publiquement. Artisan Congo se charge de centraliser les demandes des clients.
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Email de connexion</span>
                  <span className="text-lg font-semibold text-foreground">
                    {currentUser?.email || 'Non renseigné'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="card-elevated border-none shadow-sm h-full flex flex-col">
              <CardHeader>
                <CardTitle>Complétion du Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {profileCompletion}% complété
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getProfileCompletionItems().filter(item => item.completed).length} / {getProfileCompletionItems().length}
                  </span>
                </div>
                <Progress value={profileCompletion} className="h-2 bg-muted [&>div]:bg-primary" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {getProfileCompletionItems().map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        item.completed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.completed && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <span className={`text-sm truncate ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Photos Management */}
            <Card className="card-elevated border-none shadow-sm lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Mes Photos de Portfolio</CardTitle>
                {portfolioPhotosList.length < 5 && (
                  <Button size="sm" onClick={() => setIsUploadModalOpen(true)} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="w-4 h-4 mr-2" /> Ajouter
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {portfolioPhotosList.length > 0 ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Glissez-déposez pour réorganiser. La première photo est mise en avant.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {portfolioPhotosList.map((filename, index) => (
                        <div 
                          key={filename} 
                          className="group relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm bg-muted cursor-move"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <img 
                            src={pb.files.getUrl(artisanProfile, filename, { thumb: '400x400' })} 
                            alt={`Portfolio ${index}`}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors" />
                          
                          {/* Badges and Actions */}
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white border-none shadow-sm pointer-events-none">
                              <Star className="w-3 h-3 mr-1 fill-white" /> En avant
                            </Badge>
                          )}
                          
                          <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex justify-end gap-1">
                              {index !== 0 && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleSetFeatured(filename); }}
                                  className="p-1.5 bg-black/60 text-white rounded-md hover:bg-yellow-500 transition-colors"
                                  title="Mettre en avant"
                                >
                                  <Star className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={(e) => { e.stopPropagation(); setPhotoToDelete(filename); }}
                                className="p-1.5 bg-black/60 text-white rounded-md hover:bg-destructive transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-center pb-2 pointer-events-none">
                               <GripVertical className="w-6 h-6 text-white/80" />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Empty slots placeholders */}
                      {Array.from({ length: 5 - portfolioPhotosList.length }).map((_, i) => (
                        <div key={`empty-${i}`} onClick={() => setIsUploadModalOpen(true)} className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors">
                           <PlusCircle className="w-6 h-6 mb-2 opacity-50" />
                           <span className="text-xs font-medium">Ajouter</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center bg-muted/20 rounded-2xl p-8 border border-border border-dashed">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <h3 className="font-semibold mb-1">Vous n'avez pas encore de photos de portfolio</h3>
                    <p className="text-sm text-muted-foreground mb-4">Ajoutez des réalisations pour convaincre plus de clients.</p>
                    <Button onClick={() => setIsUploadModalOpen(true)} size="sm" className="rounded-xl">
                      Ajouter des photos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="card-elevated border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Avis Récents</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/artisan/reviews">Voir tous</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReviews.length > 0 ? (
                  recentReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} truncate maxLength={100} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun avis pour le moment
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Active Missions */}
            <Card className="card-elevated border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Missions Actives</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/artisan/missions">Voir toutes</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeMissions.length > 0 ? (
                  activeMissions.slice(0, 3).map((mission) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune mission active
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild className="gap-2 rounded-xl">
              <Link to={`/artisan/${currentUser?.id}`}>
                <Eye className="w-4 h-4" /> Voir mon profil public
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={(open) => {
        if (!isUploading) setIsUploadModalOpen(open);
      }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Ajouter des photos au portfolio</DialogTitle>
            <DialogDescription>
               Vous pouvez ajouter jusqu'à {5 - portfolioPhotosList.length} photo(s) supplémentaire(s).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
             <MultiPhotoUpload 
                files={newPhotos} 
                onChange={setNewPhotos} 
                maxFiles={5 - portfolioPhotosList.length} 
             />
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} disabled={isUploading}>
               Annuler
             </Button>
             <Button onClick={handleUploadPhotos} disabled={newPhotos.length === 0 || isUploading} className="bg-primary text-primary-foreground">
               {isUploading ? "Enregistrement..." : "Enregistrer les photos"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la photo</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette photo de votre portfolio ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setPhotoToDelete(null)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeletePhoto}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtisanDashboard;