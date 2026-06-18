import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, Calendar, Briefcase, FileText, CheckCircle, CreditCard, Star } from 'lucide-react';

const LeadDetailsModal = ({ isOpen, onClose, lead, onStatusChange }) => {
  const [loading, setLoading] = useState(false);

  if (!lead) return null;

  const handleStatusUpdate = async (status) => {
    setLoading(true);
    await onStatusChange(lead.id, status);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const map = {
      'nouveau': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-yellow-100 text-yellow-800',
      'devis_envoye': 'bg-purple-100 text-purple-800',
      'payé': 'bg-green-100 text-green-800',
      'terminé': 'bg-slate-100 text-slate-800',
      'annulé': 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-xl">Détails du Lead</DialogTitle>
            <Badge className={`${getStatusColor(lead.status)} capitalize px-3 py-1 text-sm`}>
              {lead.status.replace('_', ' ')}
            </Badge>
          </div>
          <DialogDescription>
            ID: {lead.id} • Créé le {new Date(lead.created).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-primary" /> Informations Client
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-muted-foreground">Nom:</span> <span className="font-medium">{lead.client_name || 'Anonyme'}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Téléphone:</span> <span className="font-medium">{lead.client_phone || 'N/A'}</span></p>
                <p className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{lead.client_email || 'N/A'}</span></p>
              </div>
            </div>

            {/* Artisan Info */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-primary" /> Artisan Assigné
              </h3>
              {lead.expand?.artisan_id ? (
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span className="text-muted-foreground">Nom:</span> <span className="font-medium">{lead.expand.artisan_id.name}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Catégorie:</span> <span className="font-medium">{lead.expand.artisan_id.category}</span></p>
                  <p className="flex items-center justify-between">
                    <span className="text-muted-foreground">Score:</span> 
                    <span className="font-medium flex items-center gap-1">
                      {lead.expand.artisan_id.score_global || 0}
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucun artisan assigné (Données manquantes)</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Message */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border h-full">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" /> Message / Demande
              </h3>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap bg-background p-3 rounded-lg border border-border/50">
                {lead.message || 'Aucun message.'}
              </p>
              {lead.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Notes Admin</h4>
                  <p className="text-sm text-foreground/80 italic">{lead.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="mt-2 bg-primary/5 p-5 rounded-xl border border-primary/20">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-primary" /> Détails Financiers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Montant Devis</p>
              <p className="font-bold text-lg">{lead.devis_amount ? `${lead.devis_amount.toLocaleString()} FCFA` : '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Commission ({lead.commission_rate || 0}%)</p>
              <p className="font-bold text-lg text-primary">{lead.commission_amount ? `${lead.commission_amount.toLocaleString()} FCFA` : '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Part Artisan</p>
              <p className="font-bold text-lg">{lead.artisan_amount ? `${lead.artisan_amount.toLocaleString()} FCFA` : '-'}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Paiement</p>
              <Badge variant="outline" className={lead.payment_status === 'payé' ? 'border-green-500 text-green-600' : 'border-muted-foreground text-muted-foreground'}>
                {lead.payment_status?.replace('_', ' ') || 'Non payé'}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex sm:justify-between gap-3">
          <div className="flex gap-2">
            {lead.status !== 'annulé' && lead.status !== 'terminé' && (
              <Button variant="destructive" size="sm" disabled={loading} onClick={() => handleStatusUpdate('annulé')}>
                Annuler
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {lead.status === 'nouveau' && (
              <Button variant="outline" size="sm" disabled={loading} onClick={() => handleStatusUpdate('en_cours')}>
                Passer En Cours
              </Button>
            )}
            {lead.status === 'devis_envoye' && lead.payment_status !== 'payé' && (
              <Button variant="default" size="sm" disabled={loading} onClick={() => handleStatusUpdate('payé')} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" /> Marquer Payé
              </Button>
            )}
            {lead.status === 'payé' && (
              <Button variant="default" size="sm" disabled={loading} onClick={() => handleStatusUpdate('terminé')}>
                Terminer la mission
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;