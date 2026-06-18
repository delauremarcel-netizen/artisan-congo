import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';

const SERVICES = [
  'Plomberie', 'Électricité', 'Menuiserie', 'Maçonnerie', 
  'Peinture', 'Carrelage', 'Chauffage', 'Climatisation', 
  'Serrurerie', 'Vitrerie', 'Autre'
];

const LOCATIONS = ['Pointe-Noire', 'Brazzaville', 'Autre'];

const ServiceRequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);

  const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    location: '',
    budget: '',
    client_name: '',
    client_phone: '',
    client_email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestId = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;

      const data = {
        request_id: requestId,
        service_type: formData.service_type,
        description: formData.description,
        location: formData.location,
        budget: formData.budget ? Number(formData.budget) : null,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        client_email: formData.client_email,
        status: 'nouvelle'
      };

      await pb.collection('service_requests').create(data, { $autoCancel: false });
      
      setSuccessId(requestId);
      toast.success('Votre demande a été envoyée avec succès.');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successId) {
    const whatsAppMessage = `Bonjour, j'ai soumis la demande ${successId} pour un artisan en ${formData.service_type} à ${formData.location}. Pouvez-vous me confirmer la réception ?`;

    return (
      <div className="min-h-screen flex flex-col bg-muted/20">
        <Helmet><title>Demande envoyée | ArtisanCongo</title></Helmet>
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 py-12">
          <div className="bg-card max-w-lg w-full rounded-2xl shadow-xl border border-border p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">Demande envoyée !</h1>
            <p className="text-muted-foreground mb-6">
              Votre demande a bien été enregistrée. Notre équipe va l'analyser et vous mettre en relation avec l'artisan idéal.
            </p>
            
            <div className="bg-muted rounded-xl p-5 mb-8 border border-border">
              <p className="text-sm font-medium text-muted-foreground mb-1">Numéro de suivi de votre demande</p>
              <p className="text-2xl font-mono font-extrabold text-primary">{successId}</p>
            </div>

            <div className="space-y-4">
              <WhatsAppButton 
                customMessage={whatsAppMessage}
                className="w-full"
                isFloatingMobile={true}
              >
                Suivre ma demande sur WhatsApp
              </WhatsAppButton>

              <Button asChild variant="outline" className="w-full h-11 text-base rounded-xl border-border">
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Helmet><title>Demander un devis | ArtisanCongo</title></Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <Button asChild variant="ghost" className="mb-6 -ml-4 hover:bg-primary/5 hover:text-primary">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</Link>
        </Button>

        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border p-6 md:p-8 flex items-start gap-4">
            <div className="bg-primary/20 p-3 rounded-xl hidden sm:block">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Demander un devis</h1>
              <p className="text-muted-foreground">
                Détaillez votre besoin. Nous nous occupons de trouver l'expert qualifié pour votre projet en toute sécurité.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Section 1: Project Details */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold border-b border-border pb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Détails du projet
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="service_type">Type de service <span className="text-secondary">*</span></Label>
                  <select
                    id="service_type"
                    name="service_type"
                    required
                    value={formData.service_type}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="">Sélectionnez un service</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ville <span className="text-secondary">*</span></Label>
                  <select
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="">Sélectionnez une ville</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description de votre besoin <span className="text-secondary">*</span></Label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez précisément les travaux à réaliser..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget estimé (Optionnel)</Label>
                <div className="relative">
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    min="0"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Ex: 50000"
                    className="h-11 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">FCFA</span>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Info */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold border-b border-border pb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Vos coordonnées
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="client_name">Nom complet <span className="text-secondary">*</span></Label>
                <Input
                  id="client_name"
                  name="client_name"
                  required
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="client_phone">Téléphone <span className="text-secondary">*</span></Label>
                  <Input
                    id="client_phone"
                    name="client_phone"
                    required
                    value={formData.client_phone}
                    onChange={handleChange}
                    placeholder="+242 xx xxx xx xx"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Email <span className="text-secondary">*</span></Label>
                  <Input
                    id="client_email"
                    name="client_email"
                    type="email"
                    required
                    value={formData.client_email}
                    onChange={handleChange}
                    placeholder="jean@exemple.com"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold rounded-xl shadow-md transition-transform active:scale-[0.98]">
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </Button>
              
              <div className="mt-6 flex items-start gap-3 bg-muted p-4 rounded-lg border border-border">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vos données sont sécurisées. Vous pourrez également nous contacter directement via WhatsApp une fois la demande soumise pour un traitement prioritaire.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceRequestPage;