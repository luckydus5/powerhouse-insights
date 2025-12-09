import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { RecentReports } from '@/components/dashboard/RecentReports';
import { DepartmentOverview } from '@/components/dashboard/DepartmentOverview';
import { useUserRole } from '@/hooks/useUserRole';
import { useReportStats } from '@/hooks/useReportStats';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { profile } = useUserRole();
  const { stats, loading } = useReportStats();

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening across your organization today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </>
          ) : (
            <>
              <KPICard
                title="Total Reports"
                value={stats.total}
                icon={<FileText className="h-5 w-5" />}
              />
              <KPICard
                title="Approved"
                value={stats.approved}
                icon={<CheckCircle className="h-5 w-5" />}
              />
              <KPICard
                title="Pending Review"
                value={stats.pending + stats.inReview}
                icon={<Clock className="h-5 w-5" />}
              />
              <KPICard
                title="Escalated"
                value={stats.escalated}
                icon={<AlertTriangle className="h-5 w-5" />}
              />
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent Reports - Takes more space */}
          <div className="lg:col-span-3">
            <RecentReports />
          </div>
          
          {/* Department Overview */}
          <div className="lg:col-span-2">
            <DepartmentOverview />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
