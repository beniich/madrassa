import React, { useState, createContext, useContext } from "react";
import OutlookSidebar from "./OutlookSidebar";
import OutlookTopBar from "./OutlookTopBar";
import CopilotPanel from "./CopilotPanel";
import CommandPalette from "./CommandPalette";

interface PaneContextType {
  selectedItem: any | null;
  setSelectedItem: (item: any) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
}

const PaneContext = createContext<PaneContextType | null>(null);

export const usePaneContext = () => {
  const context = useContext(PaneContext);
  if (!context) {
    throw new Error("usePaneContext must be used within OutlookLayout");
  }
  return context;
};

interface OutlookLayoutProps {
  children: React.ReactNode;
}

const OutlookLayout = ({ children }: OutlookLayoutProps) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Keyboard shortcut for command palette
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <PaneContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        activeModule,
        setActiveModule,
        isCopilotOpen,
        setIsCopilotOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
      }}
    >
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        <OutlookTopBar />
        
        <div className="flex flex-1 min-h-0">
          {/* Left Navigation Pane */}
          <OutlookSidebar />
          
          {/* Main Content Area (Center + Right Panes) */}
          <div className="flex-1 flex min-w-0 overflow-hidden">
            {children}
          </div>
          
          {/* Copilot AI Panel */}
          <CopilotPanel />
        </div>
        
        {/* Command Palette */}
        <CommandPalette />
      </div>
    </PaneContext.Provider>
  );
};

export default OutlookLayout;
