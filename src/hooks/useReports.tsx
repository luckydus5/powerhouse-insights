import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Report = Tables<'reports'>;
type ReportInsert = TablesInsert<'reports'>;

interface ReportWithDepartment extends Report {
  departments?: {
    name: string;
    code: string;
    color: string | null;
  } | null;
}

export function useReports(departmentId?: string) {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportWithDepartment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!user) {
      setReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          departments (
            name,
            code,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user, departmentId]);

  const createReport = async (report: Omit<ReportInsert, 'created_by'>) => {
    if (!user) {
      toast.error('You must be logged in to create a report');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...report,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Report created successfully');
      await fetchReports();
      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
      return null;
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Report updated successfully');
      await fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  const submitReport = async (id: string) => {
    await updateReport(id, { 
      status: 'pending',
      submitted_at: new Date().toISOString()
    });
  };

  return {
    reports,
    loading,
    createReport,
    updateReport,
    submitReport,
    refetch: fetchReports,
  };
}
