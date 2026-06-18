import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, Check, X, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import AdminExportData from './AdminExportData.jsx';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminArtisansTable = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const filter = searchTerm ? `name~'${searchTerm.replace(/'/g, "\\'")}' || email~'${searchTerm.replace(/'/g, "\\'")}'` : '';
      const records = await pb.collection('artisans').getFullList({
        filter,
        sort: '-created_date',
        $autoCancel: false
      });
      setArtisans(records);
    } catch (error) {
      console.error('Error fetching artisans:', error);
      toast.error('Erreur lors du chargement des artisans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchArtisans(), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await pb.collection('artisans').update(id, { status: newStatus }, { $autoCancel: false });
      toast.success(`Statut mis à jour : ${newStatus}`);
      fetchArtisans();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Validé': return <Badge className="bg-[hsl(var(--admin-success))]/10 text-[hsl(var(--admin-success))] border-[hsl(var(--admin-success))]/20">Validé</Badge>;
      case 'En attente': return <Badge className="bg-[hsl(var(--admin-warning))]/10 text-[hsl(var(--admin-warning))] border-[hsl(var(--admin-warning))]/20">En attente</Badge>;
      case 'Suspendu': return <Badge className="bg-[hsl(var(--admin-danger))]/10 text-[hsl(var(--admin-danger))] border-[hsl(var(--admin-danger))]/20">Suspendu</Badge>;
      default: return <Badge variant="outline">{status || 'Inconnu'}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--admin-muted-foreground))]" />
          <Input 
            placeholder="Rechercher un artisan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[hsl(var(--admin-card))] border-[hsl(var(--admin-border))]"
          />
        </div>
        <div className="flex gap-2">
          <AdminExportData data={artisans} filename="artisans_list" />
        </div>
      </div>

      <div className="bg-[hsl(var(--admin-card))] rounded-2xl border border-[hsl(var(--admin-border))] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[hsl(var(--admin-muted))]/50">
              <TableRow className="border-[hsl(var(--admin-border))]">
                <TableHead className="text-[hsl(var(--admin-muted-foreground))]">Artisan</TableHead>
                <TableHead className="text-[hsl(var(--admin-muted-foreground))]">Contact</TableHead>
                <TableHead className="text-[hsl(var(--admin-muted-foreground))]">Spécialité</TableHead>
                <TableHead className="text-[hsl(var(--admin-muted-foreground))]">Statut</TableHead>
                <TableHead className="text-[hsl(var(--admin-muted-foreground))] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-[hsl(var(--admin-border))]">
                    <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : artisans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[hsl(var(--admin-muted-foreground))]">
                    Aucun artisan trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                artisans.map((artisan) => (
                  <TableRow key={artisan.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-muted))]/30">
                    <TableCell>
                      <div className="font-medium text-[hsl(var(--admin-foreground))]">{artisan.name}</div>
                      <div className="text-xs text-[hsl(var(--admin-muted-foreground))]">
                        Inscrit le {new Date(artisan.created_date || artisan.created).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{artisan.email}</div>
                      <div className="text-sm text-[hsl(var(--admin-muted-foreground))]">{artisan.phone || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{artisan.category || '-'}</div>
                      <div className="text-xs text-[hsl(var(--admin-muted-foreground))]">{artisan.city || '-'}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(artisan.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {artisan.status !== 'Validé' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(artisan.id, 'Validé')} className="text-[hsl(var(--admin-success))]">
                              <Check className="mr-2 h-4 w-4" /> Approuver
                            </DropdownMenuItem>
                          )}
                          {artisan.status !== 'Suspendu' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(artisan.id, 'Suspendu')} className="text-[hsl(var(--admin-danger))]">
                              <X className="mr-2 h-4 w-4" /> Suspendre
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminArtisansTable;