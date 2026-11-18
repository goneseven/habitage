export type AssetStatus =
  | 'active'
  | 'in_repair'
  | 'stored'
  | 'loaned'
  | 'donated'
  | 'sold'
  | 'disposed'
  | 'lost';

export type AssetCondition = 'mint' | 'excellent' | 'good' | 'fair' | 'poor' | 'salvage';

export type DepreciationMethod = 'straight_line' | 'diminishing_balance' | 'none';

export interface Asset {
  id: string;
  householdId: string;
  roomId: string;
  categoryId: string;
  subcategory?: string;
  name: string;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;
  status: AssetStatus;
  condition: AssetCondition;

  // Financial values
  purchaseDate?: string;
  purchasePrice?: number;
  purchaseLocation?: string;
  currentValue?: number;
  replacementValue?: number;
  depreciationMethod?: DepreciationMethod;
  usefulLifeYears?: number;
  salvageValue?: number;

  // Warranty
  warrantyExpiry?: string;
  warrantyNotes?: string;
  warrantyProvider?: string;

  // Media & Classification
  primaryPhotoId?: string;
  tags?: string[];
  notes?: string;
  isInsured?: boolean;
  isHeirloom?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AssetPhoto {
  id: string;
  assetId: string;
  dataUrl: string; // base64 or stored object url
  caption?: string;
  isPrimary: boolean;
  createdAt: string;
}
