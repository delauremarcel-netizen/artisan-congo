import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Briefcase, Calendar, MapPin, DollarSign, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const DemanderMissionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    location: ''
  });
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour demander une mission.');
      navigate('/artisan-login');
      return;
    }

    const fetchArtisan = async () => {
      try {
        const record = await pb.collection('artisan_profiles').getOne(id, { $autoCancel: false });
        setArtisan(record);
      } catch (err) {
        console.error(err);
        toast.error('Artisan introuvable.');
        navigate('/artisans');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 5) {
      toast.error('Vous ne pouvez sélectionner que 5 photos maximum.');
      e.target.value = '';
      return;
    }
    
    // Check file sizes (max 5MB)
    const filesArray = Array.from(e.target.files);
    const oversizedFile = filesArray.find(file => file.size > 5 * 1024 * 1024);
    
    if (oversizedFile) {
      toast.error('Chaque photo ne doit pas dépasser 5MB.');
      e.target.value = '';
      return;
    }

    setPhotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.title.trim().length < 5) {
      toast.error('Le titre doit contenir au moins 5 caractères.');
      return;
    }

    if (formData.description.trim().length < 20) {
      toast.error('La description doit contenir au moins 20 caractères.');
      return;
    }
    
    if (formData.budget && Number(formData.budget) < 1000) {
      toast.error('Le budget minimum est de 1 000 FCFA.');
      return;
    }

    const selectedDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

    if (selectedDate <= today) {
      toast.error('La date souhaitée doit être dans le futur.');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('artisanId', artisan.id);
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('budget', Number(formData.budget));
      submitData.append('deadline', formData.deadline);
      submitData.append('location', formData.location.trim());
      
      if (photos) {
        Array.from(photos).forEach(file => {
          submitData.append('photos', file);
        });
      }

      // We use apiServerClient which proxies to the Express backend (/hcgi/api/...)
      const response = await apiServerClient.fetch('/missions/create', {
        method: 'POST',
        // DO NOT set Content-Type header when sending FormData; the browser sets the correct multipart boundary automatically
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la mission');
      }

      toast.success('Votre demande de mission a été envoyée avec succès !');
      navigate('/client/missions');
      
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error(err.message || 'Une erreur de communication avec le serveur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Demander une mission | ArtisanCongo</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-8 -ml-4 rounded-xl text-muted-foreground hover:text-foreground">
          <Link to={`/artisans/${id}`} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>
        </Button>

        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="bg-primary/5 p-6 md:p-8 border-b border-border">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight">
              Demander une mission à {artisan?.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 font-medium">
              <Briefcase className="w-4 h-4 text-primary" /> {artisan?.category}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">Titre de la mission <span className="text-destructive">*</span></Label>
              <Input 
                id="title" name="title" required
                value={formData.title} onChange={handleChange}
                placeholder="Ex: Rénovation de salle de bain"
                className="h-12 rounded-xl bg-background"
                minLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">Description détaillée <span className="text-destructive">*</span></Label>
              <Textarea 
                id="description" name="description" required
                value={formData.description} onChange={handleChange}
                placeholder="Décrivez votre besoin en détail (minimum 20 caractères)..."
                className="min-h-[150px] rounded-xl bg-background resize-y"
                minLength={20}
              />
              <p className="text-xs text-muted-foreground text-right">{formData.description.length} caractères</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-base font-semibold">Budget estimé (FCFA) <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="budget" name="budget" type="number" required min="1000"
                    value={formData.budget} onChange={handleChange}
                    placeholder="Ex: 50000"
                    className="h-12 pl-10 rounded-xl bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-base font-semibold">Date d'intervention souhaitée <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="deadline" name="deadline" type="date" required
                    value={formData.deadline} onChange={handleChange}
                    className="h-12 pl-10 rounded-xl bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold">Localisation exacte <span className="text-destructive">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="location" name="location" required
                  value={formData.location} onChange={handleChange}
                  placeholder="Ex: Quartier Ouenze, Rue Mboussa"
                  className="h-12 pl-10 rounded-xl bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photos" className="text-base font-semibold">Photos du projet (Optionnel)</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 bg-background text-center hover:bg-muted/50 transition-colors">
                <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <Input 
                  id="photos" name="photos" type="file" multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="photos" className="cursor-pointer text-primary font-medium hover:underline">
                  Cliquez pour ajouter des photos
                </Label>
                <p className="text-sm text-muted-foreground mt-2">Maximum 5 fichiers (JPG, PNG, WEBP), max 5MB chacun.</p>
                
                {photos && photos.length > 0 && (
                  <div className="mt-4 text-sm font-medium text-foreground bg-primary/5 py-2 px-4 rounded-lg inline-block">
                    {photos.length} fichier(s) sélectionné(s)
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full h-14 text-lg font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours...</>
                ) : (
                  'Envoyer la demande'
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-4">
                Une fois la demande envoyée, l'artisan recevra une notification et vous recontactera avec un devis.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DemanderMissionPage;