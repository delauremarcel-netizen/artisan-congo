import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  LogOut, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ArtisanProfileViewPage = () => {
  const { currentArtisan, artisanLogout } = useAuth();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const record = await pb.collection('artisans').getOne(currentArtisan.id, { $autoCancel: false });
        setArtisan(record);
      } catch (error) {
        console.error('Failed to fetch artisan profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentArtisan?.id) {
      fetchProfile();
    }
  }, [currentArtisan?.id]);

  const handleLogout = () => {
    artisanLogout();
    navigate('/artisan-login');
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Validé':
        return {
          color: 'bg-green-500/10 text-green-700 border-green-500/20',
          icon: <CheckCircle2 className="w-4 h-4 mr-1.5" />
        };
      case 'Suspendu':
        return {
          color: 'bg-red-500/10 text-red-700 border-red-500/20',
          icon: <XCircle className="w-4 h-4 mr-1.5" />
        };
      case 'Supprimé':
        return {
          color: 'bg-red-500/10 text-red-700 border-red-500/20',
          icon: <AlertCircle className="w-4 h-4 mr-1.5" />
        };
      default: // En attente
        return {
          color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
          icon: <Clock className="w-4 h-4 mr-1.5" />
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col pt-20">
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pb-32 space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="w-24 h-24 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl md:col-span-2" />
          </div>
        </main>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 text-center pt-20">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Profil introuvable</h1>
        <p className="text-muted-foreground mb-6">Nous n'avons pas pu charger vos informations.</p>
        <Button onClick={() => navigate('/artisan-dashboard')}>Retour au tableau de bord</Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(artisan.status);
  const photoUrl = artisan.photos && artisan.photos.length > 0 
    ? pb.files.getUrl(artisan, artisan.photos[0]) 
    : null;

  return (
    <>
      <Helmet>
        <title>Mon Profil - ArtisanCongo</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 flex flex-col relative pt-20">
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 pb-32 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0 shadow-inner">
              {photoUrl ? (
                <img src={photoUrl} alt={`Profil de ${artisan.name}`} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground/50" />
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{artisan.name}</h1>
                <p className="text-lg text-muted-foreground font-medium flex items-center gap-2 mt-1">
                  <Briefcase className="w-5 h-5" />
                  {artisan.category || 'Métier non spécifié'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`border ${statusConfig.color} flex items-center px-3 py-1 text-sm`}>
                  {statusConfig.icon}
                  {artisan.status || 'En attente'}
                </Badge>
                {artisan.subscription_status === 'active' && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent px-3 py-1 text-sm">
                    Abonnement Actif
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="border-border/50 shadow-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground break-all">{artisan.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Téléphone</p>
                    <p className="text-sm text-muted-foreground">{artisan.phone || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Ville d'intervention</p>
                    <p className="text-sm text-muted-foreground">{artisan.city || 'Non renseignée'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-border/50 shadow-sm h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Informations Professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Métier Principal</p>
                    <p className="text-sm text-muted-foreground">{artisan.category || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Expérience</p>
                    <p className="text-sm text-muted-foreground">
                      {artisan.experience_years ? `${artisan.experience_years} an(s)` : 'Non renseignée'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Date d'inscription</p>
                    <p className="text-sm text-muted-foreground">
                      {artisan.created ? format(new Date(artisan.created), 'dd MMMM yyyy', { locale: fr }) : 'Inconnue'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biography & Services */}
            <Card className="border-border/50 shadow-sm md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Présentation & Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">À propos de moi</h3>
                  <div className="bg-muted/30 p-4 rounded-xl text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {artisan.bio || <span className="italic opacity-70">Aucune description fournie.</span>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Services proposés détaillés</h3>
                  <div className="bg-muted/30 p-4 rounded-xl text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {artisan.services_offered || <span className="italic opacity-70">Aucun service détaillé fourni.</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Sticky Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/60 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/artisan-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour au tableau de bord
              </Link>
            </Button>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button variant="ghost" onClick={handleLogout} className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" /> Déconnexion
              </Button>
              <Button variant="secondary" asChild className="w-full sm:w-auto">
                <Link to="/artisan-quotes">
                  <FileText className="w-4 h-4 mr-2" /> Voir les devis
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link to="/artisan-profile">
                  <Edit className="w-4 h-4 mr-2" /> Modifier le profil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtisanProfileViewPage;