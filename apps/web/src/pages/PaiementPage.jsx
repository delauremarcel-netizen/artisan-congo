
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createPaiement, confirmerPaiement } from '@/lib/api.js';
import { formatMontant, calculCommission, calculMontantArtisan } from '@/lib/format.js';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaiementPage() {
  const { demandeId } = useParams();
  const navigate = useNavigate();
  
  const [demande, setDemande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paiementId, setPaiementId] = useState(null);
  
  const [numeroTransaction, setNumeroTransaction] = useState('');

  const phoneNumber = '+242 05 62 06 747';

  useEffect(() => {
    const loadDemande = async () => {
      try {
        const record = await pb.collection('demandes').getOne(demandeId, {
          expand: 'artisanId,artisanId.userId',
          $autoCancel: false
        });
        setDemande(record);
      } catch (err) {
        setError('Demande introuvable');
      } finally {
        setIsLoading(false);
      }
    };
    loadDemande();
  }, [demandeId]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!numeroTransaction.trim()) {
      setError('Veuillez entrer le numéro de transaction');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create payment
      const paiement = await createPaiement(demandeId, demande.montantEstime);
      setPaiementId(paiement.id);
      
      // Confirm payment with transaction number
      await confirmerPaiement(paiement.id, numeroTransaction);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard-client');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-muted/20">
        <header className="p-4 border-b bg-background">
          <Skeleton className="h-6 w-32" />
        </header>
        <div className="max-w-2xl mx-auto p-4 mt-8 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error && !demande) {
    return (
      <div className="min-h-[100dvh] bg-muted/20 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4 text-destructive">Erreur</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/dashboard-client">
            <Button>Retour au tableau de bord</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const montantTotal = demande?.montantEstime || 0;
  const commission = calculCommission(montantTotal);
  const montantArtisan = calculMontantArtisan(montantTotal);
  const artisanName = demande?.expand?.artisanId?.expand?.userId?.nom || 'Artisan';
  const artisanMetier = demande?.expand?.artisanId?.metier || '';

  return (
    <div className="min-h-[100dvh] bg-muted/20">
      <header className="p-4 border-b bg-background sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paiement du service</h1>
          <p className="text-muted-foreground">Finalisez le paiement pour votre demande de service</p>
        </div>

        {/* Service Summary */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 pb-3 border-b">Résumé du service</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Artisan</span>
              <span className="font-semibold">{artisanName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Métier</span>
              <span className="font-semibold">{artisanMetier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium text-right max-w-xs line-clamp-2">{demande?.description}</span>
            </div>
          </div>
        </Card>

        {/* Payment Breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 pb-3 border-b">Détails du paiement</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Montant total (100%)</span>
              <span className="text-xl font-bold">{formatMontant(montantTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Commission plateforme (20%)</span>
              <span className="font-semibold text-muted-foreground">{formatMontant(commission)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Montant artisan (80%)</span>
              <span className="font-semibold text-primary">{formatMontant(montantArtisan)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Instructions */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="font-bold text-lg mb-4">Instructions de paiement Mobile Money</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Envoyez le montant total via Mobile Money au numéro ci-dessous
          </p>
          
          <div className="bg-background rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Numéro de paiement</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyNumber}
                className="h-8 px-3"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1 text-primary" />
                    <span className="text-xs">Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    <span className="text-xs">Copier</span>
                  </>
                )}
              </Button>
            </div>
            <a 
              href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-primary hover:underline block"
            >
              {phoneNumber}
            </a>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <p className="font-medium text-amber-900 mb-1">Important</p>
            <p className="text-amber-800">Conservez le numéro de transaction que vous recevrez après le paiement. Vous en aurez besoin pour confirmer le paiement.</p>
          </div>
        </Card>

        {/* Transaction Form */}
        <Card className="p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Paiement confirmé</h3>
              <p className="text-muted-foreground">Redirection vers votre tableau de bord...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-bold text-lg">Confirmer le paiement</h3>
              
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="numeroTransaction">Numéro de transaction Mobile Money</Label>
                <Input
                  id="numeroTransaction"
                  type="text"
                  value={numeroTransaction}
                  onChange={(e) => setNumeroTransaction(e.target.value)}
                  placeholder="Ex: MM123456789"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Entrez le numéro de transaction que vous avez reçu après votre paiement Mobile Money
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#16A34A] hover:bg-[#16A34A]/90 text-white py-6 text-base font-semibold"
              >
                {isSubmitting ? 'Confirmation en cours...' : 'Confirmer le paiement'}
              </Button>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}
