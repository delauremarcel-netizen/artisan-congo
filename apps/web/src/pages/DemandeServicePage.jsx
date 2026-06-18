
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchArtisan, createDemande } from '@/lib/api.js';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient';

const PROFESSIONS = [
  'Maçon', 'Plombier', 'Électricien', 'Peintre', 'Carreleur', 'Soudeur', 
  'Menuisier bois', 'Menuisier aluminium', 'Frigoriste', 'Climaticien', 
  'Mécanicien automobile', 'Réparateur électroménager', 'Jardinier', 
  'Femme de ménage', 'Agent de sécurité', 'Informaticien', 'Photographe', 
  'Traiteur', 'Couturier', 'Homme à tout faire'
];

export default function DemandeServicePage() {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  
  const [artisan, setArtisan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    metier: '',
    description: '',
    localisation: '',
    montantEstime: ''
  });

  useEffect(() => {
    const loadArtisan = async () => {
      try {
        const data = await fetchArtisan(artisanId);
        setArtisan(data);
        setFormData(prev => ({ ...prev, metier: data.metier }));
      } catch (err) {
        setError('Artisan introuvable');
      } finally {
        setIsLoading(false);
      }
    };
    loadArtisan();
  }, [artisanId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.description.length > 1000) {
      setError('La description ne peut pas dépasser 1000 caractères');
      return;
    }
    
    if (!formData.montantEstime || formData.montantEstime <= 0) {
      setError('Veuillez entrer un montant estimé valide');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createDemande(
        artisanId,
        formData.metier,
        formData.description,
        formData.localisation,
        Number(formData.montantEstime)
      );
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard-client');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-muted/20">
        <header className="p-4 border-b bg-background">
          <Skeleton className="h-6 w-32" />
        </header>
        <div className="max-w-3xl mx-auto p-4 mt-8 space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !artisan) {
    return (
      <div className="min-h-[100dvh] bg-muted/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4 text-destructive">Erreur</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/search">
            <Button>Retour à la recherche</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-muted/20">
      <header className="p-4 border-b bg-background sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-4 mt-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Demander un service à {artisan?.expand?.userId?.nom || 'cet artisan'}</h1>
          <p className="text-muted-foreground">Remplissez le formulaire ci-dessous pour envoyer votre demande</p>
        </div>

        {/* Artisan Profile Card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-xl bg-accent overflow-hidden shrink-0">
              {artisan?.photo ? (
                <img src={pb.files.getURL(artisan, artisan.photo)} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-accent-foreground font-bold text-2xl">
                  {artisan?.metier?.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{artisan?.metier}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {artisan?.localisation}</span>
                {artisan?.avisNote > 0 && (
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Star className="w-4 h-4 fill-current" /> {artisan.avisNote.toFixed(1)} ({artisan.nombreAvis || 0} avis)
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Request Form */}
        <Card className="p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Demande envoyée avec succès</h3>
              <p className="text-muted-foreground">Redirection vers votre tableau de bord...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="metier">Métier demandé</Label>
                <Select value={formData.metier} onValueChange={(value) => setFormData({...formData, metier: value})}>
                  <SelectTrigger id="metier">
                    <SelectValue placeholder="Sélectionnez un métier" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map(prof => (
                      <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée du besoin</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Décrivez précisément ce que vous attendez..."
                  className="min-h-[150px] resize-none"
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.description.length}/1000 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Lieu d'intervention</Label>
                <Input
                  id="localisation"
                  type="text"
                  value={formData.localisation}
                  onChange={(e) => setFormData({...formData, localisation: e.target.value})}
                  placeholder="Adresse complète ou quartier"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="montantEstime">Budget estimé (FCFA)</Label>
                <Input
                  id="montantEstime"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.montantEstime}
                  onChange={(e) => setFormData({...formData, montantEstime: e.target.value})}
                  placeholder="Ex: 50000"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#16A34A] hover:bg-[#16A34A]/90 text-white py-6 text-base font-semibold"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
              </Button>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}
