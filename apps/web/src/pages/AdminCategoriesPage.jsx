import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ category_name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const records = await pb.collection('categories').getFullList({
        sort: 'category_name',
        $autoCancel: false
      });
      setCategories(records);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Échec du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ category_name: category.category_name, description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ category_name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await pb.collection('categories').update(editingCategory.id, formData, { $autoCancel: false });
        toast.success('Catégorie mise à jour');
      } else {
        await pb.collection('categories').create(formData, { $autoCancel: false });
        toast.success('Catégorie créée');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error('Échec de l\'enregistrement de la catégorie');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ? Cela pourrait affecter les artisans qui l\'utilisent.')) return;
    
    try {
      await pb.collection('categories').delete(id, { $autoCancel: false });
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Catégorie supprimée');
    } catch (error) {
      toast.error('Échec de la suppression de la catégorie');
    }
  };

  return (
    <>
      <Helmet>
        <title>Gérer les catégories - Admin</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30 pt-20">
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
              <p className="text-muted-foreground">Gérer les catégories de services des artisans</p>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" /> Ajouter une catégorie
            </Button>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la catégorie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Chargement des catégories...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Aucune catégorie trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.category_name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-md truncate">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(category)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="ex: Plomberie"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optionnel)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brève description de la catégorie..."
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer la catégorie'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminCategoriesPage;