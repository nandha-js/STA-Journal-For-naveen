import React from 'react';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  CalendarDays, 
  Settings, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, profile, setSelectedJournalId }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-[#1a233a] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20">
      <div>
        {/* App Logo & Header */}
        <div className="p-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide leading-tight">
                STA Journal
              </h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                Scalper Trading Academy
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'journals') {
                    // Default to showing all journals list
                    setSelectedJournalId(null);
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1b223c] text-indigo-300 shadow-sm shadow-indigo-900/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#11182c]'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-indigo-400' : 'text-slate-400'}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Client Portal Footer */}
      <div className="p-4 border-t border-[#1a233a] bg-[#090d19]/60">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
          <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 ring-2 ring-indigo-500/10">
            {profile?.avatar || 'NK'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">
              {profile?.name || 'Naveen Kumar'}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {profile?.role || 'Trader'}
            </p>
          </div>
        </div>

        <a
          href={profile?.portalUrl || '#portal'}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-[#12192e] hover:bg-[#17213d] text-[11px] font-medium text-slate-300 hover:text-white transition-colors border border-[#1e2a47]"
        >
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-indigo-400" />
            <span>Client Portal</span>
          </div>
          <ExternalLink size={12} className="text-slate-400" />
        </a>
      </div>
    </aside>
  );
}
