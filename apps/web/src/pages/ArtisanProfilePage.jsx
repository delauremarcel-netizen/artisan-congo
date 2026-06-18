
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { MapPin, Phone, Star, ArrowLeft, MessageSquare } from 'lucide-react';

export default function ArtisanProfilePage() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Find artisan by userId
        const record = await pb.collection('artisans').getFirstListItem(`userId="${id}"`, { 
          expand: 'userId',
          $autoCancel: false 
        });
        setArtisan(record);

        // Fetch reviews
        const reviewsData = await pb.collection('avis').getFullList({
          filter: `artisanId="${record.id}"`,
          expand: 'clientId',
          sort: '-created',
          $autoCancel: false
        });
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching artisan profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }

  if (!artisan) {
    return <div className="min-h-screen flex items-center justify-center text-lg font-bold">Artisan introuvable.</div>;
  }

  const user = artisan.expand?.userId;
  const phoneNumber = artisan.telephone || user?.telephone || '+33605884875';

  return (
    <div className="min-h-[100dvh] bg-muted/20 pb-20">
      <header className="px-6 py-4 bg-background border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link to="/search" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-8">
          <div className="h-32 bg-primary/10"></div>
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-card bg-accent overflow-hidden shrink-0">
                {user?.photo ? (
                  <img src={pb.files.getURL(user, user.photo)} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent-foreground font-bold text-4xl">
                    {user?.nom?.charAt(0) || artisan.metier.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{user?.nom || 'Artisan'}</h1>
                <p className="text-lg text-primary font-medium">{artisan.metier}</p>
              </div>
              <div className="flex items-center gap-2 pb-2 bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-bold shrink-0">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg">{artisan.avisNote > 0 ? artisan.avisNote.toFixed(1) : 'Nouveau'}</span>
                <span className="text-sm font-medium text-primary/70 ml-1">({artisan.nombreAvis || 0})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {artisan.localisation}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {phoneNumber}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/demande/${artisan.id}`} className="btn-primary flex-1 text-center py-4 text-base">
                Demander un service
              </Link>
              <a href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 text-center py-4 text-base bg-[#25D366]/10 text-[#25D366] border-[#25D366] hover:bg-[#25D366]/20">
                Contact WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-2xl border shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">À propos</h2>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {artisan.description || "Cet artisan n'a pas encore ajouté de description."}
          </p>
        </div>

        {/* Reviews */}
        <div className="bg-card rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Avis des clients
          </h2>
          
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun avis pour le moment.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{review.expand?.clientId?.nom || 'Client'}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.note ? 'fill-current' : 'text-muted stroke-2'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{review.commentaire}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
