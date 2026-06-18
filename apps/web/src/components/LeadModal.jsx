import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLeadCreation } from '@/hooks/useLeadCreation.js';
import { Loader2, CheckCircle2 } from 'lucide-react';

const categories = [
  'Plomberie', 'Menuiserie', 'Électricité', 'Maçonnerie', 'Peinture', 'Soudure', 
  'Réparation Auto', 'Construction', 'Paysagisme', 'Carrelage', 'Couverture', 'Serrurerie', 'Climatisation'
];

const LeadModal = ({ isOpen, onClose, artisan = null, defaultCategory = '' }) => {
  const { createLead, loading, error } = useLeadCreation();
  const [successData, setSuccessData] = useState(null);
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    project_description: '',
    category: defaultCategory || (artisan?.category || '')
  });

  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setFormData(prev => ({
        ...prev,
        category: defaultCategory || (artisan?.category || '')
      }));
    }
  }, [isOpen, artisan, defaultCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const leadData = {
      ...formData,
      assigned_artisan: artisan?.id || null,
      artisan_name: artisan?.name || null
    };

    const result = await createLead(leadData);
    
    if (result.success) {
      setSuccessData(result);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (successData?.whatsappUrl) {
      window.open(successData.whatsappUrl, '_blank');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {successData ? 'Demande envoyée !' : 'Demander un devis'}
          </DialogTitle>
          <DialogDescription>
            {successData 
              ? 'Votre demande a été enregistrée avec succès.' 
              : artisan 
                ? `Demande de devis pour ${artisan.name}` 
                : 'Décrivez votre projet pour être mis en relation avec un artisan qualifié.'}
          </DialogDescription>
        </DialogHeader>

        {successData ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">ID Demande: {successData.record.id}</h3>
            <p className="text-muted-foreground mb-6">
              Pour finaliser votre demande et obtenir une réponse rapide, veuillez nous contacter sur WhatsApp avec votre numéro de demande.
            </p>
            <Button onClick={handleWhatsAppRedirect} className="w-full h-12 text-base">
              Continuer sur WhatsApp
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nom complet *</Label>
              <Input 
                id="client_name" 
                name="client_name" 
                required 
                value={formData.client_name} 
                onChange={handleChange} 
                placeholder="Jean Dupont"
                className="text-foreground"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_phone">Téléphone *</Label>
                <Input 
                  id="client_phone" 
                  name="client_phone" 
                  required 
                  value={formData.client_phone} 
                  onChange={handleChange} 
                  placeholder="06 000 00 00"
                  className="text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_email">Email *</Label>
                <Input 
                  id="client_email" 
                  name="client_email" 
                  type="email" 
                  required 
                  value={formData.client_email} 
                  onChange={handleChange} 
                  placeholder="jean@exemple.com"
                  className="text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie de métier *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_description">Description du projet *</Label>
              <Textarea 
                id="project_description" 
                name="project_description" 
                required 
                value={formData.project_description} 
                onChange={handleChange} 
                placeholder="Décrivez les travaux à réaliser..."
                className="min-h-[100px] text-foreground"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Envoyer la demande
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal;