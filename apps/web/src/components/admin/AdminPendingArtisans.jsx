import React, { useState, useEffect } from 'react';
import { Check, X, User, MapPin, Briefcase } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const AdminPendingArtisans = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('artisans').getFullList({
        filter: "status='En attente'",
        sort: '-created_date',
        $autoCancel: false
      });
      setPending(records);
    } catch (error) {
      console.error('Error fetching pending artisans:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, newStatus) => {
    try {
      await pb.collection('artisans').update(id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Artisan ${newStatus === 'Validé' ? 'approuvé' : 'rejeté'} avec succès`);
      fetchPending();
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <div className="text-center py-24 bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))]">
        <User className="w-12 h-12 mx-auto text-[hsl(var(--admin-muted-foreground))] mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-[hsl(var(--admin-foreground))]">Aucun artisan en attente</h3>
        <p className="text-[hsl(var(--admin-muted-foreground))]">Toutes les demandes ont été traitées.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pending.map(artisan => (
        <div key={artisan.id} className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[hsl(var(--admin-primary))]/10 rounded-full flex items-center justify-center text-[hsl(var(--admin-primary))] font-bold text-lg">
                {artisan.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-xs font-medium bg-[hsl(var(--admin-warning))]/10 text-[hsl(var(--admin-warning))] px-2 py-1 rounded-full">
                Nouveau
              </span>
            </div>
            <h3 className="text-lg font-bold text-[hsl(var(--admin-foreground))] mb-1">{artisan.name}</h3>
            <div className="space-y-2 mt-4">
              <div className="flex items-center text-sm text-[hsl(var(--admin-muted-foreground))]">
                <Briefcase className="w-4 h-4 mr-2" /> {artisan.category || 'Non spécifié'}
              </div>
              <div className="flex items-center text-sm text-[hsl(var(--admin-muted-foreground))]">
                <MapPin className="w-4 h-4 mr-2" /> {artisan.city || 'Non spécifié'}
              </div>
            </div>
            <p className="text-sm mt-4 text-[hsl(var(--admin-foreground))]/80 line-clamp-3">
              {artisan.bio || 'Aucune description fournie.'}
            </p>
          </div>
          <div className="p-4 border-t border-[hsl(var(--admin-border))] bg-[hsl(var(--admin-muted))]/30 flex gap-3">
            <Button 
              className="flex-1 bg-[hsl(var(--admin-success))] hover:bg-[hsl(var(--admin-success))]/90 text-white"
              onClick={() => handleAction(artisan.id, 'Validé')}
            >
              <Check className="w-4 h-4 mr-2" /> Approuver
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-[hsl(var(--admin-danger))] text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10"
              onClick={() => handleAction(artisan.id, 'Rejeté')}
            >
              <X className="w-4 h-4 mr-2" /> Rejeter
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPendingArtisans;