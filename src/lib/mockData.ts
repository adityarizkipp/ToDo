import { Task } from '@/types/todo';

export function getInitialDemoTasks(): Task[] {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const tomorrowStr = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
  const yesterdayStr = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
  const threeDaysLaterStr = new Date(now.getTime() + 86400000 * 3).toISOString().split('T')[0];

  return [
    {
      id: 'demo-1',
      title: 'Finalisasi Desain Sistem & Micro-interactions',
      notes: 'Pastikan kontras rasio warna kaca lolos WCAG AA dan token spacing konsisten.',
      priority: 'high',
      status: 'in_progress',
      category: 'Design',
      dueDate: tomorrowStr,
      subtasks: [
        { id: 'sub-1', title: 'Audit kontras teks pada frosted glass', isCompleted: true },
        { id: 'sub-2', title: 'Periksa padding pill badge pada layar kecil', isCompleted: false },
      ],
      position: 0,
      createdAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Review 10 Heuristik Usability Nielsen Norman',
      notes: 'Validasi pesan error, visibility of system status, dan emergency exit (Esc / Undo).',
      priority: 'high',
      status: 'todo',
      category: 'Research',
      dueDate: dateStr,
      subtasks: [
        { id: 'sub-3', title: 'Buat shortcut cheatsheet dialog', isCompleted: false },
        { id: 'sub-4', title: 'Implementasi toast notification dengan tombol Undo', isCompleted: false }
      ],
      position: 1,
      createdAt: new Date(now.getTime() - 3600000 * 24).toISOString(),
    },
    {
      id: 'demo-3',
      title: 'Riset Palet Warna Zen Garden (Sage & Slate)',
      notes: 'Kombinasi warna alam lembut untuk mengurangi keletihan mata saat fokus bekerja.',
      priority: 'medium',
      status: 'done',
      category: 'Design',
      dueDate: yesterdayStr,
      completedAt: new Date(now.getTime() - 3600000 * 12).toISOString(),
      subtasks: [],
      position: 2,
      createdAt: new Date(now.getTime() - 3600000 * 48).toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Meditasi 10 menit & stretching punggung',
      notes: 'Jaga postur dan kejernihan pikiran sebelum deep work session.',
      priority: 'low',
      status: 'done',
      category: 'Wellness',
      dueDate: dateStr,
      completedAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
      subtasks: [],
      position: 3,
      createdAt: new Date(now.getTime() - 3600000 * 6).toISOString(),
    },
    {
      id: 'demo-5',
      title: 'Setup Database RPC untuk Weekly Productivity Graph',
      notes: 'Optimasi kalkulasi di level Postgres agar client tetap ultra-ringan.',
      priority: 'medium',
      status: 'todo',
      category: 'Engineering',
      dueDate: threeDaysLaterStr,
      subtasks: [],
      position: 4,
      createdAt: new Date(now.getTime() - 3600000 * 8).toISOString(),
    }
  ];
}
