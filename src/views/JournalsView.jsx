import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Settings2, 
  Check, 
  X, 
  Search,
  BookOpen,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import TradeCard from '../components/TradeCard';

export default function JournalsView({
  journals = [],
  trades = [],
  selectedJournalId,
  setSelectedJournalId,
  onOpenNewEntry,
  onOpenNewJournal,
  onOpenManageJournal,
  onSelectTrade,
  onDeleteTrade,
  onEditTrade
}) {
  const [filterType, setFilterType] = useState('ALL'); // ALL, WIN, LOSS, BUY, SELL
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // If a journal is selected, find its details
  const activeJournal = journals.find(j => j.id === selectedJournalId);

  // Filter trades
  const currentTrades = trades.filter(t => {
    // Check journal filter
    if (selectedJournalId && t.journalId !== selectedJournalId) {
      return false;
    }
    // Check pill filter
    if (filterType === 'WIN' && (t.result || '').toLowerCase() !== 'win') return false;
    if (filterType === 'LOSS' && (t.result || '').toLowerCase() !== 'loss') return false;
    if (filterType === 'BUY' && (t.direction || '').toLowerCase() !== 'buy') return false;
    if (filterType === 'SELL' && (t.direction || '').toLowerCase() !== 'sell') return false;

    // Check search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPair = (t.pair || '').toLowerCase().includes(q);
      const matchPlan = (t.tradingPlan || '').toLowerCase().includes(q);
      const matchNotes = (t.notes || '').toLowerCase().includes(q);
      const matchSession = (t.session || '').toLowerCase().includes(q);
      return matchPair || matchPlan || matchNotes || matchSession;
    }
    return true;
  });

  // VIEW 1: MY JOURNALS (All journals directory list)
  if (!selectedJournalId || !activeJournal) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header matching Screenshot 3 top-right */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1a233a]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
              My Journals
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a journal to view trade entries or create a dedicated new journal
            </p>
          </div>

          <button
            onClick={onOpenNewJournal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>+ New</span>
          </button>
        </div>

        {/* Journals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journals.map((journal) => {
            const journalTrades = trades.filter(t => t.journalId === journal.id);
            const wins = journalTrades.filter(t => (t.result || '').toLowerCase() === 'win').length;
            const netPnL = journalTrades.reduce((acc, t) => acc + (parseFloat(t.pnl) || 0), 0);
            const winRate = journalTrades.length > 0 ? Math.round((wins / journalTrades.length) * 100) : 0;

            return (
              <div
                key={journal.id}
                onClick={() => setSelectedJournalId(journal.id)}
                className="group relative bg-[#121829] hover:bg-[#161f36] border border-[#1e2840] hover:border-indigo-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-md"
                      style={{ backgroundColor: journal.color || '#6366f1' }}
                    >
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {journal.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {journal.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="mt-5 pt-4 border-t border-[#1a233a] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Trades: </span>
                    <span className="font-bold text-white">{journalTrades.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Win Rate: </span>
                    <span className="font-bold text-emerald-400">{winRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Net P&L: </span>
                    <span className={`font-bold ${netPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${netPnL >= 0 ? `+${netPnL.toFixed(2)}` : netPnL.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // VIEW 2: INSIDE SPECIFIC JOURNAL (e.g. "demo") matching Screenshot 1
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header with Back button and Actions matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1a233a]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedJournalId(null)}
            className="p-2 bg-[#141c30] hover:bg-[#1a2542] text-slate-300 hover:text-white rounded-xl transition-colors"
            title="Back to all journals"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeJournal.color || '#6366f1' }}
              />
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {activeJournal.name}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeJournal.description || 'Trading log entries'}
            </p>
          </div>
        </div>

        {/* Action Buttons: New Entry & Journal Options Dropdown */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => onOpenNewEntry(activeJournal.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>New Entry</span>
          </button>

          {/* Options Dropdown matching Screenshot 1 bottom right */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2.5 bg-[#141c30] hover:bg-[#1a2542] text-slate-300 hover:text-white rounded-xl border border-[#223253] transition-colors"
              title="Journal settings"
            >
              <MoreVertical size={16} />
            </button>

            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-[#11192e] border border-[#223253] rounded-xl shadow-2xl z-30 py-1.5 animate-modal"
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onOpenManageJournal(activeJournal);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-[#18233f] transition-colors"
                >
                  <Edit size={14} className="text-indigo-400" />
                  <span>Rename Journal</span>
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onOpenManageJournal(activeJournal);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-[#18233f] transition-colors"
                >
                  <Settings2 size={14} className="text-indigo-400" />
                  <span>Manage Fields</span>
                </button>

                <div className="my-1 border-t border-[#1e2a47]" />

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onOpenManageJournal(activeJournal);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete Journal</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Buttons Bar matching Screenshot 1: All, Win, Loss, Buy, Sell */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* ALL */}
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#141c30] text-slate-400 hover:text-white hover:bg-[#1c2742]'
            }`}
          >
            All
          </button>

          {/* WIN */}
          <button
            onClick={() => setFilterType('WIN')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'WIN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[#141c30] text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <Check size={13} />
            <span>Win</span>
          </button>

          {/* LOSS */}
          <button
            onClick={() => setFilterType('LOSS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'LOSS'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-[#141c30] text-rose-400 hover:bg-rose-500/10'
            }`}
          >
            <X size={13} />
            <span>Loss</span>
          </button>

          {/* BUY */}
          <button
            onClick={() => setFilterType('BUY')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'BUY'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#141c30] text-blue-400 hover:bg-blue-500/10'
            }`}
          >
            Buy
          </button>

          {/* SELL */}
          <button
            onClick={() => setFilterType('SELL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'SELL'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#141c30] text-purple-400 hover:bg-purple-500/10'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Quick Search inside journal */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pair, session, notes..."
            className="w-full sm:w-60 pl-8 pr-3 py-1.5 bg-[#141c30] border border-[#223253] rounded-full text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Trades List */}
      <div className="space-y-3">
        {currentTrades.length === 0 ? (
          <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-10 text-center">
            <p className="text-sm text-slate-400">
              No trade entries found for the selected filter in "{activeJournal.name}".
            </p>
            <button
              onClick={() => onOpenNewEntry(activeJournal.id)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30"
            >
              + Log Trade Entry
            </button>
          </div>
        ) : (
          currentTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onSelectTrade={onSelectTrade}
              onDeleteTrade={onDeleteTrade}
              onEditTrade={onEditTrade}
            />
          ))
        )}
      </div>
    </div>
  );
}
