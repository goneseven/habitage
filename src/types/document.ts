export type DocumentType =
  | 'receipt'
  | 'invoice'
  | 'warranty'
  | 'manual'
  | 'appraisal'
  | 'insurance_policy'
  | 'certificate'
  | 'other';

export interface AssetDocument {
  id: string;
  householdId: string;
  assetId?: string; // Optional if document applies to whole household
  docType: DocumentType;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl?: string; // base64 or stored URL
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}
