import React, { useState, useEffect } from 'react';
import type { Room, Asset } from '../../types';
import { db } from '../../db';
import { getRoomIcon } from './RoomIcons';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, sumAmounts } from '../../lib/currency';
import { useUIStore } from '../../store/useUIStore';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Boxes,
} from 'lucide-react';

interface RoomDetailViewProps {
  room: Room;
  currency: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const RoomDetailView: React.FC<RoomDetailViewProps> = ({
  room,
  currency,
  onBack,
  onEdit,
  onDelete,
}) => {
  const { setActiveView } = useUIStore();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const IconComp = getRoomIcon(room.iconName, room.roomType);

  useEffect(() => {
    async function loadRoomAssets() {
      try {
        setLoading(true);
        const loaded = await db.assets.where('roomId').equals(room.id).toArray();
        setAssets(loaded);
      } finally {
        setLoading(false);
      }
    }
    loadRoomAssets();
  }, [room.id]);

  const totalCurrentValue = sumAmounts(
    assets.map((a) => (a.currentValue !== undefined ? a.currentValue : a.purchasePrice))
  );
  const totalPurchaseValue = sumAmounts(assets.map((a) => a.purchasePrice));
  const insuredCount = assets.filter((a) => a.isInsured).length;

  const highestValueAsset = [...assets].sort(
    (a, b) =>
      (b.currentValue ?? b.purchasePrice ?? 0) - (a.currentValue ?? a.purchasePrice ?? 0)
  )[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-forest-700 hover:text-forest-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Architectural Spaces</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            Edit Space
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-rose-600 hover:bg-rose-50 hover:border-rose-300"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Room Hero Banner */}
      <div className="editorial-card rounded-3xl bg-white overflow-hidden border border-ivory-300 shadow-elevated">
        {room.photoUrl && (
          <div className="relative h-64 w-full overflow-hidden bg-forest-950">
            <img
              src={room.photoUrl}
              alt={room.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                style={{ backgroundColor: room.colorTag || '#2D6A4F' }}
              >
                <IconComp className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="forest" className="text-[10px]">
                    {room.floorLevel}
                  </Badge>
                  <span className="text-xs text-forest-500 capitalize">
                    {room.roomType.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-forest-950 tracking-tight">
                  {room.name}
                </h1>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveView('inventory')}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Catalogue Asset Here
            </Button>
          </div>

          {room.description && (
            <p className="text-xs sm:text-sm text-forest-700 leading-relaxed max-w-3xl pt-2">
              {room.description}
            </p>
          )}

          {/* Quick specs */}
          <div className="pt-4 border-t border-ivory-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-forest-500 block">
                Current Valuation
              </span>
              <span className="text-base font-bold text-forest-950">
                {formatCurrency(totalCurrentValue, currency, { hideDecimals: true })}
              </span>
              <span className="text-[10px] text-forest-500 block">
                Cost: {formatCurrency(totalPurchaseValue, currency, { compact: true })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-forest-500 block">
                Floor Area
              </span>
              <span className="text-base font-bold text-forest-950">
                {room.squareMeters ? `${room.squareMeters} m²` : '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-forest-500 block">
                Catalogued Items
              </span>
              <span className="text-base font-bold text-forest-950">
                {assets.length} items
              </span>
              <span className="text-[10px] text-jade-700 font-medium block">
                {insuredCount} Insured
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-forest-500 block">
                Key Asset
              </span>
              <span className="text-xs font-bold text-forest-950 truncate block">
                {highestValueAsset ? highestValueAsset.name : '—'}
              </span>
              {highestValueAsset && (
                <span className="text-[10px] text-brass-700 font-semibold block">
                  {formatCurrency(
                    highestValueAsset.currentValue ?? highestValueAsset.purchasePrice,
                    currency,
                    { hideDecimals: true }
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Possessions Catalogued in this Room */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-editorial font-bold text-forest-950">
              Possessions Located in {room.name}
            </h2>
            <p className="text-xs text-forest-600">
              Complete inventory of furniture, electronics, artwork, and valuables
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-forest-500">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="editorial-card rounded-2xl p-10 text-center bg-white border border-dashed border-ivory-300">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-base font-bold text-forest-950">
              No items catalogued in this room yet
            </h3>
            <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto">
              Add furniture, fixtures, art, or equipment to track their physical placement and valuations.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => setActiveView('inventory')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Catalogue First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => {
              const val = asset.currentValue ?? asset.purchasePrice ?? 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => setActiveView('inventory', { assetId: asset.id })}
                  className="editorial-card p-5 rounded-2xl bg-white cursor-pointer hover:border-jade-300 transition-all flex flex-col justify-between group"
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

                    <h3 className="font-editorial font-bold text-sm text-forest-950 group-hover:text-jade-800 transition-colors">
                      {asset.name}
                    </h3>
                    <p className="text-[11px] text-forest-500 mt-0.5">
                      {asset.brand && <span className="font-semibold">{asset.brand} • </span>}
                      {asset.subcategory || 'Asset'}
                    </p>

                    {asset.notes && (
                      <p className="text-xs text-forest-700 mt-2 line-clamp-2 leading-relaxed">
                        {asset.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-forest-500 uppercase font-bold block">
                        Valuation
                      </span>
                      <span className="font-bold text-forest-950">
                        {formatCurrency(val, currency, { hideDecimals: true })}
                      </span>
                    </div>

                    {asset.isInsured && (
                      <Badge variant="jade" className="text-[9px]">
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
    </div>
  );
};
