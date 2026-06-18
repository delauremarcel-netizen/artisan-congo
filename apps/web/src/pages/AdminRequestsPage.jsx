import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, LayoutList } from 'lucide-react';
import RequestDetailsModal from '@/components/RequestDetailsModal.jsx';
import pb from '@/lib/pocketbaseClient.js';

// Status colors aligned with Congo scheme (Green for Nouvelle/Pending, Yellow for En Cours, Red for Terminee)
const STATUS_COLORS = {
  nouvelle: 'bg-primary/10 text-primary border-primary/20',
  assignee: 'bg-primary/10 text-primary border-primary/20',
  en_cours: 'bg-accent/20 text-yellow-700 border-accent/30',
  terminee: 'bg-secondary/10 text-secondary border-secondary/20',
  annulee: 'bg-muted text-muted-foreground border-border'
};

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('service_requests').getList(1, 100, {
        sort: '-created',
        $autoCancel: false
      });
      setRequests(records.items);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRowClick = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? req.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 pt-20">
      <Helmet><title>Gestion des Demandes | Admin</title></Helmet>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Demandes de devis
            </h1>
            <p className="text-muted-foreground text-sm">Gérez les requêtes clients et assignez les artisans.</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher ID ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-36 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous statuts</option>
              <option value="nouvelle">Nouvelle</option>
              <option value="assignee">Assignée</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">ID Demande</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Date</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Client</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Service / Lieu</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Chargement des demandes...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-muted-foreground">
                      <LayoutList className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      Aucune demande trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(req => (
                    <tr 
                      key={req.id} 
                      onClick={() => handleRowClick(req)}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4 font-mono font-medium text-primary">{req.request_id}</td>
                      <td className="px-4 py-4 text-muted-foreground">{new Date(req.created).toLocaleDateString()}</td>
                      <td className="px-4 py-4 font-medium">{req.client_name}</td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{req.service_type}</div>
                        <div className="text-xs text-muted-foreground">{req.location}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={`capitalize ${STATUS_COLORS[req.status] || ''}`}>
                          {req.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <RequestDetailsModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        request={selectedRequest}
        onSaved={fetchRequests}
      />
    </div>
  );
};

export default AdminRequestsPage;