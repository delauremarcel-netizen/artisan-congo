
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { fetchAdminStats, fetchAdminPaiements, fetchAdminArtisans, suspendreArtisan, activerArtisan } from '@/lib/api.js';
import { formatMontant, formatDate, calculCommission, calculMontantArtisan } from '@/lib/format.js';
import { LogOut, Users, Briefcase, ClipboardList, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { currentUser, logout, role } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [paiements, setPaiements] = useState([]);
  const [artisans, setArtisans] = useState([]);
  
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingPaiements, setIsLoadingPaiements] = useState(true);
  const [isLoadingArtisans, setIsLoadingArtisans] = useState(true);
  
  const [paiementsStatut, setPaiementsStatut] = useState('');
  const [paiementsPage, setPaiementsPage] = useState(1);
  const [paiementsTotalPages, setPaiementsTotalPages] = useState(1);
  
  const [artisansStatut, setArtisansStatut] = useState('');
  const [artisansPage, setArtisansPage] = useState(1);
  const [artisansTotalPages, setArtisansTotalPages] = useState(1);
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setIsLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  // Load paiements
  useEffect(() => {
    const loadPaiements = async () => {
      setIsLoadingPaiements(true);
      try {
        const data = await fetchAdminPaiements(paiementsStatut, paiementsPage);
        setPaiements(data.items || data);
        setPaiementsTotalPages(data.totalPages || 1);
      } catch (err) {
        setError('Erreur lors du chargement des paiements');
      } finally {
        setIsLoadingPaiements(false);
      }
    };
    loadPaiements();
  }, [paiementsStatut, paiementsPage]);

  // Load artisans
  useEffect(() => {
    const loadArtisans = async () => {
      setIsLoadingArtisans(true);
      try {
        const data = await fetchAdminArtisans(artisansStatut, artisansPage);
        setArtisans(data.items || data);
        setArtisansTotalPages(data.totalPages || 1);
      } catch (err) {
        setError('Erreur lors du chargement des artisans');
      } finally {
        setIsLoadingArtisans(false);
      }
    };
    loadArtisans();
  }, [artisansStatut, artisansPage]);

  const handleSuspendreArtisan = async (artisanId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir suspendre cet artisan ?')) return;
    
    try {
      await suspendreArtisan(artisanId);
      setSuccessMessage('Artisan suspendu avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reload artisans
      const data = await fetchAdminArtisans(artisansStatut, artisansPage);
      setArtisans(data.items || data);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suspension');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleActiverArtisan = async (artisanId) => {
    try {
      await activerArtisan(artisanId);
      setSuccessMessage('Artisan activé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reload artisans
      const data = await fetchAdminArtisans(artisansStatut, artisansPage);
      setArtisans(data.items || data);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'activation');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted/20 flex flex-col">
      <header className="bg-background border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold">Administration</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {currentUser?.nom}
          </span>
          <Button onClick={logout} variant="ghost" size="sm" className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-8">
        {/* Messages */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-4 bg-primary/10 text-primary rounded-xl text-sm font-medium">
            {successMessage}
          </div>
        )}

        {/* Stats Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Vue d'ensemble</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingStats ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card className="p-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Artisans actifs</p>
                  <p className="text-3xl font-bold">{stats?.artisansActifs || 0}</p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Clients</p>
                  <p className="text-3xl font-bold">{stats?.clients || 0}</p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Demandes</p>
                  <p className="text-3xl font-bold">{stats?.demandes || 0}</p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Paiements</p>
                  <p className="text-3xl font-bold">{stats?.paiements || 0}</p>
                </Card>
              </>
            )}
          </div>
        </section>

        {/* Paiements Section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Gestion des paiements</h2>
            <Select value={paiementsStatut} onValueChange={(val) => { setPaiementsStatut(val); setPaiementsPage(1); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
                <SelectItem value="payé">Payé</SelectItem>
                <SelectItem value="remboursé">Remboursé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artisan</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Montant total</TableHead>
                    <TableHead className="text-right">Commission (20%)</TableHead>
                    <TableHead className="text-right">Montant artisan (80%)</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPaiements ? (
                    <>
                      {[1, 2, 3].map(i => (
                        <TableRow key={i}>
                          {[1, 2, 3, 4, 5, 6, 7].map(j => (
                            <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </>
                  ) : paiements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        Aucun paiement trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    paiements.map((paiement) => (
                      <TableRow key={paiement.id}>
                        <TableCell className="font-medium">{paiement.artisanNom || 'N/A'}</TableCell>
                        <TableCell>{paiement.clientNom || 'N/A'}</TableCell>
                        <TableCell className="text-right font-semibold">{formatMontant(paiement.montantTotal)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatMontant(calculCommission(paiement.montantTotal))}</TableCell>
                        <TableCell className="text-right text-primary font-medium">{formatMontant(calculMontantArtisan(paiement.montantTotal))}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            paiement.statut === 'payé' ? 'bg-green-100 text-green-800' :
                            paiement.statut === 'en attente' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {paiement.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(paiement.dateCreation)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {paiementsTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaiementsPage(p => Math.max(1, p - 1))}
                  disabled={paiementsPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {paiementsPage} sur {paiementsTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaiementsPage(p => Math.min(paiementsTotalPages, p + 1))}
                  disabled={paiementsPage === paiementsTotalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>
        </section>

        {/* Artisans Section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Gestion des artisans</h2>
            <Select value={artisansStatut} onValueChange={(val) => { setArtisansStatut(val); setArtisansPage(1); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
                <SelectItem value="supprimé">Supprimé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Métier</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead className="text-center">Note moyenne</TableHead>
                    <TableHead className="text-center">Nombre d'avis</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingArtisans ? (
                    <>
                      {[1, 2, 3].map(i => (
                        <TableRow key={i}>
                          {[1, 2, 3, 4, 5, 6, 7].map(j => (
                            <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </>
                  ) : artisans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        Aucun artisan trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    artisans.map((artisan) => (
                      <TableRow key={artisan.id}>
                        <TableCell className="font-medium">{artisan.nom || 'N/A'}</TableCell>
                        <TableCell>{artisan.metier}</TableCell>
                        <TableCell>{artisan.localisation}</TableCell>
                        <TableCell className="text-center">
                          {artisan.avisNote > 0 ? artisan.avisNote.toFixed(1) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">{artisan.nombreAvis || 0}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            artisan.statut === 'actif' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                            artisan.statut === 'suspendu' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {artisan.statut}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {artisan.statut === 'actif' ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleSuspendreArtisan(artisan.id)}
                            >
                              Suspendre
                            </Button>
                          ) : artisan.statut === 'suspendu' ? (
                            <Button
                              size="sm"
                              className="bg-[#16A34A] hover:bg-[#16A34A]/90"
                              onClick={() => handleActiverArtisan(artisan.id)}
                            >
                              Activer
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {artisansTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setArtisansPage(p => Math.max(1, p - 1))}
                  disabled={artisansPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {artisansPage} sur {artisansTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setArtisansPage(p => Math.min(artisansTotalPages, p + 1))}
                  disabled={artisansPage === artisansTotalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}
