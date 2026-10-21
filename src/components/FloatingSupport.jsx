import React, { useState } from 'react';
import { Headphones, X, ExternalLink, HelpCircle, Book, ShieldAlert, Sparkles } from 'lucide-react';

export default function FloatingSupport({ profile }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button bottom-right */}
      <button
        onClick={() => setIsOpen(true)}
        title="Scalper Academy Support & Help"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all group"
      >
        <Headphones size={22} className="group-hover:rotate-12 transition-transform" />
        <span className="sr-only">Support</span>
      </button>

      {/* Support & Resources Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden animate-modal">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#111c35]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Headphones size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">STA Support & Portal</h3>
                  <p className="text-[11px] text-slate-400">Scalper Trading Academy Support Desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-400" />
                  Local-First Trading Journal
                </div>
                All your journal entries, screenshots, and trade analytics are securely stored locally inside your browser's Local Storage. No external servers or API subscriptions required.
              </div>

              <div className="space-y-2">
                <a
                  href={profile?.portalUrl || 'https://scalpertradingacademy.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#141d33] border border-[#1e2a47] hover:border-indigo-500/40 text-xs font-semibold text-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Book size={16} className="text-indigo-400" />
                    <span>Trading Academy Client Portal</span>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-400" />
                </a>

                <div className="p-3.5 rounded-xl bg-[#141d33] border border-[#1e2a47] text-xs space-y-1.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-indigo-400" />
                    Trading Rules Checklist
                  </div>
                  <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                    <li>Wait for confirmed market structure shift.</li>
                    <li>Risk strictly 1% or fixed lots per setup.</li>
                    <li>Never take revenge trades after a stop out.</li>
                    <li>Log your trade notes with psychology reflections.</li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  Logged in as <span className="text-indigo-400 font-semibold">{profile?.name}</span> ({profile?.role})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
