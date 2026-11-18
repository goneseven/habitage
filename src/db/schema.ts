import Dexie, { type EntityTable } from 'dexie';
import type {
  Household,
  Room,
  Category,
  Asset,
  AssetPhoto,
  AssetDocument,
  MaintenanceRecord,
  ValuationRecord,
} from '../types';

export class HabitageDB extends Dexie {
  households!: EntityTable<Household, 'id'>;
  rooms!: EntityTable<Room, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  assets!: EntityTable<Asset, 'id'>;
  photos!: EntityTable<AssetPhoto, 'id'>;
  documents!: EntityTable<AssetDocument, 'id'>;
  maintenance!: EntityTable<MaintenanceRecord, 'id'>;
  valuations!: EntityTable<ValuationRecord, 'id'>;

  constructor() {
    super('HabitageDB');
    this.version(1).stores({
      households: 'id, name, propertyType, currency, createdAt',
      rooms: 'id, householdId, name, roomType, floorLevel, createdAt',
      categories: 'id, name',
      assets: 'id, householdId, roomId, categoryId, name, status, condition, purchaseDate, isInsured, createdAt',
      photos: 'id, assetId, isPrimary, createdAt',
      documents: 'id, householdId, assetId, docType, expiryDate, createdAt',
      maintenance: 'id, householdId, assetId, serviceDate, completed, createdAt',
      valuations: 'id, assetId, valuationDate, createdAt',
    });
  }
}

export const db = new HabitageDB();
