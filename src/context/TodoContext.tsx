'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, ViewMode } from '@/types/todo';
import { getInitialDemoTasks } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'info' | 'success' | 'error';
}

interface TodoContextType {
  tasks: Task[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isSpotlightOpen: boolean;
  setIsSpotlightOpen: (val: boolean) => void;
  isShortcutModalOpen: boolean;
  setIsShortcutModalOpen: (val: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (val: boolean) => void;
  currentUser: User | null;
  syncStatus: 'synced' | 'syncing' | 'offline';
  addTask: (task: Omit<Task, 'id' | 'position' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTaskStatus: (taskId: string, targetStatus: Task['status']) => Promise<void>;
  reorderTasks: (newTasks: Task[]) => void;
  toast: ToastMessage | null;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  clearToast: () => void;
  logout: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'zen_todo_guest_tasks';
const FOCUS_BROADCAST_CHANNEL = 'zen-ambient-focus';

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isFocusMode, setIsFocusModeState] = useState<boolean>(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((toastData: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ ...toastData, id });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // 1. Monitor Supabase Auth Session
  useEffect(() => {
    if (!supabase) {
      setIsLoaded(true);
      return;
    }

    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setIsLoaded(true);
    });

    // Listen to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch Tasks based on user state
  const loadUserTasks = useCallback(async () => {
    if (supabase && currentUser) {
      setSyncStatus('syncing');
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const mappedTasks: Task[] = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            notes: row.notes || undefined,
            priority: row.priority,
            status: row.status,
            category: row.category,
            dueDate: row.due_date ? row.due_date.split('T')[0] : undefined,
            subtasks: Array.isArray(row.subtasks) ? row.subtasks : [],
            completedAt: row.completed_at,
            position: row.position || 0,
            createdAt: row.created_at,
          }));
          setTasks(mappedTasks);
          setSyncStatus('synced');
          return;
        }
      } catch (err) {
        console.warn('Failed to load user tasks from Supabase', err);
        setSyncStatus('offline');
      }
    }

