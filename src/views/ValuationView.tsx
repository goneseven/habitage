import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';

export const ValuationView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-editorial font-bold text-forest-950">
          Valuation & Insurance Intelligence
        </h1>
        <p className="text-xs text-forest-600">
          Depreciation modeling, replacement value calculations, and insurance coverage gap analysis
        </p>
      </div>

      <div className="editorial-card rounded-2xl p-8 text-center bg-white border border-ivory-300 max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brass-100 text-brass-800 flex items-center justify-center mx-auto">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="font-editorial text-lg font-bold text-forest-950">
          Financial Intelligence Engine
        </h3>
        <p className="text-xs text-forest-600 leading-relaxed">
          Detailed straight-line and diminishing balance depreciation calculations powered by{' '}
          <code>decimal.js</code>, along with insurance policy benchmark auditing for{' '}
          {activeHousehold?.name || 'your residence'}.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-900 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-brass-600" />
          Financial Intelligence & Charts Ready (Feature 8 & 9)
        </div>
      </div>
    </div>
  );
};
