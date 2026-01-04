import React from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CenterPaneProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
  className?: string;
}

const CenterPane = ({
  title,
  searchPlaceholder = "Rechercher...",
  onSearch,
  onAdd,
  addLabel = "Ajouter",
  children,
  className,
}: CenterPaneProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("w-80 border-r border-border flex flex-col h-full bg-card/50", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              {addLabel}
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-9 h-9 text-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CenterPane;
