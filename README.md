# Habitage

> **Habitage** is a premium personal home inventory and asset intelligence application. It provides homeowners, collectors, and estates with an elegant, local-first digital archive of household possessions, including locations, photographs, purchase records, documents, warranties, maintenance history, and financial valuations.

---

## Highlights

- **Local-First Architecture**: Powered by IndexedDB via Dexie.js. Your personal data remains on your machine with zero cloud dependence.
- **Botanical Editorial Aesthetic**: A sophisticated tropical color palette (deep forest greens, botanical jade, warm ivory/linen, and muted brass accents) paired with refined typography.
- **Comprehensive Asset Tracking**: Categorization, room-level placement, serial numbers, conditions, and multiple high-resolution photos per asset.
- **Ownership & Warranty Vault**: Store invoices, appraisal certificates, user manuals, and warranty expiry dates with proactive alert countdowns.
- **Maintenance Logbook**: Historical service logs, cost records, service provider contacts, and lifecycle state tracking.
- **Valuation & Insurance Intelligence**: Accurate financial calculations powered by `decimal.js`, depreciation schedules, and insurance policy coverage gap analysis.
- **Data Portability**: Full JSON backup and restore, CSV imports and exports, and printable inventory reports.

---

## Tech Stack

- **Runtime & Build**: [Vite](https://vitejs.dev/) + [React 19 / 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom tropical botanical palette tokens
- **UI Components**: Headless primitives, Lucide icons
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Database**: [Dexie.js](https://dexie.org/) (IndexedDB)
- **Validation & Forms**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Analytics & Charts**: [Recharts](https://recharts.org/)
- **Financial Calculations**: [decimal.js](https://mikemcl.github.io/decimal.js/)
- **Date Handling**: [date-fns](https://date-fns.org/)

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or later (v20+ recommended)
- `npm` (or `pnpm` / `yarn`)

### Install Dependencies

```bash
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Then navigate to `http://localhost:5173` in your browser.

### Production Build

Create an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Type Checking & Linting

Run TypeScript verification:

```bash
npm run typecheck
```

---

## Project Structure

```
habitage/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Reusable UI & domain components
│   │   ├── layout/         # Sidebar, Topbar, Navigation
│   │   ├── ui/             # Design system primitives (buttons, modals, badges)
│   │   ├── household/      # Household profile & switcher
│   │   ├── rooms/          # Room grids & management
│   │   ├── assets/         # Asset catalog, forms & photo galleries
│   │   ├── documents/      # Document vault & warranty tracking
│   │   ├── maintenance/    # Service records & timelines
│   │   ├── valuation/      # Depreciation & financial charts
│   │   └── reports/        # Printable inventory reports
│   ├── db/                 # Dexie.js database schema & seed data
│   ├── lib/                # Utility functions, currency & financial math
│   ├── store/              # Zustand stores (household, UI state)
│   ├── types/              # Domain models & TypeScript interfaces
│   ├── views/              # Main route views
│   ├── App.tsx             # Main application shell
│   └── main.tsx            # Application entry point
├── PLAN.md                 # Master development plan & status
├── README.md               # Project documentation
└── package.json            # Dependencies & scripts
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