    // Guest fallback: load local storage or demo
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      } else {
        const initial = getInitialDemoTasks();
        setTasks(initial);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch {
      setTasks(getInitialDemoTasks());
    }
    setSyncStatus('synced');
  }, [currentUser]);

  useEffect(() => {
    if (isLoaded) {
      loadUserTasks();
    }
  }, [currentUser, isLoaded, loadUserTasks]);

  // Save guest tasks to local storage
  useEffect(() => {
    if (!currentUser && isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to cache guest tasks', e);
      }
    }
  }, [tasks, currentUser, isLoaded]);

  // Realtime Broadcast for Focus Mode (Phase 2)
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel(FOCUS_BROADCAST_CHANNEL);
    channel
      .on('broadcast', { event: 'focus_toggle' }, (payload) => {
        if (payload?.payload?.isFocus !== undefined) {
          setIsFocusModeState(payload.payload.isFocus);
        }
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  const setIsFocusMode = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setIsFocusModeState((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      if (supabase) {
        supabase.channel(FOCUS_BROADCAST_CHANNEL).send({
          type: 'broadcast',
          event: 'focus_toggle',
          payload: { isFocus: nextVal },
        });
      }
      return nextVal;
    });
  }, []);

  // Toast timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsShortcutModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setIsShortcutModalOpen(false);
        setIsLoginModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Operations
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'position' | 'createdAt'>) => {
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'task-' + Math.random().toString(36).substring(2, 9);
    const newTask: Task = {
      ...taskData,
      id: tempId,
      position: tasks.length,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast({
      message: `Tugas "${newTask.title}" berhasil ditambahkan.`,
      type: 'success',
    });

    if (supabase && currentUser) {
      setSyncStatus('syncing');
      try {
        const { data, error } = await supabase.from('tasks').insert([
          {
            user_id: currentUser.id,
            title: newTask.title,
            notes: newTask.notes || null,
            priority: newTask.priority,
            status: newTask.status,
            category: newTask.category,
            due_date: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
            subtasks: newTask.subtasks,
            position: newTask.position,
          },
        ]).select();

        if (error) {
          console.error('Supabase insert error:', error);
          showToast({ message: `Gagal simpan ke cloud: ${error.message}`, type: 'error' });
          setSyncStatus('offline');
        } else if (data && data[0]) {
          const dbId = data[0].id;
          setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...t, id: dbId } : t)));
          setSyncStatus('synced');
        }
      } catch (err) {
        console.error('Network error on addTask:', err);
        setSyncStatus('offline');
      }
    }
  }, [tasks.length, currentUser, showToast]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    if (supabase && currentUser && !id.startsWith('task-') && !id.startsWith('demo-')) {
      setSyncStatus('syncing');
      try {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.dueDate !== undefined) {
          dbUpdates.due_date = updates.dueDate ? new Date(updates.dueDate).toISOString() : null;
        }
        if (updates.subtasks !== undefined) dbUpdates.subtasks = updates.subtasks;
        if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;

        const { error } = await supabase
          .from('tasks')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', currentUser.id);

        if (error) {
          setSyncStatus('offline');
        } else {
          setSyncStatus('synced');
        }
      } catch {
        setSyncStatus('offline');
      }
    }
  }, [currentUser]);

  const toggleTaskStatus = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const isDone = task.status === 'done';
    const newStatus: Task['status'] = isDone ? 'todo' : 'done';
    const completedAt = !isDone ? new Date().toISOString() : null;

    if (!isDone) {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0d9488', '#14b8a6', '#38bdf8'],
        });
      } catch {}
    }

    await updateTask(id, { status: newStatus, completedAt });
  }, [tasks, updateTask]);

  const deleteTask = useCallback(async (id: string) => {
    const deletedTask = tasks.find((t) => t.id === id);
    if (!deletedTask) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));

    showToast({
      message: `Tugas "${deletedTask.title}" dihapus.`,
      actionLabel: 'Urungkan (Undo)',
      onAction: async () => {
        setTasks((prev) => [deletedTask, ...prev]);
        if (supabase && currentUser && !id.startsWith('task-') && !id.startsWith('demo-')) {
          await supabase.from('tasks').insert([
            {
              id: deletedTask.id,
              user_id: currentUser.id,
              title: deletedTask.title,
              notes: deletedTask.notes || null,
              priority: deletedTask.priority,
              status: deletedTask.status,
              category: deletedTask.category,
              subtasks: deletedTask.subtasks,
            },
          ]);
        }
        showToast({ message: 'Penghapusan dibatalkan.', type: 'info' });
      },
      type: 'info',
    });

    if (supabase && currentUser && !id.startsWith('task-') && !id.startsWith('demo-')) {
      setSyncStatus('syncing');
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', currentUser.id);

        if (!error) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('offline');
        }
      } catch {
        setSyncStatus('offline');
      }
    }
  }, [tasks, currentUser, showToast]);

  const moveTaskStatus = useCallback(async (taskId: string, targetStatus: Task['status']) => {
    const previousTasks = [...tasks];
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    const completedAt = targetStatus === 'done' ? new Date().toISOString() : null;

    setSyncStatus('syncing');
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: targetStatus, completedAt }
          : t
      )
    );

    if (supabase && currentUser && !taskId.startsWith('task-') && !taskId.startsWith('demo-')) {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({
            status: targetStatus,
            completed_at: completedAt,
          })
          .eq('id', taskId)
          .eq('user_id', currentUser.id);

        if (error) {
          setTasks(previousTasks);
          setSyncStatus('offline');
          showToast({
            message: 'Gagal memindahkan task. Perubahan dikembalikan.',
            actionLabel: 'Coba Lagi',
            onAction: () => moveTaskStatus(taskId, targetStatus),
            type: 'error',
          });
        } else {
          setSyncStatus('synced');
        }
      } catch {
        setTasks(previousTasks);
        setSyncStatus('offline');
      }
    } else {
      setSyncStatus('synced');
    }
  }, [tasks, currentUser, showToast]);

  const reorderTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    showToast({
      message: 'Berhasil keluar dari akun. Sampai jumpa kembali!',
      type: 'info',
    });
  }, [showToast]);

  return (
    <TodoContext.Provider
      value={{
        tasks,
        viewMode,
        setViewMode,
        isFocusMode,
        setIsFocusMode,
        isSpotlightOpen,
        setIsSpotlightOpen,
        isShortcutModalOpen,
        setIsShortcutModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        currentUser,
        syncStatus,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        moveTaskStatus,
        reorderTasks,
        toast,
        showToast,
        clearToast,
        logout,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
