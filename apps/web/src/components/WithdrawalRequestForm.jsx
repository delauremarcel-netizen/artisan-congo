import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Wallet } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';

const WithdrawalRequestForm = ({ open, onOpenChange, onSuccess, availableBalance }) => {
  const { currentArtisan, refreshArtisan } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    method: 'mobile_money',
    bank_details: '',
    phone_number: ''
  });

  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amountNum = parseFloat(formData.amount);
    
    if (isNaN(amountNum) || amountNum < 10) {
      toast.error('Le montant minimum de retrait est de 10 $');
      return;
    }

    if (amountNum > availableBalance) {
      toast.error('Fonds insuffisants');
      return;
    }

    if (formData.method === 'mobile_money' && !formData.phone_number.trim()) {
      toast.error('Le numéro de téléphone est requis pour Mobile Money');
      return;
    }

    if (formData.method === 'bank_transfer' && !formData.bank_details.trim()) {
      toast.error('Les coordonnées bancaires sont requises pour le virement bancaire');
      return;
    }

    setLoading(true);
    try {
      await pb.collection('withdrawals').create({
        artisan_id: currentArtisan.id,
        amount: amountNum,
        method: formData.method,
        bank_details: formData.bank_details,
        phone_number: formData.phone_number,
        status: 'pending'
      }, { $autoCancel: false });

      // Optimistically update artisan balances (in a real app, this might be handled by a backend hook)
      await pb.collection('artisans').update(currentArtisan.id, {
        available_balance: availableBalance - amountNum,
        pending_balance: (currentArtisan.pending_balance || 0) + amountNum
      }, { $autoCancel: false });

      await refreshArtisan();
      toast.success('Demande de retrait soumise avec succès');
      setFormData({ amount: '', method: 'mobile_money', bank_details: '', phone_number: '' });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Échec de la soumission de la demande de retrait');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" /> Demander un retrait
          </DialogTitle>
          <DialogDescription>
            Solde disponible : <strong className="text-foreground">{formatCurrency(availableBalance)}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant à retirer ($) *</Label>
            <Input
              id="amount"
              type="number"
              min="10"
              step="0.01"
              max={availableBalance}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Ex: 50.00"
              required
              className="bg-background text-foreground font-variant-numeric"
            />
            <p className="text-xs text-muted-foreground">Minimum 10 $</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Méthode de retrait *</Label>
            <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sélectionner la méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile_money">Mobile Money (MTN/Airtel)</SelectItem>
                <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.method === 'mobile_money' && (
            <div className="space-y-2">
              <Label htmlFor="phone_number">Numéro de téléphone Mobile Money *</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+242 06 123 4567"
                required
                className="bg-background text-foreground"
              />
            </div>
          )}

          {formData.method === 'bank_transfer' && (
            <div className="space-y-2">
              <Label htmlFor="bank_details">Coordonnées bancaires (RIB/IBAN) *</Label>
              <Textarea
                id="bank_details"
                value={formData.bank_details}
                onChange={(e) => setFormData({ ...formData, bank_details: e.target.value })}
                placeholder="Nom de la banque, Titulaire du compte, IBAN..."
                rows={3}
                required
                className="resize-none bg-background text-foreground"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || availableBalance < 10}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Traitement...' : 'Soumettre la demande'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalRequestForm;