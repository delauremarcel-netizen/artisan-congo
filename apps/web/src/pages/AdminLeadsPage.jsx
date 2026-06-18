import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import AdminDashboardLayout from '@/components/AdminDashboardLayout.jsx';
import { updateLeadStatus } from '@/lib/whatsappUtils.js';
import LeadDetailsModal from '@/components/admin/LeadDetailsModal.jsx';
import AddQuoteModal from '@/components/admin/AddQuoteModal.jsx';
import LeadsStatistics from '@/components/admin/LeadsStatistics.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, MoreVertical, Eye, FileEdit, CheckCircle, XCircle, FileText, User, Trash2, TrendingUp, AlertCircle, Filter } from 'lucide-react';

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals state
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('leads').getFullList({
        sort: '-created',
        expand: 'artisan_id',
        $autoCancel: false
      });
      setLeads(records);
    } catch (err) {
      console.error('Error fetching leads:', err);
      toast.error('Erreur lors du chargement des leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus(id, newStatus);
      toast.success(`Statut mis à jour : ${newStatus.replace('_', ' ')}`);
      // Update local state
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur de mise à jour');
    }
  };

  const handleSaveQuote = async (id, data) => {
    try {
      const updatedLead = await pb.collection('leads').update(id, data, { expand: 'artisan_id', $autoCancel: false });
      toast.success('Devis enregistré et statut mis à jour');
      setLeads(leads.map(l => l.id === id ? updatedLead : l));
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce lead ? Cette action est irréversible.')) return;
    try {
      await pb.collection('leads').delete(id, { $autoCancel: false });
      toast.success('Lead supprimé');
      setLeads(leads.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const openDetails = (lead) => {
    setSelectedLead(lead);
    setIsDetailsOpen(true);
  };

  const openQuote = (lead) => {
    setSelectedLead(lead);
    setIsQuoteOpen(true);
  };

  const filteredLeads = leads.filter(l => {
    const searchString = `${l.client_name || ''} ${l.expand?.artisan_id?.name || ''} ${l.client_email || ''}`.toLowerCase();
    const matchSearch = searchString.includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadgeStyle = (status) => {
    const map = {
      'nouveau': 'bg-blue-100 text-blue-700 border-blue-200',
      'en_cours': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'devis_envoye': 'bg-purple-100 text-purple-700 border-purple-200',
      'payé': 'bg-green-100 text-green-700 border-green-200',
      'terminé': 'bg-slate-100 text-slate-700 border-slate-200',
      'annulé': 'bg-red-100 text-red-700 border-red-200'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  // KPIs
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'nouveau').length;
  const totalRevenue = leads.reduce((sum, l) => sum + (Number(l.commission_amount) || 0), 0);

  return (
    <AdminDashboardLayout title="Gestion des Leads (Contacts & Devis)" breadcrumbs={[{ label: 'Leads' }]}>
      <Helmet><title>Leads & Devis | Admin ArtisanCongo</title></Helmet>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nouveaux Leads</p>
            <h3 className="text-2xl font-bold text-foreground">{loading ? '-' : newLeads}</h3>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
            <h3 className="text-2xl font-bold text-foreground">{loading ? '-' : totalLeads}</h3>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Revenus (Commissions)</p>
            <h3 className="text-2xl font-bold text-foreground">{loading ? '-' : `${totalRevenue.toLocaleString()} FCFA`}</h3>
          </div>
        </div>
      </div>

      <LeadsStatistics leads={leads} loading={loading} />

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between bg-muted/30">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher artisan, client..." 
              className="w-full pl-9 h-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              className="h-10 rounded-lg border border-border bg-background text-sm focus:outline-none px-3 text-foreground"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En Cours</option>
              <option value="devis_envoye">Devis Envoyé</option>
              <option value="payé">Payé</option>
              <option value="terminé">Terminé</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-sm font-medium text-muted-foreground">
                <th className="p-4 font-medium w-10"><input type="checkbox" className="rounded border-border" /></th>
                <th className="p-4 font-medium">Artisan</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium">Devis</th>
                <th className="p-4 font-medium">Paiement</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="8" className="p-4"><Skeleton className="h-10 w-full" /></td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-muted-foreground">Aucun lead trouvé.</td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-border" /></td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground truncate max-w-[150px]">
                        {lead.expand?.artisan_id?.name || 'Inconnu'}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {lead.expand?.artisan_id?.category || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-foreground truncate max-w-[150px]">{lead.client_name || 'Anonyme'}</div>
                      <div className="text-xs text-muted-foreground">{lead.client_phone || '-'}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={`capitalize ${getStatusBadgeStyle(lead.status)}`}>
                        {lead.status?.replace('_', ' ') || 'nouveau'}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">
                      {lead.devis_amount ? `${lead.devis_amount.toLocaleString()} F` : <span className="text-muted-foreground italic">-</span>}
                    </td>
                    <td className="p-4">
                      {lead.payment_status === 'payé' ? (
                        <span className="inline-flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-bold">
                          Payé
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-muted-foreground bg-muted px-2 py-1 rounded-full text-xs">
                          Non payé
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(lead.created).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 font-medium">
                          <DropdownMenuItem onClick={() => openDetails(lead)}>
                            <Eye className="w-4 h-4 mr-2" /> Voir le détail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openQuote(lead)}>
                            <FileEdit className="w-4 h-4 mr-2" /> {lead.devis_amount ? 'Modifier devis' : 'Ajouter un devis'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {lead.status === 'nouveau' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'en_cours')}>
                              <CheckCircle className="w-4 h-4 mr-2 text-yellow-600" /> Passer En cours
                            </DropdownMenuItem>
                          )}
                          {lead.status === 'devis_envoye' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'payé')}>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Marquer Payé
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, 'annulé')} className="text-orange-600 focus:text-orange-600">
                            <XCircle className="w-4 h-4 mr-2" /> Annuler
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        lead={selectedLead} 
        onStatusChange={handleStatusChange}
      />

      <AddQuoteModal 
        isOpen={isQuoteOpen} 
        onClose={() => setIsQuoteOpen(false)} 
        lead={selectedLead}
        onSave={handleSaveQuote}
      />
    </AdminDashboardLayout>
  );
};

export default AdminLeadsPage;