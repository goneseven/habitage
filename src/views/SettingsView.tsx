import React, { useEffect, useState } from 'react';
import { Database, Trash2, Shield, Sparkles } from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';
import { useUIStore } from '../store/useUIStore';
import { db } from '../db';
import { Button } from '../components/ui/Button';

export const SettingsView: React.FC = () => {
  const { loadSampleData, refreshHouseholds, activeHousehold } = useHouseholdStore();
  const { showToast } = useUIStore();

  const [counts, setCounts] = useState({
    households: 0,
    rooms: 0,
    assets: 0,
    documents: 0,
    maintenance: 0,
  });

  const loadStats = async () => {
    const [h, r, a, d, m] = await Promise.all([
      db.households.count(),
      db.rooms.count(),
      db.assets.count(),
      db.documents.count(),
      db.maintenance.count(),
    ]);
    setCounts({ households: h, rooms: r, assets: a, documents: d, maintenance: m });
  };

  useEffect(() => {
    loadStats();
  }, [activeHousehold]);

  const handleReset = async () => {
    if (
      confirm(
        'Are you sure you want to completely erase the local database? All households, assets, and rooms will be wiped.'
      )
    ) {
      await db.delete();
      await db.open();
      await refreshHouseholds();
      await loadStats();
      showToast({
        type: 'info',
        title: 'Database Reset',
        message: 'All local IndexedDB tables have been cleared.',
      });
    }
  };

  const handleSeed = async () => {
    await loadSampleData();
    await loadStats();
    showToast({
      type: 'success',
      title: 'Sample Estate Loaded',
      message: 'The Palm Grove Residence and sample inventory are ready.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-editorial font-bold text-forest-950">
          Settings & Local Vault
        </h1>
        <p className="text-xs text-forest-600">
          IndexedDB database controls, sample data management, and storage statistics
        </p>
      </div>

      {/* Storage Statistics */}
      <div className="editorial-card rounded-2xl p-6 bg-white space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-forest-800" />
          <h2 className="font-editorial text-lg font-bold text-forest-950">
            Local Storage Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
            <span className="text-[10px] uppercase font-bold text-forest-500 block">Households</span>
            <span className="text-lg font-bold text-forest-950">{counts.households}</span>
          </div>
          <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
            <span className="text-[10px] uppercase font-bold text-forest-500 block">Rooms</span>
            <span className="text-lg font-bold text-forest-950">{counts.rooms}</span>
          </div>
          <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
            <span className="text-[10px] uppercase font-bold text-forest-500 block">Assets</span>
            <span className="text-lg font-bold text-forest-950">{counts.assets}</span>
          </div>
          <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
            <span className="text-[10px] uppercase font-bold text-forest-500 block">Documents</span>
            <span className="text-lg font-bold text-forest-950">{counts.documents}</span>
          </div>
          <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
            <span className="text-[10px] uppercase font-bold text-forest-500 block">Service Logs</span>
            <span className="text-lg font-bold text-forest-950">{counts.maintenance}</span>
          </div>
        </div>
      </div>

      {/* Sample Estate & Actions */}
      <div className="editorial-card rounded-2xl p-6 bg-white space-y-4">
        <h2 className="font-editorial text-lg font-bold text-forest-950">
          Sample Data Management
        </h2>
        <p className="text-xs text-forest-600 leading-relaxed">
          Need to test features or explore an existing setup? You can re-import or augment with the
          curated mid-century modernist estate "The Palm Grove Residence".
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={handleSeed}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brass-600" />
            Load Sample Estate (Palm Grove)
          </Button>

          <Button variant="danger" size="sm" onClick={handleReset}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Erase Entire Local Database
          </Button>
        </div>
      </div>

      {/* Security and Privacy Notice */}
      <div className="p-5 rounded-2xl bg-forest-900 text-ivory-100 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-forest-800 text-brass-400 shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-editorial font-bold text-sm text-white">
            100% Local-First Guarantee
          </h4>
          <p className="text-xs text-ivory-300/80 leading-relaxed">
            All records, valuations, serial numbers, documents, and photographs are stored strictly
            inside your browser's IndexedDB sandbox. Habitage operates completely offline without
            telemetry or third-party cloud data transmission.
          </p>
        </div>
      </div>
    </div>
  );
};
