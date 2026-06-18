import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/components/StatusBadge.jsx';
import { Search, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const ArtisanMissions = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (currentUser?.id) {
      fetchMissions();
    }
  }, [currentUser]);

  useEffect(() => {
    filterAndSortMissions();
  }, [missions, activeTab, searchQuery, sortBy]);

  const fetchMissions = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('missions').getFullList({
        filter: `company_id = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setMissions(records);
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error('Erreur lors du chargement des missions');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortMissions = () => {
    let filtered = [...missions];
    if (activeTab !== 'all') {
      filtered = filtered.filter(m => m.status === activeTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created) - new Date(a.created);
      if (sortBy === 'price') return (b.budget || 0) - (a.budget || 0);
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
      return 0;
    });
    setFilteredMissions(filtered);
  };

  const handleDelete = async (missionId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) return;
    try {
      await pb.collection('missions').delete(missionId, { $autoCancel: false });
      toast.success('Mission supprimée');
      fetchMissions();
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-4xl font-bold text-foreground">Mes Missions</h1>
          <button onClick={() => navigate('/artisan/mes-demandes')} className="btn-mobile-optimized bg-primary text-primary-foreground">
            Ouvrir l'artisan
          </button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre ou description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Trier par date</SelectItem>
                  <SelectItem value="price">Trier par prix</SelectItem>
                  <SelectItem value="status">Trier par statut</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes ({missions.length})</TabsTrigger>
            <TabsTrigger value="open">Ouvertes ({missions.filter(m => m.status === 'open').length})</TabsTrigger>
            <TabsTrigger value="closed">Fermées ({missions.filter(m => m.status === 'closed').length})</TabsTrigger>
            <TabsTrigger value="completed">Complétées ({missions.filter(m => m.status === 'completed').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredMissions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune mission trouvée</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? 'Aucune mission ne correspond à votre recherche.' : 'Vous n\'avez pas encore de missions.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredMissions.map((mission) => (
                  <Card key={mission.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{mission.title}</h3>
                            <StatusBadge status={mission.status} showTooltip={false} />
                          </div>
                          <p className="text-muted-foreground line-clamp-2 mb-4">
                            {mission.description || 'Aucune description'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/artisan/chantier/${mission.id}`)}
                          >
                            Voir détails
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(mission.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtisanMissions;