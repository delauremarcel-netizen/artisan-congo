import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

const QuoteRequestModal = ({ isOpen, onClose, artisanId, artisanName }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    budget: '',
    contactMethod: 'Phone',
    // Fallback fields for unauthenticated users
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.location) {
      toast.error('Veuillez remplir les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      if (isAuthenticated) {
        // Submit to 'quotes' collection for authenticated users
        await pb.collection('quotes').create({
          artisan_id: artisanId,
          company_id: currentUser.id,
          description: formData.description,
          amount: formData.budget ? Number(formData.budget) : 0,
          status: 'pending'
        }, { $autoCancel: false });
        
        toast.success(`Demande de devis envoyée à ${artisanName}`);
      } else {
        // Submit to 'quote_inquiries' for public users
        if (!formData.name || !formData.email || !formData.phone) {
          toast.error('Veuillez renseigner vos coordonnées pour être recontacté.');
          setLoading(false);
          return;
        }

        await pb.collection('quote_inquiries').create({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_description: formData.description,
          location: formData.location,
          budget: formData.budget ? Number(formData.budget) : 0,
          preferred_contact_method: formData.contactMethod
        }, { $autoCancel: false });
        
        toast.success('Votre demande a bien été enregistrée. L\'artisan vous recontactera bientôt.');
      }
      
      onClose();
      // Reset form
      setFormData({
        description: '', location: '', budget: '', contactMethod: 'Phone', name: '', email: '', phone: ''
      });
    } catch (error) {
      console.error('Erreur lors de la demande de devis:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/60">
        <div className="bg-primary/5 p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Demander un devis</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5">
              Décrivez votre projet à <span className="font-semibold text-foreground">{artisanName}</span> pour recevoir une estimation.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {!isAuthenticated && (
            <div className="bg-muted/40 p-4 rounded-xl space-y-4 border border-border/50 mb-2">
              <p className="text-sm font-medium text-foreground mb-2 flex items-center">
                Vos coordonnées
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nom complet <span className="text-destructive">*</span></Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-background" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="bg-background" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="bg-background" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="description">Description du projet <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Détaillez vos besoins, les matériaux souhaités, les délais..."
              className="min-h-[120px] resize-y"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="location">Lieu d'intervention <span className="text-destructive">*</span></Label>
              <Select value={formData.location} onValueChange={(val) => handleSelectChange('location', val)}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brazzaville">Brazzaville</SelectItem>
                  <SelectItem value="Pointe-Noire">Pointe-Noire</SelectItem>
                  <SelectItem value="Kinshasa">Kinshasa</SelectItem>
                  <SelectItem value="Lubumbashi">Lubumbashi</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="budget">Budget estimé (FCFA)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="Ex: 50000"
                min="0"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          </div>

          {!isAuthenticated && (
            <div className="space-y-1.5">
              <Label htmlFor="contactMethod">Préférence de contact</Label>
              <Select value={formData.contactMethod} onValueChange={(val) => handleSelectChange('contactMethod', val)}>
                <SelectTrigger id="contactMethod">
                  <SelectValue placeholder="Comment vous contacter ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phone">Téléphone</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={loading} className="min-w-[140px]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestModal;