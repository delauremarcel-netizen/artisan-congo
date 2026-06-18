
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createAvis } from '@/lib/api.js';
import { formatMontant } from '@/lib/format.js';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AvisPage() {
  const { demandeId } = useParams();
  const navigate = useNavigate();
  
  const [demande, setDemande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [note, setNote] = useState(0);
  const [hoveredNote, setHoveredNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');

  useEffect(() => {
    const loadDemande = async () => {
      try {
        const record = await pb.collection('demandes').getOne(demandeId, {
          expand: 'artisanId,artisanId.userId',
          $autoCancel: false
        });
        setDemande(record);
      } catch (err) {
        setError('Demande introuvable');
      } finally {
        setIsLoading(false);
      }
    };
    loadDemande();
  }, [demandeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (note < 1 || note > 5) {
      setError('Veuillez sélectionner une note entre 1 et 5 étoiles');
      return;
    }
    
    if (!commentaire.trim()) {
      setError('Veuillez ajouter un commentaire');
      return;
    }
    
    if (commentaire.length > 500) {
      setError('Le commentaire ne peut pas dépasser 500 caractères');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await createAvis(demandeId, note, commentaire);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard-client');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'avis');
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
        <div className="max-w-2xl mx-auto p-4 mt-8 space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !demande) {
    return (
      <div className="min-h-[100dvh] bg-muted/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4 text-destructive">Erreur</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/dashboard-client">
            <Button>Retour au tableau de bord</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const artisan = demande?.expand?.artisanId;
  const artisanUser = artisan?.expand?.userId;
  const artisanName = artisanUser?.nom || 'Artisan';

  return (
    <div className="min-h-[100dvh] bg-muted/20">
      <header className="p-4 border-b bg-background sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Laisser un avis pour {artisanName}</h1>
          <p className="text-muted-foreground">Partagez votre expérience avec cet artisan</p>
        </div>

        {/* Artisan & Service Summary */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-6 pb-6 border-b">
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
              <h3 className="text-xl font-bold mb-1">{artisanName}</h3>
              <p className="text-primary font-medium mb-2">{artisan?.metier}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium text-right max-w-xs line-clamp-2">{demande?.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Montant</span>
              <span className="font-semibold">{formatMontant(demande?.montantEstime)}</span>
            </div>
          </div>
        </Card>

        {/* Review Form */}
        <Card className="p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Avis publié avec succès</h3>
              <p className="text-muted-foreground">Merci pour votre retour. Redirection...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-semibold block">Votre note</label>
                <div className="flex gap-2 justify-center py-4">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setNote(starValue)}
                      onMouseEnter={() => setHoveredNote(starValue)}
                      onMouseLeave={() => setHoveredNote(0)}
                      className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                    >
                      <Star
                        className={`w-12 h-12 transition-colors ${
                          starValue <= (hoveredNote || note)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted stroke-2'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {note > 0 && (
                  <p className="text-center text-sm font-medium text-primary">
                    {note === 1 && 'Très insatisfait'}
                    {note === 2 && 'Insatisfait'}
                    {note === 3 && 'Moyen'}
                    {note === 4 && 'Satisfait'}
                    {note === 5 && 'Très satisfait'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="commentaire" className="text-sm font-semibold block">
                  Votre commentaire
                </label>
                <Textarea
                  id="commentaire"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Partagez votre expérience avec cet artisan..."
                  className="min-h-[150px] resize-none"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  {commentaire.length}/500 caractères
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || note === 0}
                className="w-full bg-[#16A34A] hover:bg-[#16A34A]/90 text-white py-6 text-base font-semibold"
              >
                {isSubmitting ? 'Publication en cours...' : 'Publier mon avis'}
              </Button>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}
