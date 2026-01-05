// ============================================================================
// HEADER PROFESSIONNEL - SchoolGenius
// ============================================================================
// Fichier : src/components/layout/Header.tsx
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Globe,
} from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  className?: string;
}

export const Header = ({ sidebarCollapsed, className = '' }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguages(false);

    // For Arabic, switch direction to RTL
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  };

  // Données factices pour les notifications
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Nouvelle absence',
      message: 'Jean Dupont - Classe 5A',
      time: 'Il y a 5 min',
      unread: true,
    },
    {
      id: 2,
      type: 'info',
      title: 'Note ajoutée',
      message: 'Mathématiques - Classe 4B',
      time: 'Il y a 1h',
      unread: true,
    },
    {
      id: 3,
      type: 'success',
      title: 'Rapport généré',
      message: 'Rapport mensuel disponible',
      time: 'Il y a 2h',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${sidebarCollapsed ? 'left-16' : 'left-80'
        } ${className}`}
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left Section - School Year & Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* School Year Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
            <span className="text-sm font-semibold">2024-2025</span>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group flex items-center gap-2"
              title={t('common.language')}
            >
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-sm uppercase font-medium text-gray-700 hidden sm:block">{i18n.language.split('-')[0]}</span>
            </button>

            {showLanguages && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLanguages(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                  {[
                    { code: 'en', label: 'English', flag: '🇬🇧' },
                    { code: 'fr', label: 'Français', flag: '🇫🇷' },
                    { code: 'es', label: 'Español', flag: '🇪🇸' },
                    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
                    { code: 'pt', label: 'Português', flag: '🇵🇹' },
                    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
                    { code: 'ja', label: '日本語', flag: '🇯🇵' },
                    { code: 'no', label: 'Norsk', flag: '🇳🇴' },
                    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-50 transition-colors text-left ${i18n.language.startsWith(lang.code) ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                        }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sync Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
            title={t('common.save')}
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>

          {/* Connection Status */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">{t('common.online')}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">{t('common.offline')}</span>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
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
                      Voir toutes les notifications →
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
                    <p className="font-semibold text-gray-900">Admin Principal</p>
                    <p className="text-sm text-gray-600">admin@schoolgenius.com</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfile(false)}
                    >
                      <User className="w-4 h-4 text-gray-600" />
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
                    <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-50 transition-colors text-left">
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
