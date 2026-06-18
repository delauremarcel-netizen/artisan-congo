import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const RejectModal = ({ isOpen, onClose, onConfirm, artisanName, loading }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refuser l'artisan</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de refuser la candidature de <strong>{artisanName}</strong>. 
            Veuillez indiquer la raison du refus. Un email sera envoyé à l'artisan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du refus <span className="text-destructive">*</span></Label>
            <Textarea 
              id="reason" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              placeholder="Ex: Pièce d'identité non valide, manque d'expérience..."
              required
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" variant="destructive" disabled={!reason.trim() || loading}>
              {loading ? 'Traitement...' : 'Confirmer le refus'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectModal;