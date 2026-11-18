import React from 'react';
import type { Room, Asset } from '../../types';
import { getRoomIcon } from './RoomIcons';
import { Badge } from '../ui/Badge';
import { formatCurrency, sumAmounts } from '../../lib/currency';
import { MoreVertical, Edit2, Trash2, ArrowRight } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  assets: Asset[];
  currency: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  assets,
  currency,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const IconComp = getRoomIcon(room.iconName, room.roomType);

  const roomAssets = assets.filter((a) => a.roomId === room.id);
  const roomTotal = sumAmounts(
    roomAssets.map((a) => (a.currentValue !== undefined ? a.currentValue : a.purchasePrice))
  );

  return (
    <div
      onClick={onSelect}
      className="editorial-card rounded-2xl bg-white overflow-hidden cursor-pointer group flex flex-col justify-between hover:border-jade-400/50 transition-all shadow-soft hover:shadow-elevated relative"
    >
      {/* Top Banner / Photo */}
      {room.photoUrl ? (
        <div className="relative h-36 w-full overflow-hidden bg-forest-950">
          <img
            src={room.photoUrl}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md border border-white/40"
              style={{ backgroundColor: room.colorTag || '#2D6A4F' }}
            >
              <IconComp className="w-4 h-4" />
            </div>
            <Badge variant="ivory" className="text-[10px] bg-white/90 backdrop-blur-xs shadow-xs">
              {room.floorLevel}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="h-3 w-full" style={{ backgroundColor: room.colorTag || '#2D6A4F' }} />
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row when no photo */}
          {!room.photoUrl && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: room.colorTag || '#2D6A4F' }}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <Badge variant="ivory" className="text-[10px]">
                  {room.floorLevel}
                </Badge>
              </div>

              {/* Action Dropdown Menu */}
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <button
                  type="button"
                  className="p-1.5 rounded-lg text-forest-400 hover:text-forest-800 hover:bg-ivory-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-elevated border border-ivory-200 py-1 z-20"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onEdit();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-forest-800 hover:bg-ivory-100 flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Space
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onDelete();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-editorial font-bold text-base text-forest-950 group-hover:text-jade-800 transition-colors">
                {room.name}
              </h3>
              <p className="text-[11px] text-forest-500 capitalize mt-0.5">
                {room.roomType.replace('_', ' ')}
                {room.squareMeters ? ` • ${room.squareMeters} m²` : ''}
              </p>
            </div>

            {/* If photo is shown, render actions menu here */}
            {room.photoUrl && (
              <div
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <button
                  type="button"
                  className="p-1 rounded-lg text-forest-400 hover:text-forest-800 hover:bg-ivory-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-elevated border border-ivory-200 py-1 z-20"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onEdit();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-forest-800 hover:bg-ivory-100 flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Space
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onDelete();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {room.description && (
            <p className="text-xs text-forest-600 mt-2 line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          )}
        </div>

        {/* Footer Metrics */}
        <div className="pt-4 mt-4 border-t border-ivory-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-forest-500 uppercase font-bold block">
              Inventory Value
            </span>
            <span className="font-bold text-sm text-forest-950">
              {formatCurrency(roomTotal, currency, { hideDecimals: true })}
            </span>
          </div>

          <div className="flex items-center gap-1 text-forest-700 font-semibold group-hover:text-jade-700 transition-colors">
            <span>
              {roomAssets.length} {roomAssets.length === 1 ? 'item' : 'items'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
