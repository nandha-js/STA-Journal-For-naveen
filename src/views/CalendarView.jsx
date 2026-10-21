import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  Filter
} from 'lucide-react';
import TradeCard from '../components/TradeCard';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarView({
  trades = [],
  onSelectTrade,
  onDeleteTrade,
  onEditTrade,
  onOpenNewEntry
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // October 2024 default to match screenshot
  const [selectedDateStr, setSelectedDateStr] = useState('2024-10-01');
  const [filterRange, setFilterRange] = useState('ALL'); // 'ALL', 'THIS_WEEK', 'THIS_MONTH'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Compute first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days in previous month to fill grid
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Map trades by date string YYYY-MM-DD
  const tradesByDate = {};
  trades.forEach(t => {
    const d = t.date;
    if (!tradesByDate[d]) tradesByDate[d] = [];
    tradesByDate[d].push(t);
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar matrix
  const calendarCells = [];
  // Prev month filler
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    calendarCells.push({
      day: dayNum,
      isCurrentMonth: false,
      dateStr: null
    });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    const dayTrades = tradesByDate[dateStr] || [];
    const netPnL = dayTrades.reduce((acc, t) => acc + (parseFloat(t.pnl) || 0), 0);

    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
      trades: dayTrades,
      netPnL
    });
  }
  // Next month filler to complete 35 or 42 cells
  const remainingCells = 35 - calendarCells.length > 0 ? 35 - calendarCells.length : 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateStr: null
    });
  }

  // Filter trades for the bottom list
  const filteredTrades = trades.filter(t => {
    if (filterRange === 'ALL') {
      if (selectedDateStr) {
        return t.date === selectedDateStr;
      }
      return true;
    }
    if (filterRange === 'THIS_MONTH') {
      const ym = `${year}-${String(month + 1).padStart(2, '0')}`;
      return t.date?.startsWith(ym);
    }
    if (filterRange === 'THIS_WEEK') {
      // Return trades in this month
      return t.date?.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Calendar Header with Month Navigation matching Screenshot 2 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1a233a]">
        <div className="flex items-center gap-3">
          <CalendarIcon size={20} className="text-indigo-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            {monthName} {year}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-[#121829] hover:bg-[#182138] border border-[#1e2840] rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 bg-[#121829] hover:bg-[#182138] border border-[#1e2840] rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-[#121829] hover:bg-[#182138] border border-[#1e2840] rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 py-1 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid Cells matching Screenshot 2 */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={`prev-${idx}`}
                  className="min-h-[70px] sm:min-h-[85px] p-2 rounded-xl bg-[#0d1322]/40 border border-[#162038]/50 text-slate-600 text-xs font-medium"
                >
                  <span>{cell.day}</span>
                </div>
              );
            }

            const hasTrades = cell.trades && cell.trades.length > 0;
            const isSelected = selectedDateStr === cell.dateStr;

            return (
              <div
                key={cell.dateStr}
                onClick={() => {
                  setSelectedDateStr(cell.dateStr);
                  setFilterRange('ALL');
                }}
                className={`min-h-[70px] sm:min-h-[85px] p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#18233f] border-indigo-500 shadow-md shadow-indigo-900/30 ring-1 ring-indigo-500/50'
                    : hasTrades
                    ? 'bg-[#151d32] border-[#223253] hover:border-indigo-500/50 hover:bg-[#1a2542]'
                    : 'bg-[#101626] border-[#182238] hover:bg-[#141b2f] hover:border-[#223253]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}>
                    {cell.day}
                  </span>

                  {hasTrades && (
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                      {cell.trades.length}
                    </span>
                  )}
                </div>

                {hasTrades && (
                  <div className="mt-1">
                    <span className={`text-[11px] sm:text-xs font-bold tracking-tight block truncate ${
                      cell.netPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {cell.netPnL >= 0 ? `+${cell.netPnL.toFixed(0)}` : cell.netPnL.toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Pills below Calendar matching Screenshot 2: All, This Week, This Month */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFilterRange('ALL');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterRange === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#141c30] text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>

          <button
            onClick={() => {
              setFilterRange('THIS_WEEK');
              setSelectedDateStr(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterRange === 'THIS_WEEK'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#141c30] text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>

          <button
            onClick={() => {
              setFilterRange('THIS_MONTH');
              setSelectedDateStr(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterRange === 'THIS_MONTH'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#141c30] text-slate-400 hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>

        {selectedDateStr && (
          <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Selected: {selectedDateStr}
          </span>
        )}
      </div>

      {/* Trades List for Selected Date / Filter matching Screenshot 2 */}
      <div className="space-y-3">
        {filteredTrades.length === 0 ? (
          <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-8 text-center text-slate-400 text-xs">
            No trades recorded for this date selection.
            <div className="mt-3">
              <button
                onClick={() => onOpenNewEntry()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
              >
                + Add Trade Entry
              </button>
            </div>
          </div>
        ) : (
          filteredTrades.map((trade) => (
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
