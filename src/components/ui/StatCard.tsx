import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: LucideIcon;
    iconColor?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon: Icon,
    iconColor = 'text-primary',
    className,
}: StatCardProps) {
    return (
        <div className={cn('stat-card', className)}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className={cn('p-2 rounded-lg bg-surface', iconColor)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{value}</p>
                {change && (
                    <span
                        className={cn('text-sm font-medium', {
                            'text-success': changeType === 'positive',
                            'text-destructive': changeType === 'negative',
                            'text-muted-foreground': changeType === 'neutral',
                        })}
                    >
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
