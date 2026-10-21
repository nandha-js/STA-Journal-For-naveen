import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Target, 
  Smile, 
  BookOpen, 
  Activity, 
  ExternalLink, 
  Edit2, 
  Trash2,
  Maximize2
} from 'lucide-react';

export default function TradeDetailModal({ 
  trade, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  journalName 
}) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen || !trade) return null;

  const isWin = (trade.result || '').toLowerCase() === 'win';
  const isLoss = (trade.result || '').toLowerCase() === 'loss';
  const pnlVal = parseFloat(trade.pnl) || 0;
  const formattedPnL = (pnlVal >= 0 ? `+${pnlVal.toFixed(2)}` : `${pnlVal.toFixed(2)}`);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden my-6 animate-modal">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c35]">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                trade.direction === 'Buy' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {trade.direction}
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {trade.pair}
              </h2>
              <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded bg-[#162038]">
                {journalName || 'Journal'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(trade);
                }}
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Edit Entry"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this trade entry?')) {
                    onDelete(trade.id);
                    onClose();
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Delete Entry"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#141d33] border border-[#1f2b48] rounded-xl p-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Result
                </span>
                <div className={`mt-1 text-sm font-bold capitalize ${
                  isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {trade.result}
                </div>
              </div>

              <div className="bg-[#141d33] border border-[#1f2b48] rounded-xl p-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Net P&L
                </span>
                <div className={`mt-1 text-base font-bold ${
                  isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  ${formattedPnL}
                </div>
              </div>

              <div className="bg-[#141d33] border border-[#1f2b48] rounded-xl p-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Risk : Reward
                </span>
                <div className="mt-1 text-sm font-bold text-slate-200">
                  {trade.rr || '1:1.0'}
                </div>
              </div>

              <div className="bg-[#141d33] border border-[#1f2b48] rounded-xl p-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Timeframe
                </span>
                <div className="mt-1 text-sm font-bold text-slate-200">
                  {trade.timeframe || '15m'}
                </div>
              </div>
            </div>

            {/* Context Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#11192d] p-4 rounded-xl border border-[#1a2542] text-xs">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" />
                <span className="text-slate-400">Date:</span>
                <span className="text-white font-medium">{trade.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-400" />
                <span className="text-slate-400">Session:</span>
                <span className="text-white font-medium">{trade.session || 'London'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-indigo-400" />
                <span className="text-slate-400">Entry Type:</span>
                <span className="text-white font-medium">{trade.entryType || 'Breakout'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-indigo-400" />
                <span className="text-slate-400">Trading Plan:</span>
                <span className="text-white font-medium">{trade.tradingPlan || 'No plan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Smile size={14} className="text-indigo-400" />
                <span className="text-slate-400">Emotion:</span>
                <span className="text-emerald-400 font-semibold">{trade.emotion || 'Confident'}</span>
              </div>
            </div>

            {/* Notes Section */}
            {trade.notes && (
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Trade Notes & Reflection
                </h4>
                <div className="bg-[#131b30] border border-[#1f2b48] rounded-xl p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {trade.notes}
                </div>
              </div>
            )}

            {/* Chart Images Gallery */}
            {(trade.chartImage1 || trade.exitChart || trade.chartUrl2 || trade.chartUrl3) && (
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Attached Charts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trade.chartImage1 && (
                    <div 
                      onClick={() => setSelectedImage(trade.chartImage1)}
                      className="group relative h-44 rounded-xl overflow-hidden border border-[#223253] cursor-pointer bg-[#0b101d]"
                    >
                      <img src={trade.chartImage1} alt="Entry Chart" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1.5">
                        <Maximize2 size={16} /> Enlarge Entry Chart
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-slate-300">
                        Entry Chart
                      </span>
                    </div>
                  )}

                  {trade.exitChart && (
                    <div 
                      onClick={() => setSelectedImage(trade.exitChart)}
                      className="group relative h-44 rounded-xl overflow-hidden border border-[#223253] cursor-pointer bg-[#0b101d]"
                    >
                      <img src={trade.exitChart} alt="Exit Chart" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1.5">
                        <Maximize2 size={16} /> Enlarge Exit Chart
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-slate-300">
                        Exit Chart
                      </span>
                    </div>
                  )}

                  {trade.chartUrl2 && (
                    <a
                      href={trade.chartUrl2}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-[#131b30] border border-[#1f2b48] hover:border-indigo-500/40 text-xs text-indigo-300 hover:text-white transition-colors"
                    >
                      <span className="truncate">Chart Link 2: {trade.chartUrl2}</span>
                      <ExternalLink size={14} className="shrink-0 ml-2" />
                    </a>
                  )}

                  {trade.chartUrl3 && (
                    <a
                      href={trade.chartUrl3}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-[#131b30] border border-[#1f2b48] hover:border-indigo-500/40 text-xs text-indigo-300 hover:text-white transition-colors"
                    >
                      <span className="truncate">Chart Link 3: {trade.chartUrl3}</span>
                      <ExternalLink size={14} className="shrink-0 ml-2" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Image Zoom Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Full Chart" 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain" 
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
