import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'default' | 'blue' | 'gold' | 'success' | 'warning';
  className?: string;
}

export function KPICard({ title, value, icon, variant = 'default', className }: KPICardProps) {
  const variantStyles = {
    default: 'kpi-blue',
    blue: 'kpi-blue',
    gold: 'kpi-gold',
    success: 'kpi-success',
    warning: 'kpi-warning',
  };

  const iconStyles = {
    default: 'bg-primary/15 text-primary',
    blue: 'bg-primary/15 text-primary',
    gold: 'bg-secondary/15 text-secondary',
    success: 'bg-success/15 text-success',
    warning: 'bg-destructive/15 text-destructive',
  };

  return (
    <Card className={cn(
      "shadow-corporate hover:shadow-corporate-lg transition-all duration-300 border-0 overflow-hidden group",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold text-foreground tracking-tight">{value}</p>
          </div>
          {icon && (
            <div className={cn(
              "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
              iconStyles[variant]
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
