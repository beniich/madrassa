import React from 'react';
import { Badge } from '@/components/ui-1cc/badge';
import { AlertTriangle, AlertCircle, CheckCircle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface PatientRiskBadgeProps {
    risk?: RiskLevel;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const riskConfig: Record<RiskLevel, {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
}> = {
    low: {
        label: 'Stable',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        borderColor: 'border-green-300 dark:border-green-700',
    },
    medium: {
        label: 'Surveillance',
        icon: AlertCircle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
    },
    high: {
        label: 'Prioritaire',
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        borderColor: 'border-orange-300 dark:border-orange-700',
    },
    critical: {
        label: 'Critique',
        icon: Flame,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        borderColor: 'border-red-300 dark:border-red-700',
    },
};

export const PatientRiskBadge: React.FC<PatientRiskBadgeProps> = ({
    risk = 'low',
    showLabel = true,
    size = 'md',
    className,
}) => {
    const config = riskConfig[risk];
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'text-[10px] px-1.5 py-0.5 gap-1',
        md: 'text-xs px-2 py-1 gap-1.5',
        lg: 'text-sm px-3 py-1.5 gap-2',
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-3.5 w-3.5',
        lg: 'h-4 w-4',
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                'inline-flex items-center font-medium border',
                config.bgColor,
                config.color,
                config.borderColor,
                sizeClasses[size],
                className
            )}
        >
            <Icon className={cn(iconSizes[size], 'flex-shrink-0')} />
            {showLabel && <span>{config.label}</span>}
        </Badge>
    );
};

// Helper function to calculate risk score based on patient data
export const calculateRiskScore = (patient: {
    allergies?: string[];
    status?: string;
    diagnosis?: string;
    admissionReason?: string;
}): RiskLevel => {
    let score = 0;

    // Allergies increase risk
    if (patient.allergies && patient.allergies.length > 0) {
        score += patient.allergies.length;
    }

    // Admitted patients have higher base risk
    if (patient.status === 'admitted') {
        score += 2;
    }

    // Keywords that indicate higher risk
    const highRiskKeywords = ['urgence', 'critique', 'grave', 'aigu', 'sévère', 'cardiac', 'respiratoire'];
    const diagnosis = (patient.diagnosis || '').toLowerCase();
    const reason = (patient.admissionReason || '').toLowerCase();

    highRiskKeywords.forEach(keyword => {
        if (diagnosis.includes(keyword) || reason.includes(keyword)) {
            score += 2;
        }
    });

    // Map score to risk level
    if (score >= 6) return 'critical';
    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
};

export default PatientRiskBadge;
