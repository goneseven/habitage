# Habitage — Implementation Master Plan

> **Habitage**: A premium, local-first personal home inventory and asset intelligence application. Built with TypeScript, React, Vite, Tailwind CSS, Lucide icons, and Dexie.js (IndexedDB).

---

## 1. Product Vision & Principles

Habitage provides homeowners, collectors, and estates with an elegant, private, local-first digital archive of household possessions. It tracks item locations, photographs, purchase and ownership records, warranties, maintenance history, and financial asset valuations with insurance intelligence.

### Key Principles
- **Local-First & Private**: Full data persistence via IndexedDB (Dexie.js). Zero mandatory external cloud dependencies; your personal inventory never leaves your browser unless you explicitly export it.
- **Editorial Tropical Aesthetic**: Deep forest greens (`#122620`, `#173b2e`), botanical jade (`#235340`, `#2d6a4f`), warm ivory/linen backgrounds (`#fbfaf6`, `#f4f0e6`), muted brass/gold accents (`#c5a059`, `#b38728`), refined editorial serif/sans hierarchy, and subtle organic depth.
- **Precision Financial Intelligence**: Accurate decimal math (`decimal.js`) for replacement values, straight-line and diminishing balance depreciation, and insurance gap analysis.
- **Reliable Data Portability**: Unrestricted JSON and CSV import/export, complete snapshot backups, and printable inventory reports.

---

## 2. Architecture & Domain Models

### Directory Layout
```
habitage/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   └── sample-images/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── db/
│   │   ├── schema.ts          # Dexie database class & table definitions
│   │   ├── seed.ts            # High-end editorial seed data (The Palm Grove Estate)
│   │   └── index.ts           # DB instance & helper queries
│   ├── types/
│   │   ├── household.ts
│   │   ├── room.ts
│   │   ├── category.ts
│   │   ├── asset.ts
│   │   ├── document.ts
│   │   ├── maintenance.ts
│   │   ├── valuation.ts
│   │   └── report.ts
│   ├── store/
│   │   ├── useHouseholdStore.ts
│   │   ├── useUIStore.ts
│   │   └── useFilterStore.ts
│   ├── lib/
│   │   ├── utils.ts           # cn, formatting, date helpers
│   │   ├── currency.ts        # Currency symbols, decimal.js wrappers
│   │   ├── depreciation.ts    # Financial models & calculations
│   │   └── storage.ts         # Image & file blob store helpers
│   ├── components/
│   │   ├── ui/                # Radix + Tailwind primitives (Button, Dialog, Badge, Input, Select, etc.)
│   │   ├── layout/            # Editorial Navigation, Topbar, Sidebar, MobileNav
│   │   ├── household/         # Household setup, switcher, settings modal
│   │   ├── rooms/             # Room grid, room cards, room dialogs
│   │   ├── categories/        # Category manager, tree picker
│   │   ├── assets/            # Asset cards, asset details, asset form, photo gallery
│   │   ├── documents/         # Receipt/doc upload, preview, warranty tracker
│   │   ├── maintenance/       # Service logs, timeline, provider registry
│   │   ├── valuation/         # Financial dashboard, charts, depreciation tables
│   │   ├── insurance/         # Policy vs replacement coverage gap analyzer
│   │   ├── reports/           # Printable inventory reports & summary builder
│   │   └── settings/          # Data export/import, backup/restore, currencies
│   └── views/
│       ├── DashboardView.tsx
│       ├── InventoryView.tsx
│       ├── RoomsView.tsx
│       ├── RoomDetailView.tsx
│       ├── AssetDetailView.tsx
│       ├── DocumentsView.tsx
│       ├── MaintenanceView.tsx
│       ├── ValuationView.tsx
│       ├── ReportsView.tsx
│       └── SettingsView.tsx
```

### Core Domain Entities

