import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  title: string;
  department: string;
  status: 'draft' | 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const mockReports: Report[] = [
  { id: '1', title: 'Q4 Budget Review', department: 'Finance', status: 'approved', createdAt: '2 hours ago', priority: 'high' },
  { id: '2', title: 'Safety Incident #423', department: 'Safety', status: 'in_review', createdAt: '4 hours ago', priority: 'critical' },
  { id: '3', title: 'New Vendor Proposal', department: 'Procurement', status: 'pending', createdAt: '1 day ago', priority: 'medium' },
  { id: '4', title: 'System Maintenance Report', department: 'IT', status: 'draft', createdAt: '2 days ago', priority: 'low' },
  { id: '5', title: 'Customer Feedback Summary', department: 'Customer Service', status: 'rejected', createdAt: '3 days ago', priority: 'medium' },
];

const statusConfig = {
  draft: { label: 'Draft', icon: FileText, className: 'bg-muted text-muted-foreground' },
  pending: { label: 'Pending', icon: Clock, className: 'bg-warning/10 text-warning border-warning/20' },
  in_review: { label: 'In Review', icon: AlertCircle, className: 'bg-info/10 text-info border-info/20' },
  approved: { label: 'Approved', icon: CheckCircle, className: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const priorityConfig = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info/10 text-info',
  high: 'bg-warning/10 text-warning',
  critical: 'bg-destructive/10 text-destructive',
};

export function RecentReports() {
  return (
    <Card className="shadow-corporate">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
        <a href="/reports" className="text-sm text-primary hover:underline">
          View all
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockReports.map((report) => {
            const status = statusConfig[report.status];
            const StatusIcon = status.icon;
            
            return (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{report.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.department} • {report.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("capitalize text-xs", priorityConfig[report.priority])}>
                    {report.priority}
                  </Badge>
                  <Badge variant="outline" className={cn("flex items-center gap-1", status.className)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
