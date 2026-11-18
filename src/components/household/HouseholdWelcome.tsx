import React from 'react';
import { Sparkles, Shield, Compass, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useHouseholdStore } from '../../store/useHouseholdStore';
import { useUIStore } from '../../store/useUIStore';

export const HouseholdWelcome: React.FC = () => {
  const { loadSampleData, isLoading } = useHouseholdStore();
  const { openHouseholdModal } = useUIStore();

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-ivory-300 shadow-elevated p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-forest-100/50 pointer-events-none blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brass-100/40 pointer-events-none blur-3xl" />

        <div className="relative z-10 text-center max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-forest-900 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-jade-600 animate-pulse" />
            Habitage Personal Asset Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-forest-950 tracking-tight leading-tight">
            Curate your sanctuary with timeless precision.
          </h1>

          <p className="text-sm sm:text-base text-forest-700 font-normal leading-relaxed">
            A private, local-first digital archive for your household possessions, high-value
            assets, warranties, maintenance records, and insurance valuations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 pb-2 text-left">
            <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-ivory-100 flex items-center justify-center mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                100% Local-First
              </h3>
              <p className="text-xs text-forest-600 mt-1">
                Zero cloud reliance. Your documents and photos stay strictly on this device.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-ivory-100 flex items-center justify-center mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                Asset Intelligence
              </h3>
              <p className="text-xs text-forest-600 mt-1">
                Depreciation schedules, replacement valuations, and insurance coverage gap analysis.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-ivory-100 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                Editorial Luxury
              </h3>
              <p className="text-xs text-forest-600 mt-1">
                Botanical greens, muted brass, and editorial typography designed for discerning owners.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto text-sm"
              isLoading={isLoading}
              onClick={loadSampleData}
            >
              <Sparkles className="w-4 h-4 mr-2 text-brass-400" />
              Explore Sample Estate (Palm Grove)
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-sm"
              onClick={() => openHouseholdModal('create')}
            >
              Setup Blank Household
              <ArrowRight className="w-4 h-4 ml-2 text-forest-600" />
            </Button>
          </div>

          <p className="text-[11px] text-forest-500">
            You can add, edit, or delete residences at any time. Sample estate data can be purged in Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