```typescript
// Household
export interface Household {
  id: string;
  name: string;
  propertyType: 'single_family' | 'apartment' | 'townhouse' | 'estate' | 'vacation_home' | 'other';
  address?: string;
  currency: string; // e.g. 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY'
  squareMeters?: number;
  insurancePolicyLimit?: number;
  insuranceDeductible?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Room
export interface Room {
  id: string;
  householdId: string;
  name: string;
  roomType: 'living_room' | 'kitchen' | 'master_bedroom' | 'bedroom' | 'bathroom' | 'dining_room' | 'study_office' | 'library' | 'terrace_patio' | 'garden' | 'wine_cellar' | 'garage' | 'storage' | 'other';
  floorLevel: string; // e.g., "Ground Floor", "1st Floor", "Basement", "Attic"
  colorTag?: string;
  iconName?: string;
  photoUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Category & Subcategory
export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  subcategories: string[];
  defaultUsefulLifeYears?: number; // for depreciation defaults
  isCustom?: boolean;
}

// Asset
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
  status: 'active' | 'in_repair' | 'stored' | 'loaned' | 'donated' | 'sold' | 'disposed' | 'lost';
  condition: 'mint' | 'excellent' | 'good' | 'fair' | 'poor' | 'salvage';
  
  // Financial
  purchaseDate?: string;
  purchasePrice?: number;
  purchaseLocation?: string;
  currentValue?: number;
  replacementValue?: number;
  depreciationMethod?: 'straight_line' | 'diminishing_balance' | 'none';
  usefulLifeYears?: number;
  salvageValue?: number;

  // Warranty
  warrantyExpiry?: string;
  warrantyNotes?: string;
  warrantyProvider?: string;

  // Media & Metadata
  primaryPhotoId?: string;
  tags?: string[];
  notes?: string;
  isInsured?: boolean;
  isHeirloom?: boolean;

  createdAt: string;
  updatedAt: string;
}

// Photo Record
export interface AssetPhoto {
  id: string;
  assetId: string;
  blobData?: Blob; // stored in IndexedDB
  dataUrl?: string; // base64 or object URL fallback
  caption?: string;
  isPrimary: boolean;
  createdAt: string;
}

// Document / Receipt
export interface AssetDocument {
  id: string;
  householdId: string;
  assetId?: string; // nullable if general household doc (e.g. general policy)
  docType: 'receipt' | 'invoice' | 'warranty' | 'manual' | 'appraisal' | 'insurance_policy' | 'certificate' | 'other';
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl?: string;
  blobData?: Blob;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}

// Maintenance Record
export interface MaintenanceRecord {
  id: string;
  householdId: string;
  assetId: string;
  title: string;
  serviceType: 'routine_service' | 'repair' | 'inspection' | 'cleaning' | 'restoration' | 'upgrade' | 'other';
  serviceDate: string;
  cost?: number;
  serviceProvider?: string;
  providerPhone?: string;
  providerEmail?: string;
  notes?: string;
  nextScheduledDate?: string;
  completed: boolean;
  createdAt: string;
}

// Historical Valuation Record
export interface ValuationRecord {
  id: string;
  assetId: string;
  valuationDate: string;
  value: number;
  valuationType: 'appraisal' | 'market_estimate' | 'insurance_assessment' | 'purchase_price';
  appraiserName?: string;
  notes?: string;
  createdAt: string;
}
```

---

## 3. Development Phases & Feature Breakdown

To adhere strictly to the single feature per step discipline, development is divided into 11 discrete, independently verifiable features.

### Phase 1: Foundation & Core Inventory (Objective 1)
- [x] **Feature 1: Application Architecture, Design System & Household Setup**
  - *Dependencies*: Base Vite + React + Tailwind + Dexie setup.
  - *Scope*: Project infrastructure, tropical botanical design tokens, responsive layout shell (desktop sidebar, tablet/mobile header drawer), Dexie IndexedDB database schema with all tables, household profile management (creation, switching, editing, multi-currency support), and optional sample estate seed ("The Palm Grove Residence").
  - *Status*: COMPLETED.
  - *Implementation Details*:
    - Initialized React 18, Vite 6, TypeScript 5.7, Tailwind CSS with customized tropical palette (`forest`, `jade`, `ivory`, `brass`).
    - Configured typography with Google Fonts ("Playfair Display" and "Plus Jakarta Sans").
    - Defined comprehensive Dexie.js IndexedDB schema (`HabitageDB`) with tables for `households`, `rooms`, `categories`, `assets`, `photos`, `documents`, `maintenance`, and `valuations`.
    - Implemented curated botanical categories and rich editorial sample estate: "The Palm Grove Residence" with 6 architectural rooms and 6 luxury assets.
    - Built responsive navigation layout shell (`Sidebar`, `Topbar`, `AppLayout`, mobile drawer).
    - Built `useHouseholdStore` and `useUIStore` using Zustand with persistence.
    - Built `HouseholdModal` with React Hook Form + Zod validation, `HouseholdSelector` dropdown, and `HouseholdWelcome` onboarding screen.
    - Verified strict TypeScript compilation (`npm run typecheck`) and production build (`npm run build`).

