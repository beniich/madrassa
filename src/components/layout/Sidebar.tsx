// ============================================================================
// SIDEBAR PROFESSIONNEL - SchoolGenius
// ============================================================================
// Fichier : src/components/layout/Sidebar.tsx
// Architecture selon normes internationales (Material Design / shadcn)
// ============================================================================

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useConfig } from '@/contexts/ConfigContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  Calendar,
  FileText,
  Clock,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  LogOut,
  Menu,
  CreditCard,
  ClipboardList,
  BookOpen,
  CheckSquare
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string; // Will be translation key
  icon: React.ElementType;
  path: string;
  badge?: number;
  badgeColor?: 'red' | 'blue' | 'green' | 'yellow';
  children?: SidebarItem[];
}

interface SidebarProps {
  className?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'common.dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'students',
    label: 'common.students',
    icon: Users,
    path: '/students',
    badge: 2,
    badgeColor: 'red',
  },
  {
    id: 'teachers',
    label: 'common.teachers',
    icon: GraduationCap,
    path: '/teachers',
  },
  {
    id: 'classes',
    label: 'common.classes',
    icon: BookOpen,
    path: '/classes',
  },
  {
    id: 'attendance',
    label: 'common.attendance',
    icon: CheckSquare,
    path: '/attendance',
  },
  {
    id: 'exams',
    label: 'common.exams',
    icon: ClipboardList,
    path: '/exams',
  },
  {
    id: 'analytics',
    label: 'common.analytics',
    icon: BarChart3,
    path: '/analytics',
  },
  {
    id: 'calendar',
    label: 'common.calendar',
    icon: Calendar,
    path: '/calendar',
    badge: 3,
    badgeColor: 'blue',
  },
  {
    id: 'invoicing',
    label: 'common.invoicing',
    icon: CreditCard,
    path: '/invoicing',
  },
  {
    id: 'documents',
    label: 'common.documents',
    icon: FileText,
    path: '/documents',
  },
  {
    id: 'messages',
    label: 'common.communication',
    icon: MessageSquare,
    path: '/messages',
    badge: 5,
    badgeColor: 'red',
  },
];


const BOTTOM_ITEMS: SidebarItem[] = [
  {
    id: 'settings',
    label: 'common.settings',
    icon: Settings,
    path: '/settings',
  },
];

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export const Sidebar = ({ className, onCollapsedChange }: SidebarProps) => {
  const { t } = useTranslation();
  const { schoolProfile } = useConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const isActive = (path: string) => location.pathname === path;

  const getBadgeColorClass = (color?: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const schoolName = schoolProfile?.name || t('common.appName');
  const schoolLogo = schoolProfile?.logo;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              {schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt="School Logo"
                  className="w-8 h-8 object-contain rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-black text-xl text-sidebar-foreground tracking-tighter italic">
                School<span className="text-primary">Genius</span>
              </span>
            </Link>
          )}

          {collapsed && (
            <Link to="/dashboard" className="w-full flex justify-center">
              {schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt="School Logo"
                  className="w-8 h-8 object-contain rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              )}
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-2">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group',
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110',
                    isActive(item.path) ? 'text-white' : 'text-sidebar-foreground/50'
                  )}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 font-black text-xs uppercase tracking-widest">{t(item.label)}</span>

                    {item.badge && item.badge > 0 && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-[10px] font-black rounded-full',
                          isActive(item.path) ? 'bg-white text-primary' : getBadgeColorClass(item.badgeColor)
                        )}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Indicateur actif */}
                {isActive(item.path) && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-full shadow-[0_0_10px_white]" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Items */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="space-y-2">
            {BOTTOM_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group',
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive(item.path) ? 'text-white' : 'text-sidebar-foreground/50'
                  )}
                />

                {!collapsed && (
                  <span className="flex-1 font-black text-xs uppercase tracking-widest">{t(item.label)}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => handleCollapse(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-3 mt-4 rounded-2xl text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('sidebar.collapse')}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        title={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
    </>
  );
};

export default Sidebar;
