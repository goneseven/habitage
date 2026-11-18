import React from 'react';
import {
  Sofa,
  Utensils,
  BedDouble,
  Bath,
  BookOpen,
  Sun,
  Trees,
  Wine,
  Car,
  Box,
  Shirt,
  Dumbbell,
  Tv,
  Lamp,
  Home,
  DoorClosed,
  Coffee,
  Briefcase,
  Layers,
} from 'lucide-react';
import type { RoomType } from '../../types/room';

export const ROOM_ICON_OPTIONS = [
  { name: 'Sofa', icon: Sofa, label: 'Living / Lounge' },
  { name: 'BedDouble', icon: BedDouble, label: 'Bedroom / Suite' },
  { name: 'Utensils', icon: Utensils, label: 'Dining / Pavilion' },
  { name: 'Coffee', icon: Coffee, label: 'Kitchen / Cafe' },
  { name: 'Bath', icon: Bath, label: 'Bathroom / Spa' },
  { name: 'BookOpen', icon: BookOpen, label: 'Library / Study' },
  { name: 'Briefcase', icon: Briefcase, label: 'Office / Studio' },
  { name: 'Wine', icon: Wine, label: 'Wine Cellar / Tasting' },
  { name: 'Sun', icon: Sun, label: 'Terrace / Loggia' },
  { name: 'Trees', icon: Trees, label: 'Garden / Courtyard' },
  { name: 'Car', icon: Car, label: 'Garage / Workshop' },
  { name: 'Shirt', icon: Shirt, label: 'Dressing / Wardrobe' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'Fitness / Gym' },
  { name: 'Tv', icon: Tv, label: 'Cinema / Media' },
  { name: 'Box', icon: Box, label: 'Vault / Storage' },
  { name: 'Lamp', icon: Lamp, label: 'Gallery / Hallway' },
  { name: 'Home', icon: Home, label: 'Residence General' },
  { name: 'DoorClosed', icon: DoorClosed, label: 'Private Room' },
];

export const ROOM_COLOR_PRESETS = [
  { name: 'Botanical Green', value: '#2D6A4F' },
  { name: 'Deep Forest', value: '#133829' },
  { name: 'Muted Brass', value: '#C5A059' },
  { name: 'Antique Gold', value: '#B38728' },
  { name: 'Warm Terracotta', value: '#C86D51' },
  { name: 'Ocean Slate', value: '#2B5B6C' },
  { name: 'Deep Indigo', value: '#2C3E55' },
  { name: 'Charcoal Linen', value: '#4A5568' },
];

export function getRoomIcon(iconName?: string, roomType?: RoomType): React.ComponentType<{ className?: string }> {
  if (iconName) {
    const match = ROOM_ICON_OPTIONS.find((item) => item.name === iconName);
    if (match) return match.icon;
  }

  // Fallback by room type
  switch (roomType) {
    case 'living_room':
      return Sofa;
    case 'master_bedroom':
    case 'bedroom':
      return BedDouble;
    case 'kitchen':
      return Coffee;
    case 'dining_room':
      return Utensils;
    case 'bathroom':
      return Bath;
    case 'library':
    case 'study_office':
      return BookOpen;
    case 'terrace_patio':
      return Sun;
    case 'garden':
      return Trees;
    case 'wine_cellar':
      return Wine;
    case 'garage':
      return Car;
    case 'walk_in_closet':
      return Shirt;
    case 'gym':
      return Dumbbell;
    case 'home_theater':
      return Tv;
    case 'storage':
      return Box;
    default:
      return Layers;
  }
}
