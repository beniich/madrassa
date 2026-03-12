import { LucideIcon, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface SettingItemProps {
    icon?: LucideIcon;
    label: string;
    description?: string;
    children: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export const SettingItem = ({
    icon: Icon,
    label,
    description,
    children,
    action,
    className = '',
}: SettingItemProps) => {
    return (
        <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 transition-colors ${className}`}
        >
            <div className="flex items-start gap-4 flex-1">
                {Icon && (
                    <div className="mt-1 w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0 border border-purple-100/50">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{label}</span>
                        {action}
                    </div>
                    {description && (
                        <p className="text-xs text-gray-500 leading-relaxed max-w-lg">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {children}
            </div>
        </div>
    );
};
