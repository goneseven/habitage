import React, { useEffect, useState } from 'react';
import { Home, Plus, Search, ArrowUpDown } from 'lucide-react';
import { useHouseholdStore } from '../store/useHouseholdStore';
import { useUIStore } from '../store/useUIStore';
import { db } from '../db';
import type { Room, Asset } from '../types';
import { Button } from '../components/ui/Button';
import { RoomCard } from '../components/rooms/RoomCard';
import { RoomModal } from '../components/rooms/RoomModal';
import { RoomDeleteDialog } from '../components/rooms/RoomDeleteDialog';
import { RoomDetailView } from '../components/rooms/RoomDetailView';
import { sumAmounts } from '../lib/currency';

export const RoomsView: React.FC = () => {
  const { activeHousehold } = useHouseholdStore();
  const { selectedRoomId, setSelectedRoomId } = useUIStore();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'items' | 'floor'>('floor');

  // Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const loadData = async () => {
    if (!activeHousehold) return;
    try {
      setLoading(true);
      const [loadedRooms, loadedAssets] = await Promise.all([
        db.rooms.where('householdId').equals(activeHousehold.id).toArray(),
        db.assets.where('householdId').equals(activeHousehold.id).toArray(),
      ]);
      setRooms(loadedRooms);
      setAssets(loadedAssets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeHousehold]);

  if (!activeHousehold) return null;
  const currency = activeHousehold.currency || 'USD';

  // Distinct floor levels for filter pills
  const availableFloors = Array.from(new Set(rooms.map((r) => r.floorLevel))).filter(Boolean);

  // If a room is selected, render the RoomDetailView
  const activeRoom = selectedRoomId ? rooms.find((r) => r.id === selectedRoomId) : null;

  if (activeRoom) {
    return (
      <RoomDetailView
        room={activeRoom}
        currency={currency}
        onBack={() => setSelectedRoomId(null)}
        onEdit={() => {
          setRoomToEdit(activeRoom);
          setIsModalOpen(true);
        }}
        onDelete={() => {
          setRoomToDelete(activeRoom);
          setIsDeleteDialogOpen(true);
        }}
      />
    );
  }

  // Filtering
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFloor = selectedFloor === 'all' || room.floorLevel === selectedFloor;

    return matchesSearch && matchesFloor;
  });

  // Sorting
  filteredRooms.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'floor') {
      return a.floorLevel.localeCompare(b.floorLevel);
    }
    if (sortBy === 'items') {
      const aCount = assets.filter((item) => item.roomId === a.id).length;
      const bCount = assets.filter((item) => item.roomId === b.id).length;
      return bCount - aCount;
    }
    if (sortBy === 'value') {
      const aVal = sumAmounts(
        assets
          .filter((item) => item.roomId === a.id)
          .map((item) => (item.currentValue !== undefined ? item.currentValue : item.purchasePrice))
      );
      const bVal = sumAmounts(
        assets
          .filter((item) => item.roomId === b.id)
          .map((item) => (item.currentValue !== undefined ? item.currentValue : item.purchasePrice))
      );
      return bVal - aVal;
    }
    return 0;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-editorial font-bold text-forest-950">
            Architectural Spaces & Rooms
          </h1>
          <p className="text-xs text-forest-600">
            Manage physical rooms, suites, outdoor loggias, and storage zones across {activeHousehold.name}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setRoomToEdit(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Room Space
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Floor Level Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFloor('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFloor === 'all'
                ? 'bg-forest-900 text-ivory-50 shadow-xs'
                : 'bg-white border border-ivory-300 text-forest-700 hover:bg-ivory-100'
            }`}
          >
            All Floors ({rooms.length})
          </button>
          {availableFloors.map((floor) => {
            const floorCount = rooms.filter((r) => r.floorLevel === floor).length;
            const isSelected = selectedFloor === floor;
            return (
              <button
                key={floor}
                type="button"
                onClick={() => setSelectedFloor(floor)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-forest-900 text-ivory-50 shadow-xs'
                    : 'bg-white border border-ivory-300 text-forest-700 hover:bg-ivory-100'
                }`}
              >
                {floor} ({floorCount})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              type="text"
              placeholder="Search spaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-ivory-300 bg-white placeholder:text-forest-400 focus:outline-none focus:ring-1 focus:ring-forest-700 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-ivory-300 rounded-xl px-2 py-1 shadow-xs text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-forest-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-forest-900 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="floor">By Floor</option>
              <option value="value">By Valuation</option>
              <option value="items">By Items Count</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-forest-500">Loading spaces...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="editorial-card rounded-3xl p-12 text-center bg-white border border-dashed border-ivory-300">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-3">
            <Home className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-lg font-bold text-forest-950">
            {searchTerm || selectedFloor !== 'all' ? 'No matching spaces found' : 'No rooms configured yet'}
          </h3>
          <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedFloor !== 'all'
              ? 'Try resetting your floor filter or search query.'
              : 'Add living areas, suites, gardens, and garages to catalog your physical inventory.'}
          </p>
          <Button
            variant="primary"
            size="md"
            className="mt-4"
            onClick={() => {
              setRoomToEdit(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create First Room
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              assets={assets}
              currency={currency}
              onSelect={() => setSelectedRoomId(room.id)}
              onEdit={() => {
                setRoomToEdit(room);
                setIsModalOpen(true);
              }}
              onDelete={() => {
                setRoomToDelete(room);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Room Create / Edit Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomToEdit={roomToEdit}
        onRoomSaved={() => {
          loadData();
        }}
      />

      {/* Safe Delete Dialog */}
      <RoomDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        roomToDelete={roomToDelete}
        otherRooms={rooms.filter((r) => r.id !== roomToDelete?.id)}
        currency={currency}
        onDeleted={() => {
          setSelectedRoomId(null);
          loadData();
        }}
      />
    </div>
  );
};
