import React from 'react';
import { canPerform, PermissionAction, getCurrentUser } from '@/services/permissions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui-1cc/tooltip';
import { Lock } from 'lucide-react';

interface ProtectedActionProps {
    permission: PermissionAction;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    showLockIcon?: boolean;
}

/**
 * Wrapper component that conditionally renders children based on user permissions.
 * If user doesn't have the required permission, shows fallback or nothing.
 */
export const ProtectedAction: React.FC<ProtectedActionProps> = ({
    permission,
    children,
    fallback,
    showLockIcon = false
}) => {
    const user = getCurrentUser();
    const hasPermission = canPerform(user, permission);

    if (hasPermission) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (showLockIcon) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="inline-flex items-center gap-1 text-muted-foreground cursor-not-allowed opacity-50">
                        <Lock className="h-3 w-3" />
                        Accès restreint
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Vous n'avez pas les droits pour cette action.</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return null;
};

/**
 * Hook to check permissions in functional components
 */
export const usePermission = (permission: PermissionAction): boolean => {
    const user = getCurrentUser();
    return canPerform(user, permission);
};

/**
 * Higher-order component for protecting entire pages/components
 */
export function withPermission<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    requiredPermission: PermissionAction,
    FallbackComponent?: React.ComponentType
) {
    return function ProtectedComponent(props: P) {
        const user = getCurrentUser();
        const hasPermission = canPerform(user, requiredPermission);

        if (!hasPermission) {
            if (FallbackComponent) {
                return <FallbackComponent />;
            }
            return (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Accès Refusé</h2>
                    <p className="text-muted-foreground">
                        Vous n'avez pas les droits nécessaires pour accéder à cette page.
                    </p>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}

export default ProtectedAction;
