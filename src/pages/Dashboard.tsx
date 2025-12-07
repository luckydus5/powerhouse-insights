import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { RecentReports } from '@/components/dashboard/RecentReports';
import { DepartmentOverview } from '@/components/dashboard/DepartmentOverview';
import { useUserRole } from '@/hooks/useUserRole';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { profile, highestRole } = useUserRole();

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
          <KPICard
            title="Total Reports"
            value="236"
            change={12}
            changeLabel="from last month"
            icon={<FileText className="h-5 w-5" />}
          />
          <KPICard
            title="Approved"
            value="189"
            change={8}
            changeLabel="from last month"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <KPICard
            title="Pending Review"
            value="33"
            change={-5}
            changeLabel="from last month"
            icon={<Clock className="h-5 w-5" />}
          />
          <KPICard
            title="Escalated"
            value="14"
            change={2}
            changeLabel="requires attention"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
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
