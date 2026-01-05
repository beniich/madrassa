import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListItemProps {
  title: string;
  subtitle?: string;
  avatar?: string;
  initials?: string;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "secondary" | "outline";
  icon?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  rightContent?: React.ReactNode;
}

const ListItem = ({
  title,
  subtitle,
  avatar,
  initials,
  badge,
  badgeVariant = "default",
  icon,
  isSelected,
  onClick,
  className,
  rightContent,
}: ListItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50",
        isSelected && "bg-primary/10 border-l-2 border-l-primary",
        className
      )}
    >
      {(avatar || initials) && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
      
      {icon && (
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{title}</span>
          {badge && (
            <Badge variant={badgeVariant} className="text-[10px] h-5 px-1.5">
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      
      {rightContent && (
        <div className="shrink-0">
          {rightContent}
        </div>
      )}
    </button>
  );
};

export default ListItem;
