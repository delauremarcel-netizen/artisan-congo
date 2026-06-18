import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Search, Plus, UserPlus, CheckCircle, MapPin } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const DemandesPage = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('En attente');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDemandes = async () => {
      setLoading(true);
      try {
        const url = `/admin/demandes?status=${activeTab}&limit=20`;
        const res = await apiServerClient.fetch(url);
        const data = await res.json();
        if (data.success) {
          setDemandes(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch demandes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, [activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SEOHead title="Demandes Clients | Admin" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demandes Clients</h1>
          <p className="text-muted-foreground">Gérez les demandes de devis et les chantiers.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Demande
        </Button>
      </div>

      <Card className="admin-card">
        <div className="p-4 border-b border-border bg-muted/10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="En attente">Nouvelles</TabsTrigger>
              <TabsTrigger value="En cours">En cours</TabsTrigger>
              <TabsTrigger value="Terminé">Terminées</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-4 border-b border-border flex gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un client..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="admin-table-header">ID</th>
                <th className="admin-table-header">Client</th>
                <th className="admin-table-header">Service</th>
                <th className="admin-table-header">Montant</th>
                <th className="admin-table-header">Artisan Assigné</th>
                <th className="admin-table-header">Date</th>
                <th className="admin-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-muted-foreground">Chargement...</td></tr>
              ) : demandes.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-muted-foreground">Aucune demande trouvée pour ce statut.</td></tr>
              ) : (
                demandes.map(demande => (
                  <tr key={demande.id} className="hover:bg-muted/30 transition-colors">
                    <td className="admin-table-cell font-mono text-xs text-muted-foreground">{demande.id.substring(0,8)}</td>
                    <td className="admin-table-cell">
                      <div className="font-semibold text-foreground">{demande.nom_client}</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 mr-1" /> {demande.localisation}
                      </div>
                    </td>
                    <td className="admin-table-cell font-medium">{demande.categorie}</td>
                    <td className="admin-table-cell font-bold">{demande.montant_devis ? `${demande.montant_devis} €` : 'N/A'}</td>
                    <td className="admin-table-cell text-muted-foreground">
                      {demande.artisan_assigne ? (
                        <span className="flex items-center text-sm font-medium text-foreground"><CheckCircle className="w-4 h-4 text-success mr-1"/> Assigné</span>
                      ) : (
                        <span className="text-warning">Non assigné</span>
                      )}
                    </td>
                    <td className="admin-table-cell text-muted-foreground">
                      {new Date(demande.created).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="admin-table-cell text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Eye className="w-4 h-4" /></Button>
                        {!demande.artisan_assigne && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" title="Assigner un artisan"><UserPlus className="w-4 h-4" /></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DemandesPage;