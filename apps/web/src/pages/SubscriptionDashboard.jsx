import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, CreditCard, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

const SubscriptionDashboard = () => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
      
      try {
        // Fetch subscription
        const subRecords = await pb.collection('subscriptions').getFullList({
          filter: `artisan_id="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        
        if (subRecords.length > 0) {
          setSubscription(subRecords[0]);
        }

        // Fetch payments
        const paymentRecords = await pb.collection('payments').getList(1, 50, {
          filter: `artisan_id="${currentUser.id}"`,
          sort: '-date',
          $autoCancel: false
        });
        
        setPayments(paymentRecords.items);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1"/> Actif</Badge>;
      case 'expired': return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1"/> Expiré</Badge>;
      case 'trial': return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200"><Clock className="w-3 h-3 mr-1"/> Période d'essai</Badge>;
      default: return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const calculateDaysRemaining = () => {
    if (!subscription) return 0;
    const targetDate = subscription.status === 'trial' ? subscription.trial_end_date : subscription.next_payment_date;
    if (!targetDate) return 0;
    
    const diffTime = Math.abs(new Date(targetDate) - new Date());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <Helmet>
        <title>Mon Abonnement - ArtisanCongo</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mon Abonnement</h1>
              <p className="text-muted-foreground mt-1">Gérez votre forfait et vos paiements</p>
            </div>
            <Button asChild size="lg">
              <Link to="/payment">Renouveler l'abonnement</Link>
            </Button>
          </div>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50 pb-6 md:pb-0 md:pr-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Statut actuel</p>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(subscription?.status || 'expired')}
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50 pb-6 md:pb-0 md:px-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Prochain paiement</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">
                          {subscription?.next_payment_date ? new Date(subscription.next_payment_date).toLocaleDateString('fr-FR') : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center md:pl-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Jours restants</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{calculateDaysRemaining()}</span>
                        <span className="text-muted-foreground">jours</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Historique des paiements
                  </CardTitle>
                  <CardDescription>Vos transactions récentes</CardDescription>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Aucun paiement trouvé</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Méthode</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>ID Transaction</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{new Date(payment.date || payment.created).toLocaleDateString('fr-FR')}</TableCell>
                              <TableCell className="font-medium">{payment.amount?.toLocaleString()} CFA</TableCell>
                              <TableCell className="capitalize">{payment.payment_method?.replace('_', ' ')}</TableCell>
                              <TableCell>
                                <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'failed' ? 'destructive' : 'secondary'}>
                                  {payment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground font-mono">{payment.transaction_id || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SubscriptionDashboard;