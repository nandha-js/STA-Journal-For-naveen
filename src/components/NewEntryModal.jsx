import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { compressImage } from '../utils/storage';

const COMMON_PAIRS = ['XAUUSD', 'EURUSD', 'GBPUSD', 'BTCUSD', 'US30', 'NAS100', 'USDJPY', 'ETHUSD'];
const TIMEFRAMES = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', 'Daily'];
const SESSIONS = ['London', 'New York', 'Asian', 'Sydney', 'London/NY Overlap'];
const ENTRY_TYPES = ['Breakout', 'Pullback', 'Reversal', 'Liquidity Sweep', 'Fair Value Gap', 'Trend Continuation', 'Range Bound'];
const TRADING_PLANS = ['No plan', 'London Scalp Plan', 'Trend Continuation', 'SMC Liquidity', 'Asian Range Breakout', 'Mean Reversion'];
const EMOTIONS = ['Confident', 'Disciplined', 'FOMO', 'Revenge', 'Impatient', 'Anxious', 'Neutral', 'Greedy'];

export default function NewEntryModal({ 
  isOpen, 
  onClose, 
  onSaveTrade, 
  journals = [], 
  currentJournalId = null,
  initialTrade = null 
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    journalId: currentJournalId || (journals[0]?.id || 'journal-demo'),
    pair: 'XAUUSD',
    direction: 'Buy',
    result: 'Win',
    timeframe: '15m',
    session: 'London',
    pnl: '',
    rr: '1:1.5',
    entryType: 'Breakout',
    tradingPlan: 'No plan',
    emotion: 'Confident',
    notes: '',
    chartImage1: '',
    chartUrl2: '',
    chartUrl3: '',
    exitChart: '',
  });

  const [previewImage1, setPreviewImage1] = useState('');
  const [previewExitChart, setPreviewExitChart] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTrade) {
      setFormData({
        ...initialTrade,
        date: initialTrade.date || new Date().toISOString().slice(0, 10),
        pnl: initialTrade.pnl !== undefined ? initialTrade.pnl : '',
      });
      setPreviewImage1(initialTrade.chartImage1 || '');
      setPreviewExitChart(initialTrade.exitChart || '');
    } else {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().slice(0, 10),
        journalId: currentJournalId || (journals[0]?.id || 'journal-demo'),
        pnl: '',
        notes: '',
        chartImage1: '',
        chartUrl2: '',
        chartUrl3: '',
        exitChart: '',
      }));
      setPreviewImage1('');
      setPreviewExitChart('');
    }
    setErrors({});
  }, [initialTrade, currentJournalId, isOpen, journals]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Convert uploaded image file to compressed base64 for offline localStorage persistence
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64String = await compressImage(file, 1280, 0.78);
      if (field === 'chartImage1') {
        setFormData(prev => ({ ...prev, chartImage1: base64String }));
        setPreviewImage1(base64String);
      } else if (field === 'exitChart') {
        setFormData(prev => ({ ...prev, exitChart: base64String }));
        setPreviewExitChart(base64String);
      }
    } catch (err) {
      console.error('Image compression error:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.pair.trim()) newErrors.pair = 'Pair is required';
    if (!formData.journalId) newErrors.journalId = 'Please select a journal';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tradeToSave = {
      ...formData,
      id: initialTrade?.id || `trade-${Date.now()}`,
      pnl: parseFloat(formData.pnl) || 0,
      createdAt: initialTrade?.createdAt || new Date().toISOString()
    };

    onSaveTrade(tradeToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden my-8 animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c35]">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {initialTrade ? 'Edit Trade Entry' : 'New Entry'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Date & Journal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Journal *
              </label>
              <select
                name="journalId"
                value={formData.journalId}
                onChange={handleInputChange}
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none transition-colors"
              >
                {journals.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pair with quick chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pair *
              </label>
              <span className="text-[11px] text-slate-400">e.g. XAUUSD, EURUSD, BTCUSD</span>
            </div>
            <input
              type="text"
              name="pair"
              value={formData.pair}
              onChange={handleInputChange}
              placeholder="EURUSD, XAUUSD, US30..."
              className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-500"
              required
            />
            {errors.pair && <p className="text-xs text-rose-400 mt-1">{errors.pair}</p>}

            {/* Quick pair selection chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_PAIRS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, pair: p }))}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                    formData.pair.toUpperCase() === p.toUpperCase()
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#18233c] text-slate-400 hover:text-slate-200 hover:bg-[#202f52]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Direction & Result */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Direction *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, direction: 'Buy' }))}
                  className={`py-2 text-sm font-semibold rounded-xl border transition-all ${
                    formData.direction === 'Buy'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                      : 'bg-[#162038] text-slate-400 border-[#223253] hover:text-white'
                  }`}
                >
                  Buy / Long
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, direction: 'Sell' }))}
                  className={`py-2 text-sm font-semibold rounded-xl border transition-all ${
                    formData.direction === 'Sell'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
                      : 'bg-[#162038] text-slate-400 border-[#223253] hover:text-white'
                  }`}
                >
                  Sell / Short
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Result *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Win', 'Loss', 'Breakeven'].map(res => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        result: res,
                        pnl: res === 'Breakeven' ? '0' : prev.pnl 
                      }));
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      formData.result === res
                        ? res === 'Win' 
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30' 
                          : res === 'Loss' 
                          ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/30' 
                          : 'bg-amber-600 text-white border-amber-500 shadow-amber-900/30'
                        : 'bg-[#162038] text-slate-400 border-[#223253] hover:text-white'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeframe & Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Timeframe
              </label>
              <select
                name="timeframe"
                value={formData.timeframe}
                onChange={handleInputChange}
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
              >
                {TIMEFRAMES.map(tf => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Session
              </label>
              <select
                name="session"
                value={formData.session}
                onChange={handleInputChange}
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
              >
                {SESSIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* P&L and RR Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                P&L ($ or Amount)
              </label>
              <input
                type="number"
                step="any"
                name="pnl"
                value={formData.pnl}
                onChange={handleInputChange}
                placeholder="e.g. 453.00 or -150.00"
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                RR Ratio
              </label>
              <input
                type="text"
                name="rr"
                value={formData.rr}
                onChange={handleInputChange}
                placeholder="1:1.5"
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Entry Type & Trading Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Entry Type
              </label>
              <input
                type="text"
                list="entry-types-list"
                name="entryType"
                value={formData.entryType}
                onChange={handleInputChange}
                placeholder="Breakout, Pullback..."
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
              />
              <datalist id="entry-types-list">
                {ENTRY_TYPES.map(e => <option key={e} value={e} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Trading Plan
              </label>
              <input
                type="text"
                list="trading-plans-list"
                name="tradingPlan"
                value={formData.tradingPlan}
                onChange={handleInputChange}
                placeholder="Select or enter trading plan..."
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
              />
              <datalist id="trading-plans-list">
                {TRADING_PLANS.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Psychology / Emotion
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emotion: em }))}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                    formData.emotion === em
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-sm'
                      : 'bg-[#162038] text-slate-400 border-[#223253] hover:text-slate-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Trade setup rationale, triggers, execution reflections, mistakes, learnings..."
              className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Charts Section */}
          <div className="border-t border-[#1e293b] pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={14} className="text-indigo-400" />
              Chart Screenshots & Media
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Upload 1 */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Chart Image 1 (Local Upload)
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-[#162038] border border-[#223253] hover:border-indigo-500/50 rounded-xl cursor-pointer text-xs text-slate-300 transition-colors">
                  <Upload size={14} className="text-indigo-400 shrink-0" />
                  <span className="truncate">
                    {previewImage1 ? 'Change File' : 'Choose File'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'chartImage1')}
                    className="hidden"
                  />
                </label>
                {previewImage1 && (
                  <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-[#223253] group">
                    <img src={previewImage1} alt="Preview 1" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreviewImage1(''); setFormData(p => ({ ...p, chartImage1: '' })); }}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded text-xs transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Exit Chart Upload */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Exit / Result Chart (Local Upload)
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-[#162038] border border-[#223253] hover:border-indigo-500/50 rounded-xl cursor-pointer text-xs text-slate-300 transition-colors">
                  <Upload size={14} className="text-indigo-400 shrink-0" />
                  <span className="truncate">
                    {previewExitChart ? 'Change File' : 'Choose File'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'exitChart')}
                    className="hidden"
                  />
                </label>
                {previewExitChart && (
                  <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-[#223253] group">
                    <img src={previewExitChart} alt="Preview Exit" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreviewExitChart(''); setFormData(p => ({ ...p, exitChart: '' })); }}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded text-xs transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* URL inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Chart URL 2 (TradingView / Imgur link)
                </label>
                <input
                  type="url"
                  name="chartUrl2"
                  value={formData.chartUrl2}
                  onChange={handleInputChange}
                  placeholder="https://www.tradingview.com/x/..."
                  className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Chart URL 3
                </label>
                <input
                  type="url"
                  name="chartUrl3"
                  value={formData.chartUrl3}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {initialTrade ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
