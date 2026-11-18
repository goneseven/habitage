import React, { useEffect, useState } from 'react';
import { Boxes, Search } from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';
import { db } from '../db';
import type { Asset, Room } from '../types';
import { formatCurrency } from '../lib/currency';
import { Badge } from '../components/ui/Badge';

export const InventoryView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!activeHousehold) return;
      const [loadedAssets, loadedRooms] = await Promise.all([
        db.assets.where('householdId').equals(activeHousehold.id).toArray(),
        db.rooms.where('householdId').equals(activeHousehold.id).toArray(),
      ]);
      setAssets(loadedAssets);
      setRooms(loadedRooms);
    }
    loadData();
  }, [activeHousehold]);

  if (!activeHousehold) return null;
  const currency = activeHousehold.currency || 'USD';

  const filteredAssets = assets.filter((asset) => {
    const q = searchTerm.toLowerCase();
    return (
      asset.name.toLowerCase().includes(q) ||
      (asset.brand && asset.brand.toLowerCase().includes(q)) ||
      (asset.modelNumber && asset.modelNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-forest-950">
            Household Assets
          </h1>
          <p className="text-xs text-forest-600">
            {assets.length} items catalogued in {activeHousehold.name}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              type="text"
              placeholder="Search possessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs border border-ivory-300 bg-white focus:outline-none focus:ring-1 focus:ring-forest-700 w-52 sm:w-64"
            />
          </div>
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="editorial-card rounded-2xl p-12 text-center bg-white border border-dashed border-ivory-300">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3">
            <Boxes className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-lg font-bold text-forest-950">
            {searchTerm ? 'No matching assets found' : 'No items catalogued yet'}
          </h3>
          <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'Try adjusting your search keywords.'
              : 'Add your high-value belongings, furniture, fine art, and appliances.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const room = rooms.find((r) => r.id === asset.roomId);
            const val = asset.currentValue ?? asset.purchasePrice ?? 0;

            return (
              <div
                key={asset.id}
                className="editorial-card p-5 rounded-2xl bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="forest" className="text-[10px]">
                      {asset.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="ivory" className="text-[10px] uppercase">
                      {asset.condition}
                    </Badge>
                  </div>

                  <h3 className="font-editorial font-bold text-base text-forest-950">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-forest-600 mt-0.5">
                    {asset.brand && <span className="font-semibold">{asset.brand} • </span>}
                    {room ? room.name : 'Unassigned Room'}
                  </p>

                  {asset.notes && (
                    <p className="text-xs text-forest-700 mt-2.5 line-clamp-2 leading-relaxed">
                      {asset.notes}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-ivory-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-forest-500 uppercase font-bold block">
                      Valuation
                    </span>
                    <span className="text-sm font-bold text-forest-950">
                      {formatCurrency(val, currency, { hideDecimals: true })}
                    </span>
                  </div>
                  {asset.isInsured && (
                    <Badge variant="jade" className="text-[10px]">
                      Insured
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
