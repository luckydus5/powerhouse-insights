import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { ReportsList } from '@/components/reports/ReportsList';
import { CreateReportDialog } from '@/components/reports/CreateReportDialog';

export default function Reports() {
  const { reports, loading, refetch } = useReports();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
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
            <ReportsList 
              reports={reports} 
              loading={loading}
              onCreateClick={() => setCreateDialogOpen(true)}
              onRefresh={refetch}
            />
          </CardContent>
        </Card>
      </div>

      <CreateReportDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </DashboardLayout>
  );
}
