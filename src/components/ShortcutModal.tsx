'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['⌘', 'K'], desc: 'Buka Spotlight Quick Capture' },
  { keys: ['?'], desc: 'Lihat daftar pintasan keyboard ini' },
  { keys: ['Esc'], desc: 'Tutup modal / batal' },
  { keys: ['Enter'], desc: 'Submit tugas di Spotlight' },
];

export const ShortcutModal: React.FC = () => {
  const { isShortcutModalOpen, setIsShortcutModalOpen } = useTodo();

  return (
    <AnimatePresence>
      {isShortcutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsShortcutModalOpen(false)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md glass-panel bg-white/95 rounded-3xl p-6 shadow-2xl border border-white text-slate-800"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">Pintasan Keyboard (Heuristik #7)</h3>
              </div>
              <button
                onClick={() => setIsShortcutModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {SHORTCUTS.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm py-1.5">
                  <span className="text-slate-700 font-medium">{item.desc}</span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 border border-slate-200 text-slate-700 shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Dirancang untuk efisiensi navigasi cepat tanpa perlu sentuhan mouse.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
