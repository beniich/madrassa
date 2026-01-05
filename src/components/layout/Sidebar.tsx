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
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

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

// ============================================================================
// CONFIGURATION DES ITEMS
// ============================================================================

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
    id: 'analytics',
    label: 'dashboard.averageGrade', // Using existing key for stats/analytics
    icon: BarChart3,
    path: '/analytics',
  },
  {
    id: 'calendar',
    label: 'common.timetable', // Or new key 'common.calendar'
    icon: Calendar,
    path: '/calendar',
    badge: 3,
    badgeColor: 'blue',
  },
  {
    id: 'documents',
    label: 'common.documents',
    icon: FileText,
    path: '/documents',
  },
  {
    id: 'schedule',
    label: 'common.timetable',
    icon: Clock,
    path: '/schedule',
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
          'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
          collapsed ? 'w-16' : 'w-80',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">{t('common.appName')}</span>
            </Link>
          )}

          {collapsed && (
            <Link to="/dashboard" className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group',
                  isActive(item.path)
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive(item.path) ? 'text-purple-600' : 'text-gray-500'
                  )}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 font-medium text-sm">{t(item.label)}</span>

                    {item.badge && item.badge > 0 && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-semibold rounded-full',
                          getBadgeColorClass(item.badgeColor)
                        )}
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip pour mode collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {t(item.label)}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-red-500 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Indicateur actif */}
                {isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-600 rounded-r-full" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Items */}
        <div className="border-t border-gray-200 p-2">
          <div className="space-y-1">
            {BOTTOM_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group',
                  isActive(item.path)
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    isActive(item.path) ? 'text-purple-600' : 'text-gray-500'
                  )}
                />

                {!collapsed && (
                  <span className="flex-1 font-medium text-sm">{t(item.label)}</span>
                )}

                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {t(item.label)}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => handleCollapse(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2.5 mt-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{t('sidebar.collapse')}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
    </>
  );
};

export default Sidebar;
