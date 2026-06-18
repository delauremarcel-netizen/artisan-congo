import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, Grid, Filter, MapPin, Calendar, MessageSquare, Star, ArrowRight } from 'lucide-react';
import PortfolioGallery from '@/components/PortfolioGallery.jsx';
import { formatProjectDate, sortProjects, filterProjectsByCategory } from '@/lib/portfolioUtils.js';

const PortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [artisan, setArtisan] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch artisan info
        const artisanRecord = await pb.collection('artisan_profiles').getFirstListItem(`artisan_id="${id}"`, { $autoCancel: false }).catch(() => null);
        
        if (!artisanRecord) {
          // If trying to access by profile record id instead of artisan auth id
          const altRecord = await pb.collection('artisan_profiles').getOne(id, { $autoCancel: false }).catch(() => null);
          if (altRecord) setArtisan(altRecord);
        } else {
          setArtisan(artisanRecord);
        }

        // Fetch projects
        const actualArtisanId = artisanRecord?.artisan_id || id;
        const projectRecords = await pb.collection('portfolio').getFullList({
          filter: `artisan_id = "${actualArtisanId}" && statut = "public"`,
          sort: '-created',
          $autoCancel: false
        });
        
        setProjects(projectRecords);

      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.categorie));
    return ['all', ...Array.from(cats)];
  }, [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = filterProjectsByCategory(projects, categoryFilter);
    result = sortProjects(result, sortBy);
    return result;
  }, [projects, categoryFilter, sortBy]);

  const handleOpenProject = async (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    // Increment view count optimistically
    try {
      await pb.collection('portfolio').update(project.id, { views_count: (project.views_count || 0) + 1 }, { $autoCancel: false });
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-32 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const artisanName = artisan?.name || 'Artisan';
  const artisanPublicId = artisan?.id || id;

  return (
    <>
      <Helmet>
        <title>Portfolio de {artisanName} | ArtisanCongo</title>
        <meta name="description" content={`Découvrez les réalisations et le portfolio de ${artisanName} sur ArtisanCongo.`} />
      </Helmet>

      <div className="min-h-screen bg-muted/20 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-10">
            <Button variant="ghost" className="mb-4 -ml-4 text-muted-foreground" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Portfolio</h1>
            <p className="text-xl text-muted-foreground mt-2">
              <Link to={`/artisan/${artisanPublicId}`} className="text-primary hover:underline font-medium">{artisanName}</Link> 
              {' '}• {projects.length} réalisations
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8 bg-card p-4 rounded-2xl shadow-sm border border-border/50">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'Tous les projets' : cat}
                </button>
              ))}
            </div>
            
            <div className="shrink-0 flex items-center">
              <select 
                className="input-base py-2 rounded-xl text-sm w-full sm:w-auto"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Récemment ajouté</option>
                <option value="oldest">Plus ancien</option>
                <option value="views">Plus consulté</option>
                <option value="rating">Mieux noté</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredAndSortedProjects.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border/50 shadow-sm">
              <Grid className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Aucun projet trouvé</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Cet artisan n'a pas encore publié de réalisations correspondant à vos critères.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProjects.map(project => (
                <div 
                  key={project.id} 
                  className="group relative flex flex-col bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenProject(project)}
                >
                  <div className="aspect-[4/3] w-full bg-muted overflow-hidden relative">
                    {project.images && project.images.length > 0 ? (
                      <img 
                        src={pb.files.getUrl(project, project.images[0], { thumb: '600x450' })} 
                        alt={project.titre} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sans image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <Button variant="secondary" className="w-full rounded-xl bg-white/90 hover:bg-white text-black backdrop-blur-sm border-none shadow-lg">
                        Voir le projet <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    {project.client_rating > 0 && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-yellow-600 flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> {project.client_rating}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3 bg-muted font-normal text-muted-foreground border-none">
                      {project.categorie}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">{project.titre}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {formatProjectDate(project.date_debut, project.date_fin)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-5xl p-0 overflow-hidden bg-card text-card-foreground flex flex-col md:flex-row h-[90vh]">
          {selectedProject && (
            <>
              {/* Left: Gallery (60% width on desktop) */}
              <div className="w-full md:w-3/5 h-[40vh] md:h-full bg-black relative">
                {selectedProject.images && selectedProject.images.length > 0 ? (
                  <PortfolioGallery 
                    images={selectedProject.images.map(img => pb.files.getUrl(selectedProject, img))}
                    onClose={() => setIsModalOpen(false)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">Aucune image</div>
                )}
              </div>

              {/* Right: Details (40% width on desktop) */}
              <div className="w-full md:w-2/5 flex flex-col h-[50vh] md:h-full">
                <div className="p-6 md:p-8 overflow-y-auto flex-1">
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{selectedProject.categorie}</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{selectedProject.titre}</h2>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {formatProjectDate(selectedProject.date_debut, selectedProject.date_fin)}</span>
                    {selectedProject.localisation && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {selectedProject.localisation}</span>}
                  </div>

                  <div className="mb-8">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">À propos du projet</h4>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedProject.description}</p>
                  </div>

                  {selectedProject.client_avis && (
                    <div className="bg-muted/40 p-6 rounded-2xl border border-border/50 relative mb-8">
                      <MessageSquare className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < selectedProject.client_rating ? 'fill-yellow-500 text-yellow-500' : 'fill-muted text-muted-foreground/30'}`} />
                        ))}
                      </div>
                      <p className="text-foreground italic relative z-10 leading-relaxed">"{selectedProject.client_avis}"</p>
                      <p className="font-semibold text-sm mt-3 text-muted-foreground">— {selectedProject.client_nom || 'Client anonyme'}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-6 border-t border-border shrink-0 bg-muted/20 flex flex-col gap-3">
                  <Button className="w-full rounded-xl h-12 text-base font-bold shadow-sm" asChild>
                    <Link to="/demande-devis">Demander un devis similaire</Link>
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl h-12 text-base bg-card border-border/60" asChild>
                    <Link to={`/artisan/${artisanPublicId}`}>Voir le profil de l'artisan</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PortfolioPage;