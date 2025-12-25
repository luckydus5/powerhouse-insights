import { CheckCircle2, Wrench, XCircle, Calendar } from 'lucide-react';

interface FleetKPICardsProps {
  operational: number;
  underMaintenance: number;
  outOfService: number;
  servicesThisMonth: number;
  loading?: boolean;
}

export function FleetKPICards({ 
  operational, 
  underMaintenance, 
  outOfService, 
  servicesThisMonth,
  loading 
}: FleetKPICardsProps) {
  const kpis = [
    {
      title: 'Operational Machines',
      value: operational,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-500',
      iconBg: 'bg-emerald-600'
    },
    {
      title: 'Under Maintenance',
      value: underMaintenance,
      icon: Wrench,
      bgColor: 'bg-amber-500',
      iconBg: 'bg-amber-600'
    },
    {
      title: 'Out of Service',
      value: outOfService,
      icon: XCircle,
      bgColor: 'bg-red-500',
      iconBg: 'bg-red-600'
    },
    {
      title: 'Services This Month',
      value: servicesThisMonth,
      icon: Calendar,
      bgColor: 'bg-sky-500',
      iconBg: 'bg-sky-600'
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className={`${kpi.bgColor} rounded-lg p-4 text-white shadow-lg transition-transform hover:scale-[1.02]`}
        >
          <div className="flex items-center gap-3">
            <div className={`${kpi.iconBg} rounded-full p-2`}>
              <kpi.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">{kpi.title}</p>
              <p className="text-3xl font-bold">
                {loading ? '...' : kpi.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
