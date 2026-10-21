import React from 'react';
import { X, Award, CheckCircle2, TrendingUp, AlertTriangle, Download, Sparkles } from 'lucide-react';

export default function WeeklyReportModal({ isOpen, onClose, stats, trades = [], profile }) {
  if (!isOpen) return null;

  const winRate = stats.winRate || 0;
  const isProfitable = stats.totalPnL >= 0;

  // Best pair
  let bestPair = 'None';
  let maxPairPnL = -Infinity;
  Object.entries(stats.pairStats || {}).forEach(([p, data]) => {
    if (data.pnl > maxPairPnL) {
      maxPairPnL = data.pnl;
      bestPair = p;
    }
  });

  // Best session
  let bestSession = 'London';
  let maxSessionPnL = -Infinity;
  Object.entries(stats.sessionStats || {}).forEach(([s, data]) => {
    if (data.pnl > maxSessionPnL) {
      maxSessionPnL = data.pnl;
      bestSession = s;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c35]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Weekly Performance Report</h3>
              <p className="text-[11px] text-slate-400">Trading assessment for {profile?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Grade Badge */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900/40 border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
                Overall Discipline Score
              </span>
              <h2 className="text-2xl font-black text-white mt-0.5">
                {winRate >= 70 ? 'Grade A+' : winRate >= 50 ? 'Grade B' : 'Grade C'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {winRate >= 60 ? 'Consistent high win-rate execution.' : 'Focus on risk management and RR cutoffs.'}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Award size={32} />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#131b30] border border-[#1f2b48]">
              <span className="text-slate-400">Total Net P&L</span>
              <div className={`text-base font-bold mt-1 ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${stats.totalPnL >= 0 ? `+${stats.totalPnL.toFixed(2)}` : stats.totalPnL.toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#131b30] border border-[#1f2b48]">
              <span className="text-slate-400">Win Rate</span>
              <div className="text-base font-bold mt-1 text-emerald-400">
                {stats.winRate}% ({stats.wins}W / {stats.losses}L)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#131b30] border border-[#1f2b48]">
              <span className="text-slate-400">Top Performing Pair</span>
              <div className="text-sm font-bold text-white mt-1">
                {bestPair}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#131b30] border border-[#1f2b48]">
              <span className="text-slate-400">Optimal Session</span>
              <div className="text-sm font-bold text-white mt-1">
                {bestSession}
              </div>
            </div>
          </div>

          {/* Key Insights & Coaching */}
          <div className="p-4 rounded-xl bg-[#131b30] border border-[#1f2b48] space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Key Trading Insights
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Strong execution quality when trading with confidence.</li>
              <li>{stats.avgRR} average Risk to Reward maintains positive mathematical expectancy.</li>
              <li>High win rate during {bestSession} session setups.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#1e293b] bg-[#111c35]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
