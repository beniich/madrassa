// ============================================================================
// HEADER PROFESSIONNEL avec Firebase Auth - SchoolGenius
// ============================================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  RefreshCw,
  Wifi,
  WifiOff,
  UserCircle,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  sidebarCollapsed: boolean;
  className?: string;
}

export const Header = ({ sidebarCollapsed, className = '' }: HeaderProps) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Successfully logged out',
        description: 'See you soon!',
      });
      setShowProfile(false);
      navigate('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error during logout',
      });
    }
  };

  // Données factices pour les notifications
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'New absence',
      message: 'Jean Dupont - Classe 5A',
      time: 'Il y a 5 min',
      unread: true,
    },
    {
      id: 2,
      type: 'info',
      title: 'Grade added',
      message: 'Mathématiques - Classe 4B',
      time: 'Il y a 1h',
      unread: true,
    },
    {
      id: 3,
      type: 'success',
      title: 'Report generated',
      message: 'Rapport mensuel disponible',
      time: 'Il y a 2h',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-background border-b border-border z-40 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'
        } ${className}`}
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left Section - School Year & Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* School Year Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary text-primary rounded-xl border border-primary/20">
            <span className="text-xs font-black uppercase tracking-widest italic">Session 2024-2025</span>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Action Buttons */}
          <div className="flex items-center gap-1 bg-white/50 p-1 rounded-xl border border-border">
              <button
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-gray-600 hover:text-primary"
                title={t('common.save')}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="w-px h-4 bg-border mx-1" />

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-gray-600 hover:text-primary"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-white" />
                )}
              </button>
          </div>

          {/* Connection Status */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{isOnline ? t('common.online') : t('common.offline')}</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowProfile(!showProfile)}
              title="Profile menu"
              className="flex items-center gap-2 p-1 pr-3 rounded-xl bg-white border border-border hover:border-primary/50 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left mr-2">
                  <p className="text-[10px] font-black text-gray-900 leading-none">ADMIN</p>
                  <ChevronDown className="w-3 h-3 text-gray-400 mt-0.5" />
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{t('common.notifications')}</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/50' : ''
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <Link
                      to="/notifications"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      See all notifications →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              title="Menu Profile"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfile && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.displayName || 'User'}</p>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <UserCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{t('common.profile')}</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{t('common.settings')}</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">{t('common.logout')}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
