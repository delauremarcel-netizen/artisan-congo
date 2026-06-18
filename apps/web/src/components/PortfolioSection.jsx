import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Calendar, Quote } from 'lucide-react';
import PortfolioGallery from './PortfolioGallery';
import PortfolioForm from './PortfolioForm';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const PortfolioSection = ({ artisanId, isOwner = false }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('portfolio').getFullList({
        filter: `artisan_id="${artisanId}"`,
        sort: '-completion_date',
        $autoCancel: false
      });
      setProjects(records);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artisanId) {
      fetchPortfolio();
    }
  }, [artisanId]);

  const handleEdit = (project) => {
    setEditingItem(project);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;
    try {
      await pb.collection('portfolio').delete(id, { $autoCancel: false });
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Projet supprimé');
    } catch (error) {
      toast.error('Échec de la suppression du projet');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-24 w-full mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isOwner && (
        <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl border border-border/50">
          <div>
            <h3 className="font-semibold text-lg">Portfolio</h3>
            <p className="text-sm text-muted-foreground">Présentez vos projets terminés ({projects.length})</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter un projet
          </Button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border/60">
          <p className="text-muted-foreground">Aucun projet de portfolio ajouté pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="p-6 border-b bg-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold leading-tight mb-2 text-balance">{project.project_title}</h3>
                      {project.completion_date && (
                        <div className="flex items-center text-sm text-muted-foreground mb-4 font-medium font-variant-numeric tabular-nums">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          {new Date(project.completion_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                        </div>
                      )}
                    </div>
                    {isOwner && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(project)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleDelete(project.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {project.description && (
                    <p className="text-muted-foreground leading-relaxed mb-4 max-w-[65ch]">
                      {project.description}
                    </p>
                  )}

                  {project.testimonial && (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mt-4 relative">
                      <Quote className="w-6 h-6 text-primary/20 absolute top-3 left-3" />
                      <p className="text-sm italic text-foreground/80 pl-8 relative z-10 leading-relaxed">
                        "{project.testimonial}"
                      </p>
                    </div>
                  )}
                </div>
                
                {project.photos && project.photos.length > 0 && (
                  <div className="p-6 bg-muted/10">
                    <PortfolioGallery record={project} photos={project.photos} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PortfolioForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        onSuccess={fetchPortfolio}
        initialData={editingItem}
      />
    </div>
  );
};

export default PortfolioSection;