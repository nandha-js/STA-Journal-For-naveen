import React, { useState } from 'react';
import { X, BookPlus } from 'lucide-react';

const PALETTE = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
];

export default function NewJournalModal({ isOpen, onClose, onCreateJournal }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a journal name');
      return;
    }

    const newJournal = {
      id: `journal-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreateJournal(newJournal);
    setName('');
    setDescription('');
    setSelectedColor(PALETTE[0]);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c35]">
          <div className="flex items-center gap-2.5">
            <BookPlus size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              New Journal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Journal Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. My Trading Journal, Prop Account..."
              className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 transition-colors"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description or strategy focus..."
              className="w-full bg-[#162038] border border-[#223253] focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none placeholder:text-slate-500 resize-none transition-colors"
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PALETTE.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full transition-transform active:scale-95 ${
                      isSelected
                        ? 'ring-4 ring-white/30 scale-110 shadow-lg'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
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
              Create Journal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
