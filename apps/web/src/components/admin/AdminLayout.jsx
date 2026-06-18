import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { 
  LayoutDashboard, Users, Briefcase, DollarSign, Globe, 
  Bell, BarChart3, Settings, LogOut, Menu, X 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import apiServerClient from '@/lib/apiServerClient';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Artisans', path: '/admin/artisans', icon: Users },
  { name: 'Demandes', path: '/admin/demandes', icon: Briefcase },
  { name: 'Commissions', path: '/admin/commissions', icon: DollarSign },
  { name: 'Diaspora', path: '/admin/diaspora', icon: Globe },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await apiServerClient.fetch('/admin/notifications?read=false&limit=1');
        const data = await res.json();
        if (data.success && data.pagination) {
          setUnreadCount(data.pagination.totalItems);
        }
      } catch (err) {
        console.error("Failed to fetch unread notifications count", err);
      }
    };
    fetchUnreadCount();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      <div className="p-6 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[hsl(var(--primary-green))] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-xl">AC</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Admin</span>
        </Link>
        <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Menu Principal</p>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[hsl(var(--primary-green))] text-white shadow-md' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {item.name === 'Notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-[hsl(var(--alert-red))] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-[hsl(var(--alert-red))]/10 hover:text-[hsl(var(--alert-red))] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 z-30 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">
                Bonjour, {currentUser?.name || 'Admin'} 👋
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/admin/notifications" className="relative p-2 text-muted-foreground hover:text-primary transition-colors bg-muted rounded-full">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-[hsl(var(--alert-red))] rounded-full border-2 border-card"></span>
              )}
            </Link>
            
            <div className="h-8 w-px bg-border hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-foreground leading-none">{currentUser?.name || 'Administrateur'}</span>
                <span className="text-xs text-muted-foreground mt-1">Super Admin</span>
              </div>
              <Avatar className="w-10 h-10 border-2 border-border shadow-sm">
                <AvatarFallback className="bg-[hsl(var(--primary-green))]/10 text-[hsl(var(--primary-green))] font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
            </div>
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

export default AdminLayout;