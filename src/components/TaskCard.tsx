'use client';

import React, { useState } from 'react';
import { Task, Priority } from '@/types/todo';
import { useTodo } from '@/context/TodoContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Tag,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  Edit2,
  Save,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isCompact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCompact = false }) => {
  const { toggleTaskStatus, deleteTask, updateTask } = useTodo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const isDone = task.status === 'done';

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleToggleSubtask = (subId: string) => {
    const updated = task.subtasks.map((s) =>
      s.id === subId ? { ...s, isCompleted: !s.isCompleted } : s
    );
    updateTask(task.id, { subtasks: updated });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSub = {
      id: 'sub-' + Math.random().toString(36).substring(2, 7),
      title: newSubtaskTitle.trim(),
      isCompleted: false,
    };
    updateTask(task.id, { subtasks: [...task.subtasks, newSub] });
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subId: string) => {
    const updated = task.subtasks.filter((s) => s.id !== subId);
    updateTask(task.id, { subtasks: updated });
  };

  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'high':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'medium':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-teal-800 bg-teal-50 border-teal-200';
    }
  };

  const completedSubtasksCount = task.subtasks.filter((s) => s.isCompleted).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`glass-card rounded-2xl p-4 text-slate-800 group ${
        isDone ? 'opacity-65 bg-white/40' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Apple-style Circle Checkbox */}
        <button
          onClick={() => toggleTaskStatus(task.id)}
          aria-label={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
          className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
            isDone
              ? 'bg-teal-600 border-teal-600 text-white scale-105 shadow-sm'
              : 'border-slate-300 hover:border-teal-500 hover:scale-105 bg-white/90 shadow-xs'
          }`}
        >
          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Title & Tags */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                className="w-full bg-white border border-teal-500 rounded-lg px-2.5 py-1 text-sm text-slate-900 outline-none shadow-xs"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 rounded-md bg-teal-100 text-teal-700 hover:bg-teal-200"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h4
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm font-semibold leading-snug cursor-pointer select-none transition-colors ${
                isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-800 hover:text-teal-700'
              }`}
            >
              {task.title}
            </h4>
          )}

          {/* Badges / Metadata */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            {/* Priority Badge */}
            <span
              className={`px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider text-[10px] ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            {/* Category */}
            <span className="flex items-center gap-1 text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200/80">
              <Tag className="w-3 h-3 text-teal-600" />
              <span>{task.category}</span>
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span className="flex items-center gap-1 text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200/80">
                <Calendar className="w-3 h-3 text-sky-600" />
                <span>{task.dueDate}</span>
              </span>
            )}

            {/* Subtask count */}
            {task.subtasks.length > 0 && (
              <span className="text-slate-500 font-medium">
                ✓ {completedSubtasksCount}/{task.subtasks.length}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(!isEditing)}
            title="Edit judul"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            title="Hapus tugas"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Tutup rincian' : 'Buka rincian'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3 pt-3 border-t border-slate-200/70 text-xs"
          >
            {/* Notes */}
            {task.notes && (
              <p className="text-slate-600 mb-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed font-normal">
                {task.notes}
              </p>
            )}

            {/* Subtasks Checklist */}
            <div className="space-y-1.5 mb-3">
              <span className="font-semibold text-slate-500 block text-[11px] mb-1">Sub-tugas (Checklist):</span>
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between group/sub px-2 py-1 rounded-lg hover:bg-slate-100/70 transition-colors"
                >
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sub.isCompleted}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="w-3.5 h-3.5 rounded accent-teal-600 cursor-pointer"
                    />
                    <span
                      className={`text-xs ${
                        sub.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="opacity-0 group-hover/sub:opacity-100 text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Inline */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Tambah sub-tugas kecil..."
                className="w-full bg-white/90 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="p-1 px-2.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold disabled:opacity-40 cursor-pointer border border-teal-200"
              >
                Tambah
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
