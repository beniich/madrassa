import { Lock, Unlock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Permission } from '@/types/settings';

interface PermissionItemProps {
    permission: Permission;
    onToggle: (id: string, checked: boolean) => void;
}

export const PermissionItem = ({ permission, onToggle }: PermissionItemProps) => {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'students':
                return 'bg-blue-100 text-blue-700';
            case 'grades':
                return 'bg-green-100 text-green-700';
            case 'administration':
                return 'bg-purple-100 text-purple-700';
            case 'finance':
                return 'bg-amber-100 text-amber-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/10 transition-all duration-200 bg-white">
            <div className="flex items-start gap-3 mb-3 sm:mb-0">
                <div
                    className={`p-2 rounded-lg transition-colors duration-300 ${permission.enabled
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                >
                    {permission.enabled ? (
                        <Unlock className="w-5 h-5" />
                    ) : (
                        <Lock className="w-5 h-5" />
                    )}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                            {permission.name}
                        </h4>
                        <Badge
                            variant="outline"
                            className={`text-[10px] uppercase border-0 font-medium ${getCategoryColor(
                                permission.category
                            )}`}
                        >
                            {permission.category}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                        {permission.description}
                    </p>
                </div>
            </div>
            <Switch
                checked={permission.enabled}
                onCheckedChange={(checked) => onToggle(permission.id, checked)}
            />
        </div>
    );
};
