'use client';

import React, { useState } from 'react';
import { TodoProvider, useTodo } from '@/context/TodoContext';
import { ZenBackground } from '@/components/ZenBackground';
import { Header } from '@/components/Header';
import { ListView } from '@/components/ListView';
import { KanbanBoard } from '@/components/KanbanBoard';
import { InsightsGraph } from '@/components/InsightsGraph';
import { SpotlightModal } from '@/components/SpotlightModal';
import { ShortcutModal } from '@/components/ShortcutModal';
import { LoginModal } from '@/components/LoginModal';
import { QuickAddModal } from '@/components/QuickAddModal';
import { ToastNotification } from '@/components/ToastNotification';
import { LandingHero } from '@/components/LandingHero';
import { Plus } from 'lucide-react';

function TodoAppContent() {
  const { viewMode, isFocusMode, currentUser } = useTodo();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isGuestExploring, setIsGuestExploring] = useState(false);

  // If user is authenticated, they are always in the App Dashboard.
  // Unauthenticated guests only see the dashboard if they click 'Buka Dashboard Penuh (Guest Mode)'.
  const showDashboard = Boolean(currentUser || isGuestExploring);

  return (
    <div className="relative min-h-screen text-slate-800 flex flex-col justify-between selection:bg-teal-500/25 selection:text-teal-900 font-sans">
      {/* Zen Misty Landscape Background */}
      <ZenBackground isFocusMode={isFocusMode} />

      {/* Main App Container */}
      {!showDashboard ? (
        <main className="flex-1 flex flex-col justify-center">
          <LandingHero onEnterApp={() => setIsGuestExploring(true)} />
        </main>
      ) : (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 transition-opacity duration-500">
          {/* Guest exploring banner (only shown if not logged in) */}
          {!currentUser && (
            <div className="mb-4 flex items-center justify-between p-3 rounded-2xl glass-panel bg-teal-50/80 border border-teal-200 text-xs text-teal-900 font-medium">
              <span>Mode Penjelajah Tamu — Masuk atau daftar akun agar tugas Anda tersimpan permanen di cloud pribadi.</span>
              <button
                onClick={() => setIsGuestExploring(false)}
                className="ml-3 text-teal-700 hover:text-teal-950 font-bold underline cursor-pointer shrink-0"
              >
                Halaman Zen
              </button>
            </div>
          )}

          {/* Dynamic Header */}
          <Header onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

          {/* View Mode Switching */}
          <section className="transition-all duration-300">
            {viewMode === 'list' && <ListView />}
            {viewMode === 'kanban' && <KanbanBoard />}
            {viewMode === 'insights' && <InsightsGraph />}
          </section>

          {/* Floating Action Button (FAB) for mobile ergonomics */}
          <div className="md:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              aria-label="Tambah Tugas"
              className="w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-2xl shadow-teal-600/40 active:scale-90 transition-transform cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[11px] font-medium text-slate-500 border-t border-slate-200/60 relative z-10 backdrop-blur-md bg-white/40">
        Crafted with Claw's Love • Powered by Next.js & Supabase
      </footer>

      {/* Modals & Overlays */}
      <SpotlightModal />
      <ShortcutModal />
      <LoginModal />
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
      <ToastNotification />
    </div>
  );
}

export default function Page() {
  return (
    <TodoProvider>
      <TodoAppContent />
    </TodoProvider>
  );
}
