import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { db } from '../../db';
import { useUIStore } from '../../store/useUIStore';
import type { Room, Asset } from '../../types';
import { formatCurrency, sumAmounts } from '../../lib/currency';
import { AlertTriangle } from 'lucide-react';

interface RoomDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roomToDelete: Room | null;
  otherRooms: Room[];
  currency: string;
  onDeleted: () => void;
}

export const RoomDeleteDialog: React.FC<RoomDeleteDialogProps> = ({
  isOpen,
  onClose,
  roomToDelete,
  otherRooms,
  currency,
  onDeleted,
}) => {
  const { showToast } = useUIStore();
  const [affectedAssets, setAffectedAssets] = useState<Asset[]>([]);
  const [actionChoice, setActionChoice] = useState<'reassign' | 'unassign'>('reassign');
  const [targetRoomId, setTargetRoomId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function checkAssets() {
      if (!roomToDelete) return;
      const assets = await db.assets.where('roomId').equals(roomToDelete.id).toArray();
      setAffectedAssets(assets);
      if (otherRooms.length > 0) {
        setTargetRoomId(otherRooms[0].id);
        setActionChoice('reassign');
      } else {
        setActionChoice('unassign');
      }
    }
    if (isOpen && roomToDelete) {
      checkAssets();
    }
  }, [isOpen, roomToDelete, otherRooms]);

  if (!roomToDelete) return null;

  const totalValue = sumAmounts(
    affectedAssets.map((a) => (a.currentValue !== undefined ? a.currentValue : a.purchasePrice))
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await db.transaction('rw', [db.rooms, db.assets], async () => {
        if (affectedAssets.length > 0) {
          if (actionChoice === 'reassign' && targetRoomId) {
            // Reassign to selected room
            await db.assets
              .where('roomId')
              .equals(roomToDelete.id)
              .modify({ roomId: targetRoomId });
          } else {
            // Unassign
            await db.assets
              .where('roomId')
              .equals(roomToDelete.id)
              .modify({ roomId: '' });
          }
        }

        // Delete room
        await db.rooms.delete(roomToDelete.id);
      });

      showToast({
        type: 'info',
        title: 'Room Removed',
        message: `"${roomToDelete.name}" was deleted.`,
      });

      onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete room space.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const targetRoomOptions = otherRooms.map((r) => ({
    value: r.id,
    label: `${r.name} (${r.floorLevel})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Delete Architectural Space"
      subtitle={`Permanently remove "${roomToDelete.name}" from your residence plan.`}
    >
      <div className="space-y-4">
        {affectedAssets.length > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  {affectedAssets.length} Possessions Located Here
                </h4>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  This room currently houses {affectedAssets.length} catalogued items valued at{' '}
                  <span className="font-bold">
                    {formatCurrency(totalValue, currency, { hideDecimals: true })}
                  </span>
                  . Choose how to handle these possessions:
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              {otherRooms.length > 0 && (
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-amber-300 transition-colors">
                  <input
                    type="radio"
                    name="assetAction"
                    checked={actionChoice === 'reassign'}
                    onChange={() => setActionChoice('reassign')}
                    className="mt-0.5 text-forest-900 focus:ring-forest-700"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-forest-950 block">
                      Transfer items to another space
                    </span>
                    <span className="text-forest-600 text-[11px]">
                      Move all {affectedAssets.length} items to:
                    </span>
                    {actionChoice === 'reassign' && (
                      <div className="mt-2">
                        <Select
                          options={targetRoomOptions}
                          value={targetRoomId}
                          onChange={(e) => setTargetRoomId(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </label>
              )}

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer hover:border-amber-300 transition-colors">
                <input
                  type="radio"
                  name="assetAction"
                  checked={actionChoice === 'unassign'}
                  onChange={() => setActionChoice('unassign')}
                  className="mt-0.5 text-forest-900 focus:ring-forest-700"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-forest-950 block">
                    Keep items as Unassigned
                  </span>
                  <span className="text-forest-600 text-[11px]">
                    Preserve all asset records, but remove their physical location link.
                  </span>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <p className="text-xs text-forest-700 leading-relaxed">
            Are you sure you want to delete <span className="font-bold">"{roomToDelete.name}"</span>?
            This room is currently empty.
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Confirm Deletion
          </Button>
        </div>
      </div>
    </Modal>
  );
};
