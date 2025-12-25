import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Fleet, FleetStatus } from '@/hooks/useFleets';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface FleetOverviewTableProps {
  fleets: Fleet[];
  loading?: boolean;
}

const statusConfig: Record<FleetStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  operational: { label: 'Operational', variant: 'default' },
  under_maintenance: { label: 'Under Maintenance', variant: 'secondary' },
  out_of_service: { label: 'Out of Service', variant: 'destructive' }
};

export function FleetOverviewTable({ fleets, loading }: FleetOverviewTableProps) {
  if (loading) {
    return (
      <Card className="shadow-corporate">
        <CardHeader>
          <CardTitle>Fleet Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-corporate">
      <CardHeader>
        <CardTitle>Fleet Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fleet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Next Service</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No fleet machines registered yet
                  </TableCell>
                </TableRow>
              ) : (
                fleets.map((fleet) => {
                  const config = statusConfig[fleet.status];
                  return (
                    <TableRow key={fleet.id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold">{fleet.fleet_number}</TableCell>
                      <TableCell>{fleet.machine_type}</TableCell>
                      <TableCell>{fleet.operator?.full_name || fleet.operator?.email || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={config.variant}
                          className={
                            fleet.status === 'operational' ? 'bg-emerald-500 hover:bg-emerald-600' :
                            fleet.status === 'under_maintenance' ? 'bg-amber-500 hover:bg-amber-600' :
                            'bg-red-500 hover:bg-red-600'
                          }
                        >
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {fleet.last_maintenance?.maintenance_date 
                          ? format(new Date(fleet.last_maintenance.maintenance_date), 'MM/dd/yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {fleet.last_maintenance?.next_service_due 
                          ? format(new Date(fleet.last_maintenance.next_service_due), 'MM/dd/yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground italic">
                        {fleet.last_maintenance?.remarks || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
