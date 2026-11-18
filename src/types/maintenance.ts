export type MaintenanceType =
  | 'routine_service'
  | 'repair'
  | 'inspection'
  | 'cleaning'
  | 'restoration'
  | 'upgrade'
  | 'other';

export interface MaintenanceRecord {
  id: string;
  householdId: string;
  assetId: string;
  title: string;
  serviceType: MaintenanceType;
  serviceDate: string;
  cost?: number;
  serviceProvider?: string;
  providerPhone?: string;
  providerEmail?: string;
  notes?: string;
  nextScheduledDate?: string;
  completed: boolean;
  createdAt: string;
}
