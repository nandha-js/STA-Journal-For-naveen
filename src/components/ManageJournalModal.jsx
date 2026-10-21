import React, { useState, useEffect } from 'react';
import { X, Settings2, Trash2 } from 'lucide-react';

const PALETTE = [
  '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#eab308', '#f97316', '#ef4444', '#ec4899', '#8b5cf6'
];

export default function ManageJournalModal({ 
  isOpen, 
  onClose, 
  journal, 
  onUpdateJournal, 
  onDeleteJournal 
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (journal) {
      setName(journal.name || '');
      setDescription(journal.description || '');
      setColor(journal.color || '#6366f1');
      setConfirmDelete(false);
    }
  }, [journal, isOpen]);

  if (!isOpen || !journal) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateJournal({
      ...journal,
      name: name.trim(),
      description: description.trim(),
      color
    });
    onClose();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDeleteJournal(journal.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c35]">
          <div className="flex items-center gap-2">
            <Settings2 size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Manage Journal: {journal.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Journal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-4 ring-white/30 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Danger Zone: Delete */}
          <div className="pt-4 border-t border-[#1e293b]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-rose-400">Delete Journal</h4>
                <p className="text-[11px] text-slate-400">
                  Permanently remove this journal and its trade logs.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  confirmDelete 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                <Trash2 size={13} />
                {confirmDelete ? 'Confirm Delete?' : 'Delete'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
