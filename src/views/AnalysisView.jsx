import React, { useState } from 'react';
import { 
  ChevronDown, 
  TrendingUp, 
  Target, 
  BarChart2, 
  Clock, 
  Brain, 
  Award, 
  CheckCircle2, 
  XCircle, 
  MinusCircle,
  FileText
} from 'lucide-react';
import { computeStats } from '../utils/storage';

export default function AnalysisView({
  journals = [],
  trades = [],
  onOpenReport
}) {
  const [selectedJournalFilter, setSelectedJournalFilter] = useState('ALL'); // 'ALL' or journalId
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL'); // 'ALL' or plan name

  // Filter trades based on selected journal and plan
  const filteredTrades = trades.filter(t => {
    if (selectedJournalFilter !== 'ALL' && t.journalId !== selectedJournalFilter) {
      return false;
    }
    if (selectedPlanFilter !== 'ALL') {
      const plan = t.tradingPlan || 'No Plan';
      if (plan.toLowerCase() !== selectedPlanFilter.toLowerCase()) return false;
    }
    return true;
  });

  const stats = computeStats(filteredTrades);

  // Unique plans for filter dropdown
  const uniquePlans = Array.from(new Set(trades.map(t => t.tradingPlan || 'No Plan')));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls: Journal and Trading Plan Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SELECT JOURNAL */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Select Journal
          </label>
          <div className="relative">
            <select
              value={selectedJournalFilter}
              onChange={(e) => setSelectedJournalFilter(e.target.value)}
              className="w-full appearance-none bg-[#121829] border border-[#1e2840] hover:border-indigo-500/50 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none cursor-pointer transition-colors"
            >
              <option value="ALL">Overall (All Journals)</option>
              {journals.map(j => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* FILTER BY TRADING PLAN */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Filter by Trading Plan
          </label>
          <div className="relative">
            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="w-full appearance-none bg-[#121829] border border-[#1e2840] hover:border-indigo-500/50 rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none cursor-pointer transition-colors"
            >
              <option value="ALL">All Plans</option>
              {uniquePlans.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4 Stat Cards in a row matching Screenshot 2 & 3 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Win Rate */}
        <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Win Rate
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
            {stats.winRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {stats.wins} wins / {stats.losses} losses
          </div>
        </div>

        {/* Total Trades */}
        <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Trades
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {stats.totalTrades}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Executed in sample
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
            {stats.totalPnL >= 0 ? `+${stats.totalPnL.toFixed(0)}` : stats.totalPnL.toFixed(0)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Net monetary gain
          </div>
        </div>

        {/* Avg RR */}
        <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Avg RR
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-2">
            {stats.avgRR}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Risk to reward ratio
          </div>
        </div>
      </div>

      {/* SECTION 1: TRADE DISTRIBUTION */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart2 size={15} className="text-indigo-400" />
          Trade Distribution
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Donut */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
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

          {/* Progress Bars */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Wins
                </span>
                <span className="text-emerald-400">{stats.wins}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.winRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <XCircle size={13} className="text-rose-400" />
                  Losses
                </span>
                <span className="text-rose-400">{stats.losses}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.lossRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MinusCircle size={13} className="text-amber-400" />
                  Breakeven
                </span>
                <span className="text-amber-400">{stats.breakevens}</span>
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

      {/* SECTION 2: PAIR PERFORMANCE matching Screenshot 2 & 3 */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Target size={15} className="text-indigo-400" />
          Pair Performance
        </h3>

        {/* Large green graphic container matching screenshot */}
        <div className="w-full h-24 rounded-xl bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-emerald-950/60 border border-emerald-500/20 flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Top Asset Performance
            </span>
            <div className="text-xl font-black text-white mt-0.5">
              {Object.keys(stats.pairStats)[0] || 'XAU'} • {stats.winRate}% Win Rate
            </div>
          </div>
        </div>

        {/* Breakdown for each traded pair */}
        <div className="space-y-3 pt-2">
          {Object.entries(stats.pairStats).map(([pair, data]) => {
            const pairWinRate = Math.round((data.wins / data.count) * 100);
            return (
              <div key={pair} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase">{pair}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{data.count} trades</span>
                    <span className="font-semibold text-emerald-400">{pairWinRate}%</span>
                    <span className={`font-bold ${data.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${data.pnl >= 0 ? `+${data.pnl.toFixed(2)}` : data.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${pairWinRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: SESSION PERFORMANCE */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Clock size={15} className="text-indigo-400" />
          Session Performance
        </h3>

        <div className="space-y-3">
          {Object.entries(stats.sessionStats).map(([session, data]) => {
            const sessionWinRate = Math.round((data.wins / data.count) * 100);
            return (
              <div key={session} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{session}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{data.count} trades</span>
                    <span className="font-semibold text-indigo-400">{sessionWinRate}%</span>
                    <span className={`font-bold ${data.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${data.pnl >= 0 ? `+${data.pnl.toFixed(2)}` : data.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${sessionWinRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: PERFORMANCE BY TRADING PLAN */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <FileText size={15} className="text-indigo-400" />
          Performance by Trading Plan
        </h3>

        <div className="space-y-3">
          {Object.entries(stats.planStats).map(([plan, data]) => {
            const planWinRate = Math.round((data.wins / data.count) * 100);
            return (
              <div key={plan} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">{plan}</span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      (Trades: {data.count} • P&L: ${data.pnl >= 0 ? `+${data.pnl.toFixed(0)}` : data.pnl.toFixed(0)})
                    </span>
                  </div>
                  <span className="font-bold text-emerald-400">{planWinRate}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${planWinRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: PSYCHOLOGY ANALYSIS matching Screenshot 3 */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Brain size={15} className="text-indigo-400" />
          Psychology Analysis
        </h3>

        <div className="space-y-3">
          {Object.entries(stats.emotionStats).map(([emotion, data]) => {
            const emoWinRate = Math.round((data.wins / data.count) * 100);
            return (
              <div key={emotion} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">{emotion}</span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      (Trades: {data.count} • P&L: ${data.pnl >= 0 ? `+${data.pnl.toFixed(0)}` : data.pnl.toFixed(0)})
                    </span>
                  </div>
                  <span className="font-bold text-emerald-400">{emoWinRate}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${emoWinRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 6: Weekly Performance Report Card matching Screenshot 3 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141b31] to-[#17213e] border border-[#233152] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Award size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Weekly Performance Report</h4>
            <p className="text-xs text-slate-400">Unlock or view your AI trading feedback and discipline analysis</p>
          </div>
        </div>

        <button
          onClick={onOpenReport}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
