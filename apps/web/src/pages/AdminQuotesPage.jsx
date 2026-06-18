import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, MapPin, Calendar, Wrench, User, FileText, Trash2, Edit, Calculator, MessageCircle } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import pb from '@/lib/pocketbaseClient.js';
import AdminCommissionModal from '@/components/AdminCommissionModal.jsx';

const STATUS_COLORS = {
  'nouvelle': 'bg-[hsl(var(--status-nouvelle))]/15 text-[hsl(var(--status-nouvelle))] hover:bg-[hsl(var(--status-nouvelle))]/25',
  'assignee': 'bg-[hsl(var(--status-assignee))]/15 text-[hsl(var(--status-assignee))] hover:bg-[hsl(var(--status-assignee))]/25',
  'en_cours': 'bg-[hsl(var(--status-en-cours))]/15 text-[hsl(var(--status-en-cours))] hover:bg-[hsl(var(--status-en-cours))]/25',
  'terminee': 'bg-[hsl(var(--status-terminee))]/15 text-[hsl(var(--status-terminee))] hover:bg-[hsl(var(--status-terminee))]/25',
  'annulee': 'bg-[hsl(var(--status-annulee))]/15 text-[hsl(var(--status-annulee))] hover:bg-[hsl(var(--status-annulee))]/25'
};

const STATUS_LABELS = {
  'nouvelle': 'Nouvelle',
  'assignee': 'Assignée',
  'en_cours': 'En cours',
  'terminee': 'Terminée',
  'annulee': 'Annulée'
};

