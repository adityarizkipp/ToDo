'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { ViewMode } from '@/types/todo';
import {
  ListTodo,
  Kanban,
  BarChart3,
  Moon,
  Search,
  Plus,
  HelpCircle,
  User,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onOpenQuickAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAdd }) => {
  const {
    tasks,
    viewMode,
    setViewMode,
    isFocusMode,
    setIsFocusMode,
    setIsSpotlightOpen,
    setIsShortcutModalOpen,
    setIsLoginModalOpen,
    currentUser,
    logout,
    syncStatus,
  } = useTodo();

  const [greeting, setGreeting] = useState('Selamat Datang');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userName = currentUser?.email ? currentUser.email.split('@')[0] : null;

  return (
    <header className="w-full glass-panel rounded-3xl p-5 md:p-6 mb-8 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Greeting & Status */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-slate-800 flex items-center gap-2">
              <span>{greeting}{userName ? `, ${userName}` : ''}</span>
              <span className="text-teal-600">🌿</span>
            </h1>

            {/* Sync Indicator */}
            <div
              title={
                syncStatus === 'synced'
                  ? 'Realtime Database Terhubung'
                  : syncStatus === 'syncing'
                  ? 'Menyinkronkan...'
                  : 'Mode Offline'
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 border border-slate-200/80 text-slate-600 shadow-xs"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  syncStatus === 'synced'
                    ? 'bg-teal-500 animate-pulse'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-500 animate-spin'
                    : 'bg-rose-500'
                }`}
              />
              <span className="hidden sm:inline">
                {syncStatus === 'synced' ? 'Supabase Cloud' : syncStatus === 'syncing' ? 'Sync...' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Today's Productivity Progress */}
          <div className="mt-3 flex items-center gap-4 max-w-sm">
            <div className="flex-1 bg-slate-200/70 rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              {completedTasks}/{totalTasks} Selesai ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100/80 border border-slate-200/70">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-teal-800 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-teal-800 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('insights')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'insights'
                  ? 'bg-white text-teal-800 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>
          </div>

          {/* Focus Mode Button */}
          <button
            onClick={() => setIsFocusMode((prev) => !prev)}
            title="Focus Mode (Sync Realtime via Supabase Broadcast)"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
              isFocusMode
                ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80 shadow-xs'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${isFocusMode ? 'text-white fill-white' : 'text-slate-600'}`} />
            <span>Focus Mode</span>
          </button>

          {/* Cmd + K Spotlight */}
          <button
            onClick={() => setIsSpotlightOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Spotlight</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-slate-100 rounded border border-slate-200 text-slate-500 font-sans">
              ⌘K
            </kbd>
          </button>

          {/* Shortcuts Help */}
          <button
            onClick={() => setIsShortcutModalOpen(true)}
            title="Pintasan Keyboard (?)"
            className="p-2 rounded-2xl bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 transition-all cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Account / Logout */}
          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                title="Lihat Profil"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>{userName}</span>
              </button>
              <button
                onClick={logout}
                title="Keluar dari Akun (Logout)"
                className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Masuk / Daftar</span>
            </button>
          )}

          {/* Quick Add */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-teal-600/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Tambah Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
