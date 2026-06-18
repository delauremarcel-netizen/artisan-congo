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

const MissionRequestPage = () => {
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

  useEffect(() => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour demander une mission.');
      navigate('/login');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.description.length < 20) {
      toast.error('La description doit contenir au moins 20 caractères.');
      return;
    }
    
    if (formData.budget && (Number(formData.budget) < 1000 || Number(formData.budget) > 10000000)) {
      toast.error('Le budget doit être compris entre 1 000 et 10 000 000 FCFA.');
      return;
    }

    const selectedDate = new Date(formData.deadline);
    if (selectedDate < new Date()) {
      toast.error('La date souhaitée doit être dans le futur.');
      return;
    }

    setSubmitting(true);

    try {
      // Call backend API to create mission
      const response = await apiServerClient.fetch('/project-requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artisanId: artisan.id,
          title: formData.title,
          description: formData.description,
          budget: Number(formData.budget),
          deadline: formData.deadline,
          location: formData.location,
          category: artisan.category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la mission');
      }

      toast.success('Votre demande de mission a été envoyée avec succès !');
      navigate('/client/missions');
      
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Demander une mission | ArtisanCongo</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-8 -ml-4 rounded-xl">
          <Link to={`/artisans/${id}`} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>
        </Button>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-primary/5 p-8 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Demander une mission à {artisan?.name}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {artisan?.category}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">Titre de la mission <span className="text-red-500">*</span></Label>
              <Input 
                id="title" name="title" required
                value={formData.title} onChange={handleChange}
                placeholder="Ex: Réparation fuite d'eau salle de bain"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">Description détaillée <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" name="description" required
                value={formData.description} onChange={handleChange}
                placeholder="Décrivez votre besoin en détail (minimum 20 caractères)..."
                className="min-h-[150px] rounded-xl resize-y"
              />
              <p className="text-xs text-gray-500 text-right">{formData.description.length} caractères</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-base font-semibold">Budget estimé (FCFA) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    id="budget" name="budget" type="number" required min="1000"
                    value={formData.budget} onChange={handleChange}
                    placeholder="Ex: 50000"
                    className="h-12 pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-base font-semibold">Date souhaitée <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    id="deadline" name="deadline" type="date" required
                    value={formData.deadline} onChange={handleChange}
                    className="h-12 pl-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold">Localisation exacte <span className="text-red-500">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  id="location" name="location" required
                  value={formData.location} onChange={handleChange}
                  placeholder="Ex: Quartier Poto-Poto, Rue des Martyrs"
                  className="h-12 pl-10 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full h-14 text-lg font-bold rounded-xl shadow-md"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours...</>
                ) : (
                  'Envoyer la demande'
                )}
              </Button>
              <p className="text-sm text-center text-gray-500 mt-4">
                L'artisan recevra une notification et vous contactera rapidement.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MissionRequestPage;