'use client';

import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { TaskStatus } from '@/types/todo';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

interface ColumnDef {
  status: TaskStatus;
  title: string;
  icon: React.ReactNode;
  accent: string;
  countBg: string;
}

const COLUMNS: ColumnDef[] = [
  {
    status: 'todo',
    title: 'To Do',
    icon: <Circle className="w-4 h-4 text-sky-600" />,
    accent: 'border-sky-200 text-sky-900',
    countBg: 'bg-sky-100 text-sky-800',
  },
  {
    status: 'in_progress',
    title: 'In Progress',
    icon: <Clock className="w-4 h-4 text-amber-600" />,
    accent: 'border-amber-200 text-amber-900',
    countBg: 'bg-amber-100 text-amber-800',
  },
  {
    status: 'done',
    title: 'Done',
    icon: <CheckCircle2 className="w-4 h-4 text-teal-600" />,
    accent: 'border-teal-200 text-teal-900',
    countBg: 'bg-teal-100 text-teal-800',
  },
];

export const KanbanBoard: React.FC = () => {
  const { tasks, moveTaskStatus } = useTodo();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (status: TaskStatus) => {
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        const isTargeted = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={() => handleDragLeave(col.status)}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`flex flex-col min-h-[520px] rounded-3xl p-4 transition-all duration-300 ${
              isTargeted
                ? 'glass-panel border-teal-500 shadow-xl scale-[1.01] bg-teal-50/50'
                : 'glass-panel bg-white/60 border-white/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-bold text-sm text-slate-800">{col.title}</h3>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold font-mono ${col.countBg}`}>
                {columnTasks.length}
              </span>
            </div>

            {/* Task Droppable Area */}
            <div className="flex-1 space-y-3">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="cursor-grab active:cursor-grabbing transition-transform active:scale-95"
                >
                  <TaskCard task={task} isCompact />
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div
                  className={`h-36 rounded-2xl border-2 border-dashed flex items-center justify-center text-xs transition-colors font-medium ${
                    isTargeted
                      ? 'border-teal-500/80 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  {isTargeted ? 'Lepas kartu di sini' : 'Belum ada tugas di kolom ini'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