- [ ] **Feature 2: Room & Space Management**
  - *Dependencies*: Feature 1.
  - *Scope*: Room listing, Room creation & edit modal with floor levels, icons, room photo, and color badges. Room summary cards displaying asset count and aggregate room valuation. Delete confirmation with safety checks.
  - *Status*: NEXT TO IMPLEMENT.

- [ ] **Feature 3: Categories & Asset Taxonomy**
  - *Dependencies*: Feature 1.
  - *Scope*: Built-in curated luxury & household categories (Furniture, Fine Art, Electronics, Horology & Jewelry, Culinary, Appliances, Wardrobe, Audio & Media, Outdoor) with subcategories, useful life defaults, custom category creator, and hierarchical selection picker.

- [ ] **Feature 4: Asset Inventory Management & Photo Gallery**
  - *Dependencies*: Features 1, 2, 3.
  - *Scope*: Asset creation and edit drawer/dialog with form validation (React Hook Form + Zod), rich attributes (brand, model, serial, condition, status, acquisition details). Local photo upload with IndexedDB storage, thumbnail preview, primary image badge, and image gallery lightbox.

- [ ] **Feature 5: Advanced Search, Multi-Filter, Sorting & Room Explorer**
  - *Dependencies*: Feature 4.
  - *Scope*: Instant multi-field text search, category filter, room filter, condition & status toggles, price range sliders, sorting (by value, acquisition date, name, recently updated), and dedicated visual Room Explorer view with quick asset inspection.

### Phase 2: Documents, Ownership & Maintenance (Objectives 2 & 3)
- [ ] **Feature 6: Documents, Receipts & Warranty Tracker**
  - *Dependencies*: Feature 4.
  - *Scope*: Document repository for receipts, invoices, manuals, and appraisal certificates. Drag-and-drop document upload with local persistence, file preview modal, asset link binding, warranty expiry countdown alerts, and filtering by document type.

- [ ] **Feature 7: Maintenance Logs, Service Providers & Lifecycle State Tracking**
  - *Dependencies*: Feature 4.
  - *Scope*: Maintenance logbook for assets (routine servicing, restoration, repairs), cost recording, service provider contact directory, upcoming scheduled maintenance reminders, and asset lifecycle state management (active, in repair, sold, disposed).

### Phase 3: Financial Intelligence & Insurance (Objective 4)
- [ ] **Feature 8: Asset Valuation, Depreciation Engine & Financial Dashboard**
  - *Dependencies*: Feature 4.
  - *Scope*: Precision financial calculations (`decimal.js`), depreciation models (straight-line, diminishing balance), historical valuation tracking timeline, household wealth breakdown by room and category, and interactive Recharts visualizations.

- [ ] **Feature 9: Insurance Intelligence & Coverage Analysis**
  - *Dependencies*: Feature 8.
  - *Scope*: Insurance policy manager, total replacement value vs policy limit comparison, coverage gap alerts, underinsurance warnings, deductible calculators, and high-value unscheduled asset flags.

### Phase 4: Reports, Portability & Settings (Objective 5)
- [ ] **Feature 10: Reports Generation & Print / Export Engine**
  - *Dependencies*: Features 5, 8, 9.
  - *Scope*: Comprehensive household inventory reports, room-by-room audit sheets, insurance claim loss schedules, print-optimized editorial stylesheet, and formatted PDF/printable export.

- [ ] **Feature 11: Data Portability (JSON/CSV Backup & Restore) & Settings**
  - *Dependencies*: Features 1 through 10.
  - *Scope*: Complete database JSON export and import with schema validation, CSV asset import/export with column mapping, database reset/purge tools, and user preferences (currencies, default room types).

---

## 4. Implementation Decisions & Conventions

1. **Local-First Persistence**: All data is stored in IndexedDB using `Dexie`. No data leaves the user's browser. High-resolution photos and documents are stored as Blobs or Data URLs in indexed object stores with lazy loading.
2. **Design Language**: Editorial luxury tropical aesthetic. High contrast, warm ivory backgrounds (`#FAF8F5`, `#F3EFE6`), rich botanical greens (`#0F291E`, `#1A4332`, `#2C6E49`), warm brass accents (`#C5A059`, `#B38728`), tactile borders, crisp typography, and subtle shadows.
3. **Financial Precision**: All currency and financial totals are calculated using `decimal.js` or integer cents to avoid floating point inaccuracies, formatted with browser `Intl.NumberFormat` according to the active household's currency code.
4. **Resilience**: Every form validates input with Zod schemas. Error boundaries, empty states, and loading skeletons are provided for all views.
5. **Clean Git History**: Every feature is committed individually once verified.
