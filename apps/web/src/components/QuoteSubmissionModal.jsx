import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const QuoteSubmissionModal = ({ isOpen, onClose, request, onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    timeline: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.timeline) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);
      
      const quoteData = {
        artisan_id: currentUser.id,
        company_id: currentUser.id, // Using artisan id as company id for now if required
        quote_request_id: request.id,
        amount: Number(formData.amount),
        description: formData.description,
        timeline: formData.timeline,
        status: 'pending'
      };

      await pb.collection('quotes').create(quoteData, { $autoCancel: false });
      
      toast.success('Votre devis a été soumis avec succès !');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Erreur lors de la soumission du devis. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Soumettre un devis</DialogTitle>
          <DialogDescription>
            Proposez votre tarif et vos conditions pour le projet : <span className="font-medium text-foreground">{request?.service_type}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant proposé (FC) <span className="text-destructive">*</span></Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              placeholder="Ex: 150000"
              value={formData.amount}
              onChange={handleChange}
              required
              className="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Délai d'exécution estimé <span className="text-destructive">*</span></Label>
            <Input
              id="timeline"
              name="timeline"
              placeholder="Ex: 3 jours, 2 semaines..."
              value={formData.timeline}
              onChange={handleChange}
              required
              className="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Détails de l'offre <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez ce qui est inclus dans votre devis, les matériaux, etc."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="text-foreground resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le devis'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteSubmissionModal;