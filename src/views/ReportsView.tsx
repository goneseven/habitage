import React from 'react';
import { FileCheck2, Printer } from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';

export const ReportsView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-editorial font-bold text-forest-950">
          Audits & Printable Reports
        </h1>
        <p className="text-xs text-forest-600">
          Formatted insurance claim reports, room inventories, and portable audit documents
        </p>
      </div>

      <div className="editorial-card rounded-2xl p-8 text-center bg-white border border-ivory-300 max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
          <FileCheck2 className="w-6 h-6" />
        </div>
        <h3 className="font-editorial text-lg font-bold text-forest-950">
          Print & Report Generator
        </h3>
        <p className="text-xs text-forest-600 leading-relaxed">
          Generate print-optimized audit sheets, room-by-room inventories, and proof-of-ownership
          schedules for insurance underwriters or estate records for {activeHousehold?.name || 'your residence'}.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-jade-50 border border-jade-200 text-jade-800 text-xs font-medium">
          <Printer className="w-4 h-4 text-jade-600" />
          Printable Audit Layouts Ready (Feature 10)
        </div>
      </div>
    </div>
  );
};
