import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Wallet, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';

const DiasporaNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/client/login');
  };

  const getInitials = (name) => {
    if (!name) return 'CL';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navItems = [
    { path: '/diaspora/projets', label: 'Mes Chantiers', icon: Building2 },
    { path: '/diaspora/budget', label: 'Budget & Finances', icon: Wallet },
    { path: '/diaspora/notifications', label: 'Notifications', icon: Bell },
    { path: '/diaspora/profil', label: 'Mon Profil', icon: User },
  ];

  return (
    <div className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      {/* Top Header */}
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Artisan Congo Logo Placeholder */}
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">A</span>
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Artisan<span className="text-yellow-500">Congo</span> <span className="text-red-600 text-xs align-top font-black">+</span>
          </span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">
            Diaspora
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-sm mr-4">
            <div className="text-right">
              <p className="font-bold text-foreground leading-tight">{user?.name || 'Client Diaspora'}</p>
              <p className="text-muted-foreground text-xs">{user?.email || 'client@example.com'}</p>
            </div>
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.avatar ? pb.files.getUrl(user, user.avatar) : ''} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" aria-label="Déconnexion">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 max-w-7xl overflow-x-auto no-scrollbar">
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-green-600 text-green-700 bg-green-50/50 dark:bg-green-900/10' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DiasporaNav;