import { create } from 'zustand';
import { db, seedSampleHousehold, seedDefaultCategories } from '../db';
import type { Household } from '../types';

interface HouseholdState {
  households: Household[];
  activeHousehold: Household | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setActiveHouseholdId: (id: string) => Promise<void>;
  createHousehold: (data: Omit<Household, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Household>;
  updateHousehold: (id: string, updates: Partial<Omit<Household, 'id' | 'createdAt'>>) => Promise<void>;
  deleteHousehold: (id: string) => Promise<void>;
  loadSampleData: () => Promise<void>;
  refreshHouseholds: () => Promise<void>;
}

const STORAGE_KEY = 'habitage_active_household_id';

export const useHouseholdStore = create<HouseholdState>((set, get) => ({
  households: [],
  activeHousehold: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      await seedDefaultCategories();
      const allHouseholds = await db.households.toArray();
      const savedId = localStorage.getItem(STORAGE_KEY);

      let current: Household | null = null;
      if (savedId) {
        current = allHouseholds.find((h) => h.id === savedId) || null;
      }
      if (!current && allHouseholds.length > 0) {
        current = allHouseholds[0];
        localStorage.setItem(STORAGE_KEY, current.id);
      }

      set({
        households: allHouseholds,
        activeHousehold: current,
        isLoading: false,
        isInitialized: true,
      });
    } catch (err) {
      console.error('Failed to initialize households:', err);
      set({ isLoading: false, isInitialized: true });
    }
  },

  refreshHouseholds: async () => {
    const all = await db.households.toArray();
    const currentActive = get().activeHousehold;
    const updatedActive = currentActive ? all.find((h) => h.id === currentActive.id) || null : (all[0] || null);

    if (updatedActive) {
      localStorage.setItem(STORAGE_KEY, updatedActive.id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    set({ households: all, activeHousehold: updatedActive });
  },

  setActiveHouseholdId: async (id: string) => {
    const target = get().households.find((h) => h.id === id);
    if (target) {
      localStorage.setItem(STORAGE_KEY, target.id);
      set({ activeHousehold: target });
    }
  },

  createHousehold: async (data) => {
    const now = new Date().toISOString();
    const newHousehold: Household = {
      ...data,
      id: `household-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    await db.households.add(newHousehold);
    await get().refreshHouseholds();
    await get().setActiveHouseholdId(newHousehold.id);
    return newHousehold;
  },

  updateHousehold: async (id, updates) => {
    const now = new Date().toISOString();
    await db.households.update(id, {
      ...updates,
      updatedAt: now,
    });
    await get().refreshHouseholds();
  },

  deleteHousehold: async (id) => {
    // Delete cascading items associated with household
    await db.transaction('rw', [db.households, db.rooms, db.assets, db.photos, db.documents, db.maintenance], async () => {
      // Find all assets in this household
      const assets = await db.assets.where('householdId').equals(id).toArray();
      const assetIds = assets.map((a) => a.id);

      if (assetIds.length > 0) {
        await db.photos.where('assetId').anyOf(assetIds).delete();
        await db.maintenance.where('assetId').anyOf(assetIds).delete();
      }

      await db.documents.where('householdId').equals(id).delete();
      await db.assets.where('householdId').equals(id).delete();
      await db.rooms.where('householdId').equals(id).delete();
      await db.households.delete(id);
    });

    await get().refreshHouseholds();
  },

  loadSampleData: async () => {
    set({ isLoading: true });
    try {
      const sample = await seedSampleHousehold();
      await get().refreshHouseholds();
      await get().setActiveHouseholdId(sample.id);
    } finally {
      set({ isLoading: false });
    }
  },
}));
