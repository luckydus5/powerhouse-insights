import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  in_review: { label: 'In Review', className: 'bg-info/10 text-info border-info/20' },
  approved: { label: 'Approved', className: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Rejected', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function Reports() {
  return (
    <DashboardLayout title="My Reports">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Reports</h2>
            <p className="text-muted-foreground">Manage and track your submitted reports</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <Card className="shadow-corporate">
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No reports yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first report to get started
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