const AdminQuotesPage = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [contactFilter, setContactFilter] = useState('all');
  const [artisans, setArtisans] = useState([]);
  
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  
  const [actionLoading, setActionLoading] = useState(false);
  const [newNotes, setNewNotes] = useState('');
  const [selectedArtisanId, setSelectedArtisanId] = useState('');

  useEffect(() => {
    fetchQuotes();
    fetchArtisans();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('quote_requests').getList(1, 100, {
        sort: '-created',
        $autoCancel: false
      });
      setQuotes(records.items);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Erreur lors du chargement des demandes de devis');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtisans = async () => {
    try {
      const records = await pb.collection('artisans').getList(1, 200, {
        filter: 'subscription_status="active"',
        fields: 'id,name,category,city',
        $autoCancel: false
      });
      setArtisans(records.items);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      await pb.collection('quote_requests').update(quoteId, { status: newStatus }, { $autoCancel: false });
      toast.success('Statut mis à jour');
      setQuotes(quotes.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
    try {
      await pb.collection('quote_requests').delete(quoteId, { $autoCancel: false });
      toast.success('Demande supprimée');
      setQuotes(quotes.filter(q => q.id !== quoteId));
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const openAssignModal = (quote) => {
    setSelectedQuote(quote);
    const assigned = artisans.find(a => a.name === quote.assigned_artisan);
    setSelectedArtisanId(assigned ? assigned.id : '');
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedArtisanId) return;
    setActionLoading(true);
    try {
      const artisan = artisans.find(a => a.id === selectedArtisanId);
      await pb.collection('quote_requests').update(selectedQuote.id, { 
        assigned_artisan: artisan.name,
        status: 'assignee' 
      }, { $autoCancel: false });
      
      toast.success('Artisan assigné avec succès');
      setAssignModalOpen(false);
      fetchQuotes();
    } catch (error) {
      console.error('Error assigning artisan:', error);
      toast.error('Erreur lors de l\'assignation');
    } finally {
      setActionLoading(false);
    }
  };

  const openNotesModal = (quote) => {
    setSelectedQuote(quote);
    setNewNotes(quote.notes || '');
    setNotesModalOpen(true);
  };

  const handleNotesSubmit = async () => {
    setActionLoading(true);
    try {
      await pb.collection('quote_requests').update(selectedQuote.id, { notes: newNotes }, { $autoCancel: false });
      toast.success('Notes mises à jour');
      setNotesModalOpen(false);
      setQuotes(quotes.map(q => q.id === selectedQuote.id ? { ...q, notes: newNotes } : q));
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Erreur lors de la mise à jour des notes');
    } finally {
      setActionLoading(false);
    }
  };

  const openCommissionModal = (quote) => {
    setSelectedQuote(quote);
    setCommissionModalOpen(true);
  };

  const isWhatsAppContact = (quote) => {
    return quote.notes && quote.notes.toLowerCase().includes('[whatsapp]');
  };

  const filteredQuotes = quotes.filter(q => {
    const statusMatch = filterStatus === 'all' || q.status === filterStatus;
    const contactMatch = contactFilter === 'all' || 
                         (contactFilter === 'whatsapp' && isWhatsAppContact(q)) ||
                         (contactFilter === 'form' && !isWhatsAppContact(q));
    return statusMatch && contactMatch;
  });

  return (
    <>
      <Helmet>
        <title>Gestion des Devis - Admin ArtisanCongo</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background pt-20">
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-5rem)]">
          <AdminSidebar />
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/20">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Gestion des Demandes</h1>
                <p className="text-muted-foreground mt-2">Gérez les demandes entrantes, assignez les artisans et suivez les commissions.</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border/60 overflow-hidden mb-8">
              <div className="p-4 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto overflow-x-auto">
                  <TabsList className="bg-transparent h-12">
                    <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-base font-medium px-4">Toutes</TabsTrigger>
                    <TabsTrigger value="nouvelle" className="rounded-xl data-[state=active]:bg-[hsl(var(--status-nouvelle))]/10 data-[state=active]:text-[hsl(var(--status-nouvelle))] text-base font-medium px-4">Nouvelles</TabsTrigger>
                    <TabsTrigger value="assignee" className="rounded-xl data-[state=active]:bg-[hsl(var(--status-assignee))]/10 data-[state=active]:text-[hsl(var(--status-assignee))] text-base font-medium px-4">Assignées</TabsTrigger>
                    <TabsTrigger value="en_cours" className="rounded-xl data-[state=active]:bg-[hsl(var(--status-en-cours))]/10 data-[state=active]:text-[hsl(var(--status-en-cours))] text-base font-medium px-4">En cours</TabsTrigger>
                    <TabsTrigger value="terminee" className="rounded-xl data-[state=active]:bg-[hsl(var(--status-terminee))]/10 data-[state=active]:text-[hsl(var(--status-terminee))] text-base font-medium px-4">Terminées</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={contactFilter} onValueChange={setContactFilter}>
                  <SelectTrigger className="w-full md:w-[200px] bg-background">
                    <SelectValue placeholder="Méthode de contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les méthodes</SelectItem>
                    <SelectItem value="form">Formulaire Web</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-0">
                {loading ? (
                  <div className="space-y-4 p-6">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                  </div>
                ) : filteredQuotes.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Aucune demande trouvée</h3>
                    <p className="text-muted-foreground">Il n'y a aucune demande correspondant à ce filtre.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {filteredQuotes.map(quote => (
                      <div key={quote.id} className="p-6 hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-6">
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge className={`px-3 py-1 font-semibold rounded-full border-none ${STATUS_COLORS[quote.status] || 'bg-muted text-muted-foreground'}`}>
                                {STATUS_LABELS[quote.status] || quote.status}
                              </Badge>
                              {isWhatsAppContact(quote) && (
                                <Badge className="bg-[hsl(var(--whatsapp-green))]/10 text-[hsl(var(--whatsapp-green))] border-none px-3 py-1 font-semibold rounded-full flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" /> WhatsApp
                                </Badge>
                              )}
                              <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">ID: {quote.id.substring(0,8)}</span>
                              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(quote.created).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <Wrench className="w-5 h-5 text-primary" />
                              {quote.service_type}
                            </h3>
                            
                            <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                              {quote.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm font-medium">
                              <div className="flex items-center gap-1.5 text-foreground">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {quote.location}
                              </div>
                              {quote.budget > 0 && (
                                <div className="flex items-center gap-1.5 text-green-600">
                                  <span className="font-bold">Budget:</span> {quote.budget.toLocaleString('fr-FR')} FCFA
                                </div>
                              )}
                              {quote.assigned_artisan && (
                                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                  <User className="w-4 h-4" />
                                  <span className="font-bold">Assigné:</span> {quote.assigned_artisan}
                                </div>
                              )}
                            </div>
                            
                            {quote.notes && (
                              <div className="mt-3 p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-sm text-amber-900">
                                <strong>Notes admin:</strong> {quote.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-row lg:flex-col flex-wrap gap-2 min-w-[200px] justify-start lg:justify-end shrink-0 border-t lg:border-t-0 lg:border-l border-border/50 pt-4 lg:pt-0 lg:pl-6">
                            <Select value={quote.status} onValueChange={(val) => handleStatusChange(quote.id, val)}>
                              <SelectTrigger className="h-9 w-full lg:w-full bg-background">
                                <SelectValue placeholder="Changer statut" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                  <SelectItem key={val} value={val}>{label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Button variant="outline" size="sm" className="justify-start" onClick={() => openAssignModal(quote)}>
                              <User className="w-4 h-4 mr-2" /> Assigner
                            </Button>
                            
                            <Button variant="outline" size="sm" className="justify-start" onClick={() => openNotesModal(quote)}>
                              <Edit className="w-4 h-4 mr-2" /> Notes
                            </Button>
                            
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="justify-start bg-primary/10 text-primary hover:bg-primary/20 border-transparent" 
                              onClick={() => openCommissionModal(quote)}
                            >
                              <Calculator className="w-4 h-4 mr-2" /> Commission
                            </Button>

                            <Button variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(quote.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </Button>
                          </div>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Assigner un artisan</DialogTitle>
              <DialogDescription>
                Sélectionnez l'artisan qui sera en charge de cette demande de devis.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Artisan recommandé ({selectedQuote?.location})</label>
                <Select value={selectedArtisanId} onValueChange={setSelectedArtisanId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un artisan" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {artisans
                      .sort((a, b) => {
                        if (a.city === selectedQuote?.location && b.city !== selectedQuote?.location) return -1;
                        if (b.city === selectedQuote?.location && a.city !== selectedQuote?.location) return 1;
                        return 0;
                      })
                      .map(artisan => (
                      <SelectItem key={artisan.id} value={artisan.id}>
                        {artisan.name} - {artisan.category} {artisan.city === selectedQuote?.location ? '(Sur place)' : `(${artisan.city})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setAssignModalOpen(false)} className="rounded-xl">Annuler</Button>
              <Button onClick={handleAssignSubmit} disabled={actionLoading || !selectedArtisanId} className="rounded-xl">
                {actionLoading ? 'Assignation...' : 'Confirmer l\'assignation'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Notes administratives</DialogTitle>
              <DialogDescription>
                Ajoutez des notes internes pour le suivi de cette demande. Ajoutez "[WhatsApp]" pour marquer cette demande comme provenant de WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Détails du contact, problèmes rencontrés, etc. (Ajoutez [WhatsApp] si contacté via WhatsApp)"
                className="min-h-[150px] resize-y"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setNotesModalOpen(false)} className="rounded-xl">Annuler</Button>
              <Button onClick={handleNotesSubmit} disabled={actionLoading} className="rounded-xl">
                {actionLoading ? 'Sauvegarde...' : 'Sauvegarder les notes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AdminCommissionModal 
          isOpen={commissionModalOpen}
          onClose={() => setCommissionModalOpen(false)}
          quoteId={selectedQuote?.id}
          onSuccess={fetchQuotes}
        />

      </div>
    </>
  );
};

export default AdminQuotesPage;