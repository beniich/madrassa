import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface DetailPaneProps {
  title: string;
  subtitle?: string;
  tabs?: Tab[];
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const DetailPane = ({
  title,
  subtitle,
  tabs,
  onClose,
  children,
  className,
  actions,
}: DetailPaneProps) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  return (
    <div className={cn("flex-1 flex flex-col h-full bg-background min-w-0", className)}>
      {/* Header */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-border shrink-0">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-lg truncate">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          {actions}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {tabs ? (
        <Tabs defaultValue={tabs[0]?.id} className="flex-1 flex flex-col min-h-0">
          <div className="border-b border-border px-6">
            <TabsList className="h-10 bg-transparent p-0 w-full justify-start">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 h-10"
                >
                  {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {tab.content}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DetailPane;
