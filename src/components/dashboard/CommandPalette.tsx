import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Calendar,
  FileText,
  Clock,
  MessageSquare,
  FolderOpen,
  Bot,
  Settings,
  Search,
} from "lucide-react";
import { usePaneContext } from "./OutlookLayout";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Élèves", href: "/dashboard/students" },
  { icon: GraduationCap, label: "Enseignants", href: "/dashboard/teachers" },
  { icon: School, label: "Classes", href: "/dashboard/classes" },
  { icon: Calendar, label: "Planning", href: "/dashboard/timetable" },
  { icon: FileText, label: "Notes", href: "/dashboard/exams" },
  { icon: Clock, label: "Présence", href: "/dashboard/attendance" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/communication" },
  { icon: FolderOpen, label: "Documents", href: "/dashboard/documents" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
];

const recentSearches = [
  { type: "student", name: "Ahmed Khalil", class: "4B" },
  { type: "student", name: "Lina Martin", class: "5A" },
  { type: "class", name: "Classe 3C", count: "28 élèves" },
];

const CommandPalette = () => {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setIsCopilotOpen } = usePaneContext();

  return (
    <CommandDialog open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen}>
      <CommandInput placeholder="Rechercher élève, classe, enseignant..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        
        <CommandGroup heading="Recherches récentes">
          {recentSearches.map((item, i) => (
            <CommandItem
              key={i}
              onSelect={() => {
                setIsCommandPaletteOpen(false);
                if (item.type === "student") {
                  navigate("/dashboard/students");
                } else {
                  navigate("/dashboard/classes");
                }
              }}
            >
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{item.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {item.class || item.count}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => {
                setIsCommandPaletteOpen(false);
                navigate(item.href);
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              setIsCommandPaletteOpen(false);
              setIsCopilotOpen(true);
            }}
          >
            <Bot className="mr-2 h-4 w-4" />
            <span>Ouvrir Copilot IA</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
