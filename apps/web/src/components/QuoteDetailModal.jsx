import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, MapPin, FileText, User } from 'lucide-react';

const QuoteDetailModal = ({ isOpen, onClose, request, onUpdate }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (isOpen && request?.id) {
      fetchQuotes();
    }
  }, [isOpen, request]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('quotes').getFullList({
        filter: `quote_request_id="${request.id}"`,
        expand: 'artisan_id',
        sort: '-created',
        $autoCancel: false
      });
      setQuotes(records);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Impossible de charger les devis reçus.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    try {
      setActionLoading(quoteId);
      
      // Update the accepted quote
      await pb.collection('quotes').update(quoteId, {
        status: 'accepted'
      }, { $autoCancel: false });

      // Update the request status
      await pb.collection('quote_requests').update(request.id, {
        status: 'Accepté'
      }, { $autoCancel: false });

      toast.success('Devis accepté avec succès ! L\'artisan sera notifié.');
      fetchQuotes();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast.error('Erreur lors de l\'acceptation du devis.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineQuote = async (quoteId) => {
    try {
      setActionLoading(quoteId);
      await pb.collection('quotes').update(quoteId, {
        status: 'rejected'
      }, { $autoCancel: false });
      
      toast.success('Devis refusé.');
      fetchQuotes();
    } catch (error) {
      console.error('Error declining quote:', error);
      toast.error('Erreur lors du refus du devis.');
    } finally {
      setActionLoading(null);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl">{request.service_type}</DialogTitle>
            <Badge variant={request.status === 'Accepté' ? 'default' : 'secondary'}>
              {request.status || 'En attente'}
            </Badge>
          </div>
          <DialogDescription>
            Détails de votre demande et devis reçus
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          {/* Request Details */}
          <div className="bg-muted/30 p-4 rounded-xl space-y-3 border border-border">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description du projet
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.description}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" /> {request.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" /> {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString() : 'Non spécifié'}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Budget:</span> {request.budget_range}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Catégorie:</span> {request.category}
              </div>
            </div>
          </div>

          {/* Quotes List */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Devis reçus ({quotes.length})</h4>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="p-4 border border-border rounded-xl space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-5 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-end gap-2 pt-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">Aucun devis reçu pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className={`p-4 border rounded-xl space-y-3 transition-colors ${quote.status === 'accepted' ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{quote.expand?.artisan_id?.name || 'Artisan'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(quote.created).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">{quote.amount.toLocaleString()} FC</p>
                        <Badge variant="outline" className="text-xs font-normal">
                          Délai: {quote.timeline}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {quote.description}
                    </div>

                    {request.status !== 'Accepté' && quote.status === 'pending' && (
                      <div className="flex justify-end gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                          onClick={() => handleDeclineQuote(quote.id)}
                          disabled={actionLoading !== null}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Refuser
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptQuote(quote.id)}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === quote.id ? (
                            <Skeleton className="w-4 h-4 rounded-full mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Accepter ce devis
                        </Button>
                      </div>
                    )}
                    
                    {quote.status === 'accepted' && (
                      <div className="flex items-center justify-end gap-2 text-sm font-medium text-primary pt-2">
                        <CheckCircle className="w-4 h-4" /> Devis accepté
                      </div>
                    )}
                    {quote.status === 'rejected' && (
                      <div className="flex items-center justify-end gap-2 text-sm font-medium text-muted-foreground pt-2">
                        <XCircle className="w-4 h-4" /> Devis refusé
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDetailModal;