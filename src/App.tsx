import React, { useEffect } from 'react';
import { useHouseholdStore } from './store/useHouseholdStore';
import { HouseholdWelcome } from './components/household/HouseholdWelcome';
import { AppLayout } from './components/layout/AppLayout';
import { HouseholdModal } from './components/household/HouseholdModal';
import { ToastContainer } from './components/ui/ToastContainer';

export const App: React.FC = () => {
  const { initialize, isInitialized, isLoading, activeHousehold } = useHouseholdStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized || (isLoading && !activeHousehold)) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brass-500 to-brass-700 flex items-center justify-center text-forest-950 font-serif font-black text-xl shadow-md border border-brass-400/40">
            H
          </div>
          <div className="absolute -inset-1 rounded-2xl border-2 border-forest-800/20 animate-ping pointer-events-none" />
        </div>
        <h2 className="font-editorial text-xl font-bold text-forest-950">
          Habitage
        </h2>
        <p className="text-xs text-forest-600 mt-1">
          Loading encrypted local archive...
        </p>
      </div>
    );
  }

  if (!activeHousehold) {
    return (
      <>
        <HouseholdWelcome />
        <HouseholdModal />
        <ToastContainer />
      </>
    );
  }

  return <AppLayout />;
};

export default App;
