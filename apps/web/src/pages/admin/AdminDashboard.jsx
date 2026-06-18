import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Briefcase, CheckCircle, TrendingUp, AlertCircle, Check, X, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, disputes: 0 });
  const [pendingArtisans, setPendingArtisans] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const chantiers = await pb.collection('chantiers').getFullList({ $autoCancel: false }).catch(() => []);
        setStats({
          total: chantiers.length,
          inProgress: chantiers.filter(c => c.statut === 'en_cours').length,
          completed: chantiers.filter(c => c.statut === 'terminé').length,
          disputes: chantiers.filter(c => c.statut === 'litige').length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    const loadPendingArtisans = async () => {
      try {
        // Fetch all artisans requiring validation (status pending or validation_status En attente)
        const res = await pb.collection('artisans').getFullList({
          filter: "status='pending' || validation_status='En attente'",
          sort: '-created_date',
          $autoCancel: false
        });
        setPendingArtisans(res || []);
      } catch (err) {
        console.error("Error fetching pending artisans:", err);
      }
    };

    loadStats();
    loadPendingArtisans();
  }, []);

  const handleValidate = async (id) => {
    try {
      await pb.collection('artisans').update(id, { 
        status: 'active', 
        validation_status: 'Validé', 
        is_visible: true 
      }, { $autoCancel: false });
      
      toast.success('Artisan validé avec succès. Il est maintenant visible.');
      setPendingArtisans(prev => prev.filter(a => a.id !== id));
    } catch(err) {
      toast.error('Erreur lors de la validation.');
    }
  };

  const handleReject = async (id) => {
    try {
      await pb.collection('artisans').update(id, { 
        validation_status: 'Refusé', 
        status: 'pending',
        is_visible: false 
      }, { $autoCancel: false });
      
      toast.success('Artisan refusé.');
      setPendingArtisans(prev => prev.filter(a => a.id !== id));
    } catch(err) {
      toast.error('Erreur lors du refus.');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Voulez-vous vraiment supprimer définitivement cet artisan ?')) return;
    try {
      await pb.collection('artisans').delete(id, { $autoCancel: false });
      toast.success('Artisan supprimé de la base de données.');
      setPendingArtisans(prev => prev.filter(a => a.id !== id));
    } catch(err) {
      toast.error('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-elevated p-6 flex flex-col justify-center border-none">
          <Briefcase className="w-8 h-8 text-primary mb-2" />
          <h3 className="text-muted-foreground font-medium">Total Chantiers</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="card-elevated p-6 flex flex-col justify-center border-none">
          <TrendingUp className="w-8 h-8 text-secondary mb-2" />
          <h3 className="text-muted-foreground font-medium">En cours</h3>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="card-elevated p-6 flex flex-col justify-center border-none">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <h3 className="text-muted-foreground font-medium">Terminés</h3>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
        <div className="card-elevated p-6 flex flex-col justify-center border-none">
          <AlertCircle className="w-8 h-8 text-destructive mb-2" />
          <h3 className="text-muted-foreground font-medium">Litiges</h3>
          <p className="text-3xl font-bold">{stats.disputes}</p>
        </div>
      </div>

      <div className="card-elevated border-none overflow-hidden">
        <div className="p-6 border-b border-border bg-card">
          <h2 className="text-xl font-bold text-foreground">Artisans en attente de validation</h2>
          <p className="text-sm text-muted-foreground mt-1">Gérez les nouvelles inscriptions d'artisans</p>
        </div>
        <div className="p-6 bg-card">
          {pendingArtisans.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <CheckCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Aucun artisan en attente pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingArtisans.map(artisan => (
                <div key={artisan.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-5 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{artisan.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600">Nouveau</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{artisan.category} • {artisan.city}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">Email: <span className="font-medium text-foreground">{artisan.email}</span></span>
                      <span className="flex items-center gap-1">WhatsApp: <span className="font-medium text-foreground">{artisan.whatsapp || artisan.phone || 'N/A'}</span></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleValidate(artisan.id)} 
                      className="flex items-center justify-center p-2.5 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-colors" 
                      title="Valider et rendre visible"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleReject(artisan.id)} 
                      className="flex items-center justify-center p-2.5 bg-orange-500/10 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white transition-colors" 
                      title="Refuser"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/artisans`)} 
                      className="flex items-center justify-center p-2.5 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-colors" 
                      title="Gérer les artisans (Éditer)"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(artisan.id)} 
                      className="flex items-center justify-center p-2.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors" 
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}