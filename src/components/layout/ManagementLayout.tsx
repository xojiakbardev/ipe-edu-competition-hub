import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, hasRole } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  HelpCircle, 
  BarChart3, 
  LogOut,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/types';

interface ManagementLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: UserRole[];
}

const navItems: NavItem[] = [
  { 
    label: 'Dashboard', 
    path: '/management/dashboard', 
    icon: <LayoutDashboard className="w-5 h-5" />,
    allowedRoles: ['teacher', 'admin', 'super-admin']
  },
  { 
    label: 'Testlar', 
    path: '/management/tests', 
    icon: <FileText className="w-5 h-5" />,
    allowedRoles: ['teacher', 'admin', 'super-admin']
  },
  { 
    label: 'Savollar', 
    path: '/management/questions', 
    icon: <HelpCircle className="w-5 h-5" />,
    allowedRoles: ['teacher', 'admin', 'super-admin']
  },
  { 
    label: 'Statistika', 
    path: '/management/statistics', 
    icon: <BarChart3 className="w-5 h-5" />,
    allowedRoles: ['admin', 'super-admin']
  },
];

const ManagementLayout = ({ children }: ManagementLayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role: UserRole) => {
    const badges: Record<UserRole, { label: string; className: string }> = {
      'student': { label: "O'quvchi", className: 'bg-primary/10 text-primary' },
      'teacher': { label: "O'qituvchi", className: 'bg-success/10 text-success' },
      'admin': { label: 'Admin', className: 'bg-accent/10 text-accent' },
      'super-admin': { label: 'Super Admin', className: 'bg-destructive/10 text-destructive' },
    };
    return badges[role];
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  // Filter nav items by role
  const visibleNavItems = navItems.filter(item => 
    user && hasRole(user, item.allowedRoles)
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-card border border-border"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-sidebar text-sidebar-foreground 
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-sidebar-foreground">IPe Education</h1>
                <p className="text-xs text-sidebar-foreground/60">Boshqaruv paneli</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground font-medium">
                {user?.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-sidebar-foreground truncate">
                  {user?.fullName}
                </p>
                {roleBadge && (
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${roleBadge.className}`}>
                    {roleBadge.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Chiqish
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ManagementLayout;
