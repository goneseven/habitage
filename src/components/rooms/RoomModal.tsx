import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { db } from '../../db';
import { useHouseholdStore } from '../../store/useHouseholdStore';
import { useUIStore } from '../../store/useUIStore';
import type { Room, RoomType } from '../../types';
import { ROOM_ICON_OPTIONS, ROOM_COLOR_PRESETS, getRoomIcon } from './RoomIcons';
import { Camera, X } from 'lucide-react';

const roomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters'),
  roomType: z.string().min(1, 'Please select a room type'),
  floorLevel: z.string().min(1, 'Please select or specify a floor level'),
  squareMeters: z
    .preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  description: z.string().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

const ROOM_TYPE_OPTIONS = [
  { value: 'living_room', label: 'Living Room / Salon' },
  { value: 'master_bedroom', label: 'Primary Bedroom Suite' },
  { value: 'bedroom', label: 'Guest / Family Bedroom' },
  { value: 'dining_room', label: 'Dining Pavilion / Room' },
  { value: 'kitchen', label: 'Kitchen & Pantry' },
  { value: 'bathroom', label: 'Ensuite / Powder Room' },
  { value: 'study_office', label: 'Executive Office / Studio' },
  { value: 'library', label: 'Library & Reading Room' },
  { value: 'terrace_patio', label: 'Terrace, Loggia & Balcony' },
  { value: 'garden', label: 'Garden & Courtyard' },
  { value: 'wine_cellar', label: 'Wine Cellar & Tasting' },
  { value: 'garage', label: 'Garage & Motor Court' },
  { value: 'walk_in_closet', label: 'Dressing Room / Walk-in Closet' },
  { value: 'gym', label: 'Private Gym / Wellness' },
  { value: 'home_theater', label: 'Cinema / Screening Room' },
  { value: 'storage', label: 'Vault / Dedicated Storage' },
  { value: 'other', label: 'Other Architectural Space' },
];

