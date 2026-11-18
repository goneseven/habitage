export type ValuationType =
  | 'purchase_price'
  | 'appraisal'
  | 'market_estimate'
  | 'insurance_assessment';

export interface ValuationRecord {
  id: string;
  assetId: string;
  valuationDate: string;
  value: number;
  valuationType: ValuationType;
  appraiserName?: string;
  notes?: string;
  createdAt: string;
}
