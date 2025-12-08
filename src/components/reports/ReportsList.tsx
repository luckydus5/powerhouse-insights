import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Report = Tables<'reports'> & {
  departments?: {
    name: string;
    code: string;
    color: string | null;
  } | null;
};

interface ReportsListProps {
  reports: Report[];
  loading: boolean;
  onCreateClick: () => void;
}

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  in_review: { label: 'In Review', className: 'bg-info/10 text-info border-info/20' },
  approved: { label: 'Approved', className: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  escalated: { label: 'Escalated', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-info/10 text-info' },
  high: { label: 'High', className: 'bg-warning/10 text-warning' },
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive' },
};

const typeLabels = {
  incident: 'Incident',
  financial: 'Financial',
  performance: 'Performance',
  general: 'General',
};

export function ReportsList({ reports, loading, onCreateClick }: ReportsListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No reports yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first report to get started
        </p>
        <Button onClick={onCreateClick}>
          Create Report
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card 
          key={report.id} 
          className="hover:shadow-md transition-shadow cursor-pointer group"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {report.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', statusConfig[report.status]?.className)}
                  >
                    {statusConfig[report.status]?.label}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {report.description || 'No description provided'}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </span>
                  {report.departments && (
                    <Badge variant="secondary" className="text-xs">
                      {report.departments.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[report.report_type]}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', priorityConfig[report.priority]?.className)}
                  >
                    {priorityConfig[report.priority]?.label}
                  </Badge>
                </div>
              </div>
              
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
