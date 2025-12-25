import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FleetStatus } from '@/hooks/useFleets';

interface AddFleetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    fleet_number: string;
    machine_type: string;
    status: FleetStatus;
  }) => Promise<void>;
}

const machineTypes = [
  'Valtra Tractor',
  'John Deere',
  'Massey Ferguson',
  'New Holland',
  'Case IH',
  'Kubota',
  'Caterpillar',
  'Komatsu',
  'Excavator',
  'Loader',
  'Other'
];

export function AddFleetDialog({ open, onOpenChange, onSubmit }: AddFleetDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fleetNumber, setFleetNumber] = useState('');
  const [machineType, setMachineType] = useState('');
  const [status, setStatus] = useState<FleetStatus>('operational');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fleetNumber.trim() || !machineType.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        fleet_number: fleetNumber.trim(),
        machine_type: machineType.trim(),
        status
      });
      
      toast({
        title: 'Fleet Added',
        description: `${fleetNumber} has been registered successfully`
      });
      
      // Reset form
      setFleetNumber('');
      setMachineType('');
      setStatus('operational');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add fleet',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Fleet Machine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fleet_number">Fleet Number *</Label>
              <Input
                id="fleet_number"
                placeholder="e.g., VT001"
                value={fleetNumber}
                onChange={(e) => setFleetNumber(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="machine_type">Machine Type *</Label>
              <Select value={machineType} onValueChange={setMachineType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select machine type" />
                </SelectTrigger>
                <SelectContent>
                  {machineTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as FleetStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Fleet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
