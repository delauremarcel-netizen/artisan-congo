import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-[48px] pb-[24px]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-12 flex flex-col gap-[48px]">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          
          {/* Logo Section */}
          <div className="max-w-xs">
            <Link to="/" className="text-[24px] font-bold text-primary mb-4 block">
              Artisan Congo
            </Link>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              La plateforme de référence pour trouver les meilleurs professionnels qualifiés pour tous vos travaux et projets.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 w-full lg:w-auto">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 mb-2">Plateforme</h4>
              <Link to="/" className="text-[16px] font-medium text-gray-500 hover:text-primary smooth-transition">Accueil</Link>
              <Link to="/artisans" className="text-[16px] font-medium text-gray-500 hover:text-primary smooth-transition">Trouver un artisan</Link>
              <Link to="/artisan-signup-simplified" className="text-[16px] font-medium text-gray-500 hover:text-primary smooth-transition">Devenir artisan</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 mb-2">Support</h4>
              <Link to="/contact" className="text-[16px] font-medium text-gray-500 hover:text-primary smooth-transition">Contact</Link>
              <Link to="/about" className="text-[16px] font-medium text-gray-500 hover:text-primary smooth-transition">À propos</Link>
              <Link to="/admin-login" className="text-[16px] font-medium text-gray-500 hover:text-primary smooth-transition">Accès Admin</Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-[24px] border-t border-gray-100 gap-4">
          <p className="text-[14px] text-gray-500">
            © {new Date().getFullYear()} Artisan Congo. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[14px] text-gray-500 hover:text-primary smooth-transition">Confidentialité</Link>
            <Link to="/terms" className="text-[14px] text-gray-500 hover:text-primary smooth-transition">Conditions générales</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;