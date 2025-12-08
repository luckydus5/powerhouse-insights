import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDepartments } from '@/hooks/useDepartments';
import { useReports } from '@/hooks/useReports';
import { KPICard } from '@/components/dashboard/KPICard';
import { ReportsList } from '@/components/reports/ReportsList';
import { CreateReportDialog } from '@/components/reports/CreateReportDialog';
import { Plus, FileText, Users, CheckCircle, Clock } from 'lucide-react';

export default function Department() {
  const { code } = useParams<{ code: string }>();
  const { departments, loading: deptLoading } = useDepartments();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const department = departments.find(d => d.code.toLowerCase() === code?.toLowerCase());
  const { reports, loading: reportsLoading } = useReports(department?.id);

  // Calculate stats from real data
  const totalReports = reports.length;
  const approvedReports = reports.filter(r => r.status === 'approved').length;
  const pendingReports = reports.filter(r => ['pending', 'in_review'].includes(r.status)).length;

  if (deptLoading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!department) {
    return (
      <DashboardLayout title="Department Not Found">
        <Card className="shadow-corporate">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Department not found</h3>
            <p className="text-muted-foreground">The requested department does not exist.</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={department.name}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{department.name}</h2>
            <p className="text-muted-foreground">{department.description}</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Department KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Reports"
            value={totalReports.toString()}
            icon={<FileText className="h-5 w-5" />}
          />
          <KPICard
            title="Team Members"
            value="--"
            icon={<Users className="h-5 w-5" />}
          />
          <KPICard
            title="Approved"
            value={approvedReports.toString()}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <KPICard
            title="Pending"
            value={pendingReports.toString()}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Department Reports */}
        <Card className="shadow-corporate">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Department Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportsList 
              reports={reports} 
              loading={reportsLoading}
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          </CardContent>
        </Card>
      </div>

      <CreateReportDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        defaultDepartmentId={department.id}
      />
    </DashboardLayout>
  );
}
