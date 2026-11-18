import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../ui/ToastContainer';
import { HouseholdModal } from '../household/HouseholdModal';
import { useUIStore } from '../../store/useUIStore';

// Views
import { DashboardView } from '../../views/DashboardView';
import { InventoryView } from '../../views/InventoryView';
import { RoomsView } from '../../views/RoomsView';
import { DocumentsView } from '../../views/DocumentsView';
import { MaintenanceView } from '../../views/MaintenanceView';
import { ValuationView } from '../../views/ValuationView';
import { ReportsView } from '../../views/ReportsView';
import { SettingsView } from '../../views/SettingsView';

export const AppLayout: React.FC = () => {
  const { activeView } = useUIStore();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventory':
        return <InventoryView />;
      case 'rooms':
        return <RoomsView />;
      case 'documents':
        return <DocumentsView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'valuation':
        return <ValuationView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#faf8f5] text-forest-950">
      {/* Editorial Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <HouseholdModal />
      <ToastContainer />
    </div>
  );
};
