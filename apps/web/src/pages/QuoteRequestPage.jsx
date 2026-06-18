import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Loader2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

const CATEGORIES = ['Électricité', 'Plomberie', 'Menuiserie', 'Peinture', 'Maçonnerie', 'Climatisation', 'Autre'];
const BUDGET_RANGES = ['< 100,000 FC', '100,000 - 500,000 FC', '500,000 - 1,000,000 FC', '> 1,000,000 FC'];
const TIMELINES = ['Urgent (Moins de 48h)', '1-2 semaines', '1 mois', 'Flexible'];

const QuoteRequestPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    category: '',
    budget_range: '',
    timeline: '',
    location: '',
    contact_name: '',
    contact_phone: '',
    contact_email: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        contact_name: currentUser.name || '',
        contact_email: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour soumettre une demande de devis.');
      navigate('/artisan-login', { state: { returnTo: '/demande-devis' } });
      return;
    }

    try {
      setLoading(true);
      
      // Calculate a preferred date based on timeline (rough estimate for the required field)
      const preferredDate = new Date();
      if (formData.timeline.includes('Urgent')) preferredDate.setDate(preferredDate.getDate() + 2);
      else if (formData.timeline.includes('semaine')) preferredDate.setDate(preferredDate.getDate() + 14);
      else preferredDate.setDate(preferredDate.getDate() + 30);

      const requestData = {
        ...formData,
        user_id: currentUser.id,
        status: 'En attente',
        preferred_date: preferredDate.toISOString()
      };

      await pb.collection('quote_requests').create(requestData, { $autoCancel: false });
      
      toast.success('Votre demande de devis a été envoyée avec succès !');
      navigate('/mes-demandes-devis');
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Une erreur est survenue lors de l\'envoi de votre demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <SEOHead 
        title="Demander un devis | ArtisanCongo" 
        description="Décrivez votre projet et recevez des devis gratuits de la part d'artisans qualifiés au Congo."
      />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            Demander un devis gratuit
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto text-balance">
            Décrivez votre besoin en quelques clics. Nous transmettons votre demande aux meilleurs artisans de votre région.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-10">
          
          {!isAuthenticated && (
            <div className="mb-8 p-4 bg-secondary/20 border border-secondary/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-secondary" />
                <p className="text-sm font-medium text-foreground">Connectez-vous pour suivre vos demandes de devis.</p>
              </div>
              <Button asChild variant="secondary" size="sm" className="shrink-0">
                <Link to="/artisan-login">Se connecter</Link>
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Project Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                <FileText className="w-5 h-5 text-primary" /> 1. Votre projet
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="service_type">Titre du projet <span className="text-destructive">*</span></Label>
                <Input
                  id="service_type"
                  name="service_type"
                  placeholder="Ex: Rénovation complète de salle de bain"
                  value={formData.service_type}
                  onChange={handleChange}
                  required
                  className="text-foreground bg-background"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie de métier <span className="text-destructive">*</span></Label>
                  <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)} required>
                    <SelectTrigger className="bg-background text-foreground">
                      <SelectValue placeholder="Sélectionnez un métier" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Délai souhaité <span className="text-destructive">*</span></Label>
                  <Select value={formData.timeline} onValueChange={(val) => handleSelectChange('timeline', val)} required>
                    <SelectTrigger className="bg-background text-foreground">
                      <SelectValue placeholder="Quand souhaitez-vous commencer ?" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINES.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez votre besoin avec le plus de détails possible (dimensions, matériaux souhaités, contraintes particulières...)"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="text-foreground bg-background resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget_range">Budget estimé <span className="text-destructive">*</span></Label>
                  <Select value={formData.budget_range} onValueChange={(val) => handleSelectChange('budget_range', val)} required>
                    <SelectTrigger className="bg-background text-foreground">
                      <SelectValue placeholder="Sélectionnez une fourchette" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map(range => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ville / Quartier <span className="text-destructive">*</span></Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Ex: Kinshasa, Gombe"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="text-foreground bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-6 pt-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> 2. Vos coordonnées
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Nom complet <span className="text-destructive">*</span></Label>
                  <Input
                    id="contact_name"
                    name="contact_name"
                    placeholder="Votre nom"
                    value={formData.contact_name}
                    onChange={handleChange}
                    required
                    className="text-foreground bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Téléphone <span className="text-destructive">*</span></Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    placeholder="Ex: +243 81 000 0000"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    required
                    className="text-foreground bg-background"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contact_email">Adresse email <span className="text-destructive">*</span></Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={formData.contact_email}
                    onChange={handleChange}
                    required
                    className="text-foreground bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl" disabled={loading || !isAuthenticated}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer ma demande
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Vos coordonnées ne seront partagées qu'avec les artisans intéressés par votre projet.
              </p>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};

export default QuoteRequestPage;