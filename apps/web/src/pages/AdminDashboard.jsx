import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Briefcase, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, disputes: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const chantiers = await pb.collection('chantiers').getFullList({ $autoCancel: false });
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
    load();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate('/admin/dashboard')} className="btn-mobile-optimized bg-secondary text-secondary-foreground">
            Recharger admin
          </button>
          <button onClick={() => navigate('/artisan/mes-demandes')} className="btn-mobile-optimized bg-primary text-primary-foreground">
            Ouvrir l'artisan
          </button>
          <button onClick={() => navigate('/client/nouvelle-demande')} className="btn-mobile-optimized bg-foreground text-background">
            Créer
          </button>
          <button onClick={() => navigate('/admin/chantiers')} className="btn-mobile-optimized bg-muted text-foreground">
            Voir Chantiers
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-elevated p-6 flex flex-col justify-center">
          <Briefcase className="w-8 h-8 text-primary mb-2" />
          <h3 className="text-muted-foreground">Total Chantiers</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="card-elevated p-6 flex flex-col justify-center">
          <TrendingUp className="w-8 h-8 text-secondary mb-2" />
          <h3 className="text-muted-foreground">En cours</h3>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="card-elevated p-6 flex flex-col justify-center">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <h3 className="text-muted-foreground">Terminés</h3>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
        <div className="card-elevated p-6 flex flex-col justify-center">
          <AlertCircle className="w-8 h-8 text-danger mb-2" />
          <h3 className="text-muted-foreground">Litiges</h3>
          <p className="text-3xl font-bold">{stats.disputes}</p>
        </div>
      </div>
    </div>
  );
}