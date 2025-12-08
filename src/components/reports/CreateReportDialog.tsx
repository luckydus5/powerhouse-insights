import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartments } from '@/hooks/useDepartments';
import { useReports } from '@/hooks/useReports';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDepartmentId?: string;
}

const reportTypes = [
  { value: 'incident', label: 'Incident Report' },
  { value: 'financial', label: 'Financial Report' },
  { value: 'performance', label: 'Performance Report' },
  { value: 'general', label: 'General Report' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function CreateReportDialog({ open, onOpenChange, defaultDepartmentId }: CreateReportDialogProps) {
  const { departments } = useDepartments();
  const { createReport } = useReports();
  const { profile } = useUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    report_type: 'general' as 'incident' | 'financial' | 'performance' | 'general',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    department_id: defaultDepartmentId || profile?.department_id || '',
  });

  const handleSubmit = async (e: React.FormEvent, asDraft: boolean = true) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }
    
    if (!formData.department_id) {
      return;
    }

    setIsSubmitting(true);
    
    const report = await createReport({
      ...formData,
      status: asDraft ? 'draft' : 'pending',
      submitted_at: asDraft ? null : new Date().toISOString(),
    });

    setIsSubmitting(false);

    if (report) {
      setFormData({
        title: '',
        description: '',
        report_type: 'general',
        priority: 'medium',
        department_id: defaultDepartmentId || profile?.department_id || '',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new report. You can save as draft or submit for review.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter report title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) => setFormData({ ...formData, department_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Report Type</Label>
              <Select
                value={formData.report_type}
                onValueChange={(value) => setFormData({ ...formData, report_type: value as typeof formData.report_type })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as typeof formData.priority })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your report..."
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting || !formData.title.trim() || !formData.department_id}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting || !formData.title.trim() || !formData.department_id}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit for Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
