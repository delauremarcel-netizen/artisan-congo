import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, ShieldCheck, User, Briefcase, Calendar, Star, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PortfolioSection from '@/components/PortfolioSection';
import RatingForm from '@/components/RatingForm';
import RatingsList from '@/components/RatingsList';
import WhatsAppButton from '@/components/WhatsAppButton';
import pb from '@/lib/pocketbaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { PLATFORM_PHONE_NUMBER } from '@/lib/whatsappConfig.js';

const ArtisanProfile = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    fetchArtisanData();
    checkReviewEligibility();
  }, [id, currentUser]);

  const fetchArtisanData = async () => {
    setLoading(true);
    try {
      const artisanData = await pb.collection('artisans').getOne(id, { $autoCancel: false });
      setArtisan(artisanData);
    } catch (error) {
      console.error('Error fetching artisan details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    if (!currentUser) return;
    try {
      const quotes = await pb.collection('quotes').getList(1, 1, {
        filter: `artisan_id="${id}" && company_id="${currentUser.id}"`,
        $autoCancel: false
      });
      if (quotes.items.length > 0) {
        setCanReview(true);
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const handleRatingSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <Skeleton className="h-48 w-full mb-8 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center max-w-md">
          <User className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Profil introuvable</h2>
          <p className="text-muted-foreground mb-6">Ce profil d'artisan n'existe pas ou a été supprimé de la plateforme.</p>
          <Button asChild className="w-full rounded-lg">
            <Link to="/artisans">Retour à l'annuaire</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const avatarUrl = artisan.photos && artisan.photos.length > 0 ? pb.files.getUrl(artisan, artisan.photos[0]) : null;
  const rating = artisan.average_overall_rating || 0;
  const servicesList = artisan.services_offered ? artisan.services_offered.split('\n').filter(s => s.trim() !== '') : [];

  return (
    <>
      <Helmet>
        <title>{`${artisan.name} - ${artisan.category || 'Artisan'} | ArtisanCongo`}</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/20">
        <Header />

        <div className="flex-1 pb-20">
          {/* COVER & HEADER SECTION */}
          <div className="bg-slate-950 pt-10 pb-16 relative border-b border-primary/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border-4 border-slate-900 shadow-md relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={artisan.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-500" />
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1 justify-center md:justify-start">
                    <h1 className="text-2xl md:text-3xl font-bold text-white m-0">
                      {artisan.name}
                    </h1>
                    <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 border-none shadow-none flex items-center gap-1.5 px-2.5 py-0.5 w-max mx-auto md:mx-0">
                      <ShieldCheck className="w-3.5 h-3.5" /> Profil Vérifié
                    </Badge>
                  </div>
                  
                  <p className="text-accent font-medium text-lg mb-3">
                    {artisan.category || 'Multi-services'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300 text-sm">
                    <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>{artisan.city || 'Non spécifié'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl -mt-8 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* STATS STRIP */}
                <div className="bg-card rounded-xl p-5 shadow-sm border border-border grid grid-cols-3 divide-x divide-border">
                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-accent mb-1">
                      <Star className="w-5 h-5 fill-accent" />
                    </div>
                    <div className="font-semibold text-xl text-foreground">{rating > 0 ? rating.toFixed(1) : 'N/A'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{artisan.total_ratings || 0} avis</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-primary mb-1">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-xl text-foreground">{artisan.total_ratings || 0}+</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Projets</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-xl text-foreground">{artisan.experience_years || '-'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Années exp.</div>
                  </div>
                </div>

                {/* ABOUT SECTION */}
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Présentation
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {artisan.bio || 'Cet artisan n\'a pas encore ajouté de description à son profil, mais reste disponible pour évaluer vos projets et proposer un travail soigné.'}
                  </p>
                </section>

                {/* SERVICES SECTION */}
                {servicesList.length > 0 && (
                  <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      Prestations
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {servicesList.map((service, index) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-foreground text-sm font-medium">{service.replace(/^[-*•]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* PORTFOLIO SECTION */}
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Réalisations
                  </h2>
                  <PortfolioSection artisanId={id} isOwner={false} />
                </section>

                {/* RATINGS SECTION */}
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">Avis clients</h2>
                  {canReview && (
                    <div className="mb-8">
                      <RatingForm artisanId={id} onSuccess={handleRatingSuccess} />
                    </div>
                  )}
                  <RatingsList key={`list-${refreshTrigger}`} artisanId={id} />
                </section>

              </div>

              {/* RIGHT COLUMN (STICKY) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border text-center overflow-hidden relative">
                    {/* Decorative accent top line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                    
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Travailler avec cet artisan</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Contactez-nous via la plateforme pour demander un devis et garantir la sécurité de votre projet.
                    </p>
                    
                    <div className="space-y-4">
                      <Button 
                        asChild
                        className="w-full rounded-xl h-12 shadow-md text-base font-semibold transition-transform active:scale-[0.98]"
                      >
                        <Link to={`/request-service`}>
                          <FileText className="w-5 h-5 mr-2" />
                          Demander un devis
                        </Link>
                      </Button>

                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground font-medium">Ou contact direct</span>
                        </div>
                      </div>

                      <div className="text-center mb-2">
                        <p className="text-sm text-muted-foreground">
                          WhatsApp:{' '}
                          <a 
                            href={`https://wa.me/${PLATFORM_PHONE_NUMBER.replace('+', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline"
                          >
                            {PLATFORM_PHONE_NUMBER}
                          </a>
                        </p>
                      </div>

                      <WhatsAppButton 
                        serviceType={artisan.category}
                        location={artisan.city}
                        isFloatingMobile={true}
                        className="w-full"
                        targetPhoneNumber={PLATFORM_PHONE_NUMBER}
                      >
                        Contacter sur WhatsApp
                      </WhatsAppButton>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ArtisanProfile;