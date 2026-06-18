import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, MessageCircle, Calendar, Building2, Eye, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ArtisanQuotesPage = () => {
  const { currentArtisan } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // Fetch quotes where this artisan is assigned
        const records = await pb.collection('quotes').getList(1, 50, {
          filter: `artisan_id="${currentArtisan.id}"`,
          sort: '-created',
          expand: 'company_id',
          $autoCancel: false
        });
        setQuotes(records.items);
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentArtisan?.id) {
      fetchQuotes();
    }
  }, [currentArtisan?.id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/30">Rejeté</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/30">Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredQuotes = statusFilter === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === statusFilter);

  return (
    <>
      <Helmet>
        <title>Mes Devis - ArtisanCongo</title>
      </Helmet>

      <div className="min-h-screen bg-muted/20 flex flex-col">
        <Header />
        
        <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link to="/artisan-dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Demandes de devis</h1>
                <p className="text-sm text-muted-foreground">Gérez vos opportunités et répondez aux clients</p>
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les devis</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="accepted">Acceptés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredQuotes.length === 0 ? (
            <Card className="border-dashed border-2 bg-transparent">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun devis trouvé</h3>
                <p className="text-muted-foreground max-w-md">
                  {statusFilter === 'all' 
                    ? "Vous n'avez pas encore reçu de demande de devis. Assurez-vous que votre profil est complet pour attirer plus de clients."
                    : "Aucun devis ne correspond à ce statut."}
                </p>
                {statusFilter !== 'all' && (
                  <Button variant="outline" className="mt-6" onClick={() => setStatusFilter('all')}>
                    Voir tous les devis
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <Card key={quote.id} className="overflow-hidden transition-all hover:shadow-md border-border/60">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">
                              {quote.expand?.company_id?.name || 'Client Particulier'}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium line-clamp-1">
                            Demande de devis #{quote.id.substring(0, 8)}
                          </h3>
                        </div>
                        {getStatusBadge(quote.status)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {quote.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(quote.created), 'dd MMM yyyy', { locale: fr })}
                        </div>
                        {quote.amount > 0 && (
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <FileText className="w-4 h-4" />
                            {quote.amount.toLocaleString()} FCFA
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-6 md:w-64 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-border/50">
                      <Button className="w-full" variant="default">
                        <Eye className="w-4 h-4 mr-2" /> Voir détails
                      </Button>
                      <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" /> Contacter
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ArtisanQuotesPage;