const FLOOR_LEVEL_OPTIONS = [
  { value: 'Ground Floor', label: 'Ground Floor / Level 1' },
  { value: 'Upper Level', label: 'Upper Level / Level 2' },
  { value: 'Mezzanine', label: 'Mezzanine' },
  { value: 'Penthouse / Top Floor', label: 'Penthouse / Top Floor' },
  { value: 'Basement / Lower Ground', label: 'Basement / Lower Ground' },
  { value: 'Wine Cellar Vault', label: 'Sub-Basement / Cellar' },
  { value: 'Attic', label: 'Attic' },
  { value: 'Outdoor Grounds', label: 'Outdoor Grounds & Gardens' },
  { value: 'Detached Pavilion', label: 'Detached Pavilion / Guest House' },
];

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomToEdit?: Room | null;
  onRoomSaved: (room: Room) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  roomToEdit,
  onRoomSaved,
}) => {
  const { activeHousehold } = useHouseholdStore();
  const { showToast } = useUIStore();

  const [selectedColor, setSelectedColor] = useState<string>(ROOM_COLOR_PRESETS[0].value);
  const [selectedIcon, setSelectedIcon] = useState<string>('Sofa');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');

  const isEdit = !!roomToEdit;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      roomType: 'living_room',
      floorLevel: 'Ground Floor',
      squareMeters: undefined,
      description: '',
    },
  });

  const watchedRoomType = watch('roomType') as RoomType;

  useEffect(() => {
    if (roomToEdit) {
      reset({
        name: roomToEdit.name,
        roomType: roomToEdit.roomType,
        floorLevel: roomToEdit.floorLevel,
        squareMeters: roomToEdit.squareMeters,
        description: roomToEdit.description || '',
      });
      setSelectedColor(roomToEdit.colorTag || ROOM_COLOR_PRESETS[0].value);
      setSelectedIcon(roomToEdit.iconName || 'Sofa');
      setPhotoDataUrl(roomToEdit.photoUrl || '');
    } else {
      reset({
        name: '',
        roomType: 'living_room',
        floorLevel: 'Ground Floor',
        squareMeters: undefined,
        description: '',
      });
      setSelectedColor(ROOM_COLOR_PRESETS[0].value);
      setSelectedIcon('Sofa');
      setPhotoDataUrl('');
    }
  }, [roomToEdit, reset, isOpen]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast({
          type: 'error',
          title: 'Image Too Large',
          message: 'Please choose an image under 8MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RoomFormData) => {
    if (!activeHousehold) return;
    try {
      const now = new Date().toISOString();

      if (isEdit && roomToEdit) {
        const updatedRoom: Room = {
          ...roomToEdit,
          name: data.name,
          roomType: data.roomType as RoomType,
          floorLevel: data.floorLevel,
          squareMeters: data.squareMeters,
          description: data.description,
          colorTag: selectedColor,
          iconName: selectedIcon,
          photoUrl: photoDataUrl || undefined,
          updatedAt: now,
        };

        await db.rooms.put(updatedRoom);
        showToast({
          type: 'success',
          title: 'Room Updated',
          message: `"${updatedRoom.name}" has been updated.`,
        });
        onRoomSaved(updatedRoom);
      } else {
        const newRoom: Room = {
          id: `room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          householdId: activeHousehold.id,
          name: data.name,
          roomType: data.roomType as RoomType,
          floorLevel: data.floorLevel,
          squareMeters: data.squareMeters,
          description: data.description,
          colorTag: selectedColor,
          iconName: selectedIcon,
          photoUrl: photoDataUrl || undefined,
          createdAt: now,
          updatedAt: now,
        };

        await db.rooms.add(newRoom);
        showToast({
          type: 'success',
          title: 'Room Created',
          message: `"${newRoom.name}" added to ${activeHousehold.name}.`,
        });
        onRoomSaved(newRoom);
      }

      onClose();
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save room space. Please try again.',
      });
    }
  };

  const PreviewIcon = getRoomIcon(selectedIcon, watchedRoomType);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={isEdit ? 'Edit Architectural Space' : 'Add New Room / Space'}
      subtitle={`Configure the physical room location within ${activeHousehold?.name || 'residence'}.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name and Preview Badge */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-white/60 text-white mt-1"
            style={{ backgroundColor: selectedColor }}
          >
            <PreviewIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <Input
              label="Room / Space Name *"
              placeholder="e.g. Master Suite, Formal Dining Salon, Wine Cellar"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Room Purpose / Type"
            options={ROOM_TYPE_OPTIONS}
            error={errors.roomType?.message}
            {...register('roomType')}
          />
          <Select
            label="Floor / Level"
            options={FLOOR_LEVEL_OPTIONS}
            error={errors.floorLevel?.message}
            {...register('floorLevel')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Floor Area (m² or sq ft)"
            type="number"
            placeholder="e.g. 45"
            error={errors.squareMeters?.message}
            {...register('squareMeters')}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {ROOM_COLOR_PRESETS.map((color) => {
                const isSelected = selectedColor === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      isSelected
                        ? 'ring-2 ring-forest-900 ring-offset-2 scale-110'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800 mb-1.5">
            Architectural Icon
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 p-2 rounded-xl bg-ivory-50 border border-ivory-200">
            {ROOM_ICON_OPTIONS.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedIcon === opt.name;
              return (
                <button
                  key={opt.name}
                  type="button"
                  title={opt.label}
                  onClick={() => setSelectedIcon(opt.name)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-forest-900 text-ivory-50 shadow-xs'
                      : 'text-forest-700 hover:bg-ivory-200'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Photograph */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800">
            Room Photograph (Optional)
          </label>
          {photoDataUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-ivory-300 h-36 bg-forest-950 group">
              <img
                src={photoDataUrl}
                alt="Room photograph"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotoDataUrl('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-forest-950/80 text-white hover:bg-rose-600 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-ivory-300 hover:border-forest-600 bg-ivory-50/50 hover:bg-ivory-100/60 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 text-forest-600 group-hover:text-forest-900">
                <Camera className="w-5 h-5 text-brass-600" />
                <span className="text-xs font-medium">Click to upload photo of this room</span>
              </div>
              <span className="text-[10px] text-forest-400 mt-1">PNG, JPG, WebP up to 8MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-forest-800">
            Architectural Features & Description
          </label>
          <textarea
            rows={2}
            placeholder="Key finishes, lighting, security cameras, access points..."
            className="flex w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2 text-sm text-forest-950 placeholder:text-forest-400 transition-colors focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700 shadow-xs"
            {...register('description')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Room Space'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
