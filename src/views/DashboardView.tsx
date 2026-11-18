import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Boxes,
  Home,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';
import { useUIStore } from '../store/useUIStore';
import { db } from '../db';
import type { Room, Asset } from '../types';
import { formatCurrency, sumAmounts } from '../lib/currency';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const DashboardView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();
  const { setActiveView, openHouseholdModal } = useUIStore();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!activeHousehold) return;
      try {
        const [loadedRooms, loadedAssets] = await Promise.all([
          db.rooms.where('householdId').equals(activeHousehold.id).toArray(),
          db.assets.where('householdId').equals(activeHousehold.id).toArray(),
        ]);
        setRooms(loadedRooms);
        setAssets(loadedAssets);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadData();
  }, [activeHousehold]);

  if (!activeHousehold) return null;

  const currency = activeHousehold.currency || 'USD';

  // Calculations
  const totalPurchaseValue = sumAmounts(assets.map((a) => a.purchasePrice));
  const totalCurrentValue = sumAmounts(
    assets.map((a) => (a.currentValue !== undefined ? a.currentValue : a.purchasePrice))
  );
  const totalReplacementValue = sumAmounts(
    assets.map((a) => (a.replacementValue !== undefined ? a.replacementValue : a.currentValue || a.purchasePrice))
  );

  const insuredAssets = assets.filter((a) => a.isInsured);
  const policyLimit = activeHousehold.insurancePolicyLimit || 0;
  const isUnderinsured = policyLimit > 0 && totalReplacementValue > policyLimit;
  const coveragePercent = policyLimit > 0 ? Math.min(Math.round((policyLimit / (totalReplacementValue || 1)) * 100), 100) : null;

  // Recent 5 assets
  const recentAssets = [...assets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Household Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-[#184232] text-ivory-50 p-6 sm:p-8 border border-forest-800 shadow-elevated">
        <div className="absolute top-0 right-0 w-96 h-96 bg-jade-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-brass-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700/60 text-brass-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brass-400" />
              {activeHousehold.propertyType.replace('_', ' ')} Residence
            </div>

            <h1 className="text-2xl sm:text-4xl font-editorial font-bold tracking-tight text-white">
              {activeHousehold.name}
            </h1>

            {activeHousehold.address && (
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-ivory-200/80">
                <MapPin className="w-3.5 h-3.5 text-brass-400 shrink-0" />
                <span>{activeHousehold.address}</span>
              </p>
            )}

            {activeHousehold.notes && (
              <p className="text-xs text-ivory-300/70 pt-1 leading-relaxed line-clamp-2">
                {activeHousehold.notes}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="bg-forest-900/60 text-ivory-100 border-forest-700 hover:bg-forest-800"
              onClick={() => openHouseholdModal('edit')}
            >
              Edit Residence Profile
            </Button>
            <Button
              variant="brass"
              size="sm"
              onClick={() => setActiveView('rooms')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Manage Rooms
            </Button>
          </div>
        </div>

        {/* Property Specs Pill Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-forest-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-jade-300/60 block">
              Default Currency
            </span>
            <span className="font-semibold text-ivory-100 text-sm">{currency}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-jade-300/60 block">
              Floor Area
            </span>
            <span className="font-semibold text-ivory-100 text-sm">
              {activeHousehold.squareMeters ? `${activeHousehold.squareMeters} m²` : '—'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-jade-300/60 block">
              Year Built
            </span>
            <span className="font-semibold text-ivory-100 text-sm">
              {activeHousehold.yearBuilt || '—'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-jade-300/60 block">
              Insurance Policy Limit
            </span>
            <span className="font-semibold text-brass-300 text-sm">
              {activeHousehold.insurancePolicyLimit
                ? formatCurrency(activeHousehold.insurancePolicyLimit, currency, { hideDecimals: true })
                : 'Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Financial & Asset KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="editorial-card rounded-2xl p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Current Asset Value</span>
              <div className="p-2 rounded-xl bg-forest-50 text-forest-800">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-editorial font-bold text-forest-950">
              {formatCurrency(totalCurrentValue, currency, { hideDecimals: true })}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-ivory-200 text-[11px] text-forest-600 flex items-center justify-between">
            <span>Acquisition: {formatCurrency(totalPurchaseValue, currency, { compact: true })}</span>
            <span className="text-jade-700 font-semibold">
              {totalCurrentValue >= totalPurchaseValue ? '+ Gain' : 'Depreciated'}
            </span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Replacement Value</span>
              <div className="p-2 rounded-xl bg-brass-50 text-brass-700">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-editorial font-bold text-forest-950">
              {formatCurrency(totalReplacementValue, currency, { hideDecimals: true })}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-ivory-200 text-[11px] text-forest-600 flex items-center justify-between">
            <span>Insurance Benchmark</span>
            <span className="text-brass-700 font-medium">New Replacement</span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Catalogued Assets</span>
              <div className="p-2 rounded-xl bg-jade-50 text-jade-700">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-editorial font-bold text-forest-950">
              {assets.length} items
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-ivory-200 text-[11px] text-forest-600 flex items-center justify-between">
            <span>{insuredAssets.length} Insured</span>
            <span className="text-forest-800 font-medium">{rooms.length} Rooms</span>
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-forest-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Policy Protection</span>
              <div
                className={`p-2 rounded-xl ${
                  isUnderinsured ? 'bg-rose-50 text-rose-700' : 'bg-jade-50 text-jade-700'
                }`}
              >
                {isUnderinsured ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
            </div>
            <div className="text-2xl font-editorial font-bold text-forest-950">
              {policyLimit > 0 ? (
                isUnderinsured ? (
                  <span className="text-rose-700">Underinsured</span>
                ) : (
                  <span className="text-jade-700">Covered</span>
                )
              ) : (
                <span className="text-forest-400">Policy Unset</span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-ivory-200 text-[11px] text-forest-600">
            {policyLimit > 0 ? (
              <span>
                Limit: {formatCurrency(policyLimit, currency, { compact: true })} (
                {coveragePercent}%)
              </span>
            ) : (
              <span className="text-brass-700">Set policy limit in profile</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Rooms & Recent Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-editorial font-bold text-forest-950">
                Rooms & Living Spaces
              </h2>
              <p className="text-xs text-forest-600">
                Structured spaces within {activeHousehold.name}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('rooms')}
            >
              View All ({rooms.length})
            </Button>
          </div>

          {rooms.length === 0 ? (
            <div className="editorial-card rounded-2xl p-8 text-center bg-white border border-dashed border-ivory-300">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-base font-bold text-forest-950">No rooms created yet</h3>
              <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto">
                Organize your residence by adding living spaces, bedrooms, suites, and outdoor zones.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => setActiveView('rooms')}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add First Room
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {rooms.map((room) => {
                const roomAssets = assets.filter((a) => a.roomId === room.id);
                const roomTotal = sumAmounts(
                  roomAssets.map((a) => (a.currentValue !== undefined ? a.currentValue : a.purchasePrice))
                );

                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveView('rooms', { roomId: room.id })}
                    className="editorial-card p-4 rounded-2xl bg-white cursor-pointer group hover:border-jade-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: room.colorTag || '#2D6A4F' }}
                          />
                          <h4 className="font-editorial font-bold text-sm text-forest-950 group-hover:text-jade-800 transition-colors">
                            {room.name}
                          </h4>
                        </div>
                        <Badge variant="ivory" className="text-[10px] shrink-0">
                          {room.floorLevel}
                        </Badge>
                      </div>

                      {room.description && (
                        <p className="text-[11px] text-forest-600 line-clamp-2 leading-relaxed mb-3">
                          {room.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                      <span className="text-forest-500 font-medium">
                        {roomAssets.length} {roomAssets.length === 1 ? 'item' : 'items'}
                      </span>
                      <span className="font-semibold text-forest-950">
                        {formatCurrency(roomTotal, currency, { hideDecimals: true })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-editorial font-bold text-forest-950">
                Asset Highlights
              </h2>
              <p className="text-xs text-forest-600">
                Recently catalogued possessions
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('inventory')}
            >
              View Inventory
            </Button>
          </div>

          {recentAssets.length === 0 ? (
            <div className="editorial-card rounded-2xl p-6 text-center bg-white border border-dashed border-ivory-300">
              <div className="w-10 h-10 rounded-xl bg-brass-100 text-brass-800 flex items-center justify-center mx-auto mb-2">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-sm font-bold text-forest-950">No items catalogued</h3>
              <p className="text-xs text-forest-600 mt-1">
                Start adding furniture, art, electronics, and valuables to your archive.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => setActiveView('inventory')}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="editorial-card rounded-2xl bg-white p-2 divide-y divide-ivory-200">
              {recentAssets.map((asset) => {
                const room = rooms.find((r) => r.id === asset.roomId);
                const val = asset.currentValue ?? asset.purchasePrice ?? 0;

                return (
                  <div
                    key={asset.id}
                    onClick={() => setActiveView('inventory', { assetId: asset.id })}
                    className="p-3 rounded-xl hover:bg-ivory-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-forest-950 truncate group-hover:text-jade-800 transition-colors">
                        {asset.name}
                      </h4>
                      <p className="text-[10px] text-forest-500 truncate mt-0.5">
                        {asset.brand && `${asset.brand} • `}
                        {room ? room.name : 'Unassigned Room'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-forest-950">
                        {formatCurrency(val, currency, { hideDecimals: true })}
                      </p>
                      <Badge
                        variant={asset.isInsured ? 'jade' : 'ivory'}
                        className="text-[9px] px-1.5 py-0"
                      >
                        {asset.isInsured ? 'Insured' : 'Unscheduled'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-forest-100/60 border border-forest-200/80 text-forest-900 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brass-600" />
              Asset Intelligence Tip
            </p>
            <p className="text-[11px] text-forest-700 leading-relaxed">
              Maintain current replacement valuations to ensure your home insurance coverage reflects inflation and market appreciation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
