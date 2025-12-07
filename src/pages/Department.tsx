import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDepartments } from '@/hooks/useDepartments';
import { KPICard } from '@/components/dashboard/KPICard';
import { Plus, FileText, Users, CheckCircle, Clock } from 'lucide-react';

export default function Department() {
  const { code } = useParams<{ code: string }>();
  const { departments, loading } = useDepartments();

  const department = departments.find(d => d.code.toLowerCase() === code?.toLowerCase());

  if (loading) {
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Department KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Reports"
            value="24"
            change={5}
            changeLabel="this month"
            icon={<FileText className="h-5 w-5" />}
          />
          <KPICard
            title="Team Members"
            value="12"
            icon={<Users className="h-5 w-5" />}
          />
          <KPICard
            title="Approved"
            value="18"
            change={12}
            changeLabel="from last month"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <KPICard
            title="Pending"
            value="6"
            change={-3}
            changeLabel="from last week"
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Department Reports */}
        <Card className="shadow-corporate">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Department Reports</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No reports yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a report in this department
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
