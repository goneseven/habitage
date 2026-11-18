export type RoomType =
  | 'living_room'
  | 'kitchen'
  | 'master_bedroom'
  | 'bedroom'
  | 'bathroom'
  | 'dining_room'
  | 'study_office'
  | 'library'
  | 'terrace_patio'
  | 'garden'
  | 'wine_cellar'
  | 'garage'
  | 'storage'
  | 'walk_in_closet'
  | 'gym'
  | 'home_theater'
  | 'other';

export interface Room {
  id: string;
  householdId: string;
  name: string;
  roomType: RoomType;
  floorLevel: string; // e.g. "Ground Floor", "1st Floor", "Level 2", "Basement"
  colorTag?: string;
  iconName?: string;
  photoUrl?: string;
  description?: string;
  squareMeters?: number;
  createdAt: string;
  updatedAt: string;
}
