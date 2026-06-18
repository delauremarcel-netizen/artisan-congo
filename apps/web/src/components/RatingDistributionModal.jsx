import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import RatingDistributionChart from './RatingDistributionChart';

const RatingDistributionModal = ({ artisanId, artisanName, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Distribution des notes</DialogTitle>
          <DialogDescription>
            Avis détaillés pour {artisanName || 'cet artisan'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {artisanId ? (
            <RatingDistributionChart artisanId={artisanId} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Artisan non spécifié
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDistributionModal;