import React, { useState, useEffect } from 'react';
import { ArtisanDashboardLayout } from '@/components/artisan/ArtisanDashboardLayout.jsx';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const PortfolioPage = () => {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!currentUser) return;
      try {
        const res = await pb.collection('artisan_portfolio').getFullList({
          filter: `artisan_id="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setPortfolio(res);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [currentUser]);

  return (
    <ArtisanDashboardLayout>
      <SEOHead title="Portfolio | ArtisanCongo" />
      
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
            <p className="text-muted-foreground">Mettez en valeur vos meilleures réalisations.</p>
          </div>
          <Button className="gap-2"><Upload className="w-4 h-4" /> Ajouter une réalisation</Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : portfolio.length === 0 ? (
          <Card className="dashboard-card bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Aucune réalisation</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Un portfolio bien rempli augmente vos chances d'être choisi par les clients de 70%.
              </p>
              <Button><Upload className="w-4 h-4 mr-2" /> Ajouter ma première photo</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {portfolio.map((item) => (
              <div key={item.id} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-muted border border-border">
                <img 
                  src={pb.files.getUrl(item, item.photo)} 
                  alt={item.titre} 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full mb-1">
                      {item.categorie_service}
                    </span>
                    <h4 className="text-white font-bold leading-tight">{item.titre}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ArtisanDashboardLayout>
  );
};

export default PortfolioPage;