import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Star, MessageCircle, User } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { generateWhatsAppLink, trackWhatsAppClick, validateWhatsAppNumber } from '@/lib/whatsappUtils.js';

const ArtisanCard = ({ artisan }) => {
  if (!artisan) return null;

  // Resolve Avatar
  let avatarUrl = null;
  try {
    if (artisan.photos && artisan.photos.length > 0) {
      avatarUrl = pb.files.getUrl(artisan, artisan.photos[0]);
    } else if (artisan.profile_photo) {
      avatarUrl = pb.files.getUrl(artisan, artisan.profile_photo);
    }
  } catch (error) {
    avatarUrl = null;
  }

  const rating = artisan.average_overall_rating || artisan.rating_average || 0;
  const isAvailable = artisan.availability === true || artisan.availability === 'Available';
  const whatsappNumber = artisan.whatsapp || artisan.phone;

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    if (!validateWhatsAppNumber(whatsappNumber)) return;
    trackWhatsAppClick(artisan.id).catch(() => {});
    window.open(generateWhatsAppLink(artisan), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[12px] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:scale-[1.02] smooth-transition flex flex-col h-full group">
      
      {/* Image Area */}
      <div className="w-full h-[200px] relative bg-gray-100 shrink-0">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={artisan.name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display='none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* Availability Badge Overlay */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm ${
            isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-[16px] flex flex-col flex-1">
        
        {/* Header (Name + Rating) */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-[18px] font-bold text-primary line-clamp-1" title={artisan.name}>
            {artisan.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded">
            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
            <span className="text-[14px] font-medium text-gray-700">
              {rating > 0 ? rating.toFixed(1) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Info Lines */}
        <div className="flex flex-col gap-1.5 mb-4 mt-auto pt-2">
          <div className="flex items-center gap-2 text-gray-500">
            <Briefcase className="w-4 h-4 shrink-0 text-gray-400" />
            <span className="text-[14px] font-medium line-clamp-1">{artisan.category || 'Non spécifié'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
            <span className="text-[14px] font-normal line-clamp-1">{artisan.city || 'Ville non spécifiée'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100">
          <Link 
            to={`/artisan/profile/${artisan.id}`}
            className="w-full text-center py-2 text-[14px] font-medium text-gray-600 hover:text-primary bg-gray-50 hover:bg-gray-100 rounded-[8px] smooth-transition"
          >
            Voir le profil
          </Link>
          <button 
            onClick={handleWhatsAppClick}
            disabled={!validateWhatsAppNumber(whatsappNumber)}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-[12px] px-[16px] rounded-[8px] text-[14px] font-semibold smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-4 h-4" />
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtisanCard;