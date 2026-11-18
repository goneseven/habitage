import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Home,
  FileText,
  Wrench,
  TrendingUp,
  FileCheck2,
  Settings,
  X,
  Compass,
} from 'lucide-react';
import { useUIStore, type ActiveView } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Estate Overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'Asset Inventory', icon: Boxes },
  { id: 'rooms', label: 'Rooms & Spaces', icon: Home },
  { id: 'documents', label: 'Documents & Vault', icon: FileText },
  { id: 'maintenance', label: 'Maintenance Log', icon: Wrench },
  { id: 'valuation', label: 'Financial & Insurance', icon: TrendingUp },
  { id: 'reports', label: 'Audits & Reports', icon: FileCheck2 },
  { id: 'settings', label: 'Data & Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, isSidebarOpenMobile, setIsSidebarOpenMobile } = useUIStore();

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setIsSidebarOpenMobile(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#133829] text-ivory-100 border-r border-[#1e4d3b]">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-[#1f4a38]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brass-500 to-brass-700 flex items-center justify-center text-forest-950 font-serif font-black shadow-md border border-brass-400/40">
            H
          </div>
          <div>
            <h1 className="font-editorial text-lg font-bold tracking-tight text-ivory-50 flex items-center gap-2">
              Habitage
            </h1>
            <p className="text-[10px] text-jade-300 font-medium uppercase tracking-widest">
              Asset Intelligence
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsSidebarOpenMobile(false)}
          className="lg:hidden p-1.5 rounded-lg text-ivory-300 hover:text-white hover:bg-forest-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-jade-300/60">
            Navigation
          </p>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group text-left',
                isActive
                  ? 'bg-jade-600/30 text-white font-semibold border border-jade-500/40 shadow-xs'
                  : 'text-ivory-200/80 hover:text-white hover:bg-forest-800/50'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-brass-400' : 'text-jade-300/70 group-hover:text-brass-300'
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.tag && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-forest-800 text-brass-300 font-normal">
                  {item.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Local-First Security Footnote */}
      <div className="p-4 m-3 rounded-2xl bg-forest-950/50 border border-forest-800/80">
        <div className="flex items-center gap-2 text-brass-400 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Local Vault Mode</span>
        </div>
        <p className="text-[11px] text-ivory-300/70 mt-1 leading-snug">
          Stored securely in browser IndexedDB. Zero cloud tracking.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isSidebarOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpenMobile(false)}
          />
          <div className="relative w-72 max-w-xs h-full z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
