import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const CATEGORIES = [
  'Plomberie', 'Électricité', 'Menuiserie', 'Maçonnerie', 'Peinture', 'Soudure', 
  'Réparation automobile', 'Construction', 'Paysagisme', 'Carrelage', 'Couverture', 
  'Serrurerie', 'Climatisation', 'Autre'
];
const LOCATIONS = ['Pointe-Noire', 'Brazzaville', 'Kinshasa', 'Lubumbashi', 'Kolwezi'];
const CONTACT_METHODS = ['WhatsApp', 'Phone', 'Email'];

const QuoteRequestForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', project_description: '', location: '', category: '', budget: '', preferred_contact_method: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.project_description.trim()) newErrors.project_description = 'La description est requise';
    if (!formData.location) newErrors.location = 'La ville est requise';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.preferred_contact_method) newErrors.preferred_contact_method = 'Le contact est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setIsSubmitting(true);
    try {
      await pb.collection('quote_inquiries').create({
        ...formData,
        budget: formData.budget ? Number(formData.budget) : null
      }, { $autoCancel: false });
      toast.success('Votre demande a été envoyée avec succès!');
      setFormData({ name: '', email: '', phone: '', project_description: '', location: '', category: '', budget: '', preferred_contact_method: ''});
    } catch (error) {
      toast.error('Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 bg-card p-6 md:p-8 rounded-xl shadow-sm border border-border">
      <div>
        <h2 className="text-2xl mb-2">Demander un devis gratuit</h2>
        <p className="text-muted-foreground font-medium">Détaillez votre projet pour recevoir des offres de nos artisans vérifiés.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="premium-label" htmlFor="name">Nom complet <span className="text-destructive">*</span></Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="premium-input" />
            {errors.name && <p className="text-xs text-destructive mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <Label className="premium-label" htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="premium-input" />
            {errors.email && <p className="text-xs text-destructive mt-1 font-medium">{errors.email}</p>}
          </div>

          <div>
            <Label className="premium-label" htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="premium-input" />
            {errors.phone && <p className="text-xs text-destructive mt-1 font-medium">{errors.phone}</p>}
          </div>

          <div>
            <Label className="premium-label" htmlFor="preferred_contact_method">Contact préféré <span className="text-destructive">*</span></Label>
            <Select value={formData.preferred_contact_method} onValueChange={(v) => handleSelectChange('preferred_contact_method', v)}>
              <SelectTrigger className="premium-input">
                <SelectValue placeholder="Sélectionnez..." />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.preferred_contact_method && <p className="text-xs text-destructive mt-1 font-medium">{errors.preferred_contact_method}</p>}
          </div>

          <div>
            <Label className="premium-label" htmlFor="category">Type de travaux <span className="text-destructive">*</span></Label>
            <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
              <SelectTrigger className="premium-input">
                <SelectValue placeholder="Sélectionnez un métier" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive mt-1 font-medium">{errors.category}</p>}
          </div>

          <div>
            <Label className="premium-label" htmlFor="location">Ville <span className="text-destructive">*</span></Label>
            <Select value={formData.location} onValueChange={(v) => handleSelectChange('location', v)}>
              <SelectTrigger className="premium-input">
                <SelectValue placeholder="Où se situe le projet ?" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.location && <p className="text-xs text-destructive mt-1 font-medium">{errors.location}</p>}
          </div>
        </div>

        <div>
          <Label className="premium-label" htmlFor="budget">Budget estimé (Optionnel)</Label>
          <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} className="premium-input" placeholder="Ex: 150000" />
        </div>

        <div>
          <Label className="premium-label" htmlFor="project_description">Description du projet <span className="text-destructive">*</span></Label>
          <Textarea
            id="project_description" name="project_description" value={formData.project_description} onChange={handleChange}
            className="premium-input min-h-[120px] resize-y py-3"
            placeholder="Détaillez vos besoins..."
          />
          {errors.project_description && <p className="text-xs text-destructive mt-1 font-medium">{errors.project_description}</p>}
        </div>

        <Button type="submit" className="btn-premium btn-premium-primary btn-premium-lg w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours...</> : <><Send className="w-5 h-5 mr-2" /> Envoyer la demande</>}
        </Button>
      </form>
    </div>
  );
};

export default QuoteRequestForm;