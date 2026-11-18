import React, { useState, useRef, useEffect } from 'react';
import { Home, ChevronDown, Plus, Settings, Check, Trash2 } from 'lucide-react';
import { useHouseholdStore } from '../../store/useHouseholdStore';
import { useUIStore } from '../../store/useUIStore';

export const HouseholdSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { households, activeHousehold, setActiveHouseholdId, deleteHousehold } = useHouseholdStore();
  const { openHouseholdModal, showToast } = useUIStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setActiveHouseholdId(id);
    setIsOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    openHouseholdModal('edit');
  };

  const handleNew = () => {
    setIsOpen(false);
    openHouseholdModal('create');
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to permanently delete "${name}" and all its inventory items?`)) {
      await deleteHousehold(id);
      showToast({
        type: 'info',
        title: 'Household Deleted',
        message: `"${name}" was removed.`,
      });
      setIsOpen(false);
    }
  };

  if (!activeHousehold) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-ivory-300 bg-white/90 hover:bg-white text-forest-950 shadow-xs transition-all hover:border-ivory-400 group text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-forest-900 text-ivory-100 flex items-center justify-center shrink-0 shadow-xs">
          <Home className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col min-w-0 pr-1 text-left">
          <span className="text-xs font-bold text-forest-950 truncate max-w-[130px] sm:max-w-[170px]">
            {activeHousehold.name}
          </span>
          <span className="text-[10px] text-forest-500 capitalize tracking-tight">
            {activeHousehold.propertyType.replace('_', ' ')} • {activeHousehold.currency}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-forest-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-ivory-300 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-ivory-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-forest-500">
              Active Residences ({households.length})
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {households.map((h) => {
              const isActive = h.id === activeHousehold.id;
              return (
                <div
                  key={h.id}
                  onClick={() => handleSelect(h.id)}
                  className={`flex items-center justify-between px-3 py-2 mx-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-forest-100/70 text-forest-950 font-medium'
                      : 'hover:bg-ivory-100 text-forest-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-forest-900 text-ivory-50' : 'bg-ivory-200 text-forest-700'
                      }`}
                    >
                      <Home className="w-3 h-3" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold truncate">{h.name}</p>
                      <p className="text-[10px] text-forest-500 capitalize">
                        {h.propertyType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isActive && <Check className="w-3.5 h-3.5 text-jade-700" />}
                    {households.length > 1 && (
                      <button
                        title="Delete household"
                        onClick={(e) => handleDelete(h.id, h.name, e)}
                        className="p-1 rounded text-forest-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-1.5 pt-1.5 border-t border-ivory-200 flex flex-col gap-1">
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-forest-800 hover:bg-ivory-100 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-forest-600" />
              <span>Edit Current Residence</span>
            </button>
            <button
              type="button"
              onClick={handleNew}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-jade-800 hover:bg-jade-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Residence</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
