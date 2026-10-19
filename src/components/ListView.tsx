'use client';

import React, { useState, useMemo } from 'react';
import { useTodo } from '@/context/TodoContext';
import { TaskCard } from './TaskCard';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ListView: React.FC = () => {
  const { tasks, setIsSpotlightOpen } = useTodo();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'dueDate'>('createdAt');

  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.category));
    return ['all', ...Array.from(set)];
  }, [tasks]);

  const priorityWeight = { high: 3, medium: 2, low: 1 };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
        const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
        const matchesStatus =
          selectedStatus === 'all'
            ? true
            : selectedStatus === 'active'
            ? t.status !== 'done'
            : t.status === 'done';

        return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'dueDate') {
          return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy]);

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Filter Pills */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas atau kategori..."
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-sm placeholder-slate-400"
          />
        </div>

        {/* Filter & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white/90 cursor-pointer shadow-xs"
          >
            <option value="all">Semua Status</option>
            <option value="active">Belum Selesai</option>
            <option value="done">Selesai</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white/90 cursor-pointer shadow-xs"
          >
            <option value="all">Semua Kategori</option>
            {categories
              .filter((c) => c !== 'all')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white/90 cursor-pointer shadow-xs"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">Tinggi (High)</option>
            <option value="medium">Sedang (Medium)</option>
            <option value="low">Rendah (Low)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="glass-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 bg-white/90 cursor-pointer shadow-xs"
          >
            <option value="createdAt">Urut: Terbaru</option>
            <option value="priority">Urut: Prioritas</option>
            <option value="dueDate">Urut: Jatuh Tempo</option>
          </select>
        </div>
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12"
        >
          <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-4 text-teal-600 shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Semua Bersih & Teratur</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
            Tidak ada tugas yang sesuai filter. Nikmati momen ketenangan atau mulai buat tugas baru.
          </p>
          <button
            onClick={() => setIsSpotlightOpen(true)}
            className="mt-6 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-teal-600/20"
          >
            Tambah Tugas Sekarang (⌘K)
          </button>
        </motion.div>
      )}
    </div>
  );
};
