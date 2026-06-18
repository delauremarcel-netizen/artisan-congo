import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, MapPin, Calendar, FileText, Check, X, Edit } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const DevisDetailPage = () => {
  const { id } = useParams();
  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const record = await pb.collection('artisan_devis').getOne(id, { $autoCancel: false });
        setDevis(record);
      } catch (error) {
        console.error("Error fetching devis details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDevis();
  }, [id]);

  if (loading) return <ArtisanDashboardLayout><div className="p-8 text-center">Chargement...</div></ArtisanDashboardLayout>;
  if (!devis) return <ArtisanDashboardLayout><div className="p-8 text-center">Devis introuvable.</div></ArtisanDashboardLayout>;

  return (
    <ArtisanDashboardLayout>
      <SEOHead title={`Devis ${devis.id} | ArtisanCongo`} />
      
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/artisan/devis"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Détails du devis</h1>
              <span className={`badge-status-${devis.statut}`}>{devis.statut.replace('_', ' ')}</span>
            </div>
            <p className="text-muted-foreground text-sm">Réf: {devis.id}</p>
          </div>
          
          {devis.statut === 'en_attente' && (
            <div className="ml-auto flex gap-3">
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                <X className="w-4 h-4 mr-2" /> Refuser
              </Button>
              <Button className="bg-success hover:bg-success/90 text-success-foreground">
                <Check className="w-4 h-4 mr-2" /> Accepter
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Description du service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
                  <p className="font-semibold text-foreground">{devis.service_categorie}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description détaillée</p>
                  <p className="text-foreground bg-muted/30 p-4 rounded-xl mt-1">{devis.service_description}</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{devis.service_localisation}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Détails financiers</CardTitle>
                {devis.statut === 'en_attente' && (
                  <Button variant="ghost" size="sm" className="text-primary"><Edit className="w-4 h-4 mr-2" /> Modifier</Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Montant HT</span>
                    <span>{devis.montant} €</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>TVA</span>
                    <span>{devis.tva || 0} €</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-bold text-lg text-foreground">
                    <span>Total TTC</span>
                    <span>{devis.montant_total} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-bold text-foreground">{devis.client_nom}</p>
                <p className="text-sm text-muted-foreground">{devis.client_email}</p>
                <p className="text-sm text-muted-foreground">{devis.client_telephone}</p>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Dates clés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Création</span>
                  <span className="font-medium">{new Date(devis.created).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiration</span>
                  <span className="font-medium">{new Date(devis.date_expiration).toLocaleDateString('fr-FR')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ArtisanDashboardLayout>
  );
};

export default DevisDetailPage;