import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ArtisanSidebar from '@/components/ArtisanSidebar.jsx';
import MissionCard from '@/components/MissionCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const ArtisanMissionsPage = () => {
  const { currentUser } = useAuth();
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchMissions = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);

        // Fetch all missions for this artisan
        const missionsData = await pb.collection('missions').getFullList({
          sort: '-created',
          $autoCancel: false,
        });

        setMissions(missionsData);
        setFilteredMissions(missionsData);
      } catch (err) {
        console.error('Error fetching missions:', err);
        toast.error('Erreur lors du chargement des missions');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [currentUser]);

  useEffect(() => {
    let filtered = [...missions];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(mission => mission.status === statusFilter);
    }

    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created) - new Date(b.created));
    } else if (sortBy === 'deadline') {
      filtered.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    }

    setFilteredMissions(filtered);
  }, [missions, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <ArtisanSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ArtisanSidebar />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Mes Missions
              </h1>
              <p className="text-muted-foreground">
                {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''} trouvée{filteredMissions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Statut
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="Nouveau">Nouveau</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminé">Terminé</SelectItem>
                      <SelectItem value="Annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Trier par
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus récent</SelectItem>
                      <SelectItem value="oldest">Plus ancien</SelectItem>
                      <SelectItem value="deadline">Échéance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Missions Grid */}
          {filteredMissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucune mission trouvée
                </h3>
                <p className="text-muted-foreground">
                  {statusFilter !== 'all' 
                    ? 'Essayez de modifier les filtres pour voir plus de résultats.'
                    : 'Vous n\'avez pas encore de missions.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanMissionsPage;