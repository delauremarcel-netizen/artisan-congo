import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectRequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    projectType: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, projectType: value }));
  };

  const isFormValid = Object.values(formData).every(v => v.length > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      const response = await apiServerClient.fetch('/project-requests', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setIsSuccess(true);
      toast.success('Votre demande a été envoyée avec succès.');
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-5 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-bold">Demande envoyée !</h1>
          <p className="text-muted-foreground">Votre demande a été envoyée avec succès. Un artisan vous contactera dans les 24h.</p>
          <Button asChild className="w-full h-12 mt-8">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 p-5">
      <SEOHead title="Demander un devis | Artisan Congo" />
      
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Décrivez votre projet</h1>
          <p className="text-muted-foreground">Trouvez le meilleur artisan pour vos travaux</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nom complet</Label>
            <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} className="h-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Téléphone</Label>
              <Input id="clientPhone" name="clientPhone" type="tel" value={formData.clientPhone} onChange={handleChange} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input id="clientEmail" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} className="h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Type de projet</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Sélectionner un domaine" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Électricité">Électricité</SelectItem>
                <SelectItem value="Plomberie">Plomberie</SelectItem>
                <SelectItem value="Maçonnerie">Maçonnerie</SelectItem>
                <SelectItem value="Menuiserie">Menuiserie</SelectItem>
                <SelectItem value="Peinture">Peinture</SelectItem>
                <SelectItem value="Autres">Autres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea 
              id="description" name="description" 
              value={formData.description} onChange={handleChange} 
              className="min-h-[150px]"
              placeholder="Décrivez les travaux à réaliser..."
            />
          </div>

          <Button type="submit" className="w-full h-14 text-lg font-semibold" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
            Envoyer ma demande
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProjectRequestPage;