import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const SuspendModal = ({ isOpen, onClose, onConfirm, artisanName, loading }) => {
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
          <DialogTitle>Suspendre l'artisan</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de suspendre le compte de <strong>{artisanName}</strong>. 
            Son profil ne sera plus visible publiquement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison de la suspension <span className="text-destructive">*</span></Label>
            <Textarea 
              id="reason" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              placeholder="Ex: Plaintes clients répétées, non-respect des CGU..."
              required
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" variant="destructive" disabled={!reason.trim() || loading}>
              {loading ? 'Traitement...' : 'Suspendre le compte'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendModal;