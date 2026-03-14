// ============================================================================
// SIDEBAR PROFESSIONNEL - SchoolGenius
// ============================================================================
// Fichier : src/components/layout/Sidebar.tsx
// Architecture avec sections groupées pour une navigation claire et robuste
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
  Menu,
  CreditCard,
  ClipboardList,
  BookOpen,
  CheckSquare,
  FileSpreadsheet,
  Sparkles,
  ShieldCheck,
  Wallet,
  GitBranch,
  Shapes,
  Bot,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  badgeColor?: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
}

interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
  collapsible?: boolean;
}

interface SidebarProps {
  className?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
}

// ── Sections structurées ────────────────────────────────────────────────────

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'core',
    title: 'Principal',
    collapsible: false,
    items: [
      { id: 'dashboard', label: 'common.dashboard', icon: LayoutDashboard, path: '/dashboard' },
    ],
  },
  {
    id: 'school',
    title: 'Gestion Scolaire',
    collapsible: true,
    items: [
      { id: 'students', label: 'common.students', icon: Users, path: '/students', badge: 2, badgeColor: 'red' },
      { id: 'teachers', label: 'common.teachers', icon: GraduationCap, path: '/teachers' },
      { id: 'classes', label: 'common.classes', icon: BookOpen, path: '/classes' },
      { id: 'attendance', label: 'common.attendance', icon: CheckSquare, path: '/attendance' },
      { id: 'exams', label: 'common.exams', icon: ClipboardList, path: '/exams' },
      { id: 'analytics', label: 'common.analytics', icon: BarChart3, path: '/analytics' },
      { id: 'calendar', label: 'common.calendar', icon: Calendar, path: '/calendar', badge: 3, badgeColor: 'blue' },
      { id: 'messages', label: 'common.communication', icon: MessageSquare, path: '/messages', badge: 5, badgeColor: 'red' },
      { id: 'documents', label: 'common.documents', icon: FileText, path: '/documents' },
      { id: 'invoicing', label: 'common.invoicing', icon: CreditCard, path: '/invoicing' },
      { id: 'hr', label: 'Gestion RH', icon: Users, path: '/hr-management' },
    ],
  },
  {
    id: 'enterprise',
    title: 'Modules Entreprise',
    collapsible: true,
    items: [
      {
        id: 'ai-hub',
        label: 'AI Hub Entreprise',
        icon: Sparkles,
        path: '/ai-hub',
        badge: 1,
        badgeColor: 'purple',
      },
      {
        id: 'finance-hub',
        label: 'Finance & Conformité',
        icon: Wallet,
        path: '/finance-hub',
      },
      {
        id: 'security-hub',
        label: 'Centre de Sécurité',
        icon: ShieldCheck,
        path: '/security-hub',
      },
      {
        id: 'workflows',
        label: 'Automatisation',
        icon: GitBranch,
        path: '/workflow-board',
      },
      {
        id: 'diagrams',
        label: 'Éditeur de Diagrammes',
        icon: Shapes,
        path: '/diagrams',
      },
    ],
  },
  {
    id: 'analytics-tools',
    title: 'Outils & Données',
    collapsible: true,
    items: [
      { id: 'powerbi', label: 'Power BI', icon: TrendingUp, path: '/powerbi' },
      { id: 'googlesheets', label: 'Google Sheets', icon: FileSpreadsheet, path: '/googlesheets' },
    ],
  },
];

const BOTTOM_ITEMS: SidebarItem[] = [
  { id: 'settings', label: 'common.settings', icon: Settings, path: '/settings' },
];

// ── Composant SidebarNavItem ────────────────────────────────────────────────

const SidebarNavItem = ({
  item,
  collapsed,
  isActive,
  badgeColorClass,
}: {
  item: SidebarItem;
  collapsed: boolean;
  isActive: boolean;
  badgeColorClass: (color?: string) => string;
}) => (
  <Link
    to={item.path}
    title={collapsed ? item.label : undefined}
    className={cn(
      'flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all relative group',
      isActive
        ? 'bg-primary text-white shadow-lg shadow-primary/30'
        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    )}
  >
    <item.icon
      className={cn(
        'w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110',
        isActive ? 'text-white' : 'text-sidebar-foreground/50'
      )}
    />
    {!collapsed && (
      <>
        <span className="flex-1 font-semibold text-xs">{item.label}</span>
        {item.badge && item.badge > 0 && (
          <span
            className={cn(
              'px-1.5 py-0.5 text-[10px] font-bold rounded-full',
              isActive ? 'bg-white text-primary' : badgeColorClass(item.badgeColor)
            )}
          >
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </>
    )}
    {isActive && (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
    )}
  </Link>
);

// ── Composant Principal ─────────────────────────────────────────────────────

export const Sidebar = ({ className, onCollapsedChange }: SidebarProps) => {
  const { t } = useTranslation();
  const { schoolProfile } = useConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const handleCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (path: string) => location.pathname === path;

  const getBadgeColorClass = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-500 text-white';
      case 'blue': return 'bg-blue-500 text-white';
      case 'green': return 'bg-green-500 text-white';
      case 'yellow': return 'bg-yellow-500 text-white';
      case 'purple': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
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
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border flex-shrink-0">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
              {schoolLogo ? (
                <img src={schoolLogo} alt="School Logo" className="w-8 h-8 object-contain rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-black text-lg text-sidebar-foreground tracking-tighter italic whitespace-nowrap overflow-hidden text-ellipsis">
                School<span className="text-primary">Genius</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="w-full flex justify-center">
              {schoolLogo ? (
                <img src={schoolLogo} alt="School Logo" className="w-8 h-8 object-contain rounded-lg" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
              )}
            </Link>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin scrollbar-thumb-sidebar-border">
          {SIDEBAR_SECTIONS.map(section => {
            const isSectionCollapsed = collapsedSections[section.id];
            const hasActiveItem = section.items.some(item => isActive(item.path));

            return (
              <div key={section.id} className="mb-2">
                {/* Section Header */}
                {!collapsed && (
                  <button
                    onClick={() => section.collapsible && toggleSection(section.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 rounded-lg mb-1 transition-colors',
                      section.collapsible ? 'hover:bg-sidebar-accent cursor-pointer' : 'cursor-default',
                      hasActiveItem ? 'text-primary' : 'text-sidebar-foreground/40'
                    )}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {section.title}
                    </span>
                    {section.collapsible && (
                      isSectionCollapsed
                        ? <ChevronDown className="w-3 h-3" />
                        : <ChevronUp className="w-3 h-3" />
                    )}
                  </button>
                )}
                {/* Section Items */}
                {(!section.collapsible || !isSectionCollapsed) && (
                  <div className="space-y-0.5">
                    {section.items.map(item => (
                      <SidebarNavItem
                        key={item.id}
                        item={item}
                        collapsed={collapsed}
                        isActive={isActive(item.path)}
                        badgeColorClass={getBadgeColorClass}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-2 border-t border-sidebar-border flex-shrink-0">
          <div className="space-y-0.5">
            {BOTTOM_ITEMS.map(item => (
              <SidebarNavItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                isActive={isActive(item.path)}
                badgeColorClass={getBadgeColorClass}
              />
            ))}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => handleCollapse(!collapsed)}
            title={collapsed ? 'Agrandir' : 'Réduire'}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-2xl text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Réduire</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        title={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-lg border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
    </>
  );
};

export default Sidebar;
