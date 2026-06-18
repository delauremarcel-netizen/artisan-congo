import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/StatusBadge.jsx';
import { Calendar, DollarSign, User, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const MissionDetailsModal = ({ mission, isOpen, onClose, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(mission?.status || '');

  if (!mission) return null;

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === mission.status) {
      toast.error('Veuillez sélectionner un nouveau statut');
      return;
    }

    setIsUpdating(true);
    try {
      await pb.collection('missions').update(mission.id, {
        status: newStatus
      }, { $autoCancel: false });

      toast.success('Statut de la mission mis à jour');
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error updating mission status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkComplete = async () => {
    setIsUpdating(true);
    try {
      await pb.collection('missions').update(mission.id, {
        status: 'completed'
      }, { $autoCancel: false });

      toast.success('Mission marquée comme terminée');
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast.error('Erreur lors de la finalisation de la mission');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette mission ?')) return;

    setIsUpdating(true);
    try {
      await pb.collection('missions').update(mission.id, {
        status: 'closed'
      }, { $autoCancel: false });

      toast.success('Mission annulée');
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error canceling mission:', error);
      toast.error('Erreur lors de l\'annulation de la mission');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{mission.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Statut actuel</span>
            <StatusBadge status={mission.status} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Description</span>
            </div>
            <p className="text-foreground leading-relaxed">{mission.description || 'Aucune description fournie'}</p>
          </div>

          {/* Category */}
          {mission.category && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Catégorie</span>
              <span className="text-foreground font-medium">{mission.category}</span>
            </div>
          )}

          {/* Budget */}
          {mission.budget && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Budget</span>
              </div>
              <span className="text-foreground font-semibold">{mission.budget.toLocaleString()} FCFA</span>
            </div>
          )}

          {/* Deadline */}
          {mission.deadline && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Date limite</span>
              </div>
              <span className="text-foreground font-medium">{format(new Date(mission.deadline), 'dd/MM/yyyy')}</span>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Créée le</span>
            </div>
            <span className="text-foreground">{format(new Date(mission.created), 'dd/MM/yyyy à HH:mm')}</span>
          </div>

          {/* Update Status Section */}
          <div className="border-t pt-6 space-y-4">
            <Label htmlFor="status-select" className="text-base font-semibold">Changer le statut</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger id="status-select" className="w-full">
                <SelectValue placeholder="Sélectionner un nouveau statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="closed">Fermé</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {mission.status === 'open' && (
            <Button 
              onClick={handleMarkComplete} 
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Marquer comme terminé
            </Button>
          )}
          {(mission.status === 'open' || mission.status === 'pending') && (
            <Button 
              onClick={handleCancel} 
              disabled={isUpdating}
              variant="destructive"
            >
              Annuler la mission
            </Button>
          )}
          <Button 
            onClick={handleStatusUpdate} 
            disabled={isUpdating || !newStatus || newStatus === mission.status}
          >
            Mettre à jour le statut
          </Button>
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailsModal;