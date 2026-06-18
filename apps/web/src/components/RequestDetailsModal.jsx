import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import WhatsAppButton from './WhatsAppButton.jsx';

const STATUS_OPTIONS = [
  { value: 'nouvelle', label: 'Nouvelle' },
  { value: 'assignee', label: 'Assignée' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'terminee', label: 'Terminée' },
  { value: 'annulee', label: 'Annulée' }
];

const RequestDetailsModal = ({ open, onOpenChange, request, onSaved }) => {
  const [artisans, setArtisans] = useState([]);
  const [assignedArtisanId, setAssignedArtisanId] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [projectAmount, setProjectAmount] = useState('');

  useEffect(() => {
    if (open && request) {
      setAssignedArtisanId(request.assigned_artisan_id || '');
      setStatus(request.status || 'nouvelle');
      setNotes(request.notes || '');
      setIsCompleting(false);
      setProjectAmount('');
      fetchArtisans();
    }
  }, [open, request]);

  const fetchArtisans = async () => {
    try {
      const records = await pb.collection('artisans').getFullList({
        filter: "subscription_status='active'",
        sort: 'name',
        $autoCancel: false
      });
      setArtisans(records);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = {
        assigned_artisan_id: assignedArtisanId,
        status: status,
        notes: notes
      };
      await pb.collection('service_requests').update(request.id, data, { $autoCancel: false });
      toast.success('Demande mise à jour avec succès');
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!projectAmount || isNaN(projectAmount)) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }
    
    if (!assignedArtisanId) {
      toast.error('Veuillez assigner un artisan avant de terminer');
      return;
    }

    setIsSaving(true);
    try {
      // Create commission
      await pb.collection('commissions').create({
        request_id: request.request_id,
        artisan_id: assignedArtisanId,
        project_amount: Number(projectAmount),
        commission_status: 'pending'
      }, { $autoCancel: false });

      // Update request status
      await pb.collection('service_requests').update(request.id, {
        status: 'terminee',
        assigned_artisan_id: assignedArtisanId,
        notes: notes
      }, { $autoCancel: false });

      toast.success('Projet terminé et commission générée !');
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la clôture du projet');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!request) return null;

  const adminWhatsAppMessage = `Bonjour ${request.client_name}, concernant votre demande ${request.request_id} pour ${request.service_type} à ${request.location}.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande: {request.request_id}</DialogTitle>
          <DialogDescription>
            Consultez les informations et gérez le statut du projet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Service</p>
              <p className="font-semibold">{request.service_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Lieu</p>
              <p className="font-semibold">{request.location}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground font-medium">Description</p>
              <p className="text-sm bg-muted/50 p-3 rounded-md mt-1">{request.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Budget estimé</p>
              <p className="font-semibold">{request.budget ? `${request.budget} FCFA` : 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Date</p>
              <p className="text-sm">{new Date(request.created).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-semibold mb-3">Informations Client</h4>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><span className="text-muted-foreground">Nom:</span> {request.client_name}</div>
              <div><span className="text-muted-foreground">Tél:</span> {request.client_phone}</div>
              <div className="col-span-2"><span className="text-muted-foreground">Email:</span> {request.client_email}</div>
            </div>
            
            {request.client_phone && (
              <WhatsAppButton 
                targetPhoneNumber={request.client_phone}
                customMessage={adminWhatsAppMessage}
                className="w-full sm:w-auto mt-2"
                variant="outline"
              >
                Contacter le client sur WhatsApp
              </WhatsAppButton>
            )}
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <h4 className="font-semibold">Gestion</h4>
            
            {!isCompleting ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="artisan">Artisan Assigné</Label>
                  <select 
                    id="artisan" 
                    value={assignedArtisanId} 
                    onChange={(e) => setAssignedArtisanId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-- Aucun artisan assigné --</option>
                    {artisans.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.category})</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Statut</Label>
                  <select 
                    id="status" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes Administratives</Label>
                  <textarea 
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Notes internes..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </>
            ) : (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-4">
                <h5 className="font-medium text-primary">Clôture du Projet</h5>
                <p className="text-sm text-muted-foreground">
                  Entrez le montant final du projet pour générer la commission (5%).
                </p>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Montant final (FCFA)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={projectAmount}
                    onChange={(e) => setProjectAmount(e.target.value)}
                    placeholder="Ex: 50000"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          {!isCompleting ? (
            <>
              {status !== 'terminee' && (
                <Button variant="outline" className="sm:mr-auto" onClick={() => setIsCompleting(true)}>
                  Marquer comme terminé
                </Button>
              )}
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleSave} disabled={isSaving}>Enregistrer</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsCompleting(false)}>Retour</Button>
              <Button onClick={handleComplete} disabled={isSaving}>Confirmer la clôture</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;