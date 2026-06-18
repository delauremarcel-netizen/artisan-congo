import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, [activeTab]);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('withdrawals').getList(1, 100, {
        filter: `status="${activeTab}"`,
        sort: '-requested_date',
        expand: 'artisan_id',
        $autoCancel: false
      });
      setWithdrawals(records.items);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Échec du chargement des retraits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawal) => {
    if (!window.confirm(`Approuver le retrait de ${withdrawal.amount} $ ?`)) return;
    
    setProcessing(true);
    try {
      await pb.collection('withdrawals').update(withdrawal.id, {
        status: 'approved',
        processed_date: new Date().toISOString()
      }, { $autoCancel: false });

      // Create transaction record
      await pb.collection('transactions').create({
        artisan_id: withdrawal.artisan_id,
        type: 'withdrawal',
        amount: withdrawal.amount,
        status: 'completed',
        description: `Retrait via ${withdrawal.method === 'mobile_money' ? 'Mobile Money' : 'Virement bancaire'}`
      }, { $autoCancel: false });

      // Update artisan balances (pending -> completed)
      const artisan = await pb.collection('artisans').getOne(withdrawal.artisan_id, { $autoCancel: false });
      await pb.collection('artisans').update(artisan.id, {
        pending_balance: Math.max(0, (artisan.pending_balance || 0) - withdrawal.amount)
      }, { $autoCancel: false });

      toast.success('Retrait approuvé avec succès');
      fetchWithdrawals();
    } catch (error) {
      console.error('Approval error:', error);
      toast.error('Échec de l\'approbation du retrait');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectNotes('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectNotes.trim()) {
      toast.error('Veuillez fournir une raison pour le rejet');
      return;
    }

    setProcessing(true);
    try {
      await pb.collection('withdrawals').update(selectedWithdrawal.id, {
        status: 'failed',
        notes: rejectNotes,
        processed_date: new Date().toISOString()
      }, { $autoCancel: false });

      // Refund artisan balances (pending -> available)
      const artisan = await pb.collection('artisans').getOne(selectedWithdrawal.artisan_id, { $autoCancel: false });
      await pb.collection('artisans').update(artisan.id, {
        pending_balance: Math.max(0, (artisan.pending_balance || 0) - selectedWithdrawal.amount),
        available_balance: (artisan.available_balance || 0) + selectedWithdrawal.amount
      }, { $autoCancel: false });

      toast.success('Retrait rejeté et fonds remboursés');
      setRejectModalOpen(false);
      fetchWithdrawals();
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error('Échec du rejet du retrait');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <>
      <Helmet>
        <title>Demandes de Retrait - Admin</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background pt-20">
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-5rem)]">
          <AdminSidebar />
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight">Demandes de Retrait</h1>
              <p className="text-muted-foreground mt-1">Gérer les paiements des artisans</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Clock className="w-4 h-4 mr-2" /> En attente
                </TabsTrigger>
                <TabsTrigger value="approved" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <CheckCircle className="w-4 h-4 mr-2" /> Approuvés
                </TabsTrigger>
                <TabsTrigger value="failed" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <XCircle className="w-4 h-4 mr-2" /> Rejetés
                </TabsTrigger>
              </TabsList>

              <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead>Artisan</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Méthode & Détails</TableHead>
                      <TableHead>Date de demande</TableHead>
                      {activeTab === 'pending' && <TableHead className="text-right">Actions</TableHead>}
                      {activeTab !== 'pending' && <TableHead>Date de traitement</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            Chargement des retraits...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : withdrawals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          Aucune demande de retrait trouvée pour ce statut.
                        </TableCell>
                      </TableRow>
                    ) : (
                      withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id} className="hover:bg-muted/10">
                          <TableCell className="font-medium">
                            {withdrawal.expand?.artisan_id?.name || 'Artisan inconnu'}
                          </TableCell>
                          <TableCell className="font-bold font-variant-numeric">
                            {formatCurrency(withdrawal.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="mb-1">
                              {withdrawal.method === 'mobile_money' ? 'Mobile Money' : 'Virement Bancaire'}
                            </Badge>
                            <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                              {withdrawal.method === 'mobile_money' ? withdrawal.phone_number : withdrawal.bank_details}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(withdrawal.requested_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          
                          {activeTab === 'pending' && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleApprove(withdrawal)}
                                  disabled={processing}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" /> Approuver
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => openRejectModal(withdrawal)}
                                  disabled={processing}
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Rejeter
                                </Button>
                              </div>
                            </TableCell>
                          )}
                          
                          {activeTab !== 'pending' && (
                            <TableCell className="text-sm text-muted-foreground">
                              {withdrawal.processed_date ? new Date(withdrawal.processed_date).toLocaleDateString('fr-FR') : '-'}
                              {withdrawal.notes && (
                                <div className="text-xs text-red-500 mt-1 truncate max-w-[150px]" title={withdrawal.notes}>
                                  Note: {withdrawal.notes}
                                </div>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </main>
        </div>
      </div>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande de retrait</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Raison du rejet (visible par l'artisan) *</Label>
              <Textarea
                id="notes"
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Ex: Coordonnées bancaires invalides..."
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing || !rejectNotes.trim()}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminWithdrawalsPage;