import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { calculateCommission } from '@/lib/whatsappUtils.js';

const AddQuoteModal = ({ isOpen, onClose, lead, onSave }) => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('10');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setAmount(lead.devis_amount || '');
      setRate(lead.commission_rate || '10');
      setNotes(lead.notes || '');
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    setLoading(true);
    const { commission_amount, artisan_amount } = calculateCommission(amount, rate);
    
    await onSave(lead.id, {
      devis_amount: Number(amount),
      commission_rate: Number(rate),
      commission_amount,
      artisan_amount,
      notes: notes,
      status: 'devis_envoye'
    });
    setLoading(false);
    onClose();
  };

  const { commission_amount, artisan_amount } = calculateCommission(amount || 0, rate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter / Modifier le Devis</DialogTitle>
          <DialogDescription>
            Saisissez le montant proposé par l'artisan. La commission est calculée automatiquement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant total (FCFA) *</Label>
              <Input 
                id="amount" 
                type="number" 
                min="1" 
                required 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Ex: 50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Taux Commission (%)</Label>
              <Input 
                id="rate" 
                type="number" 
                min="0" 
                max="100" 
                value={rate} 
                onChange={(e) => setRate(e.target.value)} 
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-xl space-y-2 border border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Montant Client :</span>
              <span className="font-bold">{Number(amount || 0).toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-primary font-medium">Commission ArtisanCongo :</span>
              <span className="font-bold text-primary">{commission_amount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm border-t border-border/50 pt-2 mt-2">
              <span className="text-muted-foreground">Net Artisan :</span>
              <span className="font-bold">{artisan_amount.toLocaleString()} FCFA</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes Admin (Optionnel)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Détails de la négociation..."
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !amount}>
              {loading ? 'Enregistrement...' : 'Enregistrer le devis'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteModal;