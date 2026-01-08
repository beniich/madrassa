import { Switch } from '@/components/ui/switch';
import { LucideIcon } from 'lucide-react';

interface ToggleWithIconProps {
    icon: LucideIcon;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    color?: string; // Tailwind text color class, e.g., 'text-blue-600'
}

export const ToggleWithIcon = ({
    icon: Icon,
    label,
    description,
    checked,
    onChange,
    disabled = false,
    color = 'text-purple-600',
}: ToggleWithIconProps) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:border-purple-100 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-gray-50 ${checked ? color : 'text-gray-400'}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
        </div>
    );
};
