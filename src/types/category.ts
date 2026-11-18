export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  subcategories: string[];
  defaultUsefulLifeYears?: number;
  isCustom?: boolean;
}
