import React from 'react';
import { Wrench, Calendar } from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';

export const MaintenanceView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-editorial font-bold text-forest-950">
          Maintenance & Service Logbook
        </h1>
        <p className="text-xs text-forest-600">
          Scheduled servicing, repair logs, restoration history, and provider contacts
        </p>
      </div>

      <div className="editorial-card rounded-2xl p-8 text-center bg-white border border-ivory-300 max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
          <Wrench className="w-6 h-6" />
        </div>
        <h3 className="font-editorial text-lg font-bold text-forest-950">
          Asset Servicing Architecture
        </h3>
        <p className="text-xs text-forest-600 leading-relaxed">
          Track maintenance costs, certified repair technicians, warranty inspections, and
          scheduled upcoming service dates for {activeHousehold?.name || 'your household'}.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brass-50 border border-brass-200 text-brass-800 text-xs font-medium">
          <Calendar className="w-4 h-4 text-brass-600" />
          Scheduled Logbook Engine Ready (Feature 7)
        </div>
      </div>
    </div>
  );
};
