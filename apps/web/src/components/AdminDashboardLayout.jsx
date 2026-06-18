import React, { useState, useEffect } from 'react';
import { Menu, ChevronRight, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { useAdminNotifications } from '@/hooks/useAdminNotifications.js';

const AdminDashboardLayout = ({ children, title, breadcrumbs = [] }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, loading } = useAdminNotifications();
  const unreadCount = notifications?.length || 0;

  useEffect(() => {
    const checkAdminToken = () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.warn("[AdminDashboardLayout] Missing token, redirecting to login.");
        navigate('/admin/login');
        return;
      }

      try {
        // Decode JWT payload safely
        const base64Url = token.split('.')[1];
        if (!base64Url) throw new Error('Invalid JWT structure');
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        
        // Check token expiration
        if (payload.exp && Date.now() > payload.exp * 1000) {
          throw new Error('Token expired');
        }
      } catch (err) {
        console.error("[AdminDashboardLayout] Invalid or expired token:", err);
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    };

    checkAdminToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-bg))] flex">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <header className="sticky top-0 z-30 bg-[hsl(var(--admin-card))]/80 backdrop-blur-xl border-b border-[hsl(var(--admin-border))] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-1">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 mr-2 text-muted-foreground hover:bg-[hsl(var(--admin-bg))] rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden sm:flex items-center text-sm font-medium text-muted-foreground">
              <Link to="/admin/dashboard" className="hover:text-[hsl(var(--admin-primary))] transition-colors">Admin</Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-[hsl(var(--admin-primary))] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[hsl(var(--admin-text))]">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/notifications" 
              className="relative p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {!loading && unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive border-[1.5px] border-[hsl(var(--admin-card))]"></span>
                </span>
              )}
            </Link>
            <h1 className="text-lg font-bold text-[hsl(var(--admin-text))] sm:hidden">{title}</h1>
          </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="hidden sm:flex items-center justify-between mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--admin-text))] tracking-tight">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;