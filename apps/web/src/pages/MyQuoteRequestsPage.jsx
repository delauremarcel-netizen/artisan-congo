import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Plus, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuoteDetailModal from '@/components/QuoteDetailModal.jsx';

const MyQuoteRequestsPage = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      let filterStr = `user_id="${currentUser.id}"`;
      if (statusFilter !== 'all') {
        filterStr += ` && status="${statusFilter}"`;
      }

      const records = await pb.collection('quote_requests').getList(1, 50, {
        filter: filterStr,
        sort: '-created_date',
        $autoCancel: false
      });
      
      setRequests(records.items);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUser, statusFilter]);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Devis reçu': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepté': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejeté': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 py-12">
      <SEOHead title="Mes demandes de devis | ArtisanCongo" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mes demandes de devis</h1>
            <p className="text-muted-foreground mt-1">Suivez l'état de vos projets et consultez les devis reçus.</p>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/demande-devis">
              <Plus className="w-4 h-4 mr-2" /> Nouvelle demande
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Historique des demandes</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-9 bg-background">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Devis reçu">Devis reçu</SelectItem>
                <SelectItem value="Accepté">Accepté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="divide-y divide-border">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 flex items-center justify-between">
                    <div className="space-y-3 w-full max-w-md">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Aucune demande trouvée</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Vous n'avez pas encore fait de demande de devis ou aucune ne correspond à votre filtre.
                </p>
                <Button asChild variant="outline">
                  <Link to="/demande-devis">Créer ma première demande</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {requests.map((request) => (
                  <div 
                    key={request.id} 
                    className="p-4 sm:p-6 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    onClick={() => openModal(request)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-semibold text-foreground truncate">
                          {request.service_type}
                        </h4>
                        <Badge variant="outline" className={getStatusColor(request.status)}>
                          {request.status || 'En attente'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span>{request.category}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{new Date(request.created_date).toLocaleDateString()}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{request.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        Voir les devis
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuoteDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        request={selectedRequest}
        onUpdate={fetchRequests}
      />
    </div>
  );
};

export default MyQuoteRequestsPage;