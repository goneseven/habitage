import React, { useEffect, useState } from 'react';
import { useHouseholdStore } from '../store/useHouseholdStore';
import { db } from '../db';
import type { Room, Asset } from '../types';
import { formatCurrency, sumAmounts } from '../lib/currency';
import { Badge } from '../components/ui/Badge';

export const RoomsView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!activeHousehold) return;
      const [loadedRooms, loadedAssets] = await Promise.all([
        db.rooms.where('householdId').equals(activeHousehold.id).toArray(),
        db.assets.where('householdId').equals(activeHousehold.id).toArray(),
      ]);
      setRooms(loadedRooms);
      setAssets(loadedAssets);
    }
    loadData();
  }, [activeHousehold]);

  if (!activeHousehold) return null;
  const currency = activeHousehold.currency || 'USD';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-forest-950">
            Rooms & Architectural Spaces
          </h1>
          <p className="text-xs text-forest-600">
            Explore {activeHousehold.name} by floor plan and physical location
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => {
          const roomAssets = assets.filter((a) => a.roomId === room.id);
          const totalVal = sumAmounts(
            roomAssets.map((a) => (a.currentValue !== undefined ? a.currentValue : a.purchasePrice))
          );

          return (
            <div
              key={room.id}
              className="editorial-card rounded-2xl p-5 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-xs"
                      style={{ backgroundColor: room.colorTag || '#2D6A4F' }}
                    />
                    <h3 className="font-editorial font-bold text-base text-forest-950">
                      {room.name}
                    </h3>
                  </div>
                  <Badge variant="ivory" className="text-[10px]">
                    {room.floorLevel}
                  </Badge>
                </div>

                {room.description && (
                  <p className="text-xs text-forest-600 mb-4 leading-relaxed">
                    {room.description}
                  </p>
                )}

                <div className="text-xs text-forest-700 space-y-1">
                  {room.squareMeters && (
                    <p className="text-forest-500 text-[11px]">Area: {room.squareMeters} m²</p>
                  )}
                  <p className="text-forest-500 text-[11px]">
                    Type: <span className="capitalize">{room.roomType.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-ivory-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-forest-500 uppercase font-bold block">
                    Inventory Value
                  </span>
                  <span className="text-sm font-bold text-forest-950">
                    {formatCurrency(totalVal, currency, { hideDecimals: true })}
                  </span>
                </div>
                <Badge variant="forest" className="text-[10px]">
                  {roomAssets.length} {roomAssets.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
