import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDepartments } from '@/hooks/useDepartments';
import { 
  DollarSign, 
  Shield, 
  ShoppingCart, 
  Settings, 
  Users, 
  Monitor, 
  Headphones, 
  Wrench 
} from 'lucide-react';

const departmentIcons: Record<string, typeof DollarSign> = {
  'FIN': DollarSign,
  'SAF': Shield,
  'PRO': ShoppingCart,
  'OPS': Settings,
  'HR': Users,
  'IT': Monitor,
  'CS': Headphones,
  'ENG': Wrench,
};

const departmentColors: Record<string, string> = {
  'FIN': 'bg-blue-500',
  'SAF': 'bg-red-500',
  'PRO': 'bg-green-500',
  'OPS': 'bg-orange-500',
  'HR': 'bg-purple-500',
  'IT': 'bg-cyan-500',
  'CS': 'bg-pink-500',
  'ENG': 'bg-yellow-500',
};

// Mock data for department performance
const departmentStats: Record<string, { reports: number; pending: number; completion: number }> = {
  'FIN': { reports: 24, pending: 3, completion: 87 },
  'SAF': { reports: 18, pending: 5, completion: 72 },
  'PRO': { reports: 31, pending: 2, completion: 94 },
  'OPS': { reports: 45, pending: 8, completion: 82 },
  'HR': { reports: 12, pending: 1, completion: 92 },
  'IT': { reports: 28, pending: 4, completion: 86 },
  'CS': { reports: 56, pending: 7, completion: 88 },
  'ENG': { reports: 22, pending: 3, completion: 86 },
};

export function DepartmentOverview() {
  const { departments, loading } = useDepartments();

  if (loading) {
    return (
      <Card className="shadow-corporate">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-corporate">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Department Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept) => {
            const Icon = departmentIcons[dept.code] || Shield;
            const stats = departmentStats[dept.code] || { reports: 0, pending: 0, completion: 0 };
            const colorClass = departmentColors[dept.code] || 'bg-primary';
            
            return (
              <div
                key={dept.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className={`p-2.5 rounded-lg ${colorClass}/10`}>
                  <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{dept.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {stats.reports} reports
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={stats.completion} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-foreground w-12">
                      {stats.completion}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
