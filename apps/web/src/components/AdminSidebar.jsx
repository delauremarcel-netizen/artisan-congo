import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Star, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  ShieldAlert,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { currentAdmin, logout } = useAdminAuth();

  const links = [
    { name: 'Tableau de Bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Artisans', path: '/admin/artisans', icon: Users },
    { name: 'Missions', path: '/admin/missions', icon: Briefcase },
    { name: 'Avis', path: '/admin/reviews', icon: Star },
    { name: 'Leads', path: '/admin/leads', icon: MessageSquare },
    { name: 'Portfolio', path: '/admin/portfolio', icon: ImageIcon },
    { name: 'Rapports', path: '/admin/rapports', icon: FileText },
    { name: 'Paramètres', path: '/admin/parametres', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-[hsl(var(--admin-border))] shrink-0">
        <div className="w-10 h-10 bg-[hsl(var(--admin-primary))] text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-[hsl(var(--admin-text))] truncate">Admin ArtisanCongo</h2>
          <p className="text-xs text-muted-foreground truncate">{currentAdmin?.email || 'Admin'}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Menu Principal</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-[hsl(var(--admin-primary))]/10 text-[hsl(var(--admin-primary))] shadow-sm" 
                  : "text-muted-foreground hover:bg-[hsl(var(--admin-bg))] hover:text-[hsl(var(--admin-text))]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-[hsl(var(--admin-primary))]" : "")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[hsl(var(--admin-border))] shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[hsl(var(--admin-card))] border-r border-[hsl(var(--admin-border))] flex-col fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay & Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-[hsl(var(--admin-card))]">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-black/20 text-white"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;