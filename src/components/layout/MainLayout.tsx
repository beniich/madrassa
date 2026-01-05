// ============================================================================
// LAYOUT PRINCIPAL - SchoolGenius
// ============================================================================
// Fichier : src/components/layout/MainLayout.tsx
// ============================================================================

import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onCollapsedChange={setSidebarCollapsed} />

      {/* Header */}
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-80'
          }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
