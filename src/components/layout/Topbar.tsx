import React from 'react';
import { Menu, Plus, ShieldCheck } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { HouseholdSelector } from '../household/HouseholdSelector';
import { Button } from '../ui/Button';

export const Topbar: React.FC = () => {
  const { activeView, setIsSidebarOpenMobile, setActiveView } = useUIStore();

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Estate Intelligence', subtitle: 'Portfolio valuation, asset distribution & recent updates' },
    inventory: { title: 'Asset Inventory', subtitle: 'Comprehensive catalogue of household possessions' },
    rooms: { title: 'Rooms & Spaces', subtitle: 'Architectural zones, square footage & room-by-room assets' },
    documents: { title: 'Document Vault', subtitle: 'Receipts, certificates of authenticity, invoices & warranties' },
    maintenance: { title: 'Maintenance Logbook', subtitle: 'Service history, scheduled repairs & trusted providers' },
    valuation: { title: 'Financial Intelligence', subtitle: 'Depreciation models, replacement values & insurance audits' },
    reports: { title: 'Reports & Audits', subtitle: 'Printable insurance summaries and portable records' },
    settings: { title: 'Data & Preferences', subtitle: 'Local backups, CSV imports, and database controls' },
  };

  const current = viewTitles[activeView] || { title: 'Habitage', subtitle: '' };

  return (
    <header className="sticky top-0 z-20 bg-[#faf8f5]/90 backdrop-blur-md border-b border-ivory-300 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + View Header */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpenMobile(true)}
            className="lg:hidden p-2 rounded-xl border border-ivory-300 bg-white text-forest-800 hover:bg-ivory-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-editorial font-bold text-forest-950 truncate tracking-tight">
              {current.title}
            </h2>
            <p className="hidden md:block text-[11px] text-forest-600 truncate font-normal">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Household Selector + Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-jade-100/60 border border-jade-200/80 text-[11px] font-semibold text-jade-900">
            <ShieldCheck className="w-3.5 h-3.5 text-jade-700" />
            <span>Encrypted Local DB</span>
          </div>

          <HouseholdSelector />

          {activeView !== 'inventory' && (
            <Button
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
              onClick={() => setActiveView('inventory')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Catalogue Item
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
