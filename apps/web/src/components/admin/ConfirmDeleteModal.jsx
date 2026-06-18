import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, description, loading }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || 'Confirmer la suppression'}</DialogTitle>
          <DialogDescription>
            {description || 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;