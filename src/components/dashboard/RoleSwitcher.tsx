/**
 * SchoolGenius - Switch de rôle (pour démo/test)
 * Permet de basculer entre les vues Direction, Enseignant, Parent
 */

import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, GraduationCap, User } from 'lucide-react';

const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; color: string }> = {
    direction: {
        label: 'Direction',
        icon: Crown,
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    },
    admin: {
        label: 'Administration',
        icon: Shield,
        color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    },
    teacher: {
        label: 'Enseignant',
        icon: GraduationCap,
        color: 'bg-green-500/10 text-green-600 border-green-500/30',
    },
    parent: {
        label: 'Parent',
        icon: User,
        color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    },
};

const RoleSwitcher = () => {
    const { user, switchRole } = useAuth();

    if (!user) return null;

    const currentConfig = roleConfig[user.role];
    const Icon = currentConfig.icon;

    return (
        <div className="flex items-center gap-2">
            <Badge variant="outline" className={currentConfig.color}>
                <Icon className="h-3 w-3 mr-1" />
                {currentConfig.label}
            </Badge>

            <Select value={user.role} onValueChange={(value) => switchRole(value as UserRole)}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Changer de rôle" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(roleConfig).map(([role, config]) => {
                        const RoleIcon = config.icon;
                        return (
                            <SelectItem key={role} value={role} className="text-xs">
                                <div className="flex items-center gap-2">
                                    <RoleIcon className="h-3 w-3" />
                                    <span>{config.label}</span>
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
};

export default RoleSwitcher;
