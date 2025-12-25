import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type FleetStatus = 'operational' | 'under_maintenance' | 'out_of_service';

export interface Fleet {
  id: string;
  fleet_number: string;
  machine_type: string;
  status: FleetStatus;
  operator_id: string | null;
  department_id: string;
  created_at: string;
  updated_at: string;
  operator?: {
    full_name: string | null;
    email: string;
  } | null;
  last_maintenance?: {
    maintenance_date: string;
    next_service_due: string | null;
    remarks: string | null;
  } | null;
}

export function useFleets(departmentId?: string) {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFleets = useCallback(async () => {
    if (!departmentId) {
      setFleets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: fleetsData, error: fleetsError } = await supabase
        .from('fleets')
        .select('*')
        .eq('department_id', departmentId)
        .order('fleet_number');

      if (fleetsError) throw fleetsError;

      // Fetch operator details and last maintenance for each fleet
      const enrichedFleets = await Promise.all(
        (fleetsData || []).map(async (fleet) => {
          let operator = null;
          if (fleet.operator_id) {
            const { data: operatorData } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', fleet.operator_id)
              .single();
            operator = operatorData;
          }

          // Get last maintenance record
          const { data: maintenanceData } = await supabase
            .from('maintenance_records')
            .select('maintenance_date, next_service_due, remarks')
            .eq('fleet_id', fleet.id)
            .order('maintenance_date', { ascending: false })
            .limit(1)
            .single();

          return {
            ...fleet,
            status: fleet.status as FleetStatus,
            operator,
            last_maintenance: maintenanceData
          };
        })
      );

      setFleets(enrichedFleets);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchFleets();
  }, [fetchFleets]);

  const createFleet = async (data: {
    fleet_number: string;
    machine_type: string;
    status?: FleetStatus;
    operator_id?: string;
  }) => {
    if (!departmentId) throw new Error('Department ID required');

    const { data: newFleet, error } = await supabase
      .from('fleets')
      .insert({
        ...data,
        department_id: departmentId
      })
      .select()
      .single();

    if (error) throw error;
    await fetchFleets();
    return newFleet;
  };

  const updateFleet = async (id: string, data: Partial<Fleet>) => {
    const { error } = await supabase
      .from('fleets')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    await fetchFleets();
  };

  // Calculate stats
  const stats = {
    operational: fleets.filter(f => f.status === 'operational').length,
    underMaintenance: fleets.filter(f => f.status === 'under_maintenance').length,
    outOfService: fleets.filter(f => f.status === 'out_of_service').length,
    total: fleets.length
  };

  return { fleets, loading, error, stats, refetch: fetchFleets, createFleet, updateFleet };
}
