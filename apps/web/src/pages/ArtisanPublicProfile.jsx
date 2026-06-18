import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import LeaveReviewModal from '@/components/LeaveReviewModal.jsx';
import CreateMissionModal from '@/components/CreateMissionModal.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft, Share2, MapPin, Briefcase, CheckCircle2,
  AlertCircle, FileText, User, XCircle, Star, PlusCircle, Image as ImageIcon, MessageCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getScoreBgColor, getScoreColor, getStatusBadgeColor, getStatusDisplayText, getBadgeColor, getBadgeDisplayText } from '@/lib/artisanUtils.js';

const ArtisanPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [artisan, setArtisan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const fetchArtisanAndData = async () => {
    try {
      setLoading(true);
      const record = await pb.collection('artisan_profiles').getOne(id, { $autoCancel: false });
      
      if (record.profile_visibility !== 'visible') {
        setError(true);
        setArtisan(null);
      } else {
        // Find auth artisan record to get the profile picture (if attached there)
        let authArtisan = null;
        try {
           authArtisan = await pb.collection('artisans').getOne(record.artisan_id, { $autoCancel: false });
        } catch (e) {
           // Ignore if not found
        }
        
        setArtisan({
          ...record,
          authPhotos: authArtisan?.photos || []
        });
        setError(false);
        
        // Fetch reviews
        const reviewsData = await pb.collection('ratings').getFullList({
          filter: `artisan_id = "${id}"`,
          sort: '-created',
          $autoCancel: false
        }).catch(() => []);
        setReviews(reviewsData);
      }
    } catch (err) {
      console.error('Failed to fetch artisan:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchArtisanAndData();
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Profil de ${artisan?.name} sur ArtisanCongo`,
          text: `Découvrez le profil de cet artisan : ${artisan?.category}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien du profil copié dans le presse-papier');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe left (next)
    if (diff > 50) {
      nextPhoto();
    }
    // Swipe right (prev)
    if (diff < -50) {
      prevPhoto();
    }
    setTouchStart(null);
  };

  const nextPhoto = () => {
    if (!artisan?.portfolio_photos) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % artisan.portfolio_photos.length);
  };

  const prevPhoto = () => {
    if (!artisan?.portfolio_photos) return;
    setSelectedPhotoIndex((prev) => (prev - 1 + artisan.portfolio_photos.length) % artisan.portfolio_photos.length);
  };

  const openLightbox = (index) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20 pt-20">
        <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
          <Skeleton className="h-10 w-24 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-48 w-full rounded-3xl" />
              <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20 pt-20">
        <main className="flex-grow flex items-center justify-center p-4 text-center">
          <div className="bg-card p-10 rounded-3xl shadow-sm border border-border max-w-md w-full">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl font-bold tracking-tight mb-3">Profil introuvable</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Ce profil n'existe pas ou a été désactivé par l'artisan.
            </p>
            <Button onClick={() => navigate('/search')} size="lg" className="w-full rounded-xl">
              Rechercher un autre artisan
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isAvailable = artisan.availability === true;
  const portfolioPhotos = artisan.portfolio_photos || [];

  return (
    <>
      <Helmet>
        <title>{`${artisan.name} - ${artisan.category || 'Artisan'} | ArtisanCongo`}</title>
        <meta name="description" content={artisan.bio ? artisan.bio.substring(0, 160) : `Découvrez le profil de ${artisan.name}, expert en ${artisan.category}.`} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/20 selection:bg-primary/20 pt-[80px]">
        <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-background rounded-full -ml-2 text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="rounded-full bg-card border-border/60">
              <Share2 className="w-4 h-4 mr-2 text-muted-foreground" /> Partager
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Profile Card */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[112px]">
              <Card className="overflow-hidden border border-border/50 shadow-sm rounded-3xl">
                <div className="aspect-square bg-muted relative group">
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-primary/5">
                    {artisan.authPhotos && artisan.authPhotos.length > 0 ? (
                      <img 
                        src={pb.files.getUrl({ collectionId: 'pbc_1048899041', id: artisan.artisan_id }, artisan.authPhotos[0], { thumb: '600x600' })} 
                        alt={artisan.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="w-20 h-20 opacity-30 mb-4" />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-6 md:p-8 bg-card">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                    {artisan.name}
                  </h1>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {isAvailable ? (
                      <Badge className="badge-success bg-green-500/10 text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Disponible
                      </Badge>
                    ) : (
                      <Badge className="badge-neutral">
                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> Indisponible
                      </Badge>
                    )}
                    {artisan.statut_artisan && (
                      <Badge className={`capitalize ${getStatusBadgeColor(artisan.statut_artisan)}`}>{getStatusDisplayText(artisan.statut_artisan)}</Badge>
                    )}
                    {artisan.badge && (
                      <Badge className={getBadgeColor(artisan.badge)}>{getBadgeDisplayText(artisan.badge)}</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-foreground font-medium">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span>{artisan.category || 'Métier non défini'}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-5 h-5 mr-3 shrink-0" />
                      <span>{artisan.city || 'Localisation non renseignée'}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Star className="w-5 h-5 mr-3 text-yellow-500 fill-yellow-500 shrink-0" />
                      <span>
                        <span className="font-bold text-foreground mr-1">{artisan.rating_average?.toFixed(1) || '0.0'}</span> 
                        ({artisan.reviews_count || 0} avis)
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <div className={`w-5 h-5 mr-3 shrink-0 rounded-full flex items-center justify-center ${getScoreBgColor(artisan.score_global || 0)}`}>
                        <span className={`text-[10px] font-bold ${getScoreColor(artisan.score_global || 0)}`}>{artisan.score_global || 0}</span>
                      </div>
                      <span>Score de confiance</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      size="lg" 
                      className="w-full font-bold rounded-xl h-14 text-base"
                      onClick={() => setIsMissionModalOpen(true)}
                    >
                      Demander un devis
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full font-bold rounded-xl h-14 text-base"
                      onClick={() => {
                        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Voir les avis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Centralized WhatsApp Contact Section */}
              <Card className="border-border/50 bg-[#25D366]/5 rounded-3xl shadow-sm">
                <CardContent className="p-6 md:p-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#25D366]/20 flex items-center justify-center mb-4">
                    <MessageCircle className="w-7 h-7 text-[#25D366]" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-2">Contacter cet artisan</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-[250px]">
                    Contactez via WhatsApp pour une meilleure prise en charge. Artisan Congo vous mettra en relation.
                  </p>
                  <WhatsAppButton 
                    artisan={artisan} 
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl h-14 text-base shadow-sm transition-all"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              {/* Bio Section */}
              <section className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" /> Présentation
                </h2>
                {artisan.bio ? (
                  <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-lg">
                    {artisan.bio}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic bg-muted/40 rounded-2xl p-6 border border-border/50">
                    Aucune description renseignée.
                  </p>
                )}
                
                <Separator className="my-8" />
                
                <h3 className="text-lg font-bold mb-4">Services détaillés</h3>
                {artisan.services_offered ? (
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap bg-muted/20 p-6 rounded-2xl border border-border/50">
                    {artisan.services_offered}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">Non spécifié.</p>
                )}
              </section>

              {/* Portfolio Photos Section */}
              <section className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <ImageIcon className="w-6 h-6 text-primary" /> Portfolio
                  </h2>
                  {portfolioPhotos.length > 0 && (
                    <Badge variant="secondary" className="rounded-full">
                      {portfolioPhotos.length} photos
                    </Badge>
                  )}
                </div>

                {portfolioPhotos.length === 0 ? (
                  <div className="text-center py-12 bg-muted/20 rounded-2xl border border-border/50 border-dashed">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground max-w-md mx-auto mb-2">
                      Cet artisan n'a pas encore ajouté de photos de ses réalisations.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {portfolioPhotos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="group relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer"
                        onClick={() => openLightbox(index)}
                      >
                        <img 
                          src={pb.files.getUrl(artisan, photo, { thumb: '400x400' })} 
                          alt={`Réalisation ${index + 1} de ${artisan.name}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Reviews Section */}
              <section id="reviews-section" className="bg-card rounded-3xl p-8 shadow-sm border border-border/50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                    <Star className="w-6 h-6 text-primary fill-primary" /> Avis clients ({reviews.length})
                  </h2>
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => setIsReviewModalOpen(true)}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Laisser un avis
                  </Button>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-muted/20 rounded-2xl border border-border/50 border-dashed">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-bold text-lg mb-2">Aucun avis</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Cet artisan n'a pas encore reçu d'avis. Soyez le premier à partager votre expérience !
                    </p>
                    <Button onClick={() => setIsReviewModalOpen(true)} className="rounded-xl">
                      Publier un avis
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="p-6 rounded-2xl border border-border/50 bg-background/50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-bold text-foreground">Utilisateur vérifié</p>
                            <p className="text-sm text-muted-foreground">{new Date(review.created).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full">
                            <span className="font-bold text-foreground">{review.rating}</span>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          </div>
                        </div>
                        {review.review_text && (
                          <p className="text-foreground/80 leading-relaxed italic">"{review.review_text}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>

      <CreateMissionModal 
        isOpen={isMissionModalOpen} 
        onClose={() => setIsMissionModalOpen(false)} 
        artisanId={artisan.id}
        prefillCategory={artisan.category}
      />
      
      <LeaveReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        artisanId={artisan.id}
        artisanName={artisan.name}
        onReviewSubmitted={fetchArtisanAndData}
      />

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl bg-black/95 p-0 border-none rounded-none shadow-none h-auto max-h-[90vh] flex flex-col justify-center">
          {portfolioPhotos.length > 0 && (
            <div 
              className="relative w-full h-full min-h-[50vh] flex items-center justify-center outline-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={pb.files.getUrl(artisan, portfolioPhotos[selectedPhotoIndex])} 
                alt="Réalisation grand format"
                className="max-w-full max-h-[85vh] object-contain select-none"
              />
              
              {portfolioPhotos.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
                {selectedPhotoIndex + 1} / {portfolioPhotos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtisanPublicProfile;