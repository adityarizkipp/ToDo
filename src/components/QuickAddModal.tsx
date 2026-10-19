'use client';

import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Priority } from '@/types/todo';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTodo();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Design');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      status: 'todo',
      category: category.trim() || 'General',
      dueDate: dueDate || undefined,
      subtasks: [],
    });

    setTitle('');
    setNotes('');
    setDueDate('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg glass-panel bg-white/95 rounded-3xl p-6 shadow-2xl border border-white text-slate-800"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">Buat Tugas Baru</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1.5">Judul Tugas *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Cth: Review micro-interactions kartu..."
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder-slate-400 font-medium"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 font-semibold mb-1.5">Catatan Tambahan</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan detail atau konteks pekerjaan..."
                  rows={2}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-xs placeholder-slate-400 resize-none font-normal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Priority */}
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1.5">Prioritas</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="low">Low (Rendah)</option>
                    <option value="medium">Medium (Sedang)</option>
                    <option value="high">High (Tinggi)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1.5">Kategori</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Design / Research"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs placeholder-slate-400 font-medium"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1.5">Jatuh Tempo</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-700 cursor-pointer font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal (Esc)
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-md shadow-teal-600/20 active:scale-95 cursor-pointer"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
