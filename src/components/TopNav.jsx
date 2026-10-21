import React from 'react';
import { Menu, Plus, Bell, Search } from 'lucide-react';

export default function TopNav({ 
  activeTab, 
  activeJournalName, 
  onToggleSidebar, 
  onOpenNewEntry,
  profile 
}) {
  const getTitle = () => {
    if (activeTab === 'journals' && activeJournalName) {
      return activeJournalName;
    }
    switch (activeTab) {
      case 'home': return 'Dashboard';
      case 'journals': return 'My Journals';
      case 'analysis': return 'Performance Analysis';
      case 'calendar': return 'Trading Calendar';
      case 'settings': return 'Settings & Storage';
      default: return 'STA Journal';
    }
  };

  return (
    <header className="h-16 border-b border-[#1a233a] bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8">
      {/* Left Title / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">STA Journal</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <h2 className="text-sm sm:text-base font-bold text-white capitalize">
            {getTitle()}
          </h2>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenNewEntry()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Entry</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-[#18233c] border border-[#233252] flex items-center justify-center text-xs font-bold text-indigo-300">
          {profile?.avatar || 'NK'}
        </div>
      </div>
    </header>
  );
}
