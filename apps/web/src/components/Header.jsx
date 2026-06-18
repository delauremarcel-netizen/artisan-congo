import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Trouver un artisan', path: '/artisans' },
    { name: 'Devenir artisan', path: '/artisan-signup' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 h-[80px] flex items-center shadow-sm">
      <div className="w-full flex items-center justify-between px-4 md:px-12 max-w-[1920px] mx-auto">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-[24px] font-bold text-primary font-outfit tracking-tight group-hover:opacity-90 transition-opacity">
            Artisan Congo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center justify-center gap-[32px] flex-1 px-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[16px] font-medium transition-all duration-300 relative py-2 group
                ${isActive(link.path) ? 'text-primary' : 'text-gray-600 hover:text-primary'}
              `}
            >
              {link.name}
              {/* Hover Underline */}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 
                ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} 
              />
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            to="/artisan-login"
            className="text-[16px] font-semibold text-primary bg-transparent hover:bg-primary/5 px-6 py-2.5 rounded-lg smooth-transition"
          >
            Connexion Artisan
          </Link>
          <Link
            to="/admin-login"
            className="text-[14px] font-semibold text-gray-500 bg-transparent hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg smooth-transition"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="xl:hidden p-2 text-primary hover:bg-gray-100 rounded-lg smooth-transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden absolute top-[80px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-lg text-[16px] font-medium smooth-transition flex items-center ${
                    isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-gray-200 my-2" />
              
              <div className="flex flex-col gap-3">
                <Link
                  to="/artisan-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-[16px] font-semibold text-primary border border-primary/20 bg-transparent hover:bg-primary/5 rounded-lg smooth-transition"
                >
                  Connexion Artisan
                </Link>
                <Link
                  to="/admin-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-[16px] font-semibold text-gray-600 border border-gray-200 bg-transparent hover:bg-gray-50 rounded-lg smooth-transition"
                >
                  Connexion Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;