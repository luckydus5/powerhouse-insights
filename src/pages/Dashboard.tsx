import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { RecentReports } from '@/components/dashboard/RecentReports';
import { DepartmentOverview } from '@/components/dashboard/DepartmentOverview';
import { GrantedDepartments } from '@/components/dashboard/GrantedDepartments';
import { useUserRole } from '@/hooks/useUserRole';
import { useReportStats } from '@/hooks/useReportStats';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { profile } = useUserRole();
  const { stats, loading } = useReportStats();

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2 pb-2">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back, <span className="text-gradient">{profile?.full_name?.split(' ')[0] || 'User'}</span>!
          </h2>
          <p className="text-muted-foreground text-lg">
            Here's what's happening across your organization today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <KPICard
                title="Total Reports"
                value={stats.total}
                icon={<FileText className="h-6 w-6" />}
                variant="blue"
              />
              <KPICard
                title="Approved"
                value={stats.approved}
                icon={<CheckCircle className="h-6 w-6" />}
                variant="success"
              />
              <KPICard
                title="Pending Review"
                value={stats.pending + stats.inReview}
                icon={<Clock className="h-6 w-6" />}
                variant="gold"
              />
              <KPICard
                title="Escalated"
                value={stats.escalated}
                icon={<AlertTriangle className="h-6 w-6" />}
                variant="warning"
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent Reports - Takes more space */}
          <div className="lg:col-span-3 space-y-6">
            <RecentReports />
          </div>
          
          {/* Right Sidebar - Department Overview + Granted Departments */}
          <div className="lg:col-span-2 space-y-6">
            <GrantedDepartments />
            <DepartmentOverview />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
