import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Calendar, 
  ExternalLink,
  ImageIcon,
  Trash2,
  Edit2
} from 'lucide-react';

export default function TradeCard({ trade, onSelectTrade, onDeleteTrade, onEditTrade }) {
  const isWin = (trade.result || '').toLowerCase() === 'win';
  const isLoss = (trade.result || '').toLowerCase() === 'loss';
  const isBuy = (trade.direction || '').toLowerCase() === 'buy';

  const pnlVal = parseFloat(trade.pnl) || 0;
  const formattedPnL = (pnlVal >= 0 ? `+${pnlVal.toFixed(2)}` : `${pnlVal.toFixed(2)}`);

  return (
    <div 
      onClick={() => onSelectTrade && onSelectTrade(trade)}
      className="group relative bg-[#121829] hover:bg-[#161f36] border border-[#1d273f] hover:border-indigo-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-indigo-950/20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Info: Pair, Direction, Session, Date */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
            isWin 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : isLoss 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {trade.pair?.slice(0, 3)?.toUpperCase() || 'TRD'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-wide">
                {trade.pair}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                isBuy 
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' 
                  : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
              }`}>
                {trade.direction}
              </span>
              {trade.timeframe && (
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {trade.timeframe}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Clock size={12} className="text-slate-400" />
                {trade.session || 'London'}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Calendar size={12} className="text-slate-400" />
                {trade.date}
              </span>
              {(trade.chartImage1 || trade.chartUrl2 || trade.chartUrl3 || trade.exitChart) && (
                <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-medium bg-indigo-500/10 px-1.5 py-0.2 rounded">
                  <ImageIcon size={11} /> Chart
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Info: PnL, Result Pill, RR */}
        <div className="flex items-center justify-between sm:justify-end gap-5">
          <div className="text-left sm:text-right">
            <div className={`text-base font-bold tracking-tight ${
              isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-amber-400'
            }`}>
              {trade.currency || '$'}{formattedPnL}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              RR: {trade.rr || '1:1.0'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
              isWin 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : isLoss 
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {trade.result || 'Win'}
            </span>

            {/* Quick delete / edit buttons on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
              {onEditTrade && (
                <button
                  onClick={() => onEditTrade(trade)}
                  title="Edit Trade"
                  className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/15 rounded-lg transition-colors"
                >
                  <Edit2 size={13} />
                </button>
              )}
              {onDeleteTrade && (
                <button
                  onClick={() => onDeleteTrade(trade.id)}
                  title="Delete Trade"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {trade.notes && (
        <p className="mt-2 text-xs text-slate-400 line-clamp-1 border-t border-[#1a233a] pt-2">
          {trade.notes}
        </p>
      )}
    </div>
  );
}
