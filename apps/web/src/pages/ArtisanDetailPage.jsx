import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, ArrowLeft, CheckCircle2, XCircle, Phone, Mail, Globe, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ArtisanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        // Fetch from artisan_profiles collection
        const record = await pb.collection('artisan_profiles').getOne(id, { $autoCancel: false });
        
        if (record.profile_visibility !== 'visible') {
          setError(true);
          setArtisan(null);
        } else {
          setArtisan(record);
          setError(false);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-square rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Artisan introuvable</h2>
        <p className="text-muted-foreground mb-8">Ce profil n'existe pas ou a été retiré.</p>
        <Button asChild className="rounded-xl">
          <Link to="/artisans">Retour à la recherche</Link>
        </Button>
      </div>
    );
  }

  const isAvailable = artisan.availability === true;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEOHead title={`${artisan.name} - ${artisan.category} | ArtisanCongo`} />
      
      <Button variant="ghost" asChild className="mb-8 -ml-4 rounded-xl">
        <Link to="/artisans" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </Button>

      <div className="bg-card rounded-3xl p-6 md:p-10 shadow-lg border border-border flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3 shrink-0">
          <div className="aspect-square rounded-2xl bg-muted overflow-hidden flex items-center justify-center relative shadow-inner">
            <div className="text-6xl font-bold text-muted-foreground/30">
              {artisan.name.charAt(0)}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground tracking-tight">{artisan.name}</h1>
              <p className="text-xl text-primary font-medium mb-3">{artisan.category}</p>
              
              <div className="flex items-center gap-3">
                {isAvailable ? (
                  <Badge variant="default" className="font-medium bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Disponible
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-medium">
                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Non disponible
                  </Badge>
                )}
                {artisan.statut_artisan === 'certifie' && (
                  <Badge variant="outline" className="font-medium border-primary text-primary bg-primary/5">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Certifié
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-muted-foreground mb-8 mt-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary/70" />
              <span className="font-medium">{artisan.city}</span>
            </div>
            {artisan.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary/70" />
                <a href={`tel:${artisan.phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">
                  {artisan.phone}
                </a>
              </div>
            )}
            {artisan.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary/70" />
                <a href={`mailto:${artisan.email}`} className="hover:text-primary transition-colors">
                  {artisan.email}
                </a>
              </div>
            )}
          </div>

          <div className="prose prose-sm max-w-none mb-8">
            <h3 className="text-lg font-bold mb-2 text-foreground">À propos</h3>
            <p className="text-muted-foreground leading-relaxed">
              {artisan.bio || "Cet artisan n'a pas encore ajouté de description."}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-border flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate(`/artisans/${artisan.id}/demande-mission`)}
              disabled={!currentUser}
              className="flex-1 h-12 text-base rounded-xl font-semibold shadow-md"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              {currentUser ? 'Demander une mission' : 'Connectez-vous pour demander une mission'}
            </Button>
            
            <WhatsAppButton 
              phone={artisan.phone}
              message={`Bonjour ${artisan.name}, je suis intéressé par vos services de ${artisan.category}. Pouvez-vous me donner plus d'informations ?`}
              artisanId={artisan.id}
              className="flex-1 h-12 text-base bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold shadow-md"
            />
          </div>
          
          {!currentUser && (
            <p className="text-sm text-center text-muted-foreground mt-4">
              Vous n'avez pas de compte ? <Link to="/client-signup" className="text-primary hover:underline font-medium">Inscrivez-vous ici</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanDetailPage;