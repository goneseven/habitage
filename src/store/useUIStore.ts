import { create } from 'zustand';

export type ActiveView =
  | 'dashboard'
  | 'inventory'
  | 'rooms'
  | 'documents'
  | 'maintenance'
  | 'valuation'
  | 'reports'
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface UIState {
  activeView: ActiveView;
  selectedRoomId: string | null;
  selectedAssetId: string | null;
  isSidebarOpenMobile: boolean;

  // Household dialog
  isHouseholdModalOpen: boolean;
  householdModalMode: 'create' | 'edit';

  // Toasts
  toasts: ToastMessage[];

  // Actions
  setActiveView: (view: ActiveView, params?: { roomId?: string; assetId?: string }) => void;
  setSelectedRoomId: (id: string | null) => void;
  setSelectedAssetId: (id: string | null) => void;
  setIsSidebarOpenMobile: (open: boolean) => void;
  openHouseholdModal: (mode: 'create' | 'edit') => void;
  closeHouseholdModal: () => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'dashboard',
  selectedRoomId: null,
  selectedAssetId: null,
  isSidebarOpenMobile: false,

  isHouseholdModalOpen: false,
  householdModalMode: 'create',

  toasts: [],

  setActiveView: (view, params) => {
    set({
      activeView: view,
      selectedRoomId: params?.roomId ?? null,
      selectedAssetId: params?.assetId ?? null,
      isSidebarOpenMobile: false,
    });
  },

  setSelectedRoomId: (id) => set({ selectedRoomId: id }),
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),
  setIsSidebarOpenMobile: (open) => set({ isSidebarOpenMobile: open }),

  openHouseholdModal: (mode) => set({ isHouseholdModalOpen: true, householdModalMode: mode }),
  closeHouseholdModal: () => set({ isHouseholdModalOpen: false }),

  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
