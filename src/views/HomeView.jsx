import React from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  BookOpen, 
  Filter, 
  BarChart3, 
  CalendarDays, 
  Layers,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';
import TradeCard from '../components/TradeCard';

export default function HomeView({
  profile,
  journals = [],
  trades = [],
  stats,
  onNavigate,
  onOpenNewEntry,
  onOpenNewJournal,
  onSelectJournal,
  onSelectTrade,
  onDeleteTrade,
  onEditTrade
}) {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const recentTrades = [...trades].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Hey {profile?.name?.split(' ')[0] || 'Naveen'} <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            {currentDateFormatted} • Welcome to your trading journal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenNewEntry()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trades */}
        <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Trades
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {stats.totalTrades}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Logged across all journals
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Win Rate
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
            {stats.winRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {stats.wins} Won / {stats.losses} Lost
          </div>
        </div>

        {/* Wins */}
        <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Wins
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {stats.wins}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {stats.losses} Losses • {stats.breakevens} BE
          </div>
        </div>

        {/* Total P&L */}
        <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total P&L
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${
            stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {stats.totalPnL >= 0 ? `+${stats.totalPnL.toFixed(2)}` : stats.totalPnL.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Net accumulated return
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS bar matching the screenshot */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('journals')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#121829] hover:bg-[#182138] border border-[#1d273f] text-xs font-semibold text-slate-200 transition-colors"
          >
            <BookOpen size={14} className="text-indigo-400" />
            <span>Journals</span>
          </button>

          <button
            onClick={() => onNavigate('journals')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#121829] hover:bg-[#182138] border border-[#1d273f] text-xs font-semibold text-slate-200 transition-colors"
          >
            <Filter size={14} className="text-indigo-400" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => onNavigate('analysis')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#121829] hover:bg-[#182138] border border-[#1d273f] text-xs font-semibold text-slate-200 transition-colors"
          >
            <Layers size={14} className="text-indigo-400" />
            <span>Trading Plans</span>
          </button>

          <button
            onClick={() => onNavigate('analysis')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#121829] hover:bg-[#182138] border border-[#1d273f] text-xs font-semibold text-slate-200 transition-colors"
          >
            <BarChart3 size={14} className="text-indigo-400" />
            <span>Analysis</span>
          </button>

          <button
            onClick={() => onNavigate('calendar')}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#121829] hover:bg-[#182138] border border-[#1d273f] text-xs font-semibold text-slate-200 transition-colors"
          >
            <CalendarDays size={14} className="text-indigo-400" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Performance Overview + Journals & Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Performance Overview & Recent Entries */}
        <div className="lg:col-span-7 space-y-6">
          {/* Performance Overview */}
          <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Performance Overview
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Donut / Circular indicator */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Track */}
                  <path
                    className="text-slate-800"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Win Arc */}
                  <path
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${stats.winRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-emerald-400">{stats.winRate}%</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">Win Rate</span>
                </div>
              </div>

              {/* Progress Bars for Wins / Losses / BE */}
              <div className="flex-1 w-full space-y-3">
                {/* Wins Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      Wins
                    </span>
                    <span className="font-bold text-emerald-400">{stats.wins}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.winRate}%` }}
                    />
                  </div>
                </div>

                {/* Losses Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <XCircle size={13} className="text-rose-400" />
                      Losses
                    </span>
                    <span className="font-bold text-rose-400">{stats.losses}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.lossRate}%` }}
                    />
                  </div>
                </div>

                {/* Breakeven Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                      <MinusCircle size={13} className="text-amber-400" />
                      Breakeven
                    </span>
                    <span className="font-bold text-amber-400">{stats.breakevens}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.beRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recent Entries
              </h3>
              <button
                onClick={() => onNavigate('journals')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View All
              </button>
            </div>

            {recentTrades.length === 0 ? (
              <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-8 text-center text-slate-400 text-xs">
                No trades logged yet. Click <button onClick={() => onOpenNewEntry()} className="text-indigo-400 underline font-semibold">New Entry</button> to add your first trade.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentTrades.map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onSelectTrade={onSelectTrade}
                    onDeleteTrade={onDeleteTrade}
                    onEditTrade={onEditTrade}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Journals List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Journals List
              </h3>
              <button
                onClick={onOpenNewJournal}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus size={14} />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {journals.map((journal) => {
                const journalTrades = trades.filter(t => t.journalId === journal.id);
                return (
                  <div
                    key={journal.id}
                    onClick={() => onSelectJournal(journal.id)}
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-[#162038] hover:bg-[#1b2744] border border-[#223253] hover:border-indigo-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: journal.color || '#6366f1' }}
                      >
                        <BookOpen size={15} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {journal.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {journalTrades.length} trades • {journal.description || 'No description'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
