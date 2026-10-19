'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTodo } from '@/context/TodoContext';
import { parseNaturalLanguageInput } from '@/lib/nlpParser';
import { Priority } from '@/types/todo';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Calendar, Tag, AlertTriangle, X, CornerDownLeft } from 'lucide-react';

export const SpotlightModal: React.FC = () => {
  const { isSpotlightOpen, setIsSpotlightOpen, addTask } = useTodo();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInput('');
    }
  }, [isSpotlightOpen]);

  const [parsed, setParsed] = useState<{
    cleanTitle: string;
    priority: Priority;
    dueDate?: string;
    category: string;
  }>({
    cleanTitle: '',
    priority: 'medium',
    dueDate: undefined,
    category: 'General',
  });

  useEffect(() => {
    if (input.trim()) {
      setParsed(parseNaturalLanguageInput(input));
    } else {
      setParsed({ cleanTitle: '', priority: 'medium', dueDate: undefined, category: 'General' });
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parsed.cleanTitle.trim()) return;

    addTask({
      title: parsed.cleanTitle,
      priority: parsed.priority,
      status: 'todo',
      category: parsed.category,
      dueDate: parsed.dueDate,
      subtasks: [],
    });

    setIsSpotlightOpen(false);
    setInput('');
  };

  const getPriorityBadgeColor = (p: string) => {
    switch (p) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSpotlightOpen(false)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-md"
          />

          {/* Spotlight Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl glass-panel bg-white/95 rounded-3xl p-5 shadow-2xl border border-white text-slate-800 overflow-hidden"
          >
            {/* Header / Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Search className="w-6 h-6 text-teal-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis tugas baru... (Cth: Desain UI #brand besok !high)"
                className="w-full bg-transparent text-lg text-slate-800 placeholder-slate-400 outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setIsSpotlightOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            {/* Smart Inline Live Parser Preview */}
            {input.trim() && (
              <div className="mt-4 pt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Deteksi Pintar:</span>

                {/* Priority Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityBadgeColor(
                    parsed.priority
                  )}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Prioritas {parsed.priority.toUpperCase()}
                </span>

                {/* Category Pill */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  <Tag className="w-3.5 h-3.5" />
                  {parsed.category}
                </span>

                {/* Due Date Pill */}
                {parsed.dueDate && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    <Calendar className="w-3.5 h-3.5" />
                    {parsed.dueDate}
                  </span>
                )}
              </div>
            )}

            {/* Quick tips & Enter button */}
            <div className="mt-5 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200/80">
              <div className="flex items-center gap-3">
                <span>
                  Ketik <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded font-mono font-medium border border-teal-200">!high</code> prioritas
                </span>
                <span>
                  <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded font-mono font-medium border border-sky-200">#tag</code> kategori
                </span>
                <span>
                  <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded font-mono font-medium border border-purple-200">besok</code> tanggal
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!parsed.cleanTitle.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:hover:bg-teal-600 text-white font-semibold transition-all cursor-pointer shadow-md shadow-teal-600/20"
              >
                <span>Tambah</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
