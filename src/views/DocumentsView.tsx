import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';

export const DocumentsView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-editorial font-bold text-forest-950">
          Document Vault & Receipts
        </h1>
        <p className="text-xs text-forest-600">
          Secure local repository for invoices, warranty cards, manuals, and appraisal certificates
        </p>
      </div>

      <div className="editorial-card rounded-2xl p-8 text-center bg-white border border-ivory-300 max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="font-editorial text-lg font-bold text-forest-950">
          Document Management Architecture
        </h3>
        <p className="text-xs text-forest-600 leading-relaxed">
          The Document Vault allows drag-and-drop storage of receipts, certificates of authenticity,
          and warranty contracts linked directly to assets in {activeHousehold?.name || 'your residence'}.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-jade-50 border border-jade-200 text-jade-800 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-jade-600" />
          IndexedDB Blob Storage Ready (Feature 6)
        </div>
      </div>
    </div>
  );
};
