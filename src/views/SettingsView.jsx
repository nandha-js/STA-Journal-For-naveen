import React, { useState, useEffect } from 'react';
import { 
  User, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  Check, 
  Database, 
  ShieldCheck, 
  Save,
  HardDrive,
  Info
} from 'lucide-react';
import { 
  exportAllData, 
  importAllData, 
  resetAllData, 
  getLocalStorageUsage,
  syncToLocalFiles,
  loadFromLocalFiles,
  downloadSeparateFile,
  pickAndSaveCustomFile,
  getStoredTrades,
  getStoredJournals,
  getStoredProfile
} from '../utils/storage';
import { 
  FolderCheck, 
  FileJson, 
  RefreshCw, 
  FolderOpen, 
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SettingsView({
  profile,
  onUpdateProfile,
  onDataReset,
  journalsCount,
  tradesCount
}) {
  const [formData, setFormData] = useState({
    name: profile?.name || 'Naveen Kumar',
    role: profile?.role || 'Trader',
    avatar: profile?.avatar || 'NK',
    currency: profile?.currency || '$',
    portalUrl: profile?.portalUrl || 'https://scalpertradingacademy.com'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [storageUsage, setStorageUsage] = useState({ totalKB: '0', percentage: '0', breakdown: {} });
  const [fileSyncMsg, setFileSyncMsg] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshStorageInfo = () => {
    setStorageUsage(getLocalStorageUsage());
  };

  useEffect(() => {
    refreshStorageInfo();
  }, [journalsCount, tradesCount]);

  const handleSyncToLocalFilesNow = async () => {
    setIsSyncing(true);
    setFileSyncMsg(null);
    try {
      const res = await syncToLocalFiles();
      if (res && res.success) {
        setFileSyncMsg({ type: 'success', text: `Saved physically to local PC folder: ${res.dataDir}` });
      } else {
        setFileSyncMsg({ type: 'info', text: 'Data saved to localStorage. (Dev server local file sync available during npm run dev)' });
      }
    } catch (err) {
      setFileSyncMsg({ type: 'error', text: err.message });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setFileSyncMsg(null), 5000);
    }
  };

  const handleReloadFromLocalFiles = async () => {
    setIsSyncing(true);
    setFileSyncMsg(null);
    try {
      const res = await loadFromLocalFiles();
      if (res && res.success) {
        onDataReset();
        refreshStorageInfo();
        setFileSyncMsg({ type: 'success', text: 'Data successfully reloaded from local PC files!' });
      } else {
        setFileSyncMsg({ type: 'error', text: 'Could not load from local files. Checking localStorage instead.' });
      }
    } catch (err) {
      setFileSyncMsg({ type: 'error', text: err.message });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setFileSyncMsg(null), 4000);
    }
  };

  const handleCustomFileSave = async () => {
    try {
      const allData = {
        trades: getStoredTrades(),
        journals: getStoredJournals(),
        profile: getStoredProfile(),
        exportDate: new Date().toISOString()
      };
      const res = await pickAndSaveCustomFile(allData);
      if (res && res.success) {
        setFileSyncMsg({ type: 'success', text: `Successfully saved to PC file: ${res.fileName}` });
      }
    } catch (err) {
      setFileSyncMsg({ type: 'error', text: err.message });
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExport = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sta_journal_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importAllData(event.target.result);
      if (result.success) {
        setImportStatus('Data successfully imported!');
        onDataReset();
        refreshStorageInfo();
      } else {
        setImportStatus(`Import error: ${result.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data to the initial demo trades and journals?')) {
      resetAllData();
      onDataReset();
      refreshStorageInfo();
    }
  };

  const handleClearAll = () => {
    if (confirm('WARNING: This will permanently delete all trades and journals from your browser storage. Proceed?')) {
      localStorage.clear();
      onDataReset();
      refreshStorageInfo();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="pb-2 border-b border-[#1a233a]">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Settings & Local Storage
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your trader identity, local persistence, backup and restore
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <User size={18} className="text-indigo-400" />
          <h2 className="text-base font-bold text-white">Trader Profile</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Role / Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Avatar Initials
              </label>
              <input
                type="text"
                maxLength={3}
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value.toUpperCase() })}
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Currency Symbol
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="A$">A$ (AUD)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Client Portal URL
            </label>
            <input
              type="url"
              value={formData.portalUrl}
              onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
              className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check size={14} /> Profile Saved!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Save size={14} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section: Local PC Physical Files Storage */}
      <div className="bg-[#121829] border border-indigo-500/30 rounded-2xl p-6 shadow-sm space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FolderOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Physical Local PC Files
                <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Auto-Sync Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Your data is automatically saved into separate JSON files in your project directory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToLocalFilesNow}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Saving...' : 'Sync to Files'}</span>
            </button>

            <button
              onClick={handleReloadFromLocalFiles}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#162038] hover:bg-[#1f2d4e] border border-[#223253] text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              <FolderCheck size={13} className="text-emerald-400" />
              <span>Reload From Files</span>
            </button>
          </div>
        </div>

        {/* Sync notification message */}
        {fileSyncMsg && (
          <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 animate-modal ${
            fileSyncMsg.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : fileSyncMsg.type === 'error'
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
          }`}>
            {fileSyncMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{fileSyncMsg.text}</span>
          </div>
        )}

        {/* Physical files path card */}
        <div className="p-4 rounded-xl bg-[#0b101d] border border-[#1d273f] space-y-3">
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <FolderCheck size={14} className="text-indigo-400" />
              Local Folder: <code className="text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded">naveen web/data/</code>
            </span>
            <span className="text-emerald-400 font-medium">3 Separate Files Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* File 1: trades.json */}
            <div className="bg-[#12192c] p-3 rounded-xl border border-[#1e2a47] flex items-center justify-between group">
              <div>
                <span className="font-mono text-xs font-bold text-white block">trades.json</span>
                <span className="text-[10px] text-slate-400">{tradesCount} trade setups</span>
              </div>
              <button
                onClick={() => downloadSeparateFile('trades.json', getStoredTrades())}
                className="p-1.5 bg-[#18233d] hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Download trades.json"
              >
                <Download size={13} />
              </button>
            </div>

            {/* File 2: journals.json */}
            <div className="bg-[#12192c] p-3 rounded-xl border border-[#1e2a47] flex items-center justify-between group">
              <div>
                <span className="font-mono text-xs font-bold text-white block">journals.json</span>
                <span className="text-[10px] text-slate-400">{journalsCount} journals</span>
              </div>
              <button
                onClick={() => downloadSeparateFile('journals.json', getStoredJournals())}
                className="p-1.5 bg-[#18233d] hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Download journals.json"
              >
                <Download size={13} />
              </button>
            </div>

            {/* File 3: profile.json */}
            <div className="bg-[#12192c] p-3 rounded-xl border border-[#1e2a47] flex items-center justify-between group">
              <div>
                <span className="font-mono text-xs font-bold text-white block">profile.json</span>
                <span className="text-[10px] text-slate-400">{profile?.name}</span>
              </div>
              <button
                onClick={() => downloadSeparateFile('profile.json', getStoredProfile())}
                className="p-1.5 bg-[#18233d] hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                title="Download profile.json"
              >
                <Download size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Save to custom file picker */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            Want to save to a specific directory or external hard drive?
          </p>
          <button
            onClick={handleCustomFileSave}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <FileCode size={13} />
            <span>Save to Custom Location on PC</span>
          </button>
        </div>
      </div>

      {/* Local Storage Data Management */}
      <div className="bg-[#121829] border border-[#1e2840] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-white">Local Storage & Backup</h2>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            <span className="text-indigo-400 font-bold">{journalsCount}</span> Journals • <span className="text-indigo-400 font-bold">{tradesCount}</span> Trades Stored
          </div>
        </div>

        <p className="text-xs text-slate-400">
          All your trading journal records, images, and preferences live safely inside your local web browser. You can export a JSON backup at any time or restore previously saved records.
        </p>

        {/* Live Local Storage Monitor & Breakdown */}
        <div className="p-4 rounded-xl bg-[#0f1629] border border-[#1e2a47] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <HardDrive size={14} className="text-indigo-400" />
              Browser Storage Usage
            </span>
            <span className="text-indigo-400 font-bold">
              {storageUsage.totalKB} KB used / ~5,120 KB ({storageUsage.percentage}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(2, parseFloat(storageUsage.percentage) || 1)}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="bg-[#141d33] p-2 rounded-lg border border-[#1f2b48]">
              <span className="text-slate-400 block font-mono">sta_trades</span>
              <span className="text-white font-bold">{storageUsage.breakdown?.sta_trades || '0 KB'}</span>
            </div>
            <div className="bg-[#141d33] p-2 rounded-lg border border-[#1f2b48]">
              <span className="text-slate-400 block font-mono">sta_journals</span>
              <span className="text-white font-bold">{storageUsage.breakdown?.sta_journals || '0 KB'}</span>
            </div>
            <div className="bg-[#141d33] p-2 rounded-lg border border-[#1f2b48]">
              <span className="text-slate-400 block font-mono">sta_user_profile</span>
              <span className="text-white font-bold">{storageUsage.breakdown?.sta_user_profile || '0 KB'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#162038] hover:bg-[#1c2947] border border-[#223253] text-xs font-semibold text-white transition-colors"
          >
            <Download size={15} className="text-indigo-400" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#162038] hover:bg-[#1c2947] border border-[#223253] text-xs font-semibold text-white transition-colors cursor-pointer">
            <Upload size={15} className="text-indigo-400" />
            <span>Import Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
            {importStatus}
          </div>
        )}

        {/* Reset & Clear Zone */}
        <div className="pt-4 border-t border-[#1e2a47] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#162038] hover:bg-[#1f2d4f] border border-[#223253] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset to Demo Data</span>
          </button>

          <button
            onClick={handleClearAll}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 transition-colors"
          >
            <Trash2 size={14} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
