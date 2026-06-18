import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { 
  LayoutDashboard, FileText, DollarSign, Bell, User, 
  Image as ImageIcon, Briefcase, BarChart3, Settings, 
  LogOut, Menu, X 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/artisan/dashboard', icon: LayoutDashboard },
  { name: 'Devis', path: '/artisan/devis', icon: FileText },
  { name: 'Commissions', path: '/artisan/commissions', icon: DollarSign },
  { name: 'Notifications', path: '/artisan/notifications', icon: Bell },
  { name: 'Profil', path: '/artisan/profil', icon: User },
  { name: 'Portfolio', path: '/artisan/portfolio', icon: ImageIcon },
  { name: 'Prestations', path: '/artisan/prestations', icon: Briefcase },
  { name: 'Statistiques', path: '/artisan/statistiques', icon: BarChart3 },
  { name: 'Paramètres', path: '/artisan/parametres', icon: Settings },
];

export const ArtisanDashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      pb.collection('artisan_notifications').getList(1, 1, {
        filter: `artisan_id="${currentUser.id}" && lu=false`,
        $autoCancel: false
      }).then(res => setUnreadCount(res.totalItems)).catch(() => {});
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/artisan/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ArtisanCongo</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.name === 'Notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 bg-card border-r border-border z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">
                Bonjour, {currentUser?.name || 'Artisan'} ! 👋
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/artisan/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card"></span>
              )}
            </Link>
            <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
            <Link to="/artisan/profil" className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-border">
                <AvatarImage src={currentUser?.profile_photo ? pb.files.getUrl(currentUser, currentUser.profile_photo) : ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {currentUser?.name?.substring(0, 2).toUpperCase() || 'AR'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-sm">
                <p className="font-bold text-foreground leading-none">{currentUser?.name}</p>
                <p className="text-muted-foreground mt-1">{currentUser?.category || 'Artisan'}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};