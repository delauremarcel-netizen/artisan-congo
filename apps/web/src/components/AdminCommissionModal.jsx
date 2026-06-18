import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { Calculator, CheckCircle2 } from 'lucide-react';

const AdminCommissionModal = ({ isOpen, onClose, quoteId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [commissionRecord, setCommissionRecord] = useState(null);
  
  const [formData, setFormData] = useState({
    completed: false,
    project_amount: '',
  });

  const COMMISSION_RATE = 5; // 5%

  useEffect(() => {
    if (isOpen && quoteId) {
      fetchExistingCommission();
    } else {
      resetForm();
    }
  }, [isOpen, quoteId]);

  const fetchExistingCommission = async () => {
    setFetching(true);
    try {
      const records = await pb.collection('commissions').getList(1, 1, {
        filter: `quote_request_id="${quoteId}"`,
        $autoCancel: false
      });

      if (records.items.length > 0) {
        const record = records.items[0];
        setCommissionRecord(record);
        setFormData({
          completed: record.completed || false,
          project_amount: record.project_amount ? record.project_amount.toString() : '',
        });
      } else {
        resetForm();
      }
    } catch (error) {
      console.error('Error fetching commission:', error);
      toast.error('Erreur lors du chargement des données de commission');
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setCommissionRecord(null);
    setFormData({
      completed: false,
      project_amount: '',
    });
  };

  const handleAmountChange = (e) => {
    setFormData({ ...formData, project_amount: e.target.value });
  };

  const calculatedCommission = formData.project_amount 
    ? (parseFloat(formData.project_amount) * COMMISSION_RATE / 100).toFixed(2) 
    : '0.00';

  const handleSave = async () => {
    if (formData.completed && (!formData.project_amount || parseFloat(formData.project_amount) <= 0)) {
      toast.error('Le montant du chantier est obligatoire pour un projet réalisé.');
      return;
    }

    setLoading(true);
    try {
      const amount = formData.project_amount ? parseFloat(formData.project_amount) : 0;
      const commissionData = {
        quote_request_id: quoteId,
        project_amount: amount,
        commission_rate: COMMISSION_RATE,
        commission_amount: parseFloat(calculatedCommission),
        completed: formData.completed
      };

      if (commissionRecord) {
        await pb.collection('commissions').update(commissionRecord.id, commissionData, { $autoCancel: false });
      } else {
        await pb.collection('commissions').create(commissionData, { $autoCancel: false });
      }

      // If marked as completed, update quote request status to 'terminee'
      if (formData.completed) {
        await pb.collection('quote_requests').update(quoteId, { status: 'terminee' }, { $autoCancel: false });
      }

      toast.success('Informations de commission enregistrées avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving commission:', error);
      toast.error('Erreur lors de l\'enregistrement de la commission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Gestion de Commission
          </DialogTitle>
          <DialogDescription>
            Calculez et enregistrez la commission pour cette demande de devis.
          </DialogDescription>
        </DialogHeader>

        {fetching ? (
          <div className="py-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/40 rounded-xl border border-border/50">
              <Checkbox 
                id="completed" 
                checked={formData.completed} 
                onCheckedChange={(checked) => setFormData({ ...formData, completed: checked })}
                className="w-5 h-5"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className={`w-4 h-4 ${formData.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                  Projet réalisé
                </label>
                <p className="text-xs text-muted-foreground">
                  Cochez cette case si le chantier a été exécuté.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="project_amount" className="text-sm font-medium">Montant total du chantier (FCFA)</Label>
              <Input
                id="project_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 150000"
                value={formData.project_amount}
                onChange={handleAmountChange}
                className="h-12 bg-background border-border/60"
              />
            </div>

            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground font-medium">Taux de commission appliqué</span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{COMMISSION_RATE}%</Badge>
              </div>
              <div className="flex justify-between items-end mt-4">
                <span className="text-base font-semibold text-foreground">Commission due :</span>
                <span className="text-3xl font-bold text-primary tracking-tight font-variant-numeric tabular-nums">
                  {calculatedCommission} <span className="text-base font-medium text-muted-foreground">FCFA</span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">Annuler</Button>
          <Button onClick={handleSave} disabled={loading || fetching} className="rounded-xl px-6">
            {loading ? 'Enregistrement...' : 'Sauvegarder'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Extracted Badge component inline for simplicity if not imported globally
const Badge = ({ children, className, variant }) => {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}

export default AdminCommissionModal